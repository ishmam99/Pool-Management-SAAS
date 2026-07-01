<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto w-full">
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Tenant List</h1>
          <p class="text-slate-500 mt-1">Manage platform tenants and companies.</p>
        </div>
        <router-link to="/admin/tenants/create" class="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
          <i class="ri-building-add-line"></i> Create Tenant
        </router-link>
      </div>

      <div class="mb-4 rounded-2xl bg-white border border-slate-200 p-4 w-full">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input v-model="filters.search" type="text" placeholder="Company name" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
          <select v-model="filters.status" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none">
            <option value="">All Statuses</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ formatStatus(s) }}</option>
          </select>
          <select v-model="filters.domain_mode" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none">
            <option value="">All Domain Modes</option>
            <option value="subdomain">Subdomain</option>
            <option value="custom">Custom</option>
          </select>
          <button type="button" class="w-full rounded-xl bg-slate-900 text-white text-sm font-semibold" @click="fetchTenants">Apply</button>
        </div>
      </div>

      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse space-y-3"><div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-5 py-3 text-left">Company</th>
                <th class="px-5 py-3 text-left">Legal Name</th>
                <th class="px-5 py-3 text-left">Status</th>
                <th class="px-5 py-3 text-left">Domain</th>
                <th class="px-5 py-3 text-left">Marketplace</th>
                <th class="px-5 py-3 text-left">Phone</th>
                <th class="px-5 py-3 text-left">Email</th>
                <th class="px-5 py-3 text-left">Created</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-slate-50">
                <td class="px-5 py-4 font-medium">{{ tenant.company_name || tenant.name }}</td>
                <td class="px-5 py-4">{{ tenant.legal_name || '—' }}</td>
                <td class="px-5 py-4"><span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusBadgeClass(tenant.status)">{{ formatStatus(tenant.status) }}</span></td>
                <td class="px-5 py-4 capitalize">{{ tenant.domain_mode || '—' }}</td>
                <td class="px-5 py-4">{{ tenant.marketplace_opt_in ? 'Yes' : 'No' }}</td>
                <td class="px-5 py-4">{{ tenant.phone || '—' }}</td>
                <td class="px-5 py-4">{{ tenant.email || '—' }}</td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(tenant.created_at) }}</td>
                <td class="px-5 py-4 text-right flex flex-wrap justify-end gap-2">
                  <router-link :to="`/admin/tenants/${tenant.id}`" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="View tenant">
                    <i class="ri-eye-line text-lg"></i>
                  </router-link>
                  <router-link :to="`/admin/tenants/${tenant.id}/edit`" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-sky-600 hover:bg-slate-50" aria-label="Edit tenant">
                    <i class="ri-pencil-line text-lg"></i>
                  </router-link>
                  <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-red-600 hover:bg-slate-50" @click="removeTenant(tenant)" aria-label="Delete tenant">
                    <i class="ri-delete-bin-line text-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatDate, formatStatus, statusBadgeClass } from '../../utils/formatters.js'

const loading = ref(true)
const tenants = ref([])
const statusOptions = ['trial', 'active', 'past_due', 'suspended', 'cancelled']
const filters = reactive({ search: '', status: '', domain_mode: '' })

const fetchTenants = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.domain_mode) params.domain_mode = filters.domain_mode
    const res = await adminApi.getTenants(params)
    let list = normalizeList(res)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((t) => (t.company_name || t.name || '').toLowerCase().includes(q))
    }
    tenants.value = list
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error', text: getApiErrorMessage(e) })
  } finally {
    loading.value = false
  }
}

const removeTenant = async (tenant) => {
  const c = await Swal.fire({ icon: 'warning', title: 'Delete Tenant?', text: tenant.company_name, showCancelButton: true, confirmButtonColor: '#dc2626' })
  if (!c.isConfirmed) return
  try {
    await adminApi.deleteTenant(tenant.id)
    await fetchTenants()
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Delete Failed', text: getApiErrorMessage(e) })
  }
}

onMounted(fetchTenants)
</script>
