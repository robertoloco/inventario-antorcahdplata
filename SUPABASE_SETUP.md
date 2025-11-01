# Configuración de Supabase para Sincronización de Datos

Este proyecto ahora soporta sincronización de datos entre dispositivos usando Supabase. La aplicación funciona en modo **híbrido**: usa Supabase cuando está configurado, y IndexedDB local como fallback.

## 📋 Requisitos

1. Cuenta gratuita en [Supabase](https://supabase.com)
2. Un proyecto en Supabase

## 🚀 Pasos para configurar Supabase

### 1. Crear cuenta y proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se inicialice (1-2 minutos)

### 2. Ejecutar el script SQL

1. En el dashboard de tu proyecto Supabase, ve a **SQL Editor** (menú lateral izquierdo)
2. Abre el archivo `supabase-schema.sql` de este repositorio
3. Copia **todo** el contenido del archivo
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **Run** (o presiona `Ctrl+Enter`)
6. Verifica que las tablas se hayan creado correctamente yendo a **Table Editor**

### 3. Obtener las credenciales

1. En el dashboard de Supabase, ve a **Settings** > **API**
2. Busca y copia los siguientes valores:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public key** (una cadena larga que empieza con `eyJ...`)

### 4. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=tu_project_url_aquí
VITE_SUPABASE_ANON_KEY=tu_anon_key_aquí
```

**Ejemplo:**
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTg1Nzc2NjQwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## ✅ Verificar la configuración

1. Abre la consola del navegador (F12)
2. Si Supabase está correctamente configurado, verás mensajes como:
   - `"Supabase habilitado"` o similar
3. Si hay errores, verás advertencias pero la app seguirá funcionando con IndexedDB local

## 🔄 Modo Híbrido

La aplicación funciona de la siguiente manera:

- **Con Supabase configurado**: Todos los datos se guardan en Supabase (sincronizado entre dispositivos)
- **Sin Supabase o con error**: Los datos se guardan solo en IndexedDB local (solo en ese navegador)
- **Fallback automático**: Si Supabase falla, usa IndexedDB automáticamente

## 🔒 Seguridad

**⚠️ IMPORTANTE:**
- Las políticas actuales permiten acceso **público** a las tablas
- Esto es para desarrollo/uso personal
- **NO uses esta configuración si los datos son sensibles o hay múltiples usuarios**
- Para producción con autenticación, contacta para configurar RLS (Row Level Security) correctamente

## 💾 Migrar datos existentes

Si ya tienes datos en IndexedDB local y quieres migrarlos a Supabase:

1. Usa el botón **"Exportar Datos"** en la aplicación
2. Configura Supabase siguiendo esta guía
3. Usa el botón **"Importar Datos"** para cargar los datos en Supabase

## 🆘 Solución de problemas

### No se sincronizan los datos entre dispositivos

- Verifica que `.env` esté configurado en ambos dispositivos (no, espera... .env es local)
- **Mejor opción**: Configura las variables de entorno en el hosting (GitHub Pages no soporta .env)
- **Para GitHub Pages**: Edita directamente `src/supabaseClient.js` y reemplaza las credenciales:

```javascript
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'tu-anon-key-aquí';
```

### Error de CORS

- Verifica que la URL de Supabase sea correcta
- Asegúrate de usar `https://` en la URL

### Las tablas no existen

- Ejecuta de nuevo el script `supabase-schema.sql`
- Verifica en **Table Editor** que las tablas `productos`, `ventas` y `caja` existan

## 📊 Plan Gratuito de Supabase

El plan gratuito incluye:
- 500 MB de almacenamiento
- **Queries ilimitadas** ✅
- 2 GB de transferencia/mes
- Proyecto pausa después de 1 semana sin actividad (se reactiva automáticamente al usarlo)

Para este proyecto de inventario pequeño/mediano, el plan gratuito es más que suficiente.
