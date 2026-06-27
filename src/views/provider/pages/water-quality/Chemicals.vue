<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Chemical Usage</h1>
          <p class="text-slate-500 mt-1">Track chemical additions and usage summary for your pools.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div class="space-y-4">
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

          <button @click="fetchChemicals" class="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh Chemical Usage</button>
        </div>

        <div class="xl:col-span-2 space-y-4">
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <p class="text-sm text-slate-500">Usage Summary</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div class="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                <p class="text-xs uppercase tracking-wide text-slate-500">Total Chemicals</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ summary.total_items }}</p>
              </div>
              <div class="rounded-3xl bg-sky-50 p-4 text-sm text-sky-700">
                <p class="text-xs uppercase tracking-wide">Volume Used</p>
                <p class="mt-2 text-2xl font-semibold text-sky-900">{{ summary.total_volume }}</p>
              </div>
              <div class="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">
                <p class="text-xs uppercase tracking-wide">Sodium Hypochlorite</p>
                <p class="mt-2 text-2xl font-semibold text-emerald-900">{{ summary.hypochlorite || 0 }}</p>
              </div>
              <div class="rounded-3xl bg-orange-50 p-4 text-sm text-orange-700">
                <p class="text-xs uppercase tracking-wide">Other Chemicals</p>
                <p class="mt-2 text-2xl font-semibold text-orange-900">{{ summary.other || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-slate-900">Chemical Additions</h2>
              <span class="text-sm text-slate-500">{{ chemicals.length }} records</span>
            </div>
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="h-20 rounded-3xl bg-slate-100 animate-pulse"></div>
            </div>
            <div v-else>
              <div v-if="chemicals.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No chemical additions found for selected filters.
              </div>
              <div v-else class="space-y-3">
                <div v-for="item in chemicals" :key="item.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p class="text-sm text-slate-500">{{ item.pool.label }}</p>
                      <p class="text-base font-semibold text-slate-900">{{ item.chemical_name }}</p>
                    </div>
                    <div class="text-sm text-slate-700">Added {{ item.amount }} {{ item.unit }}</div>
                  </div>
                  <p class="mt-3 text-sm text-slate-500">Recorded at {{ formatDateTime(item.recorded_at) }}</p>
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
const chemicals = ref([])
const summary = ref({ total_items: 0, total_volume: 0, hypochlorite: 0, other: 0 })
const poolOptions = ref([
  { id: 1, label: 'Main Pool' },
  { id: 2, label: 'Indoor Pool 2' },
  { id: 3, label: 'Jacuzzi' }
])

const filters = ref({
  pool_id: '',
  date_from: '2024-01-01',
  date_to: '2024-01-31'
})

const formatDateTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const fetchChemicals = async () => {
  loading.value = true
  try {
    const data = await providerApi.getChemicalUsage(filters.value)
    chemicals.value = data ?? []
    const summaryData = await providerApi.getChemicalUsageSummary(filters.value)
    summary.value = summaryData ?? {}
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchChemicals)
</script>
