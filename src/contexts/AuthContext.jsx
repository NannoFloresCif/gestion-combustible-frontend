import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto (AuthProvider)
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 3. Si hay un token en localStorage al cargar la app, decodifícalo
    if (token) {
      const decodedUser = jwtDecode(token);
      setUsuario(decodedUser);
    }
  }, [token]);

  const login = (newToken) => {
    const decodedUser = jwtDecode(newToken);
    setUsuario(decodedUser);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    navigate('/'); // Redirigir al dashboard después del login
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    navigate('/login'); // Redirigir al login después del logout
  };

  const value = { token, usuario,login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Crear un Hook personalizado para usar el contexto fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}