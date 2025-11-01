# 🚀 Guía de Despliegue en GitHub Pages

## Pasos previos (solo una vez)

### 1. Configurar tu usuario de GitHub

Edita `package.json` línea 6:
```json
"homepage": "https://TU-USUARIO-GITHUB.github.io/inventario-antorchadplata",
```

Reemplaza `TU-USUARIO-GITHUB` con tu nombre de usuario real de GitHub.

### 2. Inicializar repositorio Git (si no lo has hecho)

```bash
git init
git add .
git commit -m "Initial commit: Sistema de inventario Antorca HD Plata"
```

### 3. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `inventario-antorcahdplata`
3. Visibilidad: Público (necesario para GitHub Pages gratis)
4. NO inicialices con README (ya lo tienes)

### 4. Conectar tu repositorio local con GitHub

```bash
git remote add origin https://github.com/TU-USUARIO/inventario-antorcahdplata.git
git branch -M main
git push -u origin main
```

## Desplegar la aplicación

### Opción A: Deploy automático

```bash
npm run deploy
```

Este comando:
- Construye la aplicación
- Crea/actualiza la rama `gh-pages`
- Sube los archivos a GitHub

### Opción B: Deploy manual

```bash
# 1. Construir
npm run build

# 2. Subir cambios
git add .
git commit -m "Update app"
git push

# 3. Deploy
npm run deploy
```

## Configurar GitHub Pages (solo primera vez)

1. Ve a tu repositorio: `https://github.com/TU-USUARIO/inventario-antorcahdplata`
2. Click en **Settings**
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

## Verificar el despliegue

Después de 1-2 minutos, tu app estará en:
```
https://TU-USUARIO.github.io/inventario-antorcahdplata
```

## Actualizar la aplicación

Cada vez que hagas cambios:

```bash
# 1. Hacer cambios en el código
# 2. Guardar cambios en Git
git add .
git commit -m "Descripción de los cambios"
git push

# 3. Redesplegar
npm run deploy
```

## Solución de problemas

### La página muestra 404
- Verifica que GitHub Pages esté configurado en la rama `gh-pages`
- Espera 5 minutos después del primer deploy

### Los estilos no cargan
- Verifica que `vite.config.js` tenga: `base: '/inventario-antorcahdplata/'`
- Verifica que el `homepage` en `package.json` sea correcto

### Los datos no se guardan
- Verifica que tu navegador permita IndexedDB
- Abre DevTools (F12) y busca errores en Console

## Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Vista previa de build
npm run preview

# Deploy a GitHub Pages
npm run deploy

# Ver estado de Git
git status

# Ver commits
git log --oneline
```

## Notas importantes

- ⚠️ Los datos se almacenan en el navegador del usuario, no en el servidor
- ✅ La app funciona 100% offline después de la primera carga
- 💾 Recomienda hacer backups periódicos exportando los datos
- 🔒 Cada usuario tiene sus propios datos (no se comparten)

---

¿Dudas? Consulta el README.md para más información.
