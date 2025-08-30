// Interceptor para agregar automáticamente el token JWT en las requests protegidas
import axios from "axios";

// Configurar axios para incluir el token JWT en todas las requests
axios.interceptors.request.use(
  function(config) {
    // Obtener el token del localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.access_token) {
        // Agregar el token al header Authorization
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("user");
      window.location.href = "/src/views/auth.html";
    }
    return Promise.reject(error);
  }
);

export default axios;
