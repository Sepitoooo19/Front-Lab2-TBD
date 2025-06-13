export interface MenuItem {
  title: string;
  icon?: string; // Opcional, para futura integración de iconos
  link: string;
  adminOnly?: boolean; // Para diferenciar rutas en un menú unificado si se desea
  userOnly?: boolean;
}

export const userMenuOptions: MenuItem[] = [
  { title: 'Dashboard', link: '/dashboard', userOnly: true },
  { title: 'Mis Tareas', link: '/tasks', userOnly: true },
  { title: 'Sectores', link: '/sectors', userOnly: true }, // Usuarios pueden ver sectores
  { title: 'Reportes', link: '/reports', userOnly: true },
  { title: 'Mi Perfil', link: '/profile', userOnly: true },
];

export const adminMenuOptions: MenuItem[] = [
  { title: 'Admin Dashboard', link: '/admin/dashboard', adminOnly: true },
  { title: 'Gestionar Usuarios', link: '/admin/users', adminOnly: true },
  { title: 'Gestionar Tareas', link: '/admin/tasks', adminOnly: true },
  { title: 'Gestionar Sectores', link: '/admin/sectors', adminOnly: true },
  { title: 'Reportes Admin', link: '/admin/reports', adminOnly: true },
];

// Podrías tener una función que combine o filtre estos según el rol del usuario
// para un componente de sidebar más dinámico si decides usarlo.