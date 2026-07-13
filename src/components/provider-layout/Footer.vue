<template>
  <footer class="bg-slate-900 text-white">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <img 
              :src="logoUrl || '/src/assets/logo.png'" 
              :alt="siteName" 
              class="w-10 h-10 rounded-lg" 
            />
            <span class="text-2xl font-bold text-white">{{ siteName }}</span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed mb-3">
            {{ tagline || 'Smart pool management software for modern pool businesses.' }}
          </p>
        </div>

        <!-- Navigation Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">Pages</h4>
          <ul class="space-y-2.5">
            <li><RouterLink to="/provider-website" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Home</RouterLink></li>
            <li v-if="showAbout"><RouterLink to="/provider-website/about" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">About</RouterLink></li>
            <li v-if="showServices"><RouterLink to="/provider-website/features" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Services</RouterLink></li>
            <li v-if="showPricing"><RouterLink to="/provider-website/pricing" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Pricing</RouterLink></li>
            <li v-if="showTestimonials"><RouterLink to="/provider-website/testimonials" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Testimonials</RouterLink></li>
            <li v-if="showBlog"><RouterLink to="/provider-website/blogs" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Blog</RouterLink></li>
            <li v-if="showFaq"><RouterLink to="/provider-website/faq" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">FAQ</RouterLink></li>
            <li v-if="showContact"><RouterLink to="/provider-website/join-us" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Contact</RouterLink></li>
            <li v-if="showPortalLogin"><RouterLink to="/provider-website/login" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Customer Login</RouterLink></li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div>
          <h4 class="text-white font-semibold mb-4">Contact</h4>
          <ul class="space-y-2.5 text-slate-400 text-sm">
            <li v-if="address">{{ address }}</li>
            <li v-if="phone">
              <span class="text-white font-medium">Phone:</span><br />
              <a :href="phoneHref" class="hover:text-ocean-blue transition-colors">{{ phone }}</a>
            </li>
            <li v-if="email">
              <span class="text-white font-medium">Email:</span><br />
              <a :href="`mailto:${email}`" class="hover:text-ocean-blue transition-colors">{{ email }}</a>
            </li>
          </ul>
        </div>

        <!-- Social Media -->
        <div>
          <h4 class="text-white font-semibold mb-4">Follow Us</h4>
          <div class="flex items-center gap-4">
            <a 
              v-if="facebookUrl" 
              :href="facebookUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-slate-400 hover:text-ocean-blue transition-colors" 
              aria-label="Facebook"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              v-if="instagramUrl" 
              :href="instagramUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-slate-400 hover:text-ocean-blue transition-colors" 
              aria-label="Instagram"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              v-if="twitterUrl" 
              :href="twitterUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-slate-400 hover:text-ocean-blue transition-colors" 
              aria-label="Twitter/X"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              v-if="youtubeUrl" 
              :href="youtubeUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-slate-400 hover:text-ocean-blue transition-colors" 
              aria-label="YouTube"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <p class="text-slate-500 text-xs mt-4" v-if="hasSocialLinks">
            Connect with us on social media
          </p>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-slate-400 text-sm">
          &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
        </p>

        <!-- Legal Links -->
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors">Privacy Policy</a>
          <span class="text-slate-700">|</span>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors">Terms of Service</a>
          <span class="text-slate-700">|</span>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWebsiteStore } from '../../views/provider-website/store/websiteStore'

const websiteStore = useWebsiteStore()

// Computed properties from store
const siteName = computed(() => websiteStore.siteName)
const tagline = computed(() => websiteStore.tagline)
const logoUrl = computed(() => websiteStore.logoUrl)
const phone = computed(() => websiteStore.phone)
const email = computed(() => websiteStore.email)
const address = computed(() => websiteStore.address)
const phoneHref = computed(() => websiteStore.phoneHref)

// Social media
const facebookUrl = computed(() => websiteStore.facebookUrl)
const instagramUrl = computed(() => websiteStore.instagramUrl)
const twitterUrl = computed(() => websiteStore.twitterUrl)
const youtubeUrl = computed(() => websiteStore.youtubeUrl)

// Section visibility
const showAbout = computed(() => websiteStore.showAbout)
const showServices = computed(() => websiteStore.showServices)
const showPricing = computed(() => websiteStore.showPricing)
const showTestimonials = computed(() => websiteStore.showTestimonials)
const showBlog = computed(() => websiteStore.showBlog)
const showFaq = computed(() => websiteStore.showFaq)
const showContact = computed(() => websiteStore.showContact)
const showPortalLogin = computed(() => websiteStore.showPortalLogin)

// Check if any social links exist
const hasSocialLinks = computed(() => {
  return !!(facebookUrl.value || instagramUrl.value || twitterUrl.value || youtubeUrl.value)
})

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())

// Load website data on mount
onMounted(async () => {
  if (!websiteStore.loaded) {
    await websiteStore.fetchWebsite()
  }
})
</script>