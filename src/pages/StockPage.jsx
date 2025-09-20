import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function StockPage() {
  const { usuario } = useAuth();
  const esSuperUsuario = usuario && usuario.rol === 1;

  const [filtros, setFiltros] = useState({
    sucursal_id: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [sucursales, setSucursales] = useState([]);
  const [reporteData, setReporteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si es Super Usuario, cargamos la lista de sucursales para el filtro
  useEffect(() => {
    if (esSuperUsuario) {
      api.get('/sucursales')
        .then(res => setSucursales(res.data))
        .catch(() => setError('No se pudieron cargar las sucursales.'));
    }
  }, [esSuperUsuario]);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    setError('');
    if (esSuperUsuario && !filtros.sucursal_id) {
      setError('Por favor, seleccione una sucursal.');
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
      });
      if (esSuperUsuario) {
        params.append('sucursal_id', filtros.sucursal_id);
      }

      const res = await api.get(`/reportes/stock?${params.toString()}`);
      setReporteData(res.data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reporte de Stock de Combustible</h2>
      <form onSubmit={handleGenerarReporte} className="filter-bar">
        {/* El filtro de sucursal solo se muestra al Super Usuario */}
        {esSuperUsuario && (
          <div className="form-group">
            <label>Sucursal:</label>
            <select name="sucursal_id" value={filtros.sucursal_id} onChange={handleFiltroChange} required className="form-select">
              <option value="">Seleccione sucursal</option>
              {sucursales.map(s => <option key={s.id_sucursal} value={s.id_sucursal}>{s.nombre_sucursal}</option>)}
            </select>
          </div>
        )}
        <div className="form-group">
            <label>Fecha Inicio:</label>
            <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleFiltroChange} required className="form-input" />
        </div>
         <div className="form-group">
            <label>Fecha Fin:</label>
            <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleFiltroChange} required className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Generando...' : 'Generar'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reporteData.length > 0 && (
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo Combustible</th>
              <th>Movimiento</th>
              <th>Detalle</th>
              <th>Litros</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {reporteData.map((row, index) => (
              <tr key={index}>
                <td data-label="Fecha">{new Date(row.fecha).toLocaleString('es-CL')}</td>
                <td data-label="Combustible">{row.tipo_combustible}</td>
                <td data-label="Movimiento">{row.tipo_movimiento}</td>
                <td data-label="Detalle">{row.detalle}</td>
                <td data-label="Litros" style={{ color: row.litros > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                  {parseFloat(row.litros).toFixed(2)}
                </td>
                <td data-label="Saldo">
                  <b>{parseFloat(row.saldo).toFixed(2)}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockPage;