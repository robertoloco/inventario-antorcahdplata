# 📖 Guía Rápida de Uso

## 🚀 Desarrollo Local

Para trabajar en la aplicación sin hacer deploy:

```bash
npm run dev
```

Abre: http://localhost:5173/inventario-antorcahdplata/

**Los cambios se reflejan automáticamente** sin necesidad de recargar la página.

## 🎨 Cambios Realizados

### ✅ Colores de Marca
- Color principal: `#0146cd` (azul)
- Color secundario: `#b269fb` (morado)
- Degradados aplicados en header, botones y elementos destacados

### ✅ Nombre Correcto
- Cambiado de "Antorca HD Plata" a **"Antorcha de Plata"**
- Logo añadido en el header

### ✅ Diseño Responsive
- **Móvil**: Layout vertical optimizado
  - Logo más pequeño
  - Navegación centrada
  - Grids de 1 columna
  - Formularios adaptados
  
- **Tablet** (769px - 1024px): 
  - Grids de 2 columnas
  - Mejor aprovechamiento del espacio
  
- **Desktop**: 
  - Grids adaptativos
  - Máximo ancho de 1400px

### ✅ Importar/Exportar Datos

**Nuevas funciones en la sección Productos:**

1. **📥 Importar JSON**
   - Carga productos desde un archivo JSON
   - Útil para migrar datos o carga inicial

2. **📤 Exportar JSON**
   - Descarga backup de todos tus productos
   - Nombre: `antorcha-plata-backup-YYYY-MM-DD.json`

3. **🗑️ Eliminar Todo**
   - Limpia la base de datos completamente
   - Tiene doble confirmación

## 📦 Productos Iniciales

Ya están convertidos 45 productos del Excel al archivo `productos-inicial.json`:

**Para cargarlos:**
1. Ve a la app → Productos
2. Click en "📥 Importar JSON"
3. Selecciona `public/productos-inicial.json` 
4. ¡Listo!

**Estructura de cada producto:**
```json
{
  "codigo": "ANI-PUP-STD-45",
  "nombre": "Pupilas cadena",
  "categoria": "Anillo",
  "tamano": "N/A",
  "precio": 45,
  "coleccion": "ICONICA",
  "stock": 0
}
```

## 🎯 Flujo de Trabajo Recomendado

### Desarrollo
1. `npm run dev` - Trabaja localmente
2. Haz cambios en el código
3. Prueba en el navegador (actualización automática)
4. Cuando estés satisfecho, continúa al deploy

### Deploy
```bash
# 1. Guarda cambios en Git
git add .
git commit -m "Descripción de cambios"
git push

# 2. Deploy a GitHub Pages
npm run deploy
```

**Espera 1-2 minutos** y verás los cambios en:
https://robertoloco.github.io/inventario-antorcahdplata/

## 🔧 Archivos Importantes

- `src/App.jsx` - Componente principal y navegación
- `src/App.css` - Estilos (colores, responsive)
- `src/db.js` - Base de datos IndexedDB
- `src/components/` - Componentes React
- `public/logo_antorcha.png` - Logo
- `public/productos-inicial.json` - Productos del Excel

## 💡 Tips

### Colores de Marca
Si necesitas cambiar colores, busca en `App.css`:
- `#0146cd` → Azul principal
- `#b269fb` → Morado secundario

### Agregar Más Productos
Tienes 3 opciones:
1. **Manual**: Desde la app, click "+ Nuevo Producto"
2. **Importar JSON**: Prepara un JSON y usa "Importar"
3. **Desde Excel**: Usa el script `convert-excel.js`

### Testing en Móvil
Con el servidor corriendo (`npm run dev`):
1. Abre DevTools (F12)
2. Click en el icono de móvil
3. Selecciona iPhone, Samsung, etc.

O usa tu móvil real:
1. `npm run dev -- --host`
2. Conecta al mismo WiFi
3. Abre la IP que muestra Vite

## ⚠️ Importante

- Los datos se guardan EN EL NAVEGADOR (IndexedDB)
- Cada navegador tiene sus propios datos
- Haz backups periódicos con "Exportar JSON"
- Si borras datos del navegador, pierdes el inventario

## 🆘 Solución de Problemas

**El logo no aparece:**
- Verifica que `public/logo_antorcha.png` existe
- Limpia cache: Ctrl+Shift+R

**Los colores no cambiaron:**
- Limpia cache del navegador
- Verifica que `App.css` tiene los nuevos colores

**Error al importar productos:**
- Verifica que el JSON es válido
- Usa el formato del archivo `productos-inicial.json`

---

¿Dudas? Revisa `README.md` o `DEPLOY.md`
