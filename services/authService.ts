import { useRuntimeConfig } from '#app';

/**
 * Decodifica un token JWT para inspeccionar su payload.
 * No verifica la firma, solo lee los datos.
 */
function decodeJWT(token: string): any | null {
  try {
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) return null;
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payloadBase64));
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Registra un nuevo usuario. Acepta un objeto con los datos del usuario.
 */
export async function register(userData: any): Promise<any> {
  const config = useRuntimeConfig();
  return await $fetch('/auth/register', {
    baseURL: config.public.apiBase,
    method: 'POST',
    body: userData
  });
}

/**
 * Inicia sesión de un usuario.
 * Acepta un solo objeto con las credenciales.
 */
export async function login(credentials: { username: string; password: string }): Promise<any> {
  const config = useRuntimeConfig();
  // El backend espera 'username', así que lo mantenemos. Si esperara 'email', se cambiaría aquí.
  const loginResponse = await $fetch('/auth/login', {
    baseURL: config.public.apiBase,
    method: 'POST',
    body: credentials
  }) as any;

  const token = loginResponse?.token;
  const role = loginResponse?.role;
  const locationWKT = loginResponse?.location;

  // Estandarizamos el nombre del token a 'jwt' como preferiste
  if (token && typeof token === 'string') {
    localStorage.setItem('jwt', token);
    
    if (role) {
      localStorage.setItem('role', role);
    }
    
    const decoded = decodeJWT(token);
    if (decoded) {
      const userId = decoded.userId || decoded.id || decoded.sub;
      if (userId) {
        localStorage.setItem('userId', userId.toString());
      }
    }

    if (locationWKT && typeof locationWKT === 'string') {
      localStorage.setItem('userLocationWKT', locationWKT);
    } else {
      localStorage.removeItem('userLocationWKT');
    }
  }

  return loginResponse;
}

/**
 * Cierra la sesión del usuario.
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem('jwt'); // Lee 'jwt'
  if (token) {
    try {
      const config = useRuntimeConfig();
      // Opcional: Notificar al backend. Usamos $fetch para ser consistentes.
      await $fetch('/auth/logout', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error al notificar al backend sobre el cierre de sesión (se puede ignorar):', error);
    }
  }
  // Limpiar localStorage
  localStorage.removeItem('jwt');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('userLocationWKT');
}