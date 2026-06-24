// src/stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false,
    token: null,
    authType: null,
    role: null,
    currentDashboard: null,
    companyId: null,
    companyName: null,
    sidebarOpen: true,
    user: {
      id: '',
      name: '',
      email: '',
      phone: '',
      avatar: '',
      roles: []
    }
  }),

  getters: {
    // User getters
    getUserName: (state) => state.user.name,
    getUserEmail: (state) => state.user.email,
    getUserRole: (state) => state.role,
    getCompanyName: (state) => state.companyName,
    getAuthType: (state) => state.authType,

    // Auth type checks
    isAdmin: (state) => state.authType === 'admin',
    isProvider: (state) => state.authType === 'provider',
    isCustomer: (state) => state.authType === 'customer',

    // Role permission helper
    hasRole: (state) => (role) => {
      return state.user.roles.includes(role)
    },

    // Route protection helpers
    canAccessAdmin: (state) => {
      return state.isAuthenticated && state.authType === 'admin'
    },

    canAccessProvider: (state) => {
      return state.isAuthenticated && state.authType === 'provider'
    },

    canAccessCustomer: (state) => {
      return state.isAuthenticated && state.authType === 'customer'
    }
  },

  actions: {
    login(user, token, role, authType) {
      // Set authentication state
      this.isAuthenticated = true
      this.user = user
      this.token = token
      this.role = role
      this.authType = authType

      // Auto-determine dashboard based on auth type
      if (authType === 'admin') {
        this.currentDashboard = '/admin/dashboard'
      } else if (authType === 'provider') {
        this.currentDashboard = '/provider/dashboard'
      } else if (authType === 'customer') {
        this.currentDashboard = '/customer/dashboard'
      }
    },

    logout() {
      // Reset everything
      this.isAuthenticated = false
      this.token = null
      this.authType = null
      this.role = null
      this.currentDashboard = null
      this.companyId = null
      this.companyName = null
      this.sidebarOpen = true
      this.user = {
        id: '',
        name: '',
        email: '',
        phone: '',
        avatar: '',
        roles: '',
      }
    }
  },

  persist: {
    key: 'authStore',
    storage: localStorage,
    paths: [
      'isAuthenticated',
      'token',
      'authType',
      'role',
      'currentDashboard',
      'companyId',
      'companyName',
      'sidebarOpen',
      'user'
    ]
  }
})