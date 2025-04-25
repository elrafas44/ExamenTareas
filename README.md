This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy en Vercel (Guía Completa)

### 1. Variables de entorno necesarias
Configura estas variables en el dashboard de Vercel (Settings > Environment Variables):

- `DATABASE_URL` → URL de tu base de datos PostgreSQL en la nube (ejemplo: Railway, Supabase, Neon, PlanetScale, etc.)
- `NEXTAUTH_SECRET` → Un string seguro y aleatorio (puedes generarlo con `openssl rand -base64 32`)
- `NEXTAUTH_URL` → La URL pública de tu app (ejemplo: `https://tu-app.vercel.app`)

### 2. Base de datos remota
- **No uses tu base local en producción**. Crea una base de datos PostgreSQL en Railway, Supabase, Neon, etc.
- Copia la URL de conexión y pégala como `DATABASE_URL` en Vercel.
- Ejecuta las migraciones en la base remota:

```sh
npx prisma migrate deploy
```

Puedes hacerlo desde tu máquina local, pero usando la URL remota.

### 3. Prisma en Serverless
- El código actual funciona bien en Vercel para la mayoría de los casos.
- Si ves errores de "Too many connections", busca la solución singleton para Prisma en serverless en la [docs de Prisma](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management).

### 4. Despliegue
1. Haz push de tu código a GitHub/GitLab.
2. Conecta el repo a Vercel y haz deploy.
3. Configura las variables de entorno en el dashboard de Vercel.
4. Si tu base de datos es nueva, ejecuta las migraciones.
5. Accede a tu URL de producción y ¡prueba la app!

### 5. Notas importantes
- Si usas cookies seguras (`__Secure-`), la app debe estar en HTTPS.
- Verifica que `NEXTAUTH_URL` esté bien configurada en producción.
- Si cambias el esquema de la base de datos, recuerda volver a migrar.

---

## Troubleshooting en producción
- **Error 500:** Variable de entorno mal puesta o base de datos inaccesible.
- **No se guardan sesiones:** Revisa `NEXTAUTH_SECRET` y `NEXTAUTH_URL`.
- **Problemas de cookies:** Verifica el dominio y el protocolo (debe ser HTTPS).
- **Prisma: Too many connections:** Usa el patrón singleton recomendado.

---

## Recursos útiles
- [Prisma en Serverless](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [NextAuth.js en Vercel](https://next-auth.js.org/getting-started/introduction)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

¡Listo para producción! 🚀
