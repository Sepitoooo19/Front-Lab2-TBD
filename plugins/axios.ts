import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const instance = axios.create({
    baseURL: config.public.apiBase || "http://localhost:8090", // URL base del backend
  });

  // Interceptor para incluir el token JWT en las solicitudes
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    provide: {
      axios: instance,
  },
};
});