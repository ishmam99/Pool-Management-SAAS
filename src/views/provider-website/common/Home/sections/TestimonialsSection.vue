<template>
  <section v-if="items.length" class="py-16 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-10">What Our Customers Say</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article v-for="(t, i) in items.slice(0, 3)" :key="i" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div class="flex items-center gap-3 mb-4">
            <img
              v-if="t.customer_photo_url"
              :src="t.customer_photo_url"
              :alt="t.customer_name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div v-else class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" :style="{ background: 'var(--pw-primary)' }">
              {{ (t.customer_name || '?').charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-slate-900">{{ t.customer_name }}</p>
              <p class="text-amber-500 text-sm">{{ renderStars(t.rating) }}</p>
            </div>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed">{{ t.content }}</p>
          <p v-if="t.company_response" class="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500 italic">
            {{ t.company_response }}
          </p>
        </article>
      </div>
      <div class="text-center mt-8">
        <router-link to="/provider-website/testimonials" class="text-sm font-semibold" :style="{ color: 'var(--pw-primary)' }">
          View all testimonials →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi, normalizeList } from '../../../../../services/tenantWebsiteApi.js'
import { renderStars } from '../../../utils/formatters.js'

const items = ref([])

onMounted(async () => {
  try {
    const data = await tenantWebsiteApi.getTestimonials()
    items.value = normalizeList(data)
  } catch (e) {
    console.error(e)
  }
})
</script>
