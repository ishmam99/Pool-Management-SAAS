<template>
  <div class="min-h-screen bg-white">
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 py-20 lg:py-28">
      <div class="relative z-10 container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Customer Testimonials</h1>
        <p class="text-lg text-white/90 max-w-2xl mx-auto">Real reviews from customers who trust our pool care.</p>
      </div>
    </section>

    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div v-if="loading" class="text-center text-slate-500">Loading…</div>
        <div v-else-if="items.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="(t, i) in items" :key="t.id || i" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center gap-3 mb-4">
              <img v-if="t.customer_photo_url" :src="t.customer_photo_url" :alt="t.customer_name" class="w-14 h-14 rounded-full object-cover" />
              <div v-else class="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                {{ (t.customer_name || '?').charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ t.customer_name }}</p>
                <div class="flex text-amber-400 text-sm">
                  <i v-for="n in Math.min(5, t.rating || 0)" :key="n" class="ri-star-fill"></i>
                </div>
              </div>
            </div>
            <p class="text-slate-600 leading-relaxed italic">"{{ t.content }}"</p>
            <p v-if="t.company_response" class="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">{{ t.company_response }}</p>
          </article>
        </div>
        <p v-else class="text-center text-slate-500">No testimonials yet.</p>
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
    const data = await tenantWebsiteApi.getTestimonials()
    items.value = normalizeList(data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');
.container { max-width: 1280px; }
</style>
