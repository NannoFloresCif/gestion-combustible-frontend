import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api'; // Nuestro cliente de API

function RegistrarConsumoPage() {
  // Estados para los datos del formulario y las listas
  const [maquinas, setMaquinas] = useState([]);
  const [surtidores, setSurtidores] = useState([]);
  const [formData, setFormData] = useState({
    id_maquina: '',
    horometro: '',
    litros_cargados: '',
    cuentalitros_surtidor: '',
    id_surtidor: ''
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const { usuario } = useAuth();

  // Efecto para cargar máquinas y surtidores al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Peticiones en paralelo para mayor eficiencia
        const [resMaquinas, resSurtidores] = await Promise.all([
          api.get('/maquinaria/mi-sucursal'),
          api.get('/surtidores/mi-sucursal')
        ]);
        setMaquinas(resMaquinas.data);
        setSurtidores(resSurtidores.data);
      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Error al cargar datos iniciales.' });
        console.error(error);
      }
    };

    if (usuario) { // Nos aseguramos de que el usuario ya ha cargado
      fetchData();
    }
  }, [usuario]);

  // Manejador para los cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' }); // Limpiar mensaje anterior
    try {
      const res = await api.post('/consumos', formData);
      setMensaje({ tipo: 'exito', texto: res.data.mensaje });
      // Limpiar formulario
      setFormData({
        id_maquina: '', horometro: '', litros_cargados: '',
        cuentalitros_surtidor: '', id_surtidor: ''
      });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Error al registrar el consumo.' });
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Registrar Nuevo Consumo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Máquina:</label>
          <select name="id_maquina" value={formData.id_maquina} onChange={handleChange} required>
            <option value="">Seleccione una máquina</option>
            {maquinas.map(m => (
              <option key={m.id_maquina} value={m.id_maquina}>
                {m.codigo_interno} - {m.marca} {m.modelo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Surtidor:</label>
          <select name="id_surtidor" value={formData.id_surtidor} onChange={handleChange} required>
            <option value="">Seleccione un surtidor</option>
            {surtidores.map(s => (
              <option key={s.id_surtidor} value={s.id_surtidor}>{s.nombre_surtidor}</option>
            ))}
          </select>
        </div>
        <div><label>Horómetro:</label><input type="number" name="horometro" value={formData.horometro} onChange={handleChange} required step="0.01" /></div>
        <div><label>Litros Cargados:</label><input type="number" name="litros_cargados" value={formData.litros_cargados} onChange={handleChange} required step="0.01" /></div>
        <div><label>Cuentalitros del Surtidor:</label><input type="number" name="cuentalitros_surtidor" value={formData.cuentalitros_surtidor} onChange={handleChange} required step="0.01" /></div>

        <button type="submit">Registrar Consumo</button>
      </form>
      {mensaje.texto && <p style={{ color: mensaje.tipo === 'error' ? 'red' : 'green' }}>{mensaje.texto}</p>}
    </div>
  );
}

export default RegistrarConsumoPage;