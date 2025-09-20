import { useState } from 'react';
import { NavLink } from 'react-router-dom'; // NavLink es mejor para navegación
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { usuario, logout } = useAuth();

  return (
    <header className="main-nav">
      <div className="nav-brand">
        <NavLink to="/"><h1>Gestión App</h1></NavLink>
      </div>

      {/* Botón Hamburguesa (solo visible en móvil gracias al CSS) */}
      <button className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Enlaces de Navegación */}
      {/* La clase 'is-open' se activa/desactiva según el estado */}
      <ul className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
        {usuario ? (
          <>
            <li><NavLink className="btn btn-primary" to="/">Inicio</NavLink></li>
            {/* Puedes añadir más enlaces aquí si quieres */}
            <li><button onClick={logout} className="btn btn-secondary">Cerrar Sesión</button></li>
          </>
        ) : (
          <li><NavLink to="/login">Iniciar Sesión</NavLink></li>
        )}
      </ul>
    </header>
  );
}

export default Header;