<template>
  <section v-if="page" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ page.title }}</h2>
        <p class="text-slate-600 text-lg leading-relaxed">{{ excerpt }}</p>
        <router-link
          to="/provider-website/about"
          class="inline-block mt-6 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
          :style="{ background: `linear-gradient(to right, var(--pw-primary), var(--pw-secondary))` }"
        >
          Read More
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { tenantWebsiteApi } from '../../../../../services/tenantWebsiteApi.js'
import { stripHtml } from '../../../utils/formatters.js'

const page = ref(null)
const excerpt = computed(() => stripHtml(page.value?.content, 280))

onMounted(async () => {
  try {
    page.value = await tenantWebsiteApi.getPage('about')
  } catch (e) {
    console.error(e)
  }
})
</script>
