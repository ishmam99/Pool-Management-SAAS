<template>
  <section class="py-16 bg-slate-900 text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p class="text-slate-300 mb-8">Contact us today for a free consultation or quote.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-slate-300">
        <a v-if="websiteStore.phone" :href="websiteStore.phoneHref" class="flex items-center gap-2 hover:text-white transition-colors">
          <span class="font-semibold text-white">Phone:</span> {{ websiteStore.phone }}
        </a>
        <a v-if="websiteStore.email" :href="`mailto:${websiteStore.email}`" class="flex items-center gap-2 hover:text-white transition-colors">
          <span class="font-semibold text-white">Email:</span> {{ websiteStore.email }}
        </a>
        <p v-if="websiteStore.address" class="flex items-center gap-2">
          <span class="font-semibold text-white">Address:</span> {{ websiteStore.address }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          v-if="websiteStore.phone"
          :href="websiteStore.phoneHref"
          class="px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
          :style="{ background: `linear-gradient(to right, var(--pw-primary), var(--pw-secondary))` }"
        >
          Call Now
        </a>
        <router-link
          v-if="websiteStore.showContact"
          to="/provider-website/contact"
          class="px-8 py-3.5 rounded-xl font-semibold border-2 border-white/40 hover:bg-white/10 transition-all"
        >
          Send a Message
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useWebsiteStore } from '../../../store/websiteStore.js'

const websiteStore = useWebsiteStore()
</script>
