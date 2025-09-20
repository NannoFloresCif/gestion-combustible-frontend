import axios from 'axios';

// instancia de Axios con la configuración base
const apiClient = axios.create({
  baseURL: 'https://gestion-combustible-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor para añadir el token a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;