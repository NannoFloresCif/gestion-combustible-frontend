import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function TrasladosPage() {
  // Estados para los datos del formulario y las listas
  const [maquinas, setMaquinas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [formData, setFormData] = useState({
    id_maquina: '',
    horometro_salida: '',
    id_sucursal_destino: ''
  });

  const [trasladosPendientes, setTrasladosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const { usuario } = useAuth();

  // Efecto para cargar las máquinas y sucursales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resMaquinas, resSucursales, resPendientes] = await Promise.all([
          api.get('/maquinaria/mi-sucursal'),
          api.get('/sucursales'),
          api.get('/traslados/pendientes')
        ]);

        setMaquinas(resMaquinas.data);

        // Filtramos para no poder seleccionar la propia sucursal como destino
        const sucursalesDestino = resSucursales.data.filter(s => s.id_sucursal !== usuario.sucursal);
        setSucursales(sucursalesDestino);
        setTrasladosPendientes(resPendientes.data)

      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Error al cargar datos para el formulario.' });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (usuario) {
      fetchData();
    }
  }, [usuario]);

  //const handleChange = (e) => {
  //  setFormData({ ...formData, [e.target.name]: e.target.value });
  //};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    try {
      const res = await api.post('/traslados', formData);
      setMensaje({ tipo: 'exito', texto: res.data.mensaje });
      // Limpiar formulario y recargar lista de máquinas (la máquina trasladada ya no estará disponible)
      setFormData({ id_maquina: '', horometro_salida: '', id_sucursal_destino: '' });
      const resMaquinas = await api.get('/maquinaria/mi-sucursal');
      setMaquinas(resMaquinas.data);

    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Error al solicitar el traslado.' });
      console.error(error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- NUEVA FUNCIÓN para responder a un traslado ---
  const handleResponderTraslado = async (idTraslado, decision) => {
    const motivo = decision === 'Rechazado' 
      ? window.prompt('Por favor, ingresa el motivo del rechazo:') 
      : null;

    if (decision === 'Rechazado' && !motivo) {
      // Si el usuario cancela el prompt de rechazo, no hacemos nada
      return;
    }

    try {
      await api.patch(`/traslados/${idTraslado}/respuesta`, {
        decision: decision,
        motivo_rechazo: motivo
      });
      // Actualizamos la lista para remover el traslado gestionado
      setTrasladosPendientes(trasladosPendientes.filter(t => t.id_traslado !== idTraslado));
      setMensaje({ tipo: 'exito', texto: `Traslado ${decision.toLowerCase()} exitosamente.` });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Error al responder al traslado.' });
    }
  };

  return (
    <>
    <div>
      <h2>Solicitar Traslado de Maquinaria</h2>
      <form onSubmit={handleSubmit} className="form-container">
        {/* ... Lógica de mensajes ... */}
        <div className="form-group">
          <label>Máquina a trasladar:</label>
          <select name="id_maquina" value={formData.id_maquina} onChange={handleChange} required className="form-select">
            <option value="">Seleccione una máquina</option>
            {maquinas.map(m => (
              <option key={m.id_maquina} value={m.id_maquina}>
                {m.codigo_interno} - {m.marca} {m.modelo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Horómetro de Salida:</label>
          <input type="number" name="horometro_salida" value={formData.horometro_salida} onChange={handleChange} required step="0.01" className="form-input" />
        </div>
        <div className="form-group">
          <label>Sucursal de Destino:</label>
          <select name="id_sucursal_destino" value={formData.id_sucursal_destino} onChange={handleChange} required className="form-select">
            <option value="">Seleccione una sucursal</option>
            {sucursales.map(s => (
              <option key={s.id_sucursal} value={s.id_sucursal}>{s.nombre_sucursal}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Solicitar Traslado</button>
        </div>
      </form>
      {mensaje.texto && <p style={{ color: mensaje.tipo === 'error' ? 'red' : 'green' }}>{mensaje.texto}</p>}
    </div>

    <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid var(--color-borde)' }} />

    <section>
        <h2>Traslados Pendientes de Recepción</h2>
        {/* ... Lógica de carga y mensajes ... */}
        {!loading && trasladosPendientes.length > 0 && (
          <table className="responsive-table">
            {/* ... Cabecera de la tabla ... */}
            <tbody>
              {trasladosPendientes.map(t => (
                <tr key={t.id_traslado}>
                  <td data-label="Fecha Solicitud">{new Date(t.fecha_solicitud).toLocaleString('es-CL')}</td>
                  <td data-label="Máquina">{t.maquina_codigo} - {t.maquina_modelo}</td>
                  <td data-label="Origen">{t.sucursal_origen}</td>
                  <td data-label="Horómetro">{t.horometro_salida}</td>
                  <td data-label="Solicitante">{t.usuario_solicita}</td>
                  <td data-label="Acciones">
                    <button onClick={() => handleResponderTraslado(t.id_traslado, 'Aceptado')} className="btn btn-primary">Aceptar</button>
                    <button onClick={() => handleResponderTraslado(t.id_traslado, 'Rechazado')} className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
  </>
  );
}

export default TrasladosPage;