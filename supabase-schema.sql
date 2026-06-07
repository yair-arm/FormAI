-- FormAI Database Schema
-- Pega esto en SQL Editor de Supabase y ejecuta

create table if not exists forms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  fields jsonb not null default '[]',
  slug text unique,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists form_responses (
  id uuid default gen_random_uuid() primary key,
  form_id uuid references forms(id) on delete cascade,
  data jsonb not null,
  ip text,
  created_at timestamp with time zone default now()
);

alter table forms enable row level security;
alter table form_responses enable row level security;

create policy "Users can view own forms" on forms for select using (auth.uid() = user_id);
create policy "Users can insert own forms" on forms for insert with check (auth.uid() = user_id);
create policy "Users can update own forms" on forms for update using (auth.uid() = user_id);
create policy "Users can delete own forms" on forms for delete using (auth.uid() = user_id);

create policy "Anyone can submit responses" on form_responses
  for insert with check (exists (select 1 from forms where id = form_id and is_active = true));

create policy "Form owners can view responses" on form_responses
  for select using (exists (select 1 from forms where id = form_id and user_id = auth.uid()));

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger forms_updated_at
  before update on forms
  for each row execute function update_updated_at();
