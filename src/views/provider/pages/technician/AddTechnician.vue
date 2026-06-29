<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Add Technician</h1>
          <p class="text-slate-500 mt-1">Create a new technician account for your team.</p>
        </div>
        <router-link to="/provider/technicians" class="rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition">Technician List</router-link>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm max-w-2xl mx-auto">
        <div class="space-y-4">
          <input v-model="form.name" type="text" placeholder="Full Name" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input v-model="form.email" type="email" placeholder="Email" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input v-model="form.phone" type="tel" placeholder="Phone" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <div class="grid grid-cols-2 gap-4">
            <select v-model="form.is_active" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            <input v-model="form.tenant_id" type="text" placeholder="Tenant ID" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <button @click="createTechnician" :disabled="submitting" class="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">{{ submitting ? 'Creating...' : 'Create Technician' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { providerApi } from '../../../../services/providerApi.js'

const submitting = ref(false)
const form = ref({ tenant_id: '1', name: '', email: '', phone: '', role: 'technician', is_active: '1' })

const createTechnician = async () => {
  submitting.value = true
  try {
    await providerApi.createTechnician({ ...form.value })
    form.value = { tenant_id: '1', name: '', email: '', phone: '', role: 'technician', is_active: '1' }
  } catch (error) {
    console.error('Create technician error:', error)
  } finally {
    submitting.value = false
  }
}
</script>
