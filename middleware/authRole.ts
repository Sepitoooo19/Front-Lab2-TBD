export default defineNuxtRouteMiddleware((to, from) => {
  const token = localStorage.getItem('token'); // Verifica si el token existe
  const role = localStorage.getItem('role'); // Obtén el rol del usuario desde el localStorage

  console.log('Ruta actual:', to.path);
  console.log('Rol del usuario:', role);

  if (!token) {
    console.log('No hay token, redirigiendo al login.');
    return navigateTo('/login'); // Redirige al login si no hay token
  }

  // Define las rutas permitidas para cada rol
  const allowedRoutes: Record<string, string[]> = {
    CLIENT: ['/home-client', '/client-orders', '/cart'],
    ADMIN: ['/home-admin', '/clients', '/orders', '/dealers', '/unassigned-orders', '/companies-admin', '/querys'],
    DEALER: ['/home-dealer', '/unassigned-orders-dealer', '/profile-dealer'],
  };



  // Si el rol no está definido o no tiene rutas permitidas, redirige al login
  if (!role || !allowedRoutes[role]) {
    console.log('Redirigiendo al login porque el rol no está definido o no tiene rutas permitidas.');
    return navigateTo('/login');
  }

  // Verifica si la ruta actual está permitida para el rol del usuario
  const normalizePath = (path: string) => path.replace(/\/$/, '');
  const isAllowed = allowedRoutes[role].some((route) => normalizePath(to.path).startsWith(normalizePath(route)));

  if (!isAllowed) {
    // Redirige al inicio correspondiente según el rol
    const redirectHome: Record<string, string> = {
      CLIENT: '/home-client',
      ADMIN: '/home-admin',
      DEALER: '/home-dealer',
    };
    console.log('Redirigiendo al inicio correspondiente porque la ruta no está permitida.');
    return navigateTo(redirectHome[role] || '/login');
  }
});