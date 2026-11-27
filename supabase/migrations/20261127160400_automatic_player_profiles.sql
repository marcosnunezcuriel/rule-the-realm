-- Creación automática del perfil al registrar una cuenta.

create function public.create_player_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    player_name text;
begin
    player_name := case
        when jsonb_typeof(
            new.raw_user_meta_data -> 'username'
        ) = 'string'
        then btrim(
            new.raw_user_meta_data ->> 'username'
        )
        else null
    end;

    insert into public.profiles (
        user_id,
        username
    )
    values (
        new.id,
        coalesce(
            nullif(left(player_name, 40), ''),
            'Jugador'
        )
    );

    return new;
end;
$$;

-- Crear el perfil cuando Supabase registre una cuenta.
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.create_player_profile();

-- Impedir la ejecución directa desde el navegador.
revoke all privileges
    on function public.create_player_profile()
    from public, anon, authenticated;

-- Crear los perfiles que pudieran faltar en cuentas anteriores.
insert into public.profiles (user_id, username)
select
    id,
    coalesce(
        nullif(
            left(
                case
                    when jsonb_typeof(
                        raw_user_meta_data -> 'username'
                    ) = 'string'
                    then btrim(
                        raw_user_meta_data ->> 'username'
                    )
                    else null
                end,
                40
            ),
            ''
        ),
        'Jugador'
    )
from auth.users
on conflict (user_id) do nothing;

-- Ya no será necesario crear perfiles desde React.
drop policy profiles_insert_own
    on public.profiles;

revoke insert (user_id, username)
    on table public.profiles
    from authenticated;
