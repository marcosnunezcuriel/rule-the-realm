-- Rule the Realm: pruebas de permisos, RLS y restricciones.
-- Ejecutar el archivo COMPLETO desde SQL Editor con el rol postgres.
-- No es una migración. No utiliza pgTAP ni requiere Docker.
-- Todas las filas ficticias se revierten al terminar.

begin;

-- Identidades ficticias, sin contraseñas ni sesiones reales.
insert into auth.users (id, email)
values
    ('f0000000-0000-4000-8000-000000000001', 'rtr-rls-a@example.invalid'),
    ('f0000000-0000-4000-8000-000000000002', 'rtr-rls-b@example.invalid');

set local role authenticated;

do $$
declare
    player_a constant uuid := 'f0000000-0000-4000-8000-000000000001';
    player_b constant uuid := 'f0000000-0000-4000-8000-000000000002';
    player_id uuid;
    other_id uuid;
    epoch_a uuid;
    epoch_b uuid;
    own_epoch uuid;
    other_epoch uuid;
    table_name text;
    id_column text;
    reward_value text;
    affected bigint;
    reign_id uuid;
    other_reign_id uuid;
    reign_a constant uuid := 'f0000000-0000-4000-8000-000000000011';
    reign_b constant uuid := 'f0000000-0000-4000-8000-000000000012';
