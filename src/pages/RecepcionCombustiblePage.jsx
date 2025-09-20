import { useState } from 'react';
import api from '../services/api';

function RecepcionCombustiblePage() {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0], // Pone la fecha de hoy por defecto
    tipo_combustible: 'Petróleo',
    litros_recepcionados: '',
    valor_factura: ''
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    try {
      const res = await api.post('/recepciones', formData);
      setMensaje({ tipo: 'exito', texto: res.data.mensaje });
      // Limpiar el formulario excepto la fecha y tipo de combustible
      setFormData({
        ...formData,
        litros_recepcionados: '',
        valor_factura: ''
      });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Error al registrar la recepción.' });
    }
  };

  return (
    <div>
    <h2>Registrar Recepción de Combustible</h2>
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Fecha:</label>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="form-input" />
      </div>
      
      <div className="form-group">
        <label>Tipo Combustible:</label>
        <select name="tipo_combustible" value={formData.tipo_combustible} onChange={handleChange} required className="form-select">
          <option value="Petróleo">Petróleo</option>
          <option value="Gasolina">Gasolina</option>
        </select>
      </div>

      <div className="form-group">
        <label>Litros Recepcionados:</label>
        <input type="number" name="litros_recepcionados" value={formData.litros_recepcionados} onChange={handleChange} required step="0.01" className="form-input" />
      </div>
      <div className="form-group">
        <label>Valor Factura (CLP):</label>
        <input type="number" name="valor_factura" value={formData.valor_factura} onChange={handleChange} required className="form-input" />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Registrar Recepción</button>
      </div>
    </form>
    {mensaje.texto && <p style={{ color: mensaje.tipo === 'error' ? 'red' : 'green', marginTop: '1rem' }}>{mensaje.texto}</p>}
  </div>
  );
}

export default RecepcionCombustiblePage;