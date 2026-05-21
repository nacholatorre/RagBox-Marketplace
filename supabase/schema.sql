-- ============================================================
-- Narketplace — Setup completo de la base (ÚNICO script)
-- Pegá TODO esto en Supabase → SQL Editor → Run.
-- ⚠️ Reinicia las tablas: solo para desarrollo / datos de prueba.
-- Es el único archivo que hace falta correr.
-- ============================================================

-- ---------- Reset ----------
drop table if exists contact_events cascade;
drop table if exists comments cascade;
drop table if exists reviews cascade;
drop table if exists reports cascade;
drop table if exists messages cascade;
drop table if exists conversations cascade;
drop table if exists favorites cascade;
drop table if exists listings cascade;
drop table if exists profiles cascade;
drop table if exists schools cascade;

-- ---------- schools ----------
create table schools (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  city       text,
  logo_url   text,
  active     boolean default true,
  created_at timestamptz default now()
);

-- ---------- profiles (extiende auth.users) ----------
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  whatsapp   text,
  school_id  uuid references schools(id),
  avatar_url text,
  created_at timestamptz default now()
);

-- ---------- listings ----------
create table listings (
  id               uuid primary key default gen_random_uuid(),
  school_id        uuid references schools(id) on delete cascade not null,
  seller_id        uuid references profiles(id) on delete set null,
  type             text not null default 'sell' check (type in ('sell','request','donation','announcement')),
  title            text not null,
  description      text,
  price            numeric(10,2),
  price_mode       text not null default 'fixed' check (price_mode in ('fixed','negotiable','free')),
  category         text not null check (category in ('uniformes','libros','utiles','calculadoras','deportes','tecnologia','otros')),
  condition        text not null check (condition in ('nuevo','como-nuevo','usado')),
  size             text,
  season           text,
  grade            text,
  seller_name      text not null,
  seller_whatsapp  text not null,
  images           text[] default '{}',
  status           text not null default 'active' check (status in ('active','reserved','sold','paused','fulfilled')),
  created_at       timestamptz default now(),
  expires_at       timestamptz default (now() + interval '60 days')
);

create index listings_school_id_idx on listings(school_id);
create index listings_category_idx  on listings(category);
create index listings_status_idx    on listings(status);
create index listings_seller_id_idx on listings(seller_id);
create index listings_type_idx      on listings(type);

-- ---------- favorites ----------
create table favorites (
  user_id    uuid references profiles(id) on delete cascade not null,
  listing_id uuid references listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, listing_id)
);

-- ---------- conversations (legacy — chat interno retirado, sin uso en la app) ----------
create table conversations (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid references listings(id) on delete cascade not null,
  buyer_id        uuid references profiles(id) on delete cascade not null,
  seller_id       uuid references profiles(id) on delete cascade not null,
  created_at      timestamptz default now(),
  last_message_at timestamptz default now(),
  unique (listing_id, buyer_id)
);

create index conversations_buyer_idx  on conversations(buyer_id);
create index conversations_seller_idx on conversations(seller_id);

-- ---------- messages (legacy — chat interno retirado, sin uso en la app) ----------
create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id       uuid references profiles(id) on delete cascade not null,
  body            text not null,
  created_at      timestamptz default now(),
  read_at         timestamptz
);

create index messages_conversation_idx on messages(conversation_id, created_at);

-- ---------- reports (reportar aviso) ----------
create table reports (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references listings(id) on delete cascade not null,
  reporter_id uuid references profiles(id) on delete set null,
  reason      text not null,
  detail      text,
  created_at  timestamptz default now()
);

-- ---------- reviews (calificación del vendedor) ----------
create table reviews (
  id         uuid primary key default gen_random_uuid(),
  seller_id  uuid references profiles(id) on delete cascade not null,
  rater_id   uuid references profiles(id) on delete cascade not null,
  rating     int not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz default now(),
  unique (seller_id, rater_id)
);

create index reviews_seller_idx on reviews(seller_id);

-- ---------- comments (preguntas en avisos) ----------
create table comments (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade not null,
  author_id  uuid references profiles(id) on delete cascade not null,
  body       text not null,
  created_at timestamptz default now()
);

create index comments_listing_idx on comments(listing_id, created_at);

