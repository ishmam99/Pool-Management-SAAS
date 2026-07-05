<template>
  <section v-if="areas.length" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">Service Areas</h2>
      <p class="text-slate-600 mb-8 max-w-2xl mx-auto">We proudly serve the following areas and surrounding communities.</p>
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="(area, i) in areas"
          :key="area.id || i"
          class="px-5 py-2.5 rounded-full text-sm font-medium border border-slate-200 bg-slate-50 text-slate-700"
        >
          {{ area.name || area.city || area.title || area }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi, normalizeList } from '../../../../../services/tenantWebsiteApi.js'

const areas = ref([])

onMounted(async () => {
  try {
    const data = await tenantWebsiteApi.getServiceAreas()
    areas.value = normalizeList(data)
  } catch (e) {
    console.error(e)
  }
})
</script>
