-- NOVO PROJETO SUPABASE EXCLUSIVO PARA ESTE CLONE.
-- MODO COLABORATIVO PUBLICO, SEM LOGIN: TODOS COM ACESSO AO SITE/CHAVE
-- PODEM LER, ALTERAR E APAGAR QUALQUER CAMPANHA OU FICHA.
-- NAO USE PARA DADOS PRIVADOS OU CAMPANHAS QUE EXIJAM CONTROLE DE ACESSO.
create table if not exists public.ordem_campaigns (
 id uuid primary key,
 name text not null check(char_length(name) between 1 and 120),
 created_at timestamptz not null default now()
);
create table if not exists public.ordem_characters (
 id uuid primary key,
 campaign_id uuid not null references public.ordem_campaigns(id) on delete cascade,
 title text not null default 'Novo Agente',
 sheet jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint sheet_is_object check (jsonb_typeof(sheet) = 'object')
);
create index if not exists ordem_characters_campaign_idx on public.ordem_characters(campaign_id);
alter table public.ordem_campaigns enable row level security;
alter table public.ordem_characters enable row level security;
grant usage on schema public to anon;
grant select,insert,update,delete on public.ordem_campaigns,public.ordem_characters to anon;
-- Supabase anon key is PUBLIC by design. No service_role key in frontend.
create policy "public_collab_campaigns_select" on public.ordem_campaigns for select to anon using (true);
create policy "public_collab_campaigns_insert" on public.ordem_campaigns for insert to anon with check (true);
create policy "public_collab_campaigns_update" on public.ordem_campaigns for update to anon using (true) with check (true);
create policy "public_collab_campaigns_delete" on public.ordem_campaigns for delete to anon using (true);
create policy "public_collab_chars_select" on public.ordem_characters for select to anon using (true);
create policy "public_collab_chars_insert" on public.ordem_characters for insert to anon with check (true);
create policy "public_collab_chars_update" on public.ordem_characters for update to anon using (true) with check (true);
create policy "public_collab_chars_delete" on public.ordem_characters for delete to anon using (true);
-- Realtime: habilite Postgres Changes para as duas tabelas (Dashboard > Database > Replication).
-- Caso nao estejam na publicacao ainda, execute:
alter publication supabase_realtime add table public.ordem_campaigns;
alter publication supabase_realtime add table public.ordem_characters;
