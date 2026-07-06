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
    layout: 'general',         
    customerId: null,
    tenantId: null,
    companyName: null,
    sidebarOpenr: true,
    user: {
      id: '',
      name: '',
      email: '',
      phone: '',
      avatar: '',
      roles: []
    }
  }),

  // ... getters unchanged ...

  actions: {
    login(user, token, role, authType) {
      this.isAuthenticated = true
      this.user = user
      this.token = token
      this.role = role
      this.authType = authType

      if (authType === 'admin') {
        this.currentDashboard = '/admin/dashboard'
      } else if (authType === 'provider') {
        this.currentDashboard = '/provider/dashboard'
      } else if (authType === 'customer') {
        this.currentDashboard = '/customer/dashboard'
      } else if (authType === 'technician') {
        this.currentDashboard = '/technician/dashboard'
      }
    },

    logout() {
      this.isAuthenticated = false
      this.token = null
      this.authType = null
      this.role = null
      this.currentDashboard = null
      this.companyId = null
      this.companyName = null
      this.layout = 'general'   
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
      'user',
      'layout',      
      'customerId',  
      'tenantId'     
    ]
  }
})