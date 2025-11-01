import { useState, useEffect } from 'react';
import { productosDB, ventasDB, cajaDB } from '../db';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalStock: 0,
    valorInventario: 0,
    ventasHoy: 0,
    cajaHoy: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const productos = await productosDB.getAll();
      const totalProductos = productos.length;
      const totalStock = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
      const valorInventario = productos.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0);
      
      const hoy = new Date();
      const ventasHoy = await ventasDB.getByFecha(hoy);
      const totalVentasHoy = ventasHoy.filter(v => v.tipo === 'venta').length;
      
      const cajaHoy = await cajaDB.getBalanceByFecha(hoy);

      setStats({
        totalProductos,
        totalStock,
        valorInventario,
        ventasHoy: totalVentasHoy,
        cajaHoy
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Productos</h3>
          <p className="stat-number">{stats.totalProductos}</p>
        </div>
        <div className="stat-card">
          <h3>Stock Total</h3>
          <p className="stat-number">{stats.totalStock}</p>
          <p className="stat-label">unidades</p>
        </div>
        <div className="stat-card">
          <h3>Valor Inventario</h3>
          <p className="stat-number">{stats.valorInventario.toFixed(2)} €</p>
        </div>
        <div className="stat-card">
          <h3>Ventas Hoy</h3>
          <p className="stat-number">{stats.ventasHoy}</p>
          <p className="stat-label">transacciones</p>
        </div>
        <div className="stat-card highlight">
          <h3>Caja Hoy</h3>
          <p className="stat-number">{stats.cajaHoy.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
