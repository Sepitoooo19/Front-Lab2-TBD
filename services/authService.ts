import axios from 'axios';
const config = useRuntimeConfig();

// Función para iniciar sesión
// Entrada : email y password
// Salida : token de autenticación
export const login = async (email: string, password: string) => {
  const response = await fetch(`${config.public.apiBase}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Error al iniciar sesión");
  return await response.json();
};

// Función para registrar un nuevo usuario
// Entrada : datos del usuario
// Salida : token de autenticación
export const register = async (user: any) => {
  const response = await fetch(`${config.public.apiBase}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("Error al registrar el usuario");
  return await response.json();
};

// Funcion para cerrar sesión
// Entrada : token de autenticación
// Salida : eliminar el token del localStorage
export const logout = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Opcional: Notificar al backend para invalidar el token
      await axios.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error al cerrar sesión en el backend:', error);
    }
  }
  // Eliminar el token del localStorage
  localStorage.removeItem('token');
};