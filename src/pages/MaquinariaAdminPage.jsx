import { useState, useEffect } from 'react';
import api from '../services/api';
import MaquinariaForm from '../components/MaquinariaForm';

function MaquinariaAdminPage() {
  const [maquinaria, setMaquinaria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [maquinaAEditar, setMaquinaAEditar] = useState(null);

  const cargarMaquinaria = async () => {
    try {
      setLoading(true);
      const res = await api.get('/maquinaria'); // El super usuario ve todas
      setMaquinaria(res.data);
    } catch (err) {
      setError('Error al cargar la maquinaria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMaquinaria();
  }, []);

  const handleCrear = () => {
    setMaquinaAEditar(null);
    setIsFormVisible(true);
  };

  const handleEditar = (maq) => {
    setMaquinaAEditar(maq);
    setIsFormVisible(true);
  };

  const handleGuardar = async (datosFormulario) => {
    try {
      if (maquinaAEditar) {
        await api.put(`/maquinaria/${maquinaAEditar.id_maquina}`, datosFormulario);
      } else {
        await api.post('/maquinaria', datosFormulario);
      }
      cargarMaquinaria();
      setIsFormVisible(false);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar la maquinaria.');
    }
  };

  return (
    <div>
    <h1>Administración de Maquinaria</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    
    {isFormVisible ? (
      <MaquinariaForm
        maquinaInicial={maquinaAEditar}
        onSave={handleGuardar}
        onCancel={() => setIsFormVisible(false)}
      />
    ) : (
      <>
        <button onClick={handleCrear} className="btn btn-primary" style={{marginBottom: '1.5rem'}}>
          Crear Nueva Maquinaria
        </button>
        {loading ? <p>Cargando...</p> : (
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Código Interno</th>
                <th>Marca y Modelo</th>
                <th>Sucursal Actual</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {maquinaria.map(maq => (
                <tr key={maq.id_maquina}>
                  <td data-label="Código">{maq.codigo_interno}</td>
                  <td data-label="Marca/Modelo">{`${maq.marca || ''} ${maq.modelo || ''}`}</td>
                  <td data-label="Sucursal">{maq.sucursal_actual}</td>
                  <td data-label="Estado">{maq.estado}</td>
                  <td data-label="Acciones">
                    <button onClick={() => handleEditar(maq)} className="btn btn-secondary">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    )}
  </div>
  );
}

export default MaquinariaAdminPage;