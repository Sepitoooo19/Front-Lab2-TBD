// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') as 'USER' | 'ADMIN' | null : null;

  if (token && role) {
    // Usuario está logueado, redirigir si intenta acceder a login o register
    if (to.path === '/login' || to.path === '/register') {
      if (role === 'ADMIN') {
        return navigateTo('/admin/dashboard');
      } else {
        return navigateTo('/dashboard');
      }
    }
  }
  // Si no está logueado, o está logueado pero no va a login/register, continuar.
});