@AGENTS.md

# RagBox — Marketplace escolar

## Qué es
Plataforma privada por colegio donde las familias compran y venden artículos usados
del cole: uniformes, libros, útiles, calculadoras, deportes, tecnología y otros.
Reemplaza el desorden de los grupos de WhatsApp con un marketplace organizado por
comunidad escolar.

Cada familia ve **solo** los productos de su colegio.

## Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 + componentes propios sobre `@base-ui/react`
- lucide-react (iconos), sonner (toasts)
- Supabase: Postgres + Auth + Storage + Realtime
- PWA instalable (`src/app/manifest.ts` + service worker)

## Modelo de producto
- **Login híbrido**: navegar y ver es libre; publicar y guardar favoritos pide perfil.
- **Auth simple** (MVP): solo nombre + WhatsApp en el formulario. Por debajo se
  crea un usuario de Supabase Auth con un email derivado del WhatsApp
  (`{numero}@ragbox.app`) y una contraseña fija — el email no se usa, solo es el
  identificador interno. Esto evita "Anonymous sign-ins" (que pide admin de proyecto).
  **Requiere en Supabase → Authentication → Email: "Confirm email" debe estar OFF.**
- **Dos espacios**: el **Marketplace** (feed principal de cada colegio, avisos de venta
  estructurados con foto/precio/talle) y el **Tablón** (feed de mensajes de texto estilo
  foro: buscar, ofrecer, avisar — sin campos estructurados).
- En la base, un mensaje del Tablón es un `listing` con `type` distinto de `sell`
  (el texto va en `title`; categoría/condición van con un valor fijo y la app no los usa).
- **Contacto**: botón de WhatsApp con mensaje prearmado según el tipo de publicación.
  (El chat interno fue retirado — sus tablas siguen en el schema como legacy.)
- **Sin pagos**: la transacción se coordina entre las familias.

## Estructura
```
src/
  app/
    page.tsx                  Landing — piloto Wellspring
    login/                    Crear perfil (nombre + WhatsApp, sin email)
    (app)/                    Shell con barra inferior (BottomNav)
      [school]/               Marketplace, detalle, publicar y tablón de cada colegio
      favoritos/ mis-publicaciones/ perfil/
  components/
    layout/ listings/ auth/ ui/
  context/SupabaseProvider.tsx  Cliente browser + sesión
  hooks/                        useAuth, useFavorites
  lib/
    supabase/client.ts server.ts   Clientes Supabase (browser / RSC)
    queries.ts                     Acceso a datos
    constants.ts formatters.ts whatsapp.ts utils.ts
  types/index.ts              Tipos del dominio
middleware.ts                 Refresca la sesión de Supabase
supabase/schema.sql           Schema completo (correr en el SQL Editor)
```

## Datos
Toda la data vive en Supabase. El schema está en `supabase/schema.sql` (script único):
tablas `schools`, `profiles`, `listings`, `favorites`, `conversations`, `messages`,
`reports` + buckets de Storage `listing-images` y `avatars`.
Para recrear la base: pegar ese archivo en Supabase → SQL Editor → Run
(⚠️ resetea las tablas — solo en desarrollo / piloto).

## Variables de entorno (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # SOLO la clave anon/publishable, nunca service_role
```
En Vercel: cargarlas en las env vars del proyecto.

## Convenciones
- Moneda: pesos argentinos. Formato `$14.000` (ver `lib/formatters.ts`).
- WhatsApp: número normalizado con prefijo país (ver `lib/whatsapp.ts`).
- Mobile-first absoluto: diseñar primero para celular, la barra inferior es la navegación principal.
- Paleta: navy profundo para texto/iconos (`--foreground`), naranja para la acción principal (`--primary`), verde solo para precios y WhatsApp (`--whatsapp`), rojo solo para favoritos (`--like`).
- Server Components por defecto; `'use client'` solo donde hay estado/interacción.

## Correr localmente
```
npm run dev   →  http://localhost:3100
```
El puerto es 3100 (no 3000) para no chocar con otros proyectos.

## Deploy (Vercel)
1. Importar el repo en Vercel — detecta Next.js solo, sin configuración.
2. **Env vars** del proyecto en Vercel (ver `.env.example`):
   `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clave publishable/anon).
3. **Supabase → Authentication → URL Configuration**: agregar el dominio de producción
   en **Site URL** y en **Redirect URLs** (`https://TU-DOMINIO/**`). Sin esto el magic
   link no vuelve a la app en producción.
4. Correr `supabase/schema.sql` una vez en el SQL Editor (crea tablas, RLS, buckets y
   datos demo del piloto Wellspring).

## Pendientes
- Íconos PWA en SVG (`public/icon.svg`). Reemplazar por PNG 192/512 para máxima compatibilidad.
- Fase 2: filtros avanzados, reportar aviso, related listings.
