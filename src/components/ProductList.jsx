import { useState, useEffect } from 'react';
import { productosDB, registrarProduccion } from '../db';
import DataManager from './DataManager';

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: 0
  });
  const [produccionData, setProduccionData] = useState({
    productoId: null,
    cantidad: ''
  });

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    const data = await productosDB.getAll();
    setProductos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productosDB.update(editingId, formData);
      } else {
        await productosDB.add({
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock) || 0
        });
      }
      resetForm();
      loadProductos();
    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await productosDB.delete(id);
      loadProductos();
    }
  };

  const handleProduccion = async (e) => {
    e.preventDefault();
    try {
      await registrarProduccion(
        produccionData.productoId,
        parseInt(produccionData.cantidad)
      );
      setProduccionData({ productoId: null, cantidad: '' });
      loadProductos();
      alert('Producción registrada correctamente');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', categoria: '', precio: '', stock: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="product-list">
      <div className="section-header">
        <h2>Productos</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      <DataManager onDataImported={loadProductos} />

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Stock inicial"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
          <button type="submit" className="btn-primary">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      <div className="products-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="product-card">
            <div className="product-info">
              <h3>{producto.nombre}</h3>
              <p className="categoria">{producto.categoria}</p>
              <p className="precio">{producto.precio?.toFixed(2)} €</p>
              <p className="stock">
                Stock: <strong>{producto.stock || 0}</strong> unidades
              </p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(producto)} className="btn-edit">
                Editar
              </button>
              <button onClick={() => handleDelete(producto.id)} className="btn-delete">
                Eliminar
              </button>
              <button
                onClick={() => setProduccionData({ productoId: producto.id, cantidad: '' })}
                className="btn-secondary"
              >
                + Producción
              </button>
            </div>
          </div>
        ))}
      </div>

      {produccionData.productoId && (
        <div className="modal">
          <div className="modal-content">
            <h3>Registrar Producción</h3>
            <form onSubmit={handleProduccion}>
              <input
                type="number"
                placeholder="Cantidad producida"
                value={produccionData.cantidad}
                onChange={(e) => setProduccionData({ ...produccionData, cantidad: e.target.value })}
                required
                min="1"
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Registrar</button>
                <button
                  type="button"
                  onClick={() => setProduccionData({ productoId: null, cantidad: '' })}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