begin
    -- Crear perfiles, reinados y recompensas con los permisos reales
    -- de cada jugador. El JSON mínimo prueba el esquema, no SaveGame.
    foreach player_id in array array[player_a, player_b] loop
        perform set_config('request.jwt.claim.sub', player_id::text, true);
        perform set_config('request.jwt.claims',
            jsonb_build_object('sub', player_id, 'role', 'authenticated')::text, true);

        insert into public.profiles (user_id, username)
        values (player_id, 'Jugador de prueba')
        returning progress_epoch into own_epoch;

        if player_id = player_a then
            epoch_a := own_epoch;
            reign_id := reign_a;
        else
            epoch_b := own_epoch;
            reign_id := reign_b;
        end if;

        insert into public.reigns (
            id, user_id, progress_epoch, slot, monarch, save_data, peak_gold
        ) values (
            reign_id, player_id, own_epoch, 1, 'king',
            '{"monarch":"king","day":1}'::jsonb, 200
        );

        insert into public.player_achievements (user_id, progress_epoch, achievement_id)
        values (player_id, own_epoch, 'hand-of-king');
        insert into public.player_items (user_id, progress_epoch, item_id)
        values (player_id, own_epoch, 'rough-emerald');
        insert into public.player_unlocks (user_id, progress_epoch, reward_id)
        values (player_id, own_epoch, 'anthem');
    end loop;
    raise notice 'OK: ambos jugadores pueden crear sus propios registros';

    -- Comprobar el aislamiento en ambas direcciones y las operaciones
    -- permitidas y prohibidas bajo el rol authenticated.
    foreach player_id in array array[player_a, player_b] loop
        if player_id = player_a then
            other_id := player_b;
            own_epoch := epoch_a;
            other_epoch := epoch_b;
            reign_id := reign_a;
            other_reign_id := reign_b;
        else
            other_id := player_a;
            own_epoch := epoch_b;
            other_epoch := epoch_a;
            reign_id := reign_b;
            other_reign_id := reign_a;
        end if;

        perform set_config('request.jwt.claim.sub', player_id::text, true);
        perform set_config('request.jwt.claims',
            jsonb_build_object('sub', player_id, 'role', 'authenticated')::text, true);
        if auth.uid() is distinct from player_id then
            raise exception 'Identidad de prueba incorrecta';
        end if;

        foreach table_name in array array[
            'profiles', 'reigns', 'player_achievements', 'player_items', 'player_unlocks'
        ] loop
            execute format('select count(*) from public.%I where user_id = $1', table_name)
                into affected using player_id;
            if affected <> 1 then
                raise exception 'No se puede leer el registro propio en %', table_name;
            end if;
            execute format('select count(*) from public.%I where user_id <> $1', table_name)
                into affected using player_id;
            if affected <> 0 then
                raise exception 'Lectura ajena permitida en %', table_name;
            end if;

            -- No debe existir permiso DELETE directo, ni siquiera propio.
            begin
                execute format('delete from public.%I where user_id = $1', table_name)
                    using player_id;
                raise exception 'DELETE permitido en %', table_name;
            exception when insufficient_privilege then
                null;
            end;
        end loop;

        update public.profiles set username = 'Nombre actualizado' where user_id = player_id;
        get diagnostics affected = row_count;
        if affected <> 1 then raise exception 'No se puede editar el perfil propio'; end if;

        update public.profiles set username = 'Cambio no autorizado' where user_id = other_id;
        get diagnostics affected = row_count;
        if affected <> 0 then raise exception 'Edición de perfil ajeno permitida'; end if;

        begin
            insert into public.profiles (user_id, username) values (other_id, 'Intruso');
            raise exception 'Inserción de perfil ajeno permitida';
        exception when insufficient_privilege then null;
        end;

        begin
            update public.profiles set progress_epoch = gen_random_uuid() where user_id = player_id;
            raise exception 'Cambio de progress_epoch permitido';
        exception when insufficient_privilege then null;
        end;

        update public.reigns set revision = 2 where id = reign_id;
        get diagnostics affected = row_count;
        if affected <> 1 then raise exception 'No se puede actualizar el reinado propio'; end if;

        update public.reigns set revision = 99 where id = other_reign_id;
        get diagnostics affected = row_count;
        if affected <> 0 then raise exception 'Edición de reinado ajeno permitida'; end if;

        begin
            insert into public.reigns (user_id, progress_epoch, slot, monarch, save_data, peak_gold)
            values (other_id, other_epoch, 2, 'queen', '{"monarch":"queen","day":1}'::jsonb, 200);
            raise exception 'Inserción de reinado ajeno permitida';
        exception when insufficient_privilege then null;
        end;

        begin
            update public.reigns set user_id = other_id where id = reign_id;
            raise exception 'Cambio de propietario permitido';
        exception when insufficient_privilege then null;
        end;

        -- Los tres tipos de recompensa comparten las mismas reglas.
        for table_name, id_column, reward_value in
            select * from (values
                ('player_achievements', 'achievement_id', 'first-steps'),
                ('player_items', 'item_id', 'royal-portrait-queen'),
                ('player_unlocks', 'reward_id', 'rls-test-reward')
            ) as rewards(t, c, v)
        loop
            begin
                execute format('insert into public.%I (user_id, progress_epoch, %I) values ($1,$2,$3)', table_name, id_column)
                    using other_id, other_epoch, reward_value;
                raise exception 'Inserción de recompensa ajena permitida en %', table_name;
            exception when insufficient_privilege then null;
            end;
            begin
                execute format('update public.%I set unlocked_at = now() where user_id = $1', table_name)
                    using player_id;
                raise exception 'Modificación de recompensa permitida en %', table_name;
            exception when insufficient_privilege then null;
            end;
            begin
                execute format('insert into public.%I (user_id, progress_epoch, %I) values ($1,$2,$3)', table_name, id_column)
                    using player_id, gen_random_uuid(), reward_value;
                raise exception 'Generación de progreso incorrecta aceptada en %', table_name;
            exception when foreign_key_violation then null;
            end;
        end loop;
    end loop;
    raise notice 'OK: aislamiento de ambos jugadores y protección de columnas y recompensas';

    -- El último jugador del bucle es B. Comprobar sus dos ranuras.
    insert into public.reigns (user_id, progress_epoch, slot, monarch, save_data, peak_gold)
    values (player_b, epoch_b, 2, 'queen', '{"monarch":"queen","day":1}'::jsonb, 200);

    begin
        insert into public.reigns (user_id, progress_epoch, slot, monarch, save_data, peak_gold)
        values (player_b, epoch_b, 1, 'king', '{"monarch":"king","day":1}'::jsonb, 200);
        raise exception 'Se ha ocupado dos veces la misma ranura';
    exception when unique_violation then null;
    end;

    begin
        insert into public.reigns (user_id, progress_epoch, slot, monarch, save_data, peak_gold)
        values (player_b, epoch_b, 3, 'king', '{"monarch":"king","day":1}'::jsonb, 200);
        raise exception 'Se ha permitido una tercera ranura';
    exception when check_violation then null;
    end;

    update public.reigns set status = 'defeated', slot = null,
        ended_at = now(), game_over_reason = 'bankruptcy' where id = reign_b;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'No se puede finalizar un reinado propio'; end if;

    if not exists (select 1 from public.reigns where id = reign_b and status = 'defeated') then
        raise exception 'El reinado terminado no aparece en el historial';
    end if;

    update public.reigns set status = 'active', slot = 1,
        ended_at = null, game_over_reason = null where id = reign_b;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'Reactivación de un reinado finalizado permitida'; end if;

    insert into public.reigns (user_id, progress_epoch, slot, monarch, save_data, peak_gold)
    values (player_b, epoch_b, 1, 'king', '{"monarch":"king","day":1}'::jsonb, 200);
    raise notice 'OK: dos ranuras, historial protegido y reutilización de ranuras';
end;
$$;

reset role;
set local role anon;
set local request.jwt.claim.sub = '';
set local request.jwt.claims = '{"role":"anon"}';

do $$
declare
    table_name text;
    operation text;
    statement text;
begin
    foreach table_name in array array[
        'profiles', 'reigns', 'player_achievements', 'player_items', 'player_unlocks'
    ] loop
        foreach operation in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE'] loop
            if has_table_privilege(current_user, format('public.%I', table_name), operation)
                or (operation in ('SELECT', 'INSERT', 'UPDATE') and
                    has_any_column_privilege(current_user, format('public.%I', table_name), operation)) then
                raise exception 'Invitado tiene permiso % en %', operation, table_name;
            end if;
        end loop;
        statement := format('select count(*) from public.%I', table_name);
        begin
            execute statement;
            raise exception 'Lectura anónima permitida en %', table_name;
        exception when insufficient_privilege then null;
        end;
    end loop;
    raise notice 'OK: acceso de invitados denegado en las cinco tablas';
end;
$$;

reset role;
rollback;

-- Solo debe aparecer tras una ejecución completa sin errores.
select 'Pruebas RLS superadas' as resultado;
