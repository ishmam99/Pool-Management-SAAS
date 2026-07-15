<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-indigo-50/30 p-4 md:p-8">
    <div class="">
      <!-- Header Section -->
      <div class="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-8 shadow-2xl shadow-emerald-500/20 text-white transition-all hover:shadow-emerald-500/30">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <i class="ri-building-2-line"></i>
              Tenant List
            </h1>
            <p class="mt-2 max-w-2xl text-white/80 font-medium">Manage platform tenants, view company details, and take action from a fresh new admin panel.</p>
          </div>
          <router-link to="/admin/tenants/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white shadow-lg ring-1 ring-white/30 hover:bg-white/30 hover:ring-white/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <i class="ri-building-add-line text-lg"></i> Create Tenant
          </router-link>
        </div>

       
      </div>

      <!-- Filter Section -->
      <div class="mb-6 rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/60 p-6 shadow-xl shadow-slate-200/50 transition-all hover:shadow-slate-300/60">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Search company..." 
              class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:bg-white hover:border-slate-300"
            />
          </div>
          <div class="relative">
            <select 
              v-model="filters.status" 
              class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:bg-white hover:border-slate-300 cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              <option v-for="s in statusOptions" :key="s" :value="s">{{ formatStatus(s) }}</option>
            </select>
            <i class="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
          <div class="relative">
            <select 
              v-model="filters.domain_mode" 
              class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:bg-white hover:border-slate-300 cursor-pointer appearance-none"
            >
              <option value="">All Domain Modes</option>
              <option value="subdomain">🌐 Subdomain</option>
              <option value="custom">🔗 Custom</option>
            </select>
            <i class="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
          <button 
            type="button" 
            class="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-slate-800 hover:to-cyan-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            @click="fetchTenants"
          >
            <i class="ri-filter-3-line mr-2"></i>Apply Filters
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden transition-all hover:shadow-slate-300/60">
        <!-- Loading State -->
        <div v-if="loading" class="p-8">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center gap-4 animate-pulse">
              <div class="h-14 w-14 rounded-2xl bg-slate-200"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-slate-200 rounded-full w-1/4"></div>
                <div class="h-3 bg-slate-200 rounded-full w-1/6"></div>
              </div>
              <div class="h-8 w-20 bg-slate-200 rounded-full"></div>
              <div class="h-8 w-24 bg-slate-200 rounded-xl"></div>
              <div class="h-8 w-16 bg-slate-200 rounded-full"></div>
              <div class="h-10 w-32 bg-slate-200 rounded-xl"></div>
              <div class="h-10 w-32 bg-slate-200 rounded-xl"></div>
              <div class="h-10 w-32 bg-slate-200 rounded-xl"></div>
              <div class="flex gap-2">
                <div class="h-12 w-12 bg-slate-200 rounded-xl"></div>
                <div class="h-12 w-12 bg-slate-200 rounded-xl"></div>
                <div class="h-12 w-12 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="tenants.length === 0" class="py-20 text-center">
          <div class="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-cyan-100 flex items-center justify-center ring-1 ring-slate-200/50">
            <i class="ri-building-4-line text-4xl text-slate-400"></i>
          </div>
          <h3 class="mt-4 text-xl font-semibold text-slate-700">No tenants found</h3>
          <p class="mt-2 text-sm text-slate-500">Try changing your filters or create a new tenant.</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="sticky top-0 bg-slate-900 text-slate-100">
                <th class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider">Company</th>
                <th class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider">Status</th>
                <th class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider">Domain</th>
                <th class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider">Marketplace</th>
                <th class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider">Contact</th>
                <th class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider">Created</th>
                <th class="px-5 py-4 text-right font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100/80">
              <tr 
                v-for="tenant in tenants" 
                :key="tenant.id" 
                class="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200 even:bg-slate-50/30"
              >
                <!-- Company Column -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <!-- Logo or Placeholder -->
                    <div class="flex-shrink-0">
                      <img
                        v-if="tenant.logo_path"
                        :src="buildImageUrl(tenant.logo_path)"
                        alt="Company logo"
                        class="h-13 w-13 rounded-xl border border-slate-200/80 bg-white object-contain p-1.5 shadow-sm"
                      />
                      <div
                        v-else
                        class="flex h-13 w-13 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-base font-bold text-white shadow-sm ring-1 ring-white/20"
                      >
                        {{ (tenant.company_name || tenant.name)?.charAt(0)?.toUpperCase() }}
                      </div>
                    </div>
                    <!-- Company Info -->
                    <div class="min-w-0 flex-1">
                      <div class="font-semibold text-slate-900 truncate">{{ tenant.company_name || tenant.name }}</div>
                      <div class="text-xs text-slate-400 font-medium">ID #{{ tenant.id }}</div>
                      <div v-if="tenant.legal_name" class="text-xs text-slate-500 truncate">{{ tenant.legal_name }}</div>
                    </div>
                  </div>
                </td>

                <!-- Status Badge -->
                <td class="px-5 py-4">
                  <span 
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                    :class="statusBadgeClass(tenant.status)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current opacity-60"></span>
                    {{ formatStatus(tenant.status) }}
                  </span>
                </td>

                <!-- Domain -->
                <td class="px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium ring-1 ring-slate-200/50">
                    <i class="ri-global-line text-slate-400 text-xs"></i>
                    {{ tenant.domain_mode || 'subdomain' }}
                  </span>
                </td>

                <!-- Marketplace -->
                <td class="px-5 py-4">
                  <span 
                    :class="[
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                      tenant.marketplace_opt_in 
                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/50' 
                        : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/50'
                    ]"
                  >
                    <i :class="tenant.marketplace_opt_in ? 'ri-check-line' : 'ri-close-line'" class="text-sm"></i>
                    {{ tenant.marketplace_opt_in ? 'Enabled' : 'Disabled' }}
                  </span>
                </td>

                <!-- Contact -->
                <td class="px-5 py-4">
                  <div class="space-y-1">
                    <div v-if="tenant.phone" class="flex items-center gap-1.5 text-slate-600 text-xs">
                      <i class="ri-phone-line text-slate-400"></i>
                      <span>{{ tenant.phone }}</span>
                    </div>
                    <div v-if="tenant.email" class="flex items-center gap-1.5 text-slate-600 text-xs">
                      <i class="ri-mail-line text-slate-400"></i>
                      <span class="truncate max-w-[120px]">{{ tenant.email }}</span>
                    </div>
                    <span v-if="!tenant.phone && !tenant.email" class="text-slate-400 text-xs">—</span>
                  </div>
                </td>

                <!-- Created Date -->
                <td class="px-5 py-4">
                  <div class="flex flex-col">
                    <span class="text-slate-700 text-xs font-medium">{{ formatDate(tenant.created_at) }}</span>
                    <span class="text-slate-400 text-[10px]">{{ getRelativeTime(tenant.created_at) }}</span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-5 py-4 text-right">
                  <div class="flex flex-wrap justify-end gap-1.5">
                    <router-link 
                      :to="`/admin/tenants/${tenant.id}`" 
                      class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm hover:bg-slate-200 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 group"
                      aria-label="View tenant"
                      title="View Details"
                    >
                      <i class="ri-eye-line text-base group-hover:scale-110 transition-transform"></i>
                    </router-link>
                    <router-link 
                      :to="`/admin/tenants/${tenant.id}/edit`" 
                      class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group"
                      aria-label="Edit tenant"
                      title="Edit Tenant"
                    >
                      <i class="ri-pencil-line text-base group-hover:scale-110 transition-transform"></i>
                    </router-link>
                    <button 
                      type="button" 
                      class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md hover:from-rose-600 hover:to-red-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group"
                      @click="removeTenant(tenant)" 
                      aria-label="Delete tenant"
                      title="Delete Tenant"
                    >
                      <i class="ri-delete-bin-line text-base group-hover:scale-110 transition-transform"></i>
                    </button>
                  </div>
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

