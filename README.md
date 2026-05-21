# RagBox — Marketplace escolar

Plataforma privada por colegio donde las familias compran, venden y donan artículos usados del cole (uniformes, libros, útiles, calculadoras, deportes, tecnología). Reemplaza el desorden de los grupos de WhatsApp con un marketplace organizado por comunidad escolar.

Piloto inicial: **Wellspring School (Buenos Aires)**. Cada familia ve solo los avisos de su colegio. El contacto entre familias se hace por WhatsApp — no hay pagos, ni envíos, ni carrito.

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS v4 + componentes propios sobre `@base-ui/react`
- Supabase: Postgres + Auth + Storage
- PWA instalable (`src/app/manifest.ts`)
- Deploy: Vercel

## Setup local

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Crear un proyecto en Supabase** ([supabase.com](https://supabase.com)) y, en el SQL Editor, pegar y correr `supabase/schema.sql`. El script crea tablas (`schools`, `profiles`, `listings`, `favorites`, `reports`, `reviews`, `comments`, `contact_events`), RLS policies, los buckets `listing-images` y `avatars`, y datos demo del piloto Wellspring.

   > ⚠️ El script resetea las tablas — solo correrlo en desarrollo o en una base nueva.

3. **Confirmar email OFF** — en Supabase → Authentication → Providers → Email, asegurarse de que **"Confirm email"** esté apagado. La auth de RagBox usa un email derivado del WhatsApp (`{numero}@ragbox.app`) y necesita poder crear usuarios sin confirmación.

4. **Variables de entorno** — copiar `.env.example` a `.env.local` y completar con las claves de tu proyecto Supabase (Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
   ```

   La `SUPABASE_SERVICE_ROLE_KEY` solo se usa en Server Actions (crear usuarios sin confirmación de email). Nunca exponer al cliente.

5. **Correr local**
   ```bash
   npm run dev
   ```
   La app queda en `http://localhost:3100`.

## Deploy en Vercel

1. Importar el repo en Vercel — detecta Next.js, sin configuración extra.
2. **Cargar las env vars** del paso 4 en Project Settings → Environment Variables (las tres: URL, ANON_KEY, SERVICE_ROLE_KEY).
3. En Supabase → Authentication → URL Configuration:
   - **Site URL**: el dominio de producción (`https://TU-DOMINIO.vercel.app`)
   - **Redirect URLs**: agregar `https://TU-DOMINIO.vercel.app/**`
4. Deploy.

## Scripts

```bash
npm run dev         # dev server en :3100
npm run build       # build de producción
npm run start       # servir el build (:3100)
npm run typecheck   # tsc --noEmit
```

## Admin del piloto

El acceso al panel `/admin` está gateado por el WhatsApp del dueño del piloto, configurado en `src/lib/constants.ts`:

```ts
export const ADMIN_WHATSAPP = '541159065841'
```

Cambiarlo si la app pasa a otro responsable.

## Convenciones

- **Moneda**: pesos argentinos, formato `$14.000` (ver `src/lib/formatters.ts`).
- **WhatsApp**: número normalizado con prefijo país (`src/lib/whatsapp.ts`).
- **Mobile-first**: la barra inferior es la navegación principal.
- **Paleta**: navy profundo (`--foreground`), naranja para acción principal (`--primary`), verde solo para precios y WhatsApp (`--whatsapp`), rojo solo para favoritos (`--like`).
- Server Components por defecto; `'use client'` solo donde hay estado/interacción.

## Estructura

```
src/
  app/
    page.tsx                  Landing — piloto Wellspring
    login/                    Crear perfil (nombre + WhatsApp, sin email)
    (app)/                    Shell con BottomNav
      [school]/               Marketplace, detalle, publicar, tablón
      favoritos/ mis-publicaciones/ perfil/ admin/
  components/                 layout / listings / auth / ui
  context/SupabaseProvider.tsx
  hooks/                      useAuth, useFavorites, useSchoolSlug
  lib/
    supabase/                 client.ts (browser), server.ts (RSC), admin.ts (service_role)
    queries.ts                Acceso a datos
    constants.ts formatters.ts whatsapp.ts utils.ts
  types/index.ts
middleware.ts                 Refresca la sesión de Supabase
supabase/schema.sql           Schema completo
```
