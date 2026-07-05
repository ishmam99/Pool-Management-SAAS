import { defineStore } from 'pinia'
import { tenantWebsiteApi } from '../../../services/tenantWebsiteApi.js'

const defaultConfig = () => ({
  site_name: 'Aqua Clean Pool',
  tagline: '',
  phone: '',
  email: '',
  address: '',
  logo_url: '',
  primary_color: '#dc2626',
  secondary_color: '#b91c1c',
  show_about: true,
  show_services: true,
  show_pricing: true,
  show_gallery: false,
  show_testimonials: true,
  show_blog: true,
  show_contact: true,
  show_faq: true,
})

export const useWebsiteStore = defineStore('tenantWebsite', {
  state: () => ({
    config: defaultConfig(),
    loaded: false,
    loading: false,
  }),

  getters: {
    siteName: (s) => s.config.site_name || s.config.company_name || 'Aqua Clean Pool',
    tagline: (s) => s.config.tagline || '',
    phone: (s) => s.config.phone || '',
    email: (s) => s.config.email || '',
    address: (s) => s.config.address || '',
    logoUrl: (s) => s.config.logo_url || '',
    primaryColor: (s) => s.config.primary_color || '#dc2626',
    secondaryColor: (s) => s.config.secondary_color || '#b91c1c',

    showAbout: (s) => !!s.config.show_about,
    showServices: (s) => !!s.config.show_services,
    showPricing: (s) => !!s.config.show_pricing,
    showGallery: (s) => !!s.config.show_gallery,
    showTestimonials: (s) => !!s.config.show_testimonials,
    showBlog: (s) => !!s.config.show_blog,
    showContact: (s) => !!s.config.show_contact,
    showFaq: (s) => !!s.config.show_faq,

    phoneHref: (s) => {
      const p = (s.config.phone || '').replace(/\D/g, '')
      return p ? `tel:${p}` : '#'
    },
  },

  actions: {
    async fetchWebsite() {
      if (this.loading) return this.config
      this.loading = true
      try {
        const data = await tenantWebsiteApi.getWebsite()
        this.config = { ...defaultConfig(), ...data }
        this.loaded = true
      } catch (e) {
        console.error('Failed to load website config', e)
        this.config = defaultConfig()
      } finally {
        this.loading = false
      }
      return this.config
    },
  },
})
