import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  // 1. Estados para guardar los valores de los inputs
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [sucursalId, setSucursalId] = useState(''); // El ID de la sucursal seleccionada
  const [sucursales, setSucursales] = useState([]); // Array para guardar la lista de sucursales
  const [error, setError] = useState(''); // Estado para mensajes de error

  const { login } = useAuth();

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3001/api/sucursales');
        setSucursales(respuesta.data);
      } catch (error) {
        console.error("Error al cargar sucursales", error);
        setError('No se pudieron cargar las sucursales.');
      }
    };
    cargarSucursales();
  }, []); // El array vacío [] significa que esto se ejecuta solo una vez

  useState(() => {
    const cargarSucursales = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3001/api/sucursales');
        setSucursales(respuesta.data);
      } catch (error) { console.error("Error al cargar sucursales", error); }
    };
    cargarSucursales();
  }, []);


  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (evento) => {
    evento.preventDefault(); // Previene que la página se recargue
    setError('');

    try {
      // 2. Petición POST a nuestro backend con Axios
      const respuesta = await axios.post('http://localhost:3001/api/login', {
        rut: rut,
        id_sucursal: sucursalId,
        password: password,
      });

      login(respuesta.data.token);
      console.log('Login exitoso:', respuesta.data);
      

    } catch (error) {
      // 4. Si la petición falla, mostramos el error en consola
      console.error('Error en el login:', error.response.data);
      setError(error.response.data.mensaje || 'Error al iniciar sesión.')
    }
  };

  return (
    <div>
    <h2>Iniciar Sesión</h2>
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>RUT:</label>
        <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required className="form-input" />
      </div>
      <div className="form-group">
        <label>Sucursal:</label>
        <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} required className="form-select">
          <option value="" disabled>Seleccione una sucursal</option>
          {sucursales.map((suc) => (
            <option key={suc.id_sucursal} value={suc.id_sucursal}>
              {suc.nombre_sucursal}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Ingresar</button>
      </div>
    </form>
  </div>
  );
}

export default LoginPage;