<template>
  <div class="min-h-screen bg-white">
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 py-20 lg:py-28">
      <div class="relative z-10 container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
          {{ page?.title || 'Pricing' }}
        </h1>
        <p class="text-lg text-white/90 max-w-2xl mx-auto">Transparent pricing for professional pool care services.</p>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div v-if="loading" class="text-center text-slate-500 py-12">Loading…</div>
        <div v-else-if="page?.content" class="max-w-4xl mx-auto prose-website" v-html="page.content" />
        <p v-else class="text-center text-slate-500 py-12">Pricing information is not available yet.</p>
        <div v-if="websiteStore.showContact" class="text-center mt-10">
          <router-link
            to="/provider-website/join-us"
            class="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Get a Free Quote
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi } from '../../../services/tenantWebsiteApi.js'
import { useWebsiteStore } from '../store/websiteStore.js'

const websiteStore = useWebsiteStore()
const page = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    page.value = await tenantWebsiteApi.getPage('pricing')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container { max-width: 1280px; }
</style>
