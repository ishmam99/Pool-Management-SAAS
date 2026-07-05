<template>
  <section v-if="items.length" class="py-16 bg-slate-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
      <div class="space-y-3">
        <details v-for="(faq, i) in items.slice(0, 5)" :key="faq.id || i" class="bg-white rounded-lg border border-slate-200 group">
          <summary class="px-5 py-4 cursor-pointer font-medium text-slate-900 list-none flex justify-between items-center">
            {{ faq.question }}
            <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="px-5 pb-4 text-slate-600 text-sm leading-relaxed prose-website" v-html="faq.answer" />
        </details>
      </div>
      <div class="text-center mt-6">
        <router-link to="/provider-website/faq" class="text-sm font-semibold" :style="{ color: 'var(--pw-primary)' }">
          View all FAQs →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi, normalizeList } from '../../../../../services/tenantWebsiteApi.js'

const items = ref([])

onMounted(async () => {
  try {
    const data = await tenantWebsiteApi.getFaqs()
    items.value = normalizeList(data)
  } catch (e) {
    console.error(e)
  }
})
</script>
