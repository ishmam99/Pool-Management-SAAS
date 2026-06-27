<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Warehouse Inventory</h1>
          <p class="text-slate-500 mt-1">View and add inventory items in the warehouse.</p>
        </div>
        <button @click="fetchWarehouse" class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh List</button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="space-y-4">
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900 mb-4">Add Inventory Item</h2>
            <div class="space-y-4">
              <input v-model="form.name" type="text" placeholder="Name" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model="form.sku" type="text" placeholder="SKU" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model="form.category" type="text" placeholder="Category" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <div class="grid grid-cols-2 gap-4">
                <input v-model.number="form.quantity" type="number" min="0" placeholder="Quantity" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <input v-model="form.unit" type="text" placeholder="Unit" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <input v-model="form.reorder_level" type="number" min="0" placeholder="Reorder Level" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model.number="form.supplier_id" type="number" min="1" placeholder="Supplier ID" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model="form.location" type="text" placeholder="Location" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <button @click="createItem" :disabled="submitting" class="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">{{ submitting ? 'Adding...' : 'Add Inventory' }}</button>
            </div>
          </div>
        </div>

        <div class="xl:col-span-2 space-y-4">
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Warehouse Items</h2>
                <p class="text-sm text-slate-500">Showing latest inventory from the warehouse.</p>
              </div>
              <span class="text-sm text-slate-500">{{ inventory.length }} items</span>
            </div>

            <div v-if="loading" class="space-y-3">
              <div v-for="i in 4" :key="i" class="h-20 rounded-3xl bg-slate-100 animate-pulse"></div>
            </div>
            <div v-else>
              <div v-if="inventory.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No warehouse inventory found.
              </div>
              <div v-else class="space-y-3">
                <div v-for="item in inventory" :key="item.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p class="text-sm text-slate-500">{{ item.category || 'Uncategorized' }}</p>
                      <p class="text-lg font-semibold text-slate-900">{{ item.name }}</p>
                    </div>
                    <div class="text-sm text-slate-700">{{ item.quantity }} {{ item.unit }}</div>
                  </div>
                  <div class="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>SKU: {{ item.sku }}</div>
                    <div>Reorder at: {{ item.reorder_level }}</div>
                    <div>Supplier: {{ item.supplier_id }}</div>
                    <div>Location: {{ item.location }}</div>
                  </div>
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
const submitting = ref(false)
const inventory = ref([])
const form = ref({
  name: '',
  sku: '',
  category: '',
  quantity: 0,
  unit: 'lbs',
  reorder_level: 0,
  supplier_id: 1,
  location: ''
})

const fetchWarehouse = async () => {
  loading.value = true
  try {
    inventory.value = await providerApi.getWarehouseInventory({ per_page: 20 })
  } catch (error) {
    console.error('Warehouse fetch error:', error)
  } finally {
    loading.value = false
  }
}

const createItem = async () => {
  submitting.value = true
  try {
    await providerApi.createWarehouseInventory(form.value)
    form.value = { name: '', sku: '', category: '', quantity: 0, unit: 'lbs', reorder_level: 0, supplier_id: 1, location: '' }
    await fetchWarehouse()
  } catch (error) {
    console.error('Create inventory error:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchWarehouse)
</script>
