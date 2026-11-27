-- Permisos y políticas de seguridad de Rule the Realm.


-- ==========================================
-- PERFILES
-- ==========================================

grant select
    on table public.profiles
    to authenticated;

-- Los identificadores internos y las fechas
-- se generan mediante sus valores predeterminados.
grant insert (user_id, username)
    on table public.profiles
    to authenticated;

-- El jugador únicamente puede editar su nombre.
grant update (username)
    on table public.profiles
    to authenticated;

create policy profiles_select_own
    on public.profiles
    for select
    to authenticated
    using (
        (select auth.uid()) = user_id
    );

create policy profiles_insert_own
    on public.profiles
    for insert
    to authenticated
    with check (
        (select auth.uid()) = user_id
    );

create policy profiles_update_own
    on public.profiles
    for update
    to authenticated
    using (
        (select auth.uid()) = user_id
    )
    with check (
        (select auth.uid()) = user_id
    );


-- ==========================================
-- REINADOS
-- ==========================================

grant select, insert
    on table public.reigns
    to authenticated;

-- Permitir actualizar el progreso sin modificar
-- la identidad ni el propietario del reinado.
grant update (
    slot,
    status,
    save_data,
    save_version,
    revision,
    day_reached,
    completed_days,
    completed_chapters,
    peak_gold,
    game_over_reason,
    updated_at,
    ended_at
)
    on table public.reigns
    to authenticated;

-- Consultar partidas activas e historial propio.
create policy reigns_select_own
    on public.reigns
    for select
    to authenticated
    using (
        (select auth.uid()) = user_id
    );

-- Crear reinados únicamente para la cuenta propia.
create policy reigns_insert_own
    on public.reigns
    for insert
    to authenticated
    with check (
        (select auth.uid()) = user_id
    );

-- Los reinados finalizados quedan protegidos
-- contra modificaciones posteriores.
create policy reigns_update_own_active
    on public.reigns
    for update
    to authenticated
    using (
        (select auth.uid()) = user_id
        and status = 'active'
    )
    with check (
        (select auth.uid()) = user_id
    );


-- ==========================================
-- LOGROS
-- ==========================================

grant select, insert
    on table public.player_achievements
    to authenticated;

create policy player_achievements_select_own
    on public.player_achievements
    for select
    to authenticated
    using (
        (select auth.uid()) = user_id
    );

create policy player_achievements_insert_own
    on public.player_achievements
    for insert
    to authenticated
    with check (
        (select auth.uid()) = user_id
    );


-- ==========================================
-- TESORO REAL
-- ==========================================

grant select, insert
    on table public.player_items
    to authenticated;

create policy player_items_select_own
    on public.player_items
    for select
    to authenticated
    using (
        (select auth.uid()) = user_id
    );

create policy player_items_insert_own
    on public.player_items
    for insert
    to authenticated
    with check (
        (select auth.uid()) = user_id
    );


-- ==========================================
-- RECOMPENSAS MUSICALES
-- ==========================================

grant select, insert
    on table public.player_unlocks
    to authenticated;

create policy player_unlocks_select_own
    on public.player_unlocks
    for select
    to authenticated
    using (
        (select auth.uid()) = user_id
    );

create policy player_unlocks_insert_own
    on public.player_unlocks
    for insert
    to authenticated
    with check (
        (select auth.uid()) = user_id
    );
