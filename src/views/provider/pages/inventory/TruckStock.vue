<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Truck Stock</h1>
          <p class="text-slate-500 mt-1">Monitor stock on trucks and update quantities.</p>
        </div>
        <button @click="fetchTruckStock" class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh Stock</button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Filter by Technician</h2>
          <input v-model.number="filters.technician_id" type="number" min="1" placeholder="Technician ID" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <button @click="fetchTruckStock" class="mt-4 w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Load Stock</button>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Truck Stock Items</h2>
            <p class="text-sm text-slate-500">Update stock quantities for assigned items.</p>
          </div>
          <span class="text-sm text-slate-500">{{ stock.length }} records</span>
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-24 rounded-3xl bg-slate-100 animate-pulse"></div>
        </div>

        <div v-else>
          <div v-if="stock.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No truck stock found. Try a different technician.
          </div>
          <div v-else class="space-y-4">
            <div v-for="item in stock" :key="item.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <p class="text-sm text-slate-500">{{ item.material_name || item.name }}</p>
                  <p class="text-lg font-semibold text-slate-900">{{ item.sku || item.code }}</p>
                </div>
                <div class="space-y-2">
                  <p class="text-sm text-slate-700">Current Qty: <span class="font-semibold">{{ item.quantity }}</span></p>
                  <input v-model.number="updates[item.id]" type="number" min="0" placeholder="New quantity" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <button @click="updateStock(item.id)" :disabled="updating[item.id]" class="h-12 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">{{ updating[item.id] ? 'Saving...' : 'Save Quantity' }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { providerApi } from '../../../../services/providerApi.js'

const loading = ref(false)
const stock = ref([])
const filters = ref({ technician_id: null })
const updates = ref({})
const updating = ref({})

const fetchTruckStock = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.value.technician_id) params.technician_id = filters.value.technician_id
    stock.value = await providerApi.getTruckStock(params)
    stock.value.forEach(item => {
      updates.value[item.id] = item.quantity
    })
  } catch (error) {
    console.error('Truck stock fetch error:', error)
  } finally {
    loading.value = false
  }
}

const updateStock = async (stockId) => {
  updating.value[stockId] = true
  try {
    await providerApi.updateTruckStock(stockId, { quantity: updates.value[stockId] })
    await fetchTruckStock()
  } catch (error) {
    console.error('Truck stock update error:', error)
  } finally {
    updating.value[stockId] = false
  }
}

fetchTruckStock()
</script>
