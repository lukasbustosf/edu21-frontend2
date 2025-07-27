# EDU21 Frontend

Frontend de la plataforma educativa gamificada EDU21 para Vercel.

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (estado)
- Socket.IO (tiempo real)

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://plataforma-edu21-production.up.railway.app
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Desarrollo Local

```bash
npm install
npm run dev
```

## Deploy

Este proyecto está configurado para deploy automático en Vercel. 