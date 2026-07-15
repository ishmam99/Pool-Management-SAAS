<template>
  <section v-if="serviceAreas.length > 0" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-10">
          <span
            class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4 shadow-lg shadow-sky-500/25">
            Service Areas
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">We Proudly Serve These Communities</h2>
          <p class="text-slate-600 text-lg">We provide reliable pool maintenance and repair services throughout these
            locations.</p>
        </div>

        <!-- Info Banner -->
        <!-- <div class="mb-8 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/50 rounded-2xl px-6 py-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-slate-700">
          Not sure if you're in our service area? Submit the form above and our team will confirm availability.
        </p>
      </div> -->

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
            <div class="h-8 bg-slate-200 rounded-lg w-3/4 mb-2"></div>
            <div class="h-5 bg-slate-200 rounded-lg w-1/2 mb-3"></div>
            <div class="h-4 bg-slate-200 rounded-lg w-1/3"></div>
            <div class="mt-4 h-6 bg-slate-200 rounded-full w-1/4"></div>
          </div>
        </div>

        <!-- Service Area Cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="area in serviceAreas" :key="area.id || area.city"
            class="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-sky-200">
            <div class="space-y-2">
              <h3 class="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">
                {{ area.city }}
              </h3>
              <p class="text-base text-slate-600 font-medium">{{ area.state }}</p>
              <span
                class="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full border border-slate-200">
                ZIP {{ area.zip_code }}
              </span>
              <div class="flex items-center gap-2 pt-2">
                <span class="relative flex h-2.5 w-2.5">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-medium text-emerald-600">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi, normalizeList, getApiErrorMessage } from '../../../../services/tenantWebsiteApi.js'

const serviceAreas = ref([])
const loading = ref(true)

const fetchServiceAreas = async () => {
  loading.value = true
  try {
    const data = await tenantWebsiteApi.getServiceAreas()

    // Filter active areas and sort by order_index
    const activeAreas = data
      .filter(area => area.is_active === true)
      .sort((a, b) => {
        const orderA = parseInt(a.order_index) || 0
        const orderB = parseInt(b.order_index) || 0
        return orderA - orderB
      })

    serviceAreas.value = activeAreas
  } catch (error) {
    console.error('Failed to fetch service areas:', error)
    // Gracefully handle error - leave serviceAreas as empty array
    serviceAreas.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchServiceAreas()
})


</script>
