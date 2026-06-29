<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/40 p-4 md:p-8">
    <!-- Loading -->
    <div v-if="loading" class="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div class="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div class="h-64 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <!-- Back + Header -->
      <div class="mb-8">
        <router-link
          to="/customer/pools"
          class="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-4 transition"
        >
          <i class="ri-arrow-left-line"></i>
          Back to My Pools
        </router-link>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg">
              <i class="ri-history-line"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Service History</h1>
              <p class="text-gray-500">{{ poolLabel }}</p>
            </div>
          </div>
          <div v-if="history.length" class="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100">
            {{ history.length }} service {{ history.length === 1 ? 'record' : 'records' }}
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="history.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div class="text-5xl mb-4">📋</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No service history yet</h3>
        <p class="text-gray-500 mb-6">Completed visits for this pool will appear here.</p>
        <router-link
          to="/customer/pools"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
        >
          <i class="ri-drop-line"></i>
          View All Pools
        </router-link>
      </div>

      <!-- Pool Summary -->
      <div class="mb-6 grid gap-4 md:grid-cols-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="text-xs uppercase tracking-wide text-gray-500 mb-2">Pool</div>
          <div class="text-lg font-semibold text-gray-900">{{ poolInfo.value?.label || poolInfo.value?.name || 'Pool' }}</div>
          <p class="text-sm text-gray-500 mt-1">{{ poolInfo.value?.service_address || 'Address not available' }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="text-xs uppercase tracking-wide text-gray-500 mb-2">Volume</div>
          <div class="text-lg font-semibold text-gray-900">{{ poolInfo.value?.volume_gallons ? `${poolInfo.value.volume_gallons} gal` : 'Not specified' }}</div>
          <p class="text-sm text-gray-500 mt-1">{{ poolInfo.value?.chemical_type || 'Chemical type not provided' }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="text-xs uppercase tracking-wide text-gray-500 mb-2">Season</div>
          <div class="text-lg font-semibold text-gray-900">{{ poolInfo.value?.season || 'Season not specified' }}</div>
          <p class="text-sm text-gray-500 mt-1">Dog: {{ poolInfo.value?.has_dog === true ? 'Yes' : poolInfo.value?.has_dog === false ? 'No' : 'Unknown' }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="text-xs uppercase tracking-wide text-gray-500 mb-2">Equipment</div>
          <div class="text-lg font-semibold text-gray-900">{{ poolInfo.value?.equipment?.length || 0 }} items</div>
          <p class="text-sm text-gray-500 mt-1">Gate: {{ poolInfo.value?.gate_code || 'N/A' }}</p>
        </div>
      </div>

      <div v-if="poolInfo.value?.equipment?.length" class="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Pool Equipment</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="equip in poolInfo.value.equipment"
            :key="equip.id"
            class="rounded-2xl border border-gray-100 p-4 bg-gray-50"
          >
            <div class="flex items-center justify-between gap-3 mb-2">
              <div>
                <p class="font-semibold text-gray-900">{{ equip.brand }} {{ equip.model }}</p>
                <p class="text-xs uppercase tracking-wide text-gray-500">{{ equip.type }}</p>
              </div>
              <span class="text-xs font-semibold text-gray-600">Installed</span>
            </div>
            <p class="text-sm text-gray-600">Serial: {{ equip.serial_number }}</p>
            <p class="text-sm text-gray-600 mt-1">Installed: {{ formatDate(equip.install_date) }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <article
          v-for="(entry, index) in history"
          :key="entry.id || index"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
        >
          <div class="flex flex-col md:flex-row">
            <div class="md:w-36 bg-gradient-to-b from-teal-500 to-cyan-600 p-4 flex md:flex-col items-center justify-center text-white shrink-0">
              <div class="text-2xl font-bold">{{ formatDay(entry.started_at || entry.finished_at || entry.created_at) }}</div>
              <div class="text-sm opacity-90">{{ formatMonthYear(entry.started_at || entry.finished_at || entry.created_at) }}</div>
            </div>
            <div class="flex-1 p-5 md:p-6">
              <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ entry.type || entry.service || 'Pool Service' }}
                  </h3>
                  <p v-if="entry.technician?.name || entry.technician_name" class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <i class="ri-user-line"></i>
                    {{ entry.technician?.name || entry.technician_name }}
                  </p>
                </div>
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="statusBadgeClass(entry.status)"
                >
                  {{ formatStatus(entry.status || 'completed') }}
                </span>
              </div>

              <p v-if="entry.notes" class="text-sm text-gray-600 mb-4 leading-relaxed">
                {{ entry.notes }}
              </p>

              <div v-if="entry.checklist?.length" class="mb-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Checklist</h4>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <li v-for="item in entry.checklist" :key="item" class="flex items-center gap-2">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs">✓</span>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div
                v-if="hasReadings(entry)"
                class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100"
              >
                <div v-if="entry.chlorine != null" class="text-center p-2 bg-blue-50 rounded-lg">
                  <div class="text-xs text-blue-600 font-medium">Chlorine</div>
                  <div class="text-sm font-bold text-gray-800">{{ entry.chlorine }}</div>
                </div>
                <div v-if="entry.ph != null" class="text-center p-2 bg-purple-50 rounded-lg">
                  <div class="text-xs text-purple-600 font-medium">pH</div>
                  <div class="text-sm font-bold text-gray-800">{{ entry.ph }}</div>
                </div>
                <div v-if="entry.alkalinity != null" class="text-center p-2 bg-teal-50 rounded-lg">
                  <div class="text-xs text-teal-600 font-medium">Alkalinity</div>
                  <div class="text-sm font-bold text-gray-800">{{ entry.alkalinity }}</div>
                </div>
                <div v-if="entry.temperature != null" class="text-center p-2 bg-orange-50 rounded-lg">
                  <div class="text-xs text-orange-600 font-medium">Temp</div>
                  <div class="text-sm font-bold text-gray-800">{{ entry.temperature }}°</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatStatus, statusBadgeClass, formatDate } from '../utils/formatters.js'

const route = useRoute()
const loading = ref(true)
const poolInfo = ref(null)
const history = ref([])

const normalizePool = (pool = {}) => ({
  ...pool,
  label: pool.label || pool.name || 'Pool',
  service_address: pool.service_address || 'Address not available',
  volume_gallons: pool.volume_gallons || pool.volume || '',
  chemical_type: pool.chemical_type || pool.chemicalType || pool.chemical || '',
  season: pool.season || pool.seasonal || '',
  gate_code: pool.gate_code || pool.gateCode || 'N/A',
  has_dog: pool.has_dog ?? pool.hasDog ?? null,
  equipment: pool.equipment || pool.equipments || [],
})

const poolLabel = computed(() => {
  return poolInfo.value?.label || poolInfo.value?.name || 'Your Pool' 
})

const formatDay = (dateStr) => {
  if (!dateStr) return '--'
  return new Date(dateStr).getDate()
}

const formatMonthYear = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const hasReadings = (entry) =>
  entry.chlorine != null || entry.ph != null || entry.alkalinity != null || entry.temperature != null

const fetchHistory = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getPoolHistory(route.params.id)
    const pool = data?.pool || data
    poolInfo.value = normalizePool(pool)
    history.value = data?.work_orders?.data || data?.work_orders || []
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Load History',
      text: getApiErrorMessage(error),
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchHistory)
</script>
