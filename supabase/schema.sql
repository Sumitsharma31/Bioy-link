-- ==========================================
-- BioLinks Idempotent Production Schema
-- Safe to run multiple times
-- ==========================================

-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  updated_at timestamp with time zone default now(),
  username text unique check (
    char_length(username) >= 3 and
    char_length(username) <= 30 and
    username ~ '^[a-z0-9._]+$' and
    username !~ '\.\.' and
    username !~ '__' and
    username !~ '^[._]' and
    username !~ '[._]$'
  ),
  full_name text,
  avatar_url text,
  bio text,
  subscription_tier text default 'free',
  timezone text default 'Asia/Kolkata',
  
  -- Analytics
  views integer default 0,
  mobile_views integer default 0,
  desktop_views integer default 0,
  tablet_views integer default 0
);

-- Ensure analytics columns exist if table was already created
alter table profiles add column if not exists views integer default 0;
alter table profiles add column if not exists mobile_views integer default 0;
alter table profiles add column if not exists desktop_views integer default 0;
alter table profiles add column if not exists tablet_views integer default 0;
alter table profiles add column if not exists timezone text default 'Asia/Kolkata';

-- RLS for Profiles
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);


-- 2. LINKS TABLE
create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  order_index integer not null default 0,
  is_active boolean default true,
  icon_name text default 'Globe',
  clicks integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure clicks column exists if table was already created
alter table links add column if not exists clicks integer default 0;
alter table links add column if not exists icon_name text default 'Globe';

-- RLS for Links
alter table links enable row level security;

drop policy if exists "Links are viewable by everyone." on links;
create policy "Links are viewable by everyone." on links
  for select using (true);

drop policy if exists "Users can insert their own links." on links;
create policy "Users can insert their own links." on links
  for insert with check ((select auth.uid()) = profile_id);

drop policy if exists "Users can update own links." on links;
create policy "Users can update own links." on links
  for update using ((select auth.uid()) = profile_id);

drop policy if exists "Users can delete own links." on links;
create policy "Users can delete own links." on links
  for delete using ((select auth.uid()) = profile_id);


-- 3. APPEARANCE TABLE
create table if not exists appearance (
  profile_id uuid references profiles(id) on delete cascade not null primary key,
  theme_preset text default 'Modern Lime',
  button_style text default 'Rounded',
  font_family text default 'Inter',
  custom_bg_color text,
  custom_button_color text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Appearance
alter table appearance enable row level security;

drop policy if exists "Appearance settings are viewable by everyone." on appearance;
create policy "Appearance settings are viewable by everyone." on appearance
  for select using (true);

drop policy if exists "Users can insert their own appearance settings." on appearance;
create policy "Users can insert their own appearance settings." on appearance
  for insert with check ((select auth.uid()) = profile_id);

drop policy if exists "Users can update own appearance settings." on appearance;
create policy "Users can update own appearance settings." on appearance
  for update using ((select auth.uid()) = profile_id);


-- 4. ANALYTICS FUNCTIONS (RPCs)
create or replace function increment_profile_views(profile_id uuid, device_type text)
returns void as $$
begin
  update profiles
  set views = views + 1,
      mobile_views = case when device_type = 'mobile' then mobile_views + 1 else mobile_views end,
      desktop_views = case when device_type = 'desktop' then desktop_views + 1 else desktop_views end,
      tablet_views = case when device_type = 'tablet' then tablet_views + 1 else tablet_views end
  where id = profile_id;
end;
$$ language plpgsql security definer;

create or replace function increment_link_clicks(link_id uuid)
returns void as $$
begin
  update links
  set clicks = clicks + 1
  where id = link_id;
end;
$$ language plpgsql security definer;


-- 5. REALTIME & PERFORMANCE
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table links;
alter publication supabase_realtime add table appearance;

create index if not exists links_profile_id_idx on links (profile_id);
create index if not exists appearance_profile_id_idx on appearance (profile_id);
create index if not exists links_clicks_idx on links (clicks desc);

-- 6. USERNAME HISTORY TABLE
-- Tracks previous usernames so old URLs can redirect to the new one.
create table if not exists username_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  old_username text not null,
  new_username text not null,
  changed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists username_history_user_id_idx on username_history (user_id);
create index if not exists username_history_old_username_idx on username_history (old_username);

-- RLS for username_history
alter table username_history enable row level security;

drop policy if exists "History is viewable by everyone." on username_history;
create policy "History is viewable by everyone." on username_history
  for select using (true);

drop policy if exists "Users can insert their own history." on username_history;
create policy "Users can insert their own history." on username_history
  for insert with check ((select auth.uid()) = user_id);

