import { useState } from 'react';
import api from '../services/api';

function ReportesPage() {
  // Estados para los filtros de fecha y los datos del reporte
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporteData, setReporteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función que se ejecuta al hacer clic en el botón "Generar Reporte"
  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) {
      setError('Por favor, seleccione una fecha de inicio y una de fin.');
      return;
    }

    setLoading(true);
    setError('');
    setReporteData([]);

    try {
      const url = `/reportes/desviaciones?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
      const respuesta = await api.get(url);
      setReporteData(respuesta.data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al generar el reporte.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reporte de Desviaciones de Combustible</h2>

      <form onSubmit={handleGenerarReporte}>
        <label>Fecha de Inicio: </label>
        <input 
          type="date" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />

        <label style={{ marginLeft: '1rem' }}>Fecha de Fin: </label>
        <input 
          type="date" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />

        <button type="submit" style={{ marginLeft: '1rem' }} disabled={loading}>
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {reporteData.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Resultados del Reporte</h3>
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Tipo Combustible</th>
                <th>Total Consumos Ingresados (Lts)</th>
                <th>Total Consumos Cuentalitros (Lts)</th>
                <th>Diferencia (Lts)</th>
              </tr>
            </thead>
            <tbody>
              {reporteData.map(row => (
                <tr key={`${row.dia}-${row.tipo_combustible}`}>
                  <td>{new Date(row.dia).toLocaleDateString('es-CL', { timeZone: 'UTC' })}</td>
                  <td>{row.tipo_combustible}</td>
                  <td>{parseFloat(row.totalConsumosIngresados).toFixed(2)}</td>
                  <td>{parseFloat(row.totalConsumosCuentalitros).toFixed(2)}</td>
                  <td style={{ color: parseFloat(row.diferencia) < 0 ? 'red' : 'green' }}>
                    {parseFloat(row.diferencia).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportesPage;