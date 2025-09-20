import { useState, useEffect } from 'react';
import api from '../services/api';

function MaquinariaForm({ maquinaInicial, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    codigo_interno: '',
    marca: '',
    modelo: '',
    tipo_combustible: 'Petróleo',
    id_sucursal_actual: ''
  });
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/sucursales')
      .then(res => setSucursales(res.data))
      .catch(() => setError('No se pudieron cargar las sucursales.'));
  }, []);

  useEffect(() => {
    if (maquinaInicial) {
      setFormData(maquinaInicial);
    } else {
      setFormData({ codigo_interno: '', marca: '', modelo: '', tipo_combustible: 'Petróleo', id_sucursal_actual: '' });
    }
  }, [maquinaInicial]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>{maquinaInicial ? 'Editar Maquinaria' : 'Crear Nueva Maquinaria'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="form-group">
        <label>Código Interno:</label>
        <input type="text" name="codigo_interno" value={formData.codigo_interno} onChange={handleChange} required className="form-input" />
      </div>
      <div className="form-group">
        <label>Marca:</label>
        <input type="text" name="marca" value={formData.marca} onChange={handleChange} className="form-input" />
      </div>
      <div className="form-group">
        <label>Modelo:</label>
        <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="form-input" />
      </div>
      
      <div className="form-group">
        <label>Tipo Combustible:</label>
        <select name="tipo_combustible" value={formData.tipo_combustible} onChange={handleChange} required className="form-select">
          <option value="Petróleo">Petróleo</option>
          <option value="Gasolina">Gasolina</option>
        </select>
      </div>

      <div className="form-group">
        <label>Sucursal Actual:</label>
        <select name="id_sucursal_actual" value={formData.id_sucursal_actual} onChange={handleChange} required className="form-select">
          <option value="">Seleccione una sucursal</option>
          {sucursales.map(suc => <option key={suc.id_sucursal} value={suc.id_sucursal}>{suc.nombre_sucursal}</option>)}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}

export default MaquinariaForm;