import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '', // Puede ser 'CLIENT', 'ADMIN', 'DEALER'
    token: '', // Token de autenticación
  }),
  actions: {
    setRole(role: string) {
      this.role = role;
    },
    setToken(token: string) {
      this.token = token;
    },
  },
});