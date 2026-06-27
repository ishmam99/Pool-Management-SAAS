<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Purchase Orders</h1>
          <p class="text-slate-500 mt-1">Create and review purchase orders for inventory restock.</p>
        </div>
        <button @click="fetchPurchaseOrders" class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh Orders</button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">New Purchase Order</h2>
          <div class="space-y-4">
            <input v-model.number="form.supplier_id" type="number" min="1" placeholder="Supplier ID" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <div class="grid grid-cols-3 gap-4">
              <input v-model.number="item.quantity" type="number" min="1" placeholder="Quantity" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model.number="item.unit_price" type="number" step="0.01" min="0" placeholder="Unit Price" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input v-model.number="item.inventory_id" type="number" min="1" placeholder="Inventory ID" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <input v-model="form.delivery_date" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <textarea v-model="form.notes" placeholder="Notes" rows="3" class="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
            <button @click="createPurchaseOrder" :disabled="submitting" class="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">{{ submitting ? 'Creating...' : 'Create Purchase Order' }}</button>
          </div>
        </div>

        <div class="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Purchase Orders</h2>
              <p class="text-sm text-slate-500">Filtered by status.</p>
            </div>
            <select v-model="filters.status" @change="fetchPurchaseOrders" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="received">Received</option>
            </select>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-24 rounded-3xl bg-slate-100 animate-pulse"></div>
          </div>

          <div v-else>
            <div v-if="orders.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No purchase orders found for this status.
            </div>
            <div v-else class="space-y-4">
              <div v-for="order in orders" :key="order.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p class="text-sm text-slate-500">Order #{{ order.id }} • Supplier {{ order.supplier_id }}</p>
                    <p class="text-lg font-semibold text-slate-900">Delivery {{ order.delivery_date }}</p>
                  </div>
                  <div class="text-sm text-slate-700">Status: {{ order.status || filters.status }}</div>
                </div>
                <div class="mt-3 text-sm text-slate-600">
                  <p>{{ order.notes }}</p>
                  <p class="mt-3 font-semibold">Items:</p>
                  <ul class="list-disc ml-5 mt-2 space-y-1">
                    <li v-for="item in order.items || []" :key="item.inventory_id">
                      Inventory #{{ item.inventory_id }} • Qty {{ item.quantity }} @ ${{ item.unit_price }}
                    </li>
                  </ul>
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
const orders = ref([])
const filters = ref({ status: 'pending' })
const form = ref({ supplier_id: 1, delivery_date: '', notes: '', items: [] })
const item = ref({ inventory_id: 1, quantity: 50, unit_price: 25.0 })

const fetchPurchaseOrders = async () => {
  loading.value = true
  try {
    orders.value = await providerApi.getPurchaseOrders(filters.value)
  } catch (error) {
    console.error('Purchase order fetch error:', error)
  } finally {
    loading.value = false
  }
}

const createPurchaseOrder = async () => {
  if (!form.value.delivery_date) {
    return
  }

  submitting.value = true
  try {
    const payload = {
      supplier_id: form.value.supplier_id,
      items: [ { ...item.value } ],
      delivery_date: form.value.delivery_date,
      notes: form.value.notes
    }
    await providerApi.createPurchaseOrder(payload)
    form.value = { supplier_id: 1, delivery_date: '', notes: '', items: [] }
    item.value = { inventory_id: 1, quantity: 50, unit_price: 25.0 }
    await fetchPurchaseOrders()
  } catch (error) {
    console.error('Create purchase order error:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchPurchaseOrders)
</script>
