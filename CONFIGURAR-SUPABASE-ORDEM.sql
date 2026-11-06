-- Arquivo da Ordem: complemento ao SQL inicial ja executado.
-- Execute no SQL Editor do projeto OrdemFichas.
-- ATENCAO: sem login, estas permissoes permitem a QUALQUER visitante
-- com a chave publica ler, criar, editar e apagar TODAS as campanhas/fichas.
-- Nao use com dados privados; para producao publica, implemente
-- autorizacao de campanha por backend/Edge Function antes de liberar.

begin;
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
grant select, insert, update, delete on public.ordem_campaigns, public.ordem_characters to anon;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_campaigns' and policyname='public_collab_campaigns_select') then
    create policy public_collab_campaigns_select on public.ordem_campaigns for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_campaigns' and policyname='public_collab_campaigns_insert') then
    create policy public_collab_campaigns_insert on public.ordem_campaigns for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_campaigns' and policyname='public_collab_campaigns_update') then
    create policy public_collab_campaigns_update on public.ordem_campaigns for update to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_campaigns' and policyname='public_collab_campaigns_delete') then
    create policy public_collab_campaigns_delete on public.ordem_campaigns for delete to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_characters' and policyname='public_collab_chars_select') then
    create policy public_collab_chars_select on public.ordem_characters for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_characters' and policyname='public_collab_chars_insert') then
    create policy public_collab_chars_insert on public.ordem_characters for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_characters' and policyname='public_collab_chars_update') then
    create policy public_collab_chars_update on public.ordem_characters for update to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ordem_characters' and policyname='public_collab_chars_delete') then
    create policy public_collab_chars_delete on public.ordem_characters for delete to anon using (true);
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='ordem_campaigns') then
    alter publication supabase_realtime add table public.ordem_campaigns;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='ordem_characters') then
    alter publication supabase_realtime add table public.ordem_characters;
  end if;
end $$;
commit;
