<template>
  <section class="relative py-20 lg:py-28 overflow-hidden">
    <div
      class="absolute inset-0 opacity-90"
      :style="{ background: `linear-gradient(135deg, var(--pw-primary), var(--pw-secondary))` }"
    />
    <div class="absolute inset-0 bg-black/20" />
    <div class="container relative z-10 mx-auto px-4 text-center text-white">
      <img
        v-if="websiteStore.logoUrl"
        :src="websiteStore.logoUrl"
        :alt="websiteStore.siteName"
        class="w-24 h-24 mx-auto mb-6 rounded-full object-cover bg-white p-1 shadow-xl"
      />
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{{ websiteStore.siteName }}</h1>
      <p v-if="websiteStore.tagline" class="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
        {{ websiteStore.tagline }}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          v-if="websiteStore.phone"
          :href="websiteStore.phoneHref"
          class="px-8 py-3.5 rounded-xl font-semibold bg-white transition-all hover:scale-105 hover:shadow-xl"
          :style="{ color: 'var(--pw-primary)' }"
        >
          Call Now
        </a>
        <router-link
          v-if="websiteStore.showContact"
          to="/provider-website/contact"
          class="px-8 py-3.5 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all"
        >
          Contact Us
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useWebsiteStore } from '../../../store/websiteStore.js'

const websiteStore = useWebsiteStore()
</script>
