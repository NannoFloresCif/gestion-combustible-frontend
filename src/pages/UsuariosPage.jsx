import { useState, useEffect } from 'react';
import api from '../services/api';
import UsuarioForm from '../components/UsuarioForm'; // Importamos el formulario

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para controlar el formulario
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // Función para cargar o recargar la lista de usuarios
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCrear = () => {
    setUsuarioAEditar(null); // No hay usuario para editar
    setIsFormVisible(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioAEditar(usuario); // Pasamos el usuario a editar
    setIsFormVisible(true);
  };

  const handleCambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    if (window.confirm(`¿Seguro que deseas cambiar el estado a "${nuevoEstado}"?`)) {
      try {
        await api.patch(`/usuarios/${id}/estado`, { estado: nuevoEstado });
        cargarUsuarios(); // Recargamos la lista para ver el cambio
      } catch (err) {
        setError('Error al cambiar el estado del usuario.');
      }
    }
  };

  const handleGuardarUsuario = async (datosFormulario) => {
    try {
      if (usuarioAEditar) {
        // Modo Edición
        await api.put(`/usuarios/${usuarioAEditar.id_usuario}`, datosFormulario);
      } else {
        // Modo Creación
        await api.post('/usuarios', datosFormulario);
      }
      cargarUsuarios();
      setIsFormVisible(false); // Ocultamos el formulario
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el usuario.');
    }
  };

  return (
    <div>
      <h1>Administración de Usuarios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Mostramos el formulario o la tabla */}
      {isFormVisible ? (
        <UsuarioForm
          usuarioInicial={usuarioAEditar}
          onSave={handleGuardarUsuario}
          onCancel={() => setIsFormVisible(false)}
        />
      ) : (
        <>
          <button onClick={handleCrear}>Crear Nuevo Usuario</button>
          {loading ? <p>Cargando...</p> : (
            <table>
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Sucursal</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(user => (
                  <tr key={user.id_usuario}>
                    <td>{user.rut}</td>
                    <td>{`${user.nombre} ${user.apellido}`}</td>
                    <td>{user.nombre_rol}</td>
                    <td>{user.nombre_sucursal}</td>
                    <td>{user.estado}</td>
                    <td>
                      <button onClick={() => handleEditar(user)}>Editar</button>
                      <button onClick={() => handleCambiarEstado(user.id_usuario, user.estado)}>
                        Cambiar Estado
                      </button>
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

export default UsuariosPage;
