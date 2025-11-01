import { productosDB } from '../db';

function DataManager({ onDataImported }) {
  const handleImportJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validar que sea un array
      if (!Array.isArray(data)) {
        alert('El archivo debe contener un array de productos');
        return;
      }

      // Importar productos
      let imported = 0;
      for (const producto of data) {
        if (producto.nombre) {
          await productosDB.add(producto);
          imported++;
        }
      }

      alert(`✅ ${imported} productos importados correctamente`);
      if (onDataImported) onDataImported();
      
      // Limpiar input
      event.target.value = '';
    } catch (error) {
      console.error('Error importando:', error);
      alert('Error al importar el archivo. Verifica que sea un JSON válido.');
    }
  };

  const handleExportJSON = async () => {
    try {
      const productos = await productosDB.getAll();
      const dataStr = JSON.stringify(productos, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `antorcha-plata-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar los datos');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('⚠️ ¿ELIMINAR TODOS LOS PRODUCTOS? Esta acción no se puede deshacer.')) {
      if (window.confirm('¿Estás COMPLETAMENTE seguro? Se perderán todos los datos.')) {
        try {
          const productos = await productosDB.getAll();
          for (const producto of productos) {
            await productosDB.delete(producto.id);
          }
          alert('✅ Todos los productos han sido eliminados');
          if (onDataImported) onDataImported();
        } catch (error) {
          console.error('Error eliminando:', error);
          alert('Error al eliminar los productos');
        }
      }
    }
  };

  return (
    <div className="data-manager">
      <div className="data-actions">
        <div className="action-group">
          <h3>Importar Datos</h3>
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            style={{ display: 'none' }}
            id="import-json"
          />
          <label htmlFor="import-json" className="btn-secondary">
            📥 Importar JSON
          </label>
          <p className="hint">Importa productos desde un archivo JSON</p>
        </div>

        <div className="action-group">
          <h3>Exportar Datos</h3>
          <button onClick={handleExportJSON} className="btn-secondary">
            📤 Exportar JSON
          </button>
          <p className="hint">Descarga un backup de todos tus productos</p>
        </div>

        <div className="action-group danger">
          <h3>Zona de Peligro</h3>
          <button onClick={handleClearAll} className="btn-delete">
            🗑️ Eliminar Todo
          </button>
          <p className="hint">Elimina todos los productos (irreversible)</p>
        </div>
      </div>
    </div>
  );
}

export default DataManager;
