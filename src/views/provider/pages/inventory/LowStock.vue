<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Low Stock Alerts</h1>
          <p class="text-slate-500 mt-1">Monitor low inventory alerts and recommended reorder levels.</p>
        </div>
        <button @click="fetchLowStock" class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh Alerts</button>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Alerts</h2>
            <p class="text-sm text-slate-500">Items below reorder level across the inventory network.</p>
          </div>
          <span class="text-sm text-slate-500">{{ alerts.length }} alerts</span>
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-24 rounded-3xl bg-slate-100 animate-pulse"></div>
        </div>

        <div v-else>
          <div v-if="alerts.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No low stock alerts right now.
          </div>
          <div v-else class="space-y-4">
            <div v-for="alert in alerts" :key="alert.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p class="text-sm text-slate-500">{{ alert.category || 'Inventory Item' }}</p>
                  <p class="text-lg font-semibold text-slate-900">{{ alert.name }}</p>
                </div>
                <div class="text-sm text-slate-700">Deficit: {{ alert.deficit }}</div>
              </div>
              <div class="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-slate-600">
                <div>Current Qty: {{ alert.current_quantity }}</div>
                <div>Reorder Level: {{ alert.reorder_level }}</div>
                <div>Recommended Order: {{ alert.recommended_order }}</div>
                <div>Supplier: {{ alert.supplier?.name || 'Unknown' }}</div>
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
const alerts = ref([])

const fetchLowStock = async () => {
  loading.value = true
  try {
    alerts.value = await providerApi.getLowStockAlerts()
  } catch (error) {
    console.error('Low stock fetch error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchLowStock)
</script>
