<template>
  <section v-if="page" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-8">{{ page.title || 'Pricing' }}</h2>
      <div class="max-w-3xl mx-auto prose-website" v-html="page.content" />
      <div class="text-center mt-8">
        <router-link
          to="/provider-website/pricing"
          class="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
          :style="{ background: `linear-gradient(to right, var(--pw-primary), var(--pw-secondary))` }"
        >
          View Pricing Details
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi } from '../../../../../services/tenantWebsiteApi.js'

const page = ref(null)

onMounted(async () => {
  try {
    page.value = await tenantWebsiteApi.getPage('pricing')
  } catch (e) {
    console.error(e)
  }
})
</script>
