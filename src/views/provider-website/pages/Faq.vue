<template>
  <div class="min-h-screen bg-white">
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 py-20 lg:py-28">
      <div class="relative z-10 container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p class="text-lg text-white/90 max-w-2xl mx-auto">Find answers to common questions about our pool services.</p>
      </div>
    </section>

    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4 max-w-3xl">
        <div v-if="loading" class="text-center text-slate-500">Loading…</div>
        <div v-else-if="items.length" class="space-y-3">
          <details v-for="(faq, i) in items" :key="faq.id || i" class="bg-white rounded-xl border border-slate-200 group">
            <summary class="px-5 py-4 cursor-pointer font-medium text-slate-900 list-none flex justify-between items-center gap-4">
              {{ faq.question }}
              <span class="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div class="px-5 pb-4 text-slate-600 leading-relaxed prose-website" v-html="faq.answer" />
          </details>
        </div>
        <p v-else class="text-center text-slate-500">No FAQs available.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi, normalizeList } from '../../../services/tenantWebsiteApi.js'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await tenantWebsiteApi.getFaqs()
    items.value = normalizeList(data)
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