-- ---------- contact_events (clics en "Contactar por WhatsApp") ----------
create table contact_events (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade not null,
  user_id    uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index contact_events_listing_idx on contact_events(listing_id);

-- ---------- Trigger: crear profile al registrarse ----------
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- Trigger: actualizar last_message_at ----------
create or replace function bump_conversation()
returns trigger language plpgsql as $$
begin
  update conversations set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_created on messages;
create trigger on_message_created
  after insert on messages
  for each row execute function bump_conversation();

-- ============================================================
-- RLS
-- ============================================================
alter table schools       enable row level security;
alter table profiles      enable row level security;
alter table listings      enable row level security;
alter table favorites     enable row level security;
alter table conversations enable row level security;
alter table messages      enable row level security;
alter table reports       enable row level security;
alter table reviews        enable row level security;
alter table comments       enable row level security;
alter table contact_events enable row level security;

-- schools: lectura pública
create policy "schools_select" on schools for select using (true);

-- profiles: lectura pública, escritura propia
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);

-- listings: lectura pública; el dueño gestiona los suyos
create policy "listings_select" on listings for select using (true);
create policy "listings_insert" on listings for insert with check (auth.uid() = seller_id);
create policy "listings_update" on listings for update using (auth.uid() = seller_id);
create policy "listings_delete" on listings for delete using (auth.uid() = seller_id);

-- favorites: cada quien ve y modifica los suyos
create policy "favorites_select" on favorites for select using (auth.uid() = user_id);
create policy "favorites_insert" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete" on favorites for delete using (auth.uid() = user_id);

-- conversations: solo participantes
create policy "conversations_select" on conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "conversations_insert" on conversations for insert
  with check (auth.uid() = buyer_id);

-- messages: solo participantes de la conversación
create policy "messages_select" on messages for select using (
  exists (select 1 from conversations c
          where c.id = conversation_id
          and (c.buyer_id = auth.uid() or c.seller_id = auth.uid()))
);
create policy "messages_insert" on messages for insert with check (
  auth.uid() = sender_id
  and exists (select 1 from conversations c
              where c.id = conversation_id
              and (c.buyer_id = auth.uid() or c.seller_id = auth.uid()))
);

-- reports: cualquier usuario autenticado puede reportar
create policy "reports_insert" on reports for insert
  to authenticated with check (auth.uid() = reporter_id);

-- reviews: lectura pública; cada quien gestiona su propia reseña
create policy "reviews_select" on reviews for select using (true);
create policy "reviews_insert" on reviews for insert
  to authenticated with check (auth.uid() = rater_id);
create policy "reviews_update" on reviews for update
  to authenticated using (auth.uid() = rater_id);

-- comments: lectura pública; el autor gestiona los suyos
create policy "comments_select" on comments for select using (true);
create policy "comments_insert" on comments for insert
  to authenticated with check (auth.uid() = author_id);
create policy "comments_delete" on comments for delete
  to authenticated using (auth.uid() = author_id);

-- contact_events: cualquiera registra un contacto; solo el admin lo lee
create policy "contact_events_insert" on contact_events for insert
  with check (true);
create policy "contact_events_select" on contact_events for select
  using ((auth.jwt() ->> 'email') = 'nachitolatorre@icloud.com');

-- ---------- Realtime ----------
alter publication supabase_realtime add table messages;

-- ============================================================
-- Storage: bucket de imágenes
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('listing-images', 'listing-images', true),
  ('avatars',        'avatars',        true)
on conflict (id) do nothing;

drop policy if exists "storage_public_select" on storage.objects;
create policy "storage_public_select" on storage.objects
  for select using (bucket_id in ('listing-images', 'avatars'));

drop policy if exists "storage_auth_insert" on storage.objects;
create policy "storage_auth_insert" on storage.objects
  for insert to authenticated with check (bucket_id in ('listing-images', 'avatars'));

drop policy if exists "storage_auth_update" on storage.objects;
create policy "storage_auth_update" on storage.objects
  for update to authenticated using (bucket_id in ('listing-images', 'avatars'));

-- ============================================================
-- Seed — colegio piloto (solo Wellspring) + catálogo demo
-- ============================================================
insert into schools (name, slug, city, logo_url) values
  ('Wellspring School', 'wellspring-ba', 'Buenos Aires', '/images/logo-colegio.png');

insert into listings
  (school_id, title, description, price, category, condition, size, seller_name, seller_whatsapp, images)
select s.id, v.title, v.description, v.price, v.category, v.condition, v.size,
       v.seller_name, v.seller_whatsapp, v.images
from schools s
cross join (values
  ('Chomba Wellspring talle 10',          'Usada un semestre, muy buen estado.',          8000,  'uniformes',    'como-nuevo', '10',  'María García',    '5491170003793', array['/images/chomba.png']),
  ('Sweater del colegio talle 12',        'Abriga muchísimo, sin pelusas.',               14000, 'uniformes',    'usado',      '12',  'Pablo Díaz',      '5491170003793', array['/images/sweater.png']),
  ('Pollera del kilt talle 12',           'Dobladillo original, impecable.',              16000, 'uniformes',    'como-nuevo', '12',  'Carla Méndez',    '5491170003793', array['/images/kilts.png']),
  ('Campera polar Wellspring talle 14',   'Ideal para el invierno.',                      22000, 'uniformes',    'usado',      '14',  'Sofía Ramírez',   '5491170003793', array['/images/polar.png']),
  ('Jogging del colegio talle 12',        'Cómodo, poco uso.',                            15000, 'uniformes',    'como-nuevo', '12',  'Diego Sosa',      '5491170003793', array['/images/joggin.png']),
  ('Remera House Fire talle 10',          'De la casa Fire, buen estado.',                7000,  'uniformes',    'usado',      '10',  'Ana Torres',      '5491170003793', array['/images/remera-house-fire.png']),
  ('Polera térmica talle 8',              'Primera capa para los días fríos.',            8500,  'uniformes',    'como-nuevo', '8',   'Lucía Fernández', '5491170003793', array['/images/polera.png']),
  ('Medias del colegio (pack x3)',        'Pack de 3 pares, sin estrenar.',               4000,  'uniformes',    'nuevo',      null,  'Tomás Vega',      '5491170003793', array['/images/medias.png']),
  ('Camiseta de rugby talle 14',          'Usada una temporada.',                         12000, 'deportes',     'usado',      '14',  'Nicolás Paz',     '5491170003793', array['/images/camiseta-rugby.png']),
  ('Remera de hockey talle 12',           'Buen estado, sin roturas.',                    9000,  'deportes',     'como-nuevo', '12',  'Valentina Ruiz',  '5491170003793', array['/images/remera-hockey.png']),
  ('Short de gimnasia talle 10',          'Para educación física.',                       5000,  'deportes',     'usado',      '10',  'Martín Acosta',   '5491170003793', array['/images/short.png']),
  ('Calza deportiva talle 12',            'Elastizada, muy cómoda.',                      6000,  'deportes',     'como-nuevo', '12',  'Julieta Roldán',  '5491170003793', array['/images/calza.png']),
  ('Calculadora científica Casio fx-82',  'Funciona perfecto, ideal secundario.',         12000, 'calculadoras', 'usado',      null,  'Marcos Gil',      '5491170003793', array[]::text[]),
  ('Libro de Matemática 3 — Santillana',  'Edición 2023, algunas hojas con lápiz.',       null,  'libros',       'usado',      null,  'Laura Méndez',    '5491170003793', array[]::text[])
) as v(title, description, price, category, condition, size, seller_name, seller_whatsapp, images)
where s.slug = 'wellspring-ba';

-- ---------- Seed — Tablón: mensajes de la comunidad ----------
-- Los mensajes del Tablón son listings que no son 'sell'. El texto del mensaje va en
-- title. category/condition van con un valor fijo porque la columna es NOT NULL,
-- pero la app no los usa para el Tablón.
insert into listings
  (school_id, type, title, price_mode, category, condition,
   seller_name, seller_whatsapp, images)
select s.id, v.type, v.title, 'free', 'otros', 'usado',
       v.seller_name, v.seller_whatsapp, array[]::text[]
from schools s
cross join (values
  ('request',      'Busco una chomba talle 10 en buen estado. Si a alguna familia le quedó chica, la necesito.', 'Mariana López', '5491170003793'),
  ('request',      'Alguien tiene el libro de Matemática de 3er año? El de Santillana, edición reciente. Gracias!', 'Gabriel Ortiz', '5491170003793'),
  ('donation',     'Dono una campera de invierno talle 12, le quedó chica a mi hijo. La puedo dejar en portería.', 'Cecilia Vera', '5491170003793'),
  ('donation',     'Regalo útiles escolares: cuadernos sin estrenar y una cartuchera. Escribanme y los coordino.', 'Hernán Díaz', '5491170003793'),
  ('announcement', 'Encontré una campera en la salida del primer turno. La dejé en portería por si alguien la perdió.', 'María García', '5491170003793')
) as v(type, title, seller_name, seller_whatsapp)
where s.slug = 'wellspring-ba';

-- Listo. Volvé a la app y refrescá.
-- Nota: en una base de producción ya creada, en vez de correr todo este script,
-- actualizá solo los CHECK de listings con:
--   alter table listings drop constraint listings_type_check,
--     add constraint listings_type_check check (type in ('sell','request','donation','announcement'));
--   alter table listings drop constraint listings_status_check,
--     add constraint listings_status_check check (status in ('active','reserved','sold','paused','fulfilled'));
