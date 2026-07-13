import { defineStore } from 'pinia'
import { tenantWebsiteApi } from '../../../services/tenantWebsiteApi.js'

const defaultConfig = () => ({
  // Basic info
  id: null,
  tenant_id: null,
  subdomain: '',
  custom_domain: '',
  site_name: 'Aqua Clean Pool',
  tagline: '',
  
  // Media
  logo: '',
  favicon: '',
  logo_url: '',
  favicon_url: '',
  website_url: '',
  
  // Contact info
  phone: '',
  email: '',
  address: '',
  
  // Social media
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  
  // Colors
  primary_color: '#dc2626',
  secondary_color: '#b91c1c',
  
  
  show_about: true,
  show_services: true,
  show_pricing: true,
  show_gallery: true,
  show_testimonials: true,
  show_blog: true,
  show_contact: true,
  show_faq: true,
  show_portal_login: true,
  
  // SEO & Analytics
  meta_description: null,
  google_analytics_id: null,
  
  // Status
  is_published: true,
  
  // Dates
  created_at: null,
  updated_at: null,
})

export const useWebsiteStore = defineStore('tenantWebsite', {
  state: () => ({
    config: defaultConfig(),
    loaded: false,
    loading: false,
  }),

  getters: {
    // Existing getters (unchanged)
    siteName: (s) => s.config.site_name || s.config.company_name || 'Pool',
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

    // New getters for additional fields
    subdomain: (s) => s.config.subdomain || '',
    customDomain: (s) => s.config.custom_domain || '',
    websiteUrl: (s) => s.config.website_url || '',
    faviconUrl: (s) => s.config.favicon_url || '',
    favicon: (s) => s.config.favicon || '',
    logo: (s) => s.config.logo || '',
    facebookUrl: (s) => s.config.facebook_url || '',
    instagramUrl: (s) => s.config.instagram_url || '',
    twitterUrl: (s) => s.config.twitter_url || '',
    youtubeUrl: (s) => s.config.youtube_url || '',
    metaDescription: (s) => s.config.meta_description || '',
    googleAnalyticsId: (s) => s.config.google_analytics_id || '',
    showPortalLogin: (s) => !!s.config.show_portal_login,
    isPublished: (s) => !!s.config.is_published,
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