-- ============================================================
-- Carga de catálogo oficial RagBox para Sofía Latorre
-- ============================================================
-- Pegar este script en Supabase → SQL Editor → Run.
-- Idempotente: borra las publicaciones actuales de Sofía e inserta las 82 nuevas.
-- Atómico: si algo falla a la mitad, rollback automático del bloque entero.
--
-- Requisitos previos:
--   - Colegio Wellspring existe (slug = 'wellspring-ba').
--   - Sofía ya se registró en la app y su profile tiene whatsapp = '5491170003793'.
--     Si no existe, el script aborta con error (no insertamos listings huérfanos).

do $$
declare
  v_school_id uuid;
  v_seller_id uuid;
  v_whatsapp text := '5491170003793';
  v_name     text := 'Sofía Latorre';
begin
  select id into v_school_id from schools where slug = 'wellspring-ba';
  if v_school_id is null then
    raise exception 'No existe el colegio con slug wellspring-ba';
  end if;

  select id into v_seller_id from profiles where whatsapp = v_whatsapp limit 1;
  if v_seller_id is null then
    raise exception 'No existe profile con whatsapp %. Sofía tiene que registrarse en la app primero.', v_whatsapp;
  end if;

  -- Borrar publicaciones actuales de Sofía (favoritos/reports caen en cascada)
  delete from listings
   where seller_id = v_seller_id
      or seller_name = v_name;

  -- Insertar las 82 publicaciones del catálogo oficial
  insert into listings
    (school_id, seller_id, seller_name, seller_whatsapp,
     title, price, category, condition, size, images)
  values
    -- Chomba
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Chomba talle 4',   19000, 'uniformes', 'nuevo', '4',   array['/images/chomba.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Chomba talle S',   20000, 'uniformes', 'nuevo', 'S',   array['/images/chomba.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Chomba talle M',   20000, 'uniformes', 'nuevo', 'M',   array['/images/chomba.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Chomba talle L',   21000, 'uniformes', 'nuevo', 'L',   array['/images/chomba.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Chomba talle XL',  21000, 'uniformes', 'nuevo', 'XL',  array['/images/chomba.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Chomba talle XXL', 21000, 'uniformes', 'nuevo', 'XXL', array['/images/chomba.png']),

    -- Camisas (sin imagen)
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camisa talle M',  22000, 'uniformes', 'nuevo', 'M',  array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camisa talle L',  22000, 'uniformes', 'nuevo', 'L',  array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camisa talle XL', 23000, 'uniformes', 'nuevo', 'XL', array[]::text[]),

    -- Joggings
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Jogging talle XL',  22000, 'uniformes', 'nuevo', 'XL',  array['/images/joggin.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Jogging talle XXL', 22000, 'uniformes', 'nuevo', 'XXL', array['/images/joggin.png']),

    -- Sweaters
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 6',    22000, 'uniformes', 'nuevo', '6',    array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 8',    22000, 'uniformes', 'nuevo', '8',    array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 10',   23000, 'uniformes', 'nuevo', '10',   array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 12',   23000, 'uniformes', 'nuevo', '12',   array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 14',   24000, 'uniformes', 'nuevo', '14',   array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 16',   24000, 'uniformes', 'nuevo', '16',   array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle 18/S', 25000, 'uniformes', 'nuevo', '18/S', array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle M',    25000, 'uniformes', 'nuevo', 'M',    array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle L',    26000, 'uniformes', 'nuevo', 'L',    array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle XL',   26000, 'uniformes', 'nuevo', 'XL',   array['/images/sweater.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Sweater talle XXL',  26000, 'uniformes', 'nuevo', 'XXL',  array['/images/sweater.png']),

    -- Polars
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Polar talle 2',  25000, 'uniformes', 'nuevo', '2',  array['/images/polar.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Polar talle 4',  25000, 'uniformes', 'nuevo', '4',  array['/images/polar.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Polar talle 8',  27000, 'uniformes', 'nuevo', '8',  array['/images/polar.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Polar talle L',  31000, 'uniformes', 'nuevo', 'L',  array['/images/polar.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Polar talle XL', 31000, 'uniformes', 'nuevo', 'XL', array['/images/polar.png']),

    -- Shorts
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Short talle XXL', 16000, 'deportes', 'nuevo', 'XXL', array['/images/short.png']),

    -- Camisetas Rugby
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle 8',  16000, 'deportes', 'nuevo', '8',  array['/images/camiseta-rugby.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle 12', 16000, 'deportes', 'nuevo', '12', array['/images/camiseta-rugby.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle 14', 17000, 'deportes', 'nuevo', '14', array['/images/camiseta-rugby.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle 16', 17000, 'deportes', 'nuevo', '16', array['/images/camiseta-rugby.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle S',  18000, 'deportes', 'nuevo', 'S',  array['/images/camiseta-rugby.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle M',  18000, 'deportes', 'nuevo', 'M',  array['/images/camiseta-rugby.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Camiseta Rugby talle XL', 19500, 'deportes', 'nuevo', 'XL', array['/images/camiseta-rugby.png']),

    -- Calzas
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Calza talle S', 9500, 'deportes', 'nuevo', 'S', array['/images/calza.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Calza talle M', 9500, 'deportes', 'nuevo', 'M', array['/images/calza.png']),

    -- Remeras House
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle 8 Verde',     16000, 'uniformes', 'nuevo', '8 Verde',     array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle 8 Azul',      16000, 'uniformes', 'nuevo', '8 Azul',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle 8 Roja',      16000, 'uniformes', 'nuevo', '8 Roja',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle 16/XS Verde', 16000, 'uniformes', 'nuevo', '16/XS Verde', array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle 16/XS Roja',  16000, 'uniformes', 'nuevo', '16/XS Roja',  array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle 16/XS Azul',  16000, 'uniformes', 'nuevo', '16/XS Azul',  array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle S Verde',     17500, 'uniformes', 'nuevo', 'S Verde',     array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle S Roja',      17500, 'uniformes', 'nuevo', 'S Roja',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle S Azul',      17500, 'uniformes', 'nuevo', 'S Azul',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle M Verde',     17500, 'uniformes', 'nuevo', 'M Verde',     array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle M Roja',      17500, 'uniformes', 'nuevo', 'M Roja',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle M Azul',      17500, 'uniformes', 'nuevo', 'M Azul',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle L Verde',     18000, 'uniformes', 'nuevo', 'L Verde',     array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle L Roja',      18000, 'uniformes', 'nuevo', 'L Roja',      array['/images/remera-house-fire.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera House talle L Azul',      18000, 'uniformes', 'nuevo', 'L Azul',      array['/images/remera-house-fire.png']),

    -- Kilts
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle 6',    32000, 'uniformes', 'nuevo', '6',    array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle 8',    32000, 'uniformes', 'nuevo', '8',    array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle 10',   33000, 'uniformes', 'nuevo', '10',   array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle 12',   34000, 'uniformes', 'nuevo', '12',   array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle 14',   35000, 'uniformes', 'nuevo', '14',   array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle 16',   35000, 'uniformes', 'nuevo', '16',   array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle S/18', 36000, 'uniformes', 'nuevo', 'S/18', array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle M',    36000, 'uniformes', 'nuevo', 'M',    array['/images/kilts.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Kilt talle L',    36000, 'uniformes', 'nuevo', 'L',    array['/images/kilts.png']),

    -- Poleras
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Polera talle 2', 9500, 'uniformes', 'nuevo', '2', array['/images/polera.png']),

    -- Medias Formales
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Formales talle T2',    4000, 'uniformes', 'nuevo', 'T2',    array['/images/medias.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Formales Rayas',       4000, 'uniformes', 'nuevo', 'Rayas', array['/images/medias.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Formales talle T4',    4500, 'uniformes', 'nuevo', 'T4',    array['/images/medias.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Formales talle T5',    4500, 'uniformes', 'nuevo', 'T5',    array['/images/medias.png']),

    -- Medias Can Can
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Can Can talle T2', 5000, 'uniformes', 'nuevo', 'T2', array['/images/medias.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Can Can talle T3', 5000, 'uniformes', 'nuevo', 'T3', array['/images/medias.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Medias Can Can talle T4', 5500, 'uniformes', 'nuevo', 'T4', array['/images/medias.png']),

    -- Buzos Gym (sin imagen)
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Buzo Gym talle 16',  29000, 'deportes', 'nuevo', '16',  array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Buzo Gym talle S',   29000, 'deportes', 'nuevo', 'S',   array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Buzo Gym talle M',   30000, 'deportes', 'nuevo', 'M',   array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Buzo Gym talle L',   30000, 'deportes', 'nuevo', 'L',   array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Buzo Gym talle XL',  31000, 'deportes', 'nuevo', 'XL',  array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Buzo Gym talle XXL', 31000, 'deportes', 'nuevo', 'XXL', array[]::text[]),

    -- Remera Hockey
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera Hockey talle 16', 21000, 'deportes', 'nuevo', '16', array['/images/remera-hockey.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera Hockey talle S',  21000, 'deportes', 'nuevo', 'S',  array['/images/remera-hockey.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera Hockey talle M',  21000, 'deportes', 'nuevo', 'M',  array['/images/remera-hockey.png']),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Remera Hockey talle L',  22000, 'deportes', 'nuevo', 'L',  array['/images/remera-hockey.png']),

    -- Campera (sin imagen)
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Campera talle 4',  48000, 'uniformes', 'nuevo', '4',  array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Campera talle L',  55000, 'uniformes', 'nuevo', 'L',  array[]::text[]),
    (v_school_id, v_seller_id, v_name, v_whatsapp, 'Campera talle XL', 60000, 'uniformes', 'nuevo', 'XL', array[]::text[]);

  raise notice 'Listo. Publicaciones de Sofía: %', (select count(*) from listings where seller_id = v_seller_id);
end $$;

-- Verificar después de correr:
--   select title, size, price, category
--     from listings
--    where seller_id = (select id from profiles where whatsapp = '5491170003793')
--    order by category, title, size;
