import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false,
    token: null,
    hrm_token: null,
    user: {
      id: '',
      name: '',
      email: '',
      avatar: '',
      phone: '',
      user_type: '',
      roles: [],
      permissions: []
    },
    role: null,
    currentDashboard: null,
    sidebarOpen: true,
    currentTab: 'crm',
    attendance_info_id: null,
    login_id: null,
    attendance_login_time: null,
    team_id: null,
    customerSuccessTeamSidebarIdentifier: null,
    companyName: null,
    companyId: null,
    variableModuleId: null,
  }),

  actions: {
    login(user, token, role, dashboard = 'crm') {
      this.isAuthenticated = true
      this.user = user
      this.token = token
      this.role = role
      this.currentDashboard = dashboard
      // Set currentTab based on dashboard (or role)
      this.currentTab = role === 'instructor' ? 'instructor' : 'student'
    },

    logout() {
      this.isAuthenticated = false
      this.token = null
      this.hrm_token = null
      this.role = null
      this.currentDashboard = null
      this.team_id = null
      this.customerSuccessTeamSidebarIdentifier = null
      this.companyName = null
      this.companyId = null
      this.variableModuleId = null
      this.user = {
        id: '',
        name: '',
        email: '',
        avatar: '',
        phone: '',
        user_type: '',
        roles: [],
        permissions: []
      }
      this.sidebarOpen = true
      this.currentTab = 'crm'
    },

    // ... other actions (setTeamId, etc.)
  },

  getters: {
    getUserName: (state) => state.user.name,
    getUserEmail: (state) => state.user.email,
    getUserAvatar: (state) => state.user.avatar,
    isCRM: (state) => state.currentTab === 'crm',
    isUserManagement: (state) => state.currentTab === 'user'
  },

  // 🔥 Proper persist configuration
  persist: {
    key: 'authStore', // key for localStorage
    storage: localStorage, // use localStorage (or sessionStorage)
    paths: [
      'isAuthenticated',
      'token',
      'user',
      'role',
      'currentDashboard',
      'currentTab',
      'sidebarOpen',
      'attendance_info_id',
      'login_id',
      'attendance_login_time',
      'team_id',
      'customerSuccessTeamSidebarIdentifier',
      'companyName',
      'companyId',
      'variableModuleId'
    ] // only persist these paths (optional)
  }
})