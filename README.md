# EDU21 Frontend

Frontend de la plataforma educativa gamificada EDU21 para Vercel.

## 🚀 Tecnologías

- **Next.js 14** - Framework de React
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Zustand** - Gestión de estado
- **Socket.IO** - Comunicación en tiempo real

## 📋 Variables de Entorno Requeridas

```env
# Backend API (Railway)
NEXT_PUBLIC_API_URL=https://plataforma-edu21-production.up.railway.app

# Supabase Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret

# Environment
NODE_ENV=production
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🚀 Deploy en Vercel

Este proyecto está configurado para deploy automático en Vercel.

### Pasos para deploy:

1. **Importar repositorio** en [vercel.com](https://vercel.com)
2. **Configurar variables de entorno** en Vercel
3. **Deploy automático** en cada push a `master`

### Variables de entorno en Vercel:

- `NEXT_PUBLIC_API_URL` - URL del backend en Railway
- `SUPABASE_URL` - URL de Supabase
- `SUPABASE_ANON_KEY` - Clave anónima de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio de Supabase
- `JWT_SECRET` - Secreto para JWT
- `NODE_ENV` - production

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas de Next.js 14 (App Router)
├── components/          # Componentes reutilizables
├── hooks/              # Custom hooks
├── lib/                # Utilidades y servicios
├── store/              # Estado global (Zustand)
└── types/              # Definiciones de TypeScript
```

## 🔗 Backend

El backend está desplegado en **Railway** y es completamente independiente de este repositorio.

## 📝 Notas

- Este es un repositorio **frontend-only**
- El backend está en el repositorio principal
- Configurado específicamente para Vercel
- Sin conflictos de monorepo 