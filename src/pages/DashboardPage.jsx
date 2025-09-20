import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Un objeto para mapear IDs de rol a nombres legibles
const NOMBRES_ROLES = {
  1: 'Super Usuario',
  2: 'Gerencia',
  3: 'Jefe de Sucursal',
  4: 'Administrativo',
  5: 'Operador'
};


function DashboardPage() {
  const { usuario, logout } = useAuth();

  if (!usuario) {
    return <p>Cargando información del usuario...</p>;
  }
  return (
    <div>
      <h1>Dashboard de Gestión de Combustible</h1>
      <h2>¡Bienvenido!</h2>
      {/* Mostramos la información del usuario del token */}
      <p>
        <strong>Rol:</strong> {NOMBRES_ROLES[usuario.rol] || 'Desconocido'} | 
        <strong> Sucursal ID:</strong> {usuario.sucursal}
      </p>

      <nav>
        <h3>Menú de Acciones</h3>
        <ul>
          {/* Renderizado Condicional: Mostramos enlaces según el rol */}

          {usuario.rol === 1 && (
            <li><Link to="/admin/usuarios">Administrar Usuarios</Link></li>
          )}

          {/* Todos los roles excepto Gerencia pueden registrar consumos */}
          {usuario.rol !== 2 && (
            <li><Link to="/consumos/registrar">Registrar Consumo</Link></li>
          )}

          {/* Roles que pueden ver la lista de consumos */}
          {[1, 2, 3, 4].includes(usuario.rol) && (
            <li><Link to="/consumos">Visualizar Consumos</Link></li>
          )}

          {/* Roles que pueden gestionar traslados */}
          {[1, 3, 4].includes(usuario.rol) && (
            <li><Link to="/traslados">Gestionar Traslados</Link></li>
          )}

          {/* Roles que pueden ver reportes */}
          {[1, 2, 3].includes(usuario.rol) && (
            <li><Link to="/reportes">Ver Reportes</Link></li>
          )}
        </ul>
      </nav>

      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

export default DashboardPage;