-- Esquema inicial de Rule the Realm.


-- ==========================================
-- PERFILES
-- ==========================================

create table public.profiles (
    user_id uuid primary key
        references auth.users(id)
        on delete cascade,

    username text not null
        check (
            char_length(btrim(username))
            between 1 and 40
        ),

    -- Identifica la generación de progreso actual.
    progress_epoch uuid not null
        default gen_random_uuid(),

    created_at timestamptz not null
        default now(),

    unique (user_id, progress_epoch)
);


-- ==========================================
-- REINADOS
-- ==========================================

create table public.reigns (
    id uuid primary key
        default gen_random_uuid(),

    user_id uuid not null,
    progress_epoch uuid not null,

    -- Ranura activa de guardado.
    slot smallint,

    monarch text not null
        check (monarch in ('king', 'queen')),

    status text not null
        default 'active'
        check (
            status in (
                'active',
                'defeated',
                'abandoned',
                'completed'
            )
        ),

    -- Estado persistente del motor del juego.
    save_data jsonb not null
        check (jsonb_typeof(save_data) = 'object'),

    save_version integer not null
        default 1
        check (save_version >= 1),

    revision bigint not null
        default 1
        check (revision >= 1),

    -- Información para el historial y las estadísticas.
    day_reached integer not null
        default 1
        check (day_reached >= 1),

    completed_days integer not null
        default 0
        check (completed_days >= 0),

    completed_chapters integer not null
        default 0
        check (completed_chapters >= 0),

    peak_gold numeric not null,

    game_over_reason text
        check (
            game_over_reason in (
                'bankruptcy',
                'abandoned',
                'invasion',
                'religious-crisis',
                'overthrown'
            )
        ),

    -- Un reinado importado podría no tener
    -- una fecha de inicio conocida.
    started_at timestamptz
        default now(),

    updated_at timestamptz not null
        default now(),

    ended_at timestamptz,

    -- El progreso debe pertenecer a un perfil existente.
    foreign key (user_id, progress_epoch)
        references public.profiles(
            user_id,
            progress_epoch
        )
        on delete cascade,

    -- Solo los reinados activos ocupan ranuras.
    constraint reigns_valid_slot check (
        (
            status = 'active'
            and slot is not null
            and slot in (1, 2)
        )
        or (
            status <> 'active'
            and slot is null
        )
    ),

    -- Solo los reinados finalizados tienen fecha de fin.
    constraint reigns_valid_ending check (
        (
            status = 'active'
            and ended_at is null
        )
        or (
            status <> 'active'
            and ended_at is not null
        )
    ),

    -- Solo una derrota tiene causa de derrota.
    constraint reigns_valid_defeat check (
        (
            status = 'defeated'
            and game_over_reason is not null
        )
        or (
            status <> 'defeated'
            and game_over_reason is null
        )
    ),

    constraint reigns_valid_progress check (
        completed_days <= day_reached
        and completed_chapters <= completed_days
    ),

    -- El resumen debe corresponder al guardado.
    constraint reigns_matching_save check (
        (
            save_data ->> 'monarch' = monarch
            and save_data -> 'day' = to_jsonb(day_reached)
        ) is true
    ),

    constraint reigns_valid_dates check (
        ended_at is null
        or started_at is null
        or ended_at >= started_at
    )
);

-- Impide ocupar dos veces la misma ranura.
create unique index reigns_unique_active_slot
    on public.reigns (user_id, slot)
    where status = 'active';

-- Facilita la recuperación del historial del jugador.
create index reigns_user_history_idx
    on public.reigns (user_id, updated_at desc);


-- ==========================================
-- LOGROS
-- ==========================================

create table public.player_achievements (
    user_id uuid not null,
    progress_epoch uuid not null,

    achievement_id text not null
        check (btrim(achievement_id) <> ''),

    unlocked_at timestamptz not null
        default now(),

    primary key (user_id, achievement_id),

    foreign key (user_id, progress_epoch)
        references public.profiles(
            user_id,
            progress_epoch
        )
        on delete cascade
);


-- ==========================================
-- TESORO REAL
-- ==========================================

create table public.player_items (
    user_id uuid not null,
    progress_epoch uuid not null,

    item_id text not null
        check (
            btrim(item_id) <> ''
            and item_id <> 'anthem-of-astaria'
        ),

    unlocked_at timestamptz not null
        default now(),

    primary key (user_id, item_id),

    foreign key (user_id, progress_epoch)
        references public.profiles(
            user_id,
            progress_epoch
        )
        on delete cascade
);


-- ==========================================
-- RECOMPENSAS MUSICALES
-- ==========================================

create table public.player_unlocks (
    user_id uuid not null,
    progress_epoch uuid not null,

    reward_id text not null
        check (btrim(reward_id) <> ''),

    unlocked_at timestamptz not null
        default now(),

    primary key (user_id, reward_id),

    foreign key (user_id, progress_epoch)
        references public.profiles(
            user_id,
            progress_epoch
        )
        on delete cascade
);


-- ==========================================
-- SEGURIDAD INICIAL
-- ==========================================

-- Activar la seguridad a nivel de fila.
alter table public.profiles
    enable row level security;

alter table public.reigns
    enable row level security;

alter table public.player_achievements
    enable row level security;

alter table public.player_items
    enable row level security;

alter table public.player_unlocks
    enable row level security;

-- Ningún cliente del juego tendrá acceso hasta
-- que configuremos expresamente sus permisos.
revoke all privileges on table
    public.profiles,
    public.reigns,
    public.player_achievements,
    public.player_items,
    public.player_unlocks
from public, anon, authenticated;
