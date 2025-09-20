import { useState, useEffect } from 'react';
import api from '../services/api';

function UsuarioForm({ usuarioInicial, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    password: '',
    id_rol: '',
    id_sucursal: ''
  });
  // 1. AÑADIMOS NUEVO ESTADO PARA CONFIRMAR CONTRASEÑA
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [roles, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [resRoles, resSucursales] = await Promise.all([
          api.get('/roles'),
          api.get('/sucursales')
        ]);
        setRoles(resRoles.data);
        setSucursales(resSucursales.data);
      } catch (err) {
        setError('No se pudieron cargar los roles o sucursales.');
      }
    };
    cargarListas();
  }, []);

  useEffect(() => {
    if (usuarioInicial) {
      setFormData({ ...usuarioInicial, password: '' });
      setConfirmPassword(''); // Limpiamos la confirmación también
    } else {
      setFormData({ rut: '', nombre: '', apellido: '', password: '', id_rol: '', id_sucursal: '' });
    }
  }, [usuarioInicial]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    // 3. AÑADIMOS LA LÓGICA DE VALIDACIÓN
    // Si estamos creando un usuario nuevo o si se escribió algo en el campo de contraseña...
    if (!usuarioInicial || formData.password) {
      if (formData.password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return; // Detenemos el envío del formulario
      }
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{usuarioInicial ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div><label>RUT:</label><input type="text" name="rut" value={formData.rut} onChange={handleChange} required /></div>
      <div><label>Nombre:</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
      <div><label>Apellido:</label><input type="text" name="apellido" value={formData.apellido} onChange={handleChange} /></div>
      
      <div>
        <label>Contraseña:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required={!usuarioInicial} />
      </div>

      {/* 2. AÑADIMOS EL NUEVO INPUT PARA CONFIRMAR */}
      <div>
        <label>Confirmar Contraseña:</label>
        <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!usuarioInicial} />
      </div>

      <div>
        <label>Rol:</label>
        <select name="id_rol" value={formData.id_rol} onChange={handleChange} required>
          <option value="">Seleccione un rol</option>
          {roles.map(rol => <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>)}
        </select>
      </div>

      <div>
        <label>Sucursal:</label>
        <select name="id_sucursal" value={formData.id_sucursal} onChange={handleChange} required>
          <option value="">Seleccione una sucursal</option>
          {sucursales.map(suc => <option key={suc.id_sucursal} value={suc.id_sucursal}>{suc.nombre_sucursal}</option>)}
        </select>
      </div>

      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}

export default UsuarioForm;