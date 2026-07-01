<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-indigo-50 p-4 md:p-8">
    <div class="w-full">
      <div class="mb-6 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 p-8 shadow-2xl text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-extrabold tracking-tight">Tenant List</h1>
            <p class="mt-2 max-w-2xl text-cyan-100/90">Manage platform tenants, view company details, and take action from a fresh new admin panel.</p>
          </div>
          <router-link to="/admin/tenants/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/25 hover:bg-white/30 transition">
            <i class="ri-building-add-line"></i> Create Tenant
          </router-link>
        </div>
      </div>

      <div class="mb-4 rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 p-5 w-full shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input v-model="filters.search" type="text" placeholder="Company name" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20" />
          <select v-model="filters.status" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20">
            <option value="">All Statuses</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ formatStatus(s) }}</option>
          </select>
          <select v-model="filters.domain_mode" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20">
            <option value="">All Domain Modes</option>
            <option value="subdomain">Subdomain</option>
            <option value="custom">Custom</option>
          </select>
          <button type="button" class="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-slate-800 hover:to-cyan-800 transition" @click="fetchTenants">Apply</button>
        </div>
      </div>

      <div class="rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 shadow-xl overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse space-y-3"><div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-2xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-900 text-xs uppercase text-slate-100">
              <tr>
                <th class="px-5 py-4 text-left">Company</th>
                <th class="px-5 py-4 text-left">Legal Name</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-left">Domain</th>
                <th class="px-5 py-4 text-left">Marketplace</th>
                <th class="px-5 py-4 text-left">Phone</th>
                <th class="px-5 py-4 text-left">Email</th>
                <th class="px-5 py-4 text-left">Created</th>
                <th class="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-4 font-semibold text-slate-900">{{ tenant.company_name || tenant.name }}</td>
                <td class="px-5 py-4 text-slate-700">{{ tenant.legal_name || '—' }}</td>
                <td class="px-5 py-4"><span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(tenant.status)">{{ formatStatus(tenant.status) }}</span></td>
                <td class="px-5 py-4 capitalize text-slate-700">{{ tenant.domain_mode || '—' }}</td>
                <td class="px-5 py-4 text-slate-700">{{ tenant.marketplace_opt_in ? 'Yes' : 'No' }}</td>
                <td class="px-5 py-4 text-slate-700">{{ tenant.phone || '—' }}</td>
                <td class="px-5 py-4 text-slate-700">{{ tenant.email || '—' }}</td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(tenant.created_at) }}</td>
                <td class="px-5 py-4 text-right flex flex-wrap justify-end gap-2">
                  <router-link :to="`/admin/tenants/${tenant.id}`" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 shadow-sm hover:scale-[1.02] transition-transform" aria-label="View tenant">
                    <i class="ri-eye-line text-lg"></i>
                  </router-link>
                  <router-link :to="`/admin/tenants/${tenant.id}/edit`" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:scale-[1.02] transition-transform" aria-label="Edit tenant">
                    <i class="ri-pencil-line text-lg"></i>
                  </router-link>
                  <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md hover:scale-[1.02] transition-transform" @click="removeTenant(tenant)" aria-label="Delete tenant">
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
