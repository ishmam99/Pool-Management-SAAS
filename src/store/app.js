import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    mobileMenu: false,
  }),

  actions: {
    toggleMenu() {
      this.mobileMenu = !this.mobileMenu
    },
  },
})