const buildImageUrl = (path) => {
  if (!path) return ''
  return `${import.meta.env.VITE_BASE_URL}/storage/${path}`
}

// Helper function for relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return 'Today'
}

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
    await Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: getApiErrorMessage(e),
      background: '#fff',
      confirmButtonColor: '#0d9488'
    })
  } finally {
    loading.value = false
  }
}

const removeTenant = async (tenant) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Delete Tenant?',
    html: `Are you sure you want to delete <strong>${tenant.company_name || tenant.name}</strong>?<br><small class="text-slate-500">This action cannot be undone.</small>`,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    background: '#fff',
    customClass: {
      confirmButton: 'rounded-xl px-6 py-2.5',
      cancelButton: 'rounded-xl px-6 py-2.5'
    }
  })
  
  if (!result.isConfirmed) return
  
  try {
    await adminApi.deleteTenant(tenant.id)
    await Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Tenant has been removed.',
      timer: 1500,
      showConfirmButton: false,
      background: '#fff'
    })
    await fetchTenants()
  } catch (e) {
    await Swal.fire({ 
      icon: 'error', 
      title: 'Delete Failed', 
      text: getApiErrorMessage(e),
      background: '#fff',
      confirmButtonColor: '#0d9488'
    })
  }
}

onMounted(fetchTenants)
</script>

<style scoped>
/* Smooth scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* H-13 utility for exact 52px */
.h-13 {
  height: 52px;
}
.w-13 {
  width: 52px;
}
</style>