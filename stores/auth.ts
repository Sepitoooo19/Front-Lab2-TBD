import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
    userName: '' as string,
    userRole: '' as 'USER' | 'ADMIN' | '', // Puede ser 'USER', 'ADMIN'
    token: '' as string,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'ADMIN',
    isUser: (state) => state.userRole === 'USER',
  },
  actions: {
    setUser(payload: { id: number; name: string; role: 'USER' | 'ADMIN'; token: string }) {
      this.userId = payload.id
      this.userName = payload.name
      this.userRole = payload.role
      this.token = payload.token

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', payload.token)
        localStorage.setItem('role', payload.role)
        localStorage.setItem('userId', payload.id.toString())
        localStorage.setItem('userName', payload.name)
      }
    },
    loadUserFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('jwt')
        const role = localStorage.getItem('role') as 'USER' | 'ADMIN' | ''
        const userId = localStorage.getItem('userId')
        const userName = localStorage.getItem('userName')

        if (token && role && userId) {
          this.token = token
          this.userRole = role
          this.userId = parseInt(userId, 10)
          this.userName = userName || ''
        }
      }
    },
    clearUser() {
      this.userId = null
      this.userName = ''
      this.userRole = ''
      this.token = ''
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
      }
    },
  },
})