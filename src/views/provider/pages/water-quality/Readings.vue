<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Water Quality Readings</h1>
          <p class="text-slate-500 mt-1">Review pool chemistry logs by pool and date range.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div class="space-y-4">
          <div class="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Work Order</label>
            <input v-model.number="filters.work_order_id" type="number" placeholder="Work Order ID" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div class="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Pool</label>
            <select v-model="filters.pool_id" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="">All Pools</option>
              <option v-for="pool in poolOptions" :key="pool.id" :value="pool.id">{{ pool.label }}</option>
            </select>
          </div>

          <div class="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Date Range</label>
            <div class="space-y-3">
              <input v-model="filters.date_from" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model="filters.date_to" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <button @click="fetchReadings" class="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh Readings</button>
        </div>

        <div class="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Readings Log</h2>
              <p class="text-sm text-slate-500">{{ readings.length }} records found</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">pH</span>
              <span class="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">Free Chlorine</span>
              <span class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">Alkalinity</span>
            </div>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="h-24 rounded-3xl bg-slate-100 animate-pulse"></div>
          </div>

          <div v-else>
            <div v-if="readings.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No readings available for the selected filters.
            </div>
            <div v-else class="space-y-4">
              <div v-for="reading in readings" :key="reading.id" class="rounded-3xl border border-slate-200 p-4 shadow-sm bg-white">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p class="text-sm text-slate-500">{{ reading.pool.label }}</p>
                    <p class="text-lg font-semibold text-slate-900">{{ formatDateTime(reading.recorded_at) }}</p>
                  </div>
                  <div class="flex flex-wrap gap-3">
                    <div class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">pH {{ reading.ph }}</div>
                    <div class="rounded-2xl bg-sky-50 px-3 py-2 text-sm text-sky-700">Free Cl {{ reading.free_chlorine }}</div>
                    <div class="rounded-2xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700">Total Cl {{ reading.total_chlorine }}</div>
                    <div class="rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Alk {{ reading.alkalinity }}</div>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-600">
                  <div>CyA: <span class="font-semibold text-slate-900">{{ reading.cya }}</span></div>
                  <div>Clarity: <span class="font-semibold text-slate-900">{{ reading.water_clarity }}</span></div>
                  <div>Recorded at: <span class="font-semibold text-slate-900">{{ formatDateTime(reading.recorded_at) }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { providerApi } from '../../../../services/providerApi.js'

const loading = ref(false)
const readings = ref([])
const poolOptions = ref([
  { id: 1, label: 'Main Pool' },
  { id: 2, label: 'Indoor Pool 2' },
  { id: 3, label: 'Jacuzzi' }
])

const filters = ref({
  work_order_id: null,
  pool_id: '',
  date_from: '2024-01-01',
  date_to: '2024-01-31'
})

const formatDateTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const fetchReadings = async () => {
  loading.value = true
  try {
    const data = await providerApi.getWaterQualityReadings(filters.value)
    readings.value = data ?? []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReadings)
</script>
