import { useState, useEffect } from 'react';
import { cajaDB } from '../db';

function CashControl() {
  const [movimientos, setMovimientos] = useState([]);
  const [balance, setBalance] = useState(0);
  const [balanceEfectivo, setBalanceEfectivo] = useState(0);
  const [balanceTarjeta, setBalanceTarjeta] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    monto: '',
    descripcion: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const movs = await cajaDB.getAll();
    setMovimientos(movs);
    
    const bal = await cajaDB.getBalance();
    setBalance(bal);
    
    // Calcular balances por método de pago
    const efectivo = movs
      .filter(m => (m.metodoPago === 'efectivo' || !m.metodoPago))
      .reduce((total, mov) => {
        return mov.tipo === 'ingreso' ? total + mov.monto : total - mov.monto;
      }, 0);
    
    const tarjeta = movs
      .filter(m => m.metodoPago === 'tarjeta')
      .reduce((total, mov) => {
        return mov.tipo === 'ingreso' ? total + mov.monto : total - mov.monto;
      }, 0);
    
    setBalanceEfectivo(efectivo);
    setBalanceTarjeta(tarjeta);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cajaDB.add({
        tipo: formData.tipo,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion
      });
      setFormData({ tipo: 'ingreso', monto: '', descripcion: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error registrando movimiento:', error);
    }
  };

  return (
    <div className="cash-control">
      <div className="section-header">
        <h2>Control de Caja</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : '+ Nuevo Movimiento'}
        </button>
      </div>

      <div className="balance-cards-grid">
        <div className="balance-card">
          <h3>Balance Total</h3>
          <p className={`balance-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
        <div className="balance-card efectivo">
          <h3>💵 Efectivo</h3>
          <p className={`balance-amount ${balanceEfectivo >= 0 ? 'positive' : 'negative'}`}>
            {balanceEfectivo.toFixed(2)} €
          </p>
        </div>
        <div className="balance-card tarjeta">
          <h3>💳 Tarjeta</h3>
          <p className={`balance-amount ${balanceTarjeta >= 0 ? 'positive' : 'negative'}`}>
            {balanceTarjeta.toFixed(2)} €
          </p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>

          <input
            type="number"
            step="0.01"
            placeholder="Monto"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
          />

          <button type="submit" className="btn-primary">Registrar</button>
        </form>
      )}

      <div className="movimientos-list">
        <h3>Movimientos</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.id}>
                <td>{new Date(mov.fecha).toLocaleString()}</td>
                <td>
                  <span className={`badge ${mov.tipo}`}>
                    {mov.tipo === 'ingreso' ? '+ Ingreso' : '- Egreso'}
                  </span>
                </td>
                <td>{mov.descripcion}</td>
                <td className={mov.tipo === 'ingreso' ? 'positive' : 'negative'}>
                  {mov.tipo === 'ingreso' ? '+' : '-'}{mov.monto.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashControl;
