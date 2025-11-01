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
      const totalStock = productos.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
      const valorInventario = productos.reduce((sum, p) => sum + ((parseFloat(p.precio) || 0) * (parseInt(p.stock) || 0)), 0);
      
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

  const enviarResumenEmail = async () => {
    try {
      const productos = await productosDB.getAll();
      const hoy = new Date();
      const ventasHoy = await ventasDB.getByFecha(hoy);
      const ventasReales = ventasHoy.filter(v => v.tipo === 'venta');
      
      const cajaMovimientos = await cajaDB.getAll();
      const movimientosHoy = cajaMovimientos.filter(m => {
        const movFecha = new Date(m.fecha);
        return movFecha.toDateString() === hoy.toDateString();
      });
      
      const efectivoHoy = movimientosHoy
        .filter(m => m.metodoPago === 'efectivo' || !m.metodoPago)
        .reduce((total, m) => total + (m.tipo === 'ingreso' ? m.monto : -m.monto), 0);
      
      const tarjetaHoy = movimientosHoy
        .filter(m => m.metodoPago === 'tarjeta')
        .reduce((total, m) => total + (m.tipo === 'ingreso' ? m.monto : -m.monto), 0);
      
      const totalVentas = ventasReales.reduce((sum, v) => sum + (v.cantidad * v.precioVenta), 0);
      
      // Productos con stock bajo (menos de 3)
      const stockBajo = productos.filter(p => {
        const stock = parseInt(p.stock) || 0;
        return stock < 3 && stock > 0;
      });
      const sinStock = productos.filter(p => (parseInt(p.stock) || 0) === 0);
      
      // Construir cuerpo del email
      const fecha = hoy.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      let cuerpo = `RESUMEN DEL DÍA - Antorcha de Plata%0D%0A`;
      cuerpo += `Fecha: ${fecha}%0D%0A`;
      cuerpo += `%0D%0A`;
      cuerpo += `━━━ VENTAS ━━━%0D%0A`;
      cuerpo += `Número de ventas: ${ventasReales.length}%0D%0A`;
      cuerpo += `Total vendido: ${totalVentas.toFixed(2)} €%0D%0A`;
      cuerpo += `%0D%0A`;
      cuerpo += `━━━ CAJA ━━━%0D%0A`;
      cuerpo += `💵 Efectivo: ${efectivoHoy.toFixed(2)} €%0D%0A`;
      cuerpo += `💳 Tarjeta: ${tarjetaHoy.toFixed(2)} €%0D%0A`;
      cuerpo += `Total caja: ${(efectivoHoy + tarjetaHoy).toFixed(2)} €%0D%0A`;
      cuerpo += `%0D%0A`;
      cuerpo += `━━━ INVENTARIO ━━━%0D%0A`;
      cuerpo += `Productos totales: ${productos.length}%0D%0A`;
      cuerpo += `Stock total: ${productos.reduce((s, p) => s + (parseInt(p.stock) || 0), 0)} unidades%0D%0A`;
      cuerpo += `Valor inventario: ${productos.reduce((s, p) => s + ((parseFloat(p.precio) || 0) * (parseInt(p.stock) || 0)), 0).toFixed(2)} €%0D%0A`;
      
      if (sinStock.length > 0) {
        cuerpo += `%0D%0A`;
        cuerpo += `⚠️ SIN STOCK (${sinStock.length}):%0D%0A`;
        sinStock.slice(0, 5).forEach(p => {
          cuerpo += `  - ${p.nombre}%0D%0A`;
        });
      }
      
      if (stockBajo.length > 0) {
        cuerpo += `%0D%0A`;
        cuerpo += `🔴 STOCK BAJO (${stockBajo.length}):%0D%0A`;
        stockBajo.slice(0, 5).forEach(p => {
          cuerpo += `  - ${p.nombre} (${p.stock} uds)%0D%0A`;
        });
      }
      
      if (ventasReales.length > 0) {
        cuerpo += `%0D%0A`;
        cuerpo += `━━━ DETALLE VENTAS ━━━%0D%0A`;
        for (const venta of ventasReales) {
          const producto = await productosDB.getById(venta.productoId);
          const metodo = venta.metodoPago === 'tarjeta' ? '💳' : '💵';
          cuerpo += `${metodo} ${producto?.nombre || 'N/A'} x${venta.cantidad} = ${(venta.cantidad * venta.precioVenta).toFixed(2)} €%0D%0A`;
        }
      }
      
      // Abrir cliente de email
      const asunto = `Resumen ${fecha} - Antorcha de Plata`;
      window.location.href = `mailto:?subject=${encodeURIComponent(asunto)}&body=${cuerpo}`;
      
    } catch (error) {
      console.error('Error generando resumen:', error);
      alert('Error al generar el resumen');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={enviarResumenEmail} className="btn-email">
          📧 Enviar resumen del día
        </button>
      </div>
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
