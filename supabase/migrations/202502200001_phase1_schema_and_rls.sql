-- Phase 1 schema alignment and baseline RLS
-- Generated for OUALEBO CONNECT Sprint P0

create extension if not exists "pgcrypto";

-- Generic timestamp helper
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Utility to fetch the current utilisateur id (bypasses RLS)
create or replace function public.current_utilisateur_id()
returns uuid
security definer
set search_path = public
language sql
stable
as $$
  select id from public.utilisateurs where user_id = auth.uid() limit 1;
$$;

-- Utility to check roles (bypasses RLS)
create or replace function public.has_role(roles text[])
returns boolean
security definer
set search_path = public
language sql
stable
as $$
  select exists(
    select 1
    from public.utilisateurs u
    where u.user_id = auth.uid()
      and u.role = any(roles)
  );
$$;

-- Utilisateurs table
create table if not exists public.utilisateurs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null unique,
  nom text not null,
  prenom text not null,
  role text not null check (role in ('admin','directeur','secretaire','tresorier','conseiller')),
  specialisation text check (specialisation in ('juridique','protocole','communication','strategique')),
  poste text,
  telephone text,
  photo_url text,
  actif boolean not null default true,
  derniere_connexion timestamptz,
  nombre_connexions integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create trigger trg_utilisateurs_updated_at
  before update on public.utilisateurs
  for each row execute function public.update_updated_at_column();

-- Courrier table aligned with CR-YYYY-XXX numbering
create table if not exists public.courrier (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  type text not null check (type in ('arrivee','depart')),
  objet text not null,
  expediteur text,
  destinataire text,
  date_reception date,
  date_envoi date,
  priorite text not null default 'normale' check (priorite in ('normale','urgente','tres_urgente')),
  statut text not null default 'recu' check (statut in ('recu','en_cours','traite','archive')),
  categorie text,
  affecte_a uuid references public.utilisateurs(id) on delete set null,
  piece_jointe_url text,
  observations text,
  created_by uuid not null references public.utilisateurs(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.generate_courrier_numero()
returns text
language plpgsql
as $$
declare
  sequence_num integer;
  current_year text := to_char(current_date, 'YYYY');
begin
  select coalesce(max(split_part(numero, '-', 3)::int), 0) + 1
    into sequence_num
  from public.courrier
  where split_part(numero, '-', 2) = current_year;

  return format('CR-%s-%s', current_year, lpad(sequence_num::text, 3, '0'));
end;
$$;

create or replace function public.courrier_set_numero()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null or new.numero = '' then
    new.numero := public.generate_courrier_numero();
  end if;
  return new;
end;
$$;

create trigger trg_courrier_set_numero
  before insert on public.courrier
  for each row execute function public.courrier_set_numero();

create trigger trg_courrier_updated_at
  before update on public.courrier
  for each row execute function public.update_updated_at_column();

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  type_document text,
  categorie text,
  statut text not null default 'brouillon' check (statut in ('brouillon','en_revision','valide','archive')),
  fichier_url text,
  tags text[],
  responsable_id uuid references public.utilisateurs(id) on delete set null,
  created_by uuid not null references public.utilisateurs(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at_column();

-- Evenements (calendrier)
create table if not exists public.evenements (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  date_debut timestamptz not null,
  date_fin timestamptz,
  lieu text,
  statut text not null default 'planifie' check (statut in ('planifie','confirme','annule')),
  created_by uuid not null references public.utilisateurs(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_evenements_updated_at
  before update on public.evenements
  for each row execute function public.update_updated_at_column();

-- Audiences
create table if not exists public.audiences (
  id uuid primary key default gen_random_uuid(),
  objet text not null,
  date_audience timestamptz not null,
  lieu text,
  participants text[],
  statut text not null default 'planifiee' check (statut in ('planifiee','confirmee','reportee','annulee')),
  evenement_id uuid references public.evenements(id) on delete set null,
  responsable_id uuid references public.utilisateurs(id) on delete set null,
  created_by uuid not null references public.utilisateurs(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_audiences_updated_at
  before update on public.audiences
  for each row execute function public.update_updated_at_column();

-- ========================
-- RLS configuration
-- ========================

alter table public.utilisateurs enable row level security;
alter table public.courrier enable row level security;
alter table public.documents enable row level security;
alter table public.evenements enable row level security;
alter table public.audiences enable row level security;

-- Utilisateurs policies
create policy utilisateurs_select on public.utilisateurs
  for select to authenticated
  using (
    user_id = auth.uid()
    or has_role(array['admin','directeur'])
  );

create policy utilisateurs_insert on public.utilisateurs
  for insert to authenticated
  with check (has_role(array['admin','directeur']));

create policy utilisateurs_update on public.utilisateurs
  for update to authenticated
  using (user_id = auth.uid() or has_role(array['admin','directeur']))
  with check (user_id = auth.uid() or has_role(array['admin','directeur']));

create policy utilisateurs_delete on public.utilisateurs
  for delete to authenticated
  using (has_role(array['admin']));

-- Courrier policies
create policy courrier_select on public.courrier
  for select to authenticated
  using (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
    or affecte_a = current_utilisateur_id()
  );

create policy courrier_insert on public.courrier
  for insert to authenticated
  with check (
    has_role(array['admin','directeur','secretaire'])
    and created_by = current_utilisateur_id()
  );

create policy courrier_update on public.courrier
  for update to authenticated
  using (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
    or affecte_a = current_utilisateur_id()
  )
  with check (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
    or affecte_a = current_utilisateur_id()
  );

create policy courrier_delete on public.courrier
  for delete to authenticated
  using (has_role(array['admin','directeur']));

-- Documents policies
create policy documents_select on public.documents
  for select to authenticated
  using (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
    or responsable_id = current_utilisateur_id()
  );

create policy documents_insert on public.documents
  for insert to authenticated
  with check (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
  );

create policy documents_update on public.documents
  for update to authenticated
  using (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
    or responsable_id = current_utilisateur_id()
  )
  with check (
    has_role(array['admin','directeur','secretaire'])
    or created_by = current_utilisateur_id()
    or responsable_id = current_utilisateur_id()
  );

create policy documents_delete on public.documents
  for delete to authenticated
  using (has_role(array['admin','directeur']));

-- Evenements policies
create policy evenements_select on public.evenements
  for select to authenticated
  using (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
  );

create policy evenements_insert on public.evenements
  for insert to authenticated
  with check (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
  );

create policy evenements_update on public.evenements
  for update to authenticated
  using (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
  )
  with check (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
  );

create policy evenements_delete on public.evenements
  for delete to authenticated
  using (has_role(array['admin','directeur']));

-- Audiences policies
create policy audiences_select on public.audiences
  for select to authenticated
  using (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
    or responsable_id = current_utilisateur_id()
  );

create policy audiences_insert on public.audiences
  for insert to authenticated
  with check (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
  );

create policy audiences_update on public.audiences
  for update to authenticated
  using (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
    or responsable_id = current_utilisateur_id()
  )
  with check (
    has_role(array['admin','directeur','secretaire','conseiller'])
    or created_by = current_utilisateur_id()
    or responsable_id = current_utilisateur_id()
  );

create policy audiences_delete on public.audiences
  for delete to authenticated
  using (has_role(array['admin','directeur']));
