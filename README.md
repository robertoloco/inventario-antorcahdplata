# ⚡ Antorcha de Plata - Sistema de Inventario

Aplicación web para gestión de inventario de joyas, control de producción, ventas y caja.

## 🚀 Características

- ✅ **Gestión de Productos**: CRUD completo de productos con categorías, precios y stock
- ✅ **Control de Producción**: Registro de piezas producidas
- ✅ **Registro de Ventas**: Sistema completo de ventas con actualización automática de stock
- ✅ **Control de Caja**: Seguimiento de ingresos y egresos del mercado
- ✅ **Dashboard**: Resumen visual de estadísticas importantes
- ✅ **Almacenamiento Local**: Todos los datos se guardan en IndexedDB (navegador)
- ✅ **Importar/Exportar**: Sistema de backup en JSON
- ✅ **100% Gratis**: Sin costos de backend ni hosting
- ✅ **Responsive**: Funciona perfectamente en móvil, tablet y desktop

## 🛠️ Tecnologías

- **React** con Vite
- **IndexedDB** con Dexie.js para almacenamiento
- **GitHub Pages** para hosting gratuito
- **CSS moderno** con diseño responsive

## 📦 Instalación y Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador: http://localhost:5173
```

## 🌐 Desplegar en GitHub Pages

### 1. Configurar el repositorio

Antes de desplegar, edita `package.json` para reemplazar `USUARIO` con tu nombre de usuario de GitHub:

**package.json:**
```json
"homepage": "https://TU-USUARIO.github.io/inventario-antorcahdplata"
```

### 2. Desplegar

```bash
npm run deploy
```

Este comando:
1. Genera la versión de producción
2. La publica automáticamente en la rama `gh-pages`
3. La app estará disponible en: `https://TU-USUARIO.github.io/inventario-antorcahdplata`

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. En "Source" selecciona la rama `gh-pages`
4. Guarda los cambios

¡Tu aplicación estará en línea en unos minutos!

## 📱 Uso

### Dashboard
- Visualiza estadísticas generales
- Total de productos, stock, valor de inventario
- Ventas y caja del día

### Productos
- **Crear**: Añade nuevos productos con nombre, categoría, precio y stock inicial
- **Editar**: Modifica datos de productos existentes
- **Eliminar**: Borra productos del inventario
- **Producción**: Registra piezas nuevas fabricadas

### Ventas
- Selecciona producto y cantidad
- El precio se autocompleta pero puede modificarse
- Actualiza automáticamente el stock
- Registra el movimiento en caja

### Caja
- Visualiza balance total
- Registra ingresos y egresos manuales
- Historial completo de movimientos

## 💾 Almacenamiento de Datos

Los datos se guardan localmente en el navegador usando IndexedDB:
- ✅ **Persistente**: Los datos no se pierden al cerrar el navegador
- ✅ **Privado**: Solo tú tienes acceso a tus datos
- ✅ **Sin límite práctico**: Mucho más espacio que localStorage
- ⚠️ **Por navegador**: Los datos son específicos del navegador que uses

### Backup Manual

Para hacer backup de tus datos:
1. Abre las DevTools del navegador (F12)
2. Ve a Application → IndexedDB → InventarioAntorcaDB
3. Exporta las tablas que necesites

### Exportar/Importar
Ya puedes exportar e importar tus datos en formato JSON desde la sección de Productos.

**Para importar los productos iniciales:**
1. Ve a la sección "Productos"
2. Click en "📥 Importar JSON"
3. Selecciona el archivo `productos-inicial.json` (descárgalo del repositorio)
4. ¡Listo! Tendrás 45 productos cargados

## 🎨 Futuras Mejoras

- [ ] Sistema de fotos para productos
- [x] Exportar/Importar datos en JSON
- [ ] Búsqueda y filtros avanzados
- [ ] Reportes y estadísticas
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App) para usar offline

## 📄 Licencia

Proyecto personal para gestión de inventario de joyas.

---

Hecho con ❤️ para Antorcha de Plata
