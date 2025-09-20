import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function ConsumosListPage() {
  const [consumos, setConsumos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  
  // Estado unificado para todos los filtros
  const [filtros, setFiltros] = useState({
    sucursal_id: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { usuario } = useAuth();
  const esRolGlobal = usuario && [1, 2].includes(usuario.rol);

  // Carga los datos necesarios para los filtros al montar el componente
  useEffect(() => {
    if (esRolGlobal) {
      api.get('/sucursales')
        .then(res => setSucursales(res.data))
        .catch(err => console.error("Error cargando sucursales", err));
    }
  }, [esRolGlobal]);

  // Función para buscar/filtrar consumos
  const buscarConsumos = async () => {
    setLoading(true);
    setError('');
    try {
      // URLSearchParams es la forma profesional de construir query strings
      const params = new URLSearchParams();
      
      if (esRolGlobal && filtros.sucursal_id) {
        params.append('sucursal_id', filtros.sucursal_id);
      }
      if (filtros.fecha_inicio) {
        params.append('fecha_inicio', filtros.fecha_inicio);
      }
      if (filtros.fecha_fin) {
        params.append('fecha_fin', filtros.fecha_fin);
      }
      
      const resConsumos = await api.get(`/consumos?${params.toString()}`);
      setConsumos(resConsumos.data);
    } catch (err) {
      setError('Error al cargar los consumos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carga la lista inicial de consumos cuando la página se monta por primera vez
  useEffect(() => {
    if (usuario) { // Nos aseguramos de tener el usuario antes de buscar
        buscarConsumos();
    }
  }, [usuario]);
  
  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleFiltroSubmit = (e) => {
    e.preventDefault();
    buscarConsumos();
  };

  const handleEliminar = async (idConsumo) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de consumo?')) {
      try {
        await api.patch(`/consumos/${idConsumo}/eliminar`);
        setConsumos(consumos.filter(c => c.id_consumo !== idConsumo));
      } catch (err) {
        setError('Error al eliminar el consumo.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Listado de Consumos Registrados</h2>

      {/* Formulario de Filtros */}
      <form onSubmit={handleFiltroSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        {esRolGlobal && (
          <select name="sucursal_id" value={filtros.sucursal_id} onChange={handleFiltroChange}>
            <option value="">Todas las sucursales</option>
            {sucursales.map(s => <option key={s.id_sucursal} value={s.id_sucursal}>{s.nombre_sucursal}</option>)}
          </select>
        )}
        <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleFiltroChange} />
        <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleFiltroChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table className="responsive-table">
        <thead>
          <tr>
            <th >Fecha y Hora</th>
            <th>Máquina</th>
            <th>Horómetro</th>
            <th>Litros</th>
            <th>Usuario</th>
            <th>Surtidor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {consumos.map(consumo => (
            <tr key={consumo.id_consumo}>
              <td data-label>{new Date(consumo.fecha_hora).toLocaleString('es-CL')}</td>
              <td data-label>{consumo.maquina_codigo} - {consumo.maquina_modelo}</td>
              <td data-label>{consumo.horometro}</td>
              <td data-label>{consumo.litros_cargados}</td>
              <td data-label>{consumo.usuario_registro}</td>
              <td data-label>{consumo.nombre_surtidor}</td>
              <td data-label>
                <button className="btn-secondary" onClick={() => handleEliminar(consumo.id_consumo)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConsumosListPage;