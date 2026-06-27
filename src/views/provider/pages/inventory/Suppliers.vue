<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p class="text-slate-500 mt-1">Manage your supplier contacts and create new vendors.</p>
        </div>
        <button @click="fetchSuppliers" class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh Suppliers</button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Add Supplier</h2>
          <div class="space-y-4">
            <input v-model="form.name" type="text" placeholder="Name" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input v-model="form.contact_name" type="text" placeholder="Contact Name" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input v-model="form.email" type="email" placeholder="Email" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input v-model="form.phone" type="tel" placeholder="Phone" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input v-model="form.address" type="text" placeholder="Address" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input v-model="form.tax_id" type="text" placeholder="Tax ID" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <button @click="createSupplier" :disabled="submitting" class="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">{{ submitting ? 'Saving...' : 'Create Supplier' }}</button>
          </div>
        </div>

        <div class="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Supplier List</h2>
              <p class="text-sm text-slate-500">All active suppliers in the inventory system.</p>
            </div>
            <span class="text-sm text-slate-500">{{ suppliers.length }} suppliers</span>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="h-20 rounded-3xl bg-slate-100 animate-pulse"></div>
          </div>
          <div v-else>
            <div v-if="suppliers.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No suppliers found.
            </div>
            <div v-else class="space-y-3">
              <div v-for="supplier in suppliers" :key="supplier.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p class="text-sm text-slate-500">{{ supplier.contact_name }}</p>
                    <p class="text-lg font-semibold text-slate-900">{{ supplier.name }}</p>
                  </div>
                  <div class="text-sm text-slate-700">{{ supplier.phone }}</div>
                </div>
                <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                  <div>Email: {{ supplier.email }}</div>
                  <div>Address: {{ supplier.address }}</div>
                  <div>Tax ID: {{ supplier.tax_id }}</div>
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
const suppliers = ref([])
const form = ref({ name: '', contact_name: '', email: '', phone: '', address: '', tax_id: '' })

const fetchSuppliers = async () => {
  loading.value = true
  try {
    suppliers.value = await providerApi.getSuppliers()
  } catch (error) {
    console.error('Supplier fetch error:', error)
  } finally {
    loading.value = false
  }
}

const createSupplier = async () => {
  submitting.value = true
  try {
    await providerApi.createSupplier(form.value)
    form.value = { name: '', contact_name: '', email: '', phone: '', address: '', tax_id: '' }
    await fetchSuppliers()
  } catch (error) {
    console.error('Create supplier error:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchSuppliers)
</script>
