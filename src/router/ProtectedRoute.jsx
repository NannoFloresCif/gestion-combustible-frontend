import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    // Si no hay token, redirigir al usuario a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay un token, renderizar el componente hijo (la página protegida)
  return children;
}

export default ProtectedRoute;