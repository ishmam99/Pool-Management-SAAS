<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Technicians</h1>
          <p class="text-slate-500 mt-1">Manage your technician users and add new team members.</p>
        </div>
        <button @click="fetchTechnicians(pagination.current_page)" class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh</button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-semibold text-slate-900 mb-4">Add New Technician</h2>
            <p class="text-slate-500 text-sm">Create a new technician from a dedicated page.</p>
          </div>
          <router-link to="/provider/technicians/new" class="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Create Technician</router-link>
        </div>

        <div class="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Technician Directory</h2>
              <p class="text-sm text-slate-500">Showing active technicians in the system.</p>
            </div>
            <span class="text-sm text-slate-500">{{ pagination.total }} technicians</span>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="h-20 rounded-3xl bg-slate-100 animate-pulse"></div>
          </div>

          <div v-else>
            <div v-if="technicians.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No technicians found.
            </div>
            <div v-else class="space-y-4">
              <div v-for="tech in technicians" :key="tech.id" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p class="text-sm text-slate-500">{{ tech.role }}</p>
                    <p class="text-lg font-semibold text-slate-900">{{ tech.name }}</p>
                  </div>
                  <span :class="tech.is_active === '1' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'" class="rounded-full px-3 py-1 text-sm font-semibold">
                    {{ tech.is_active === '1' ? 'Active' : 'Inactive' }}</span>
                </div>
                <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                  <div>Email: {{ tech.email }}</div>
                  <div>Phone: {{ tech.phone }}</div>
                  <div>Last login: {{ formatDateTime(tech.last_login_at) }}</div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-2">
              <button @click="fetchTechnicians(pagination.current_page - 1)" :disabled="pagination.current_page <= 1" class="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition">Previous</button>
              <button @click="fetchTechnicians(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page" class="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition">Next</button>
              <span class="text-sm text-slate-500">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
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
const technicians = ref([])
const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 15 })

const formatDateTime = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const fetchTechnicians = async (page = 1) => {
  if (page < 1) return
  loading.value = true
  try {
    const response = await providerApi.getTechnicians({ role: 'technician', page })
    technicians.value = response.data ?? []
    pagination.value = {
      current_page: response.current_page ?? page,
      last_page: response.last_page ?? 1,
      total: response.total ?? technicians.value.length,
      per_page: response.per_page ?? 15
    }
  } catch (error) {
    console.error('Technician fetch error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchTechnicians(1))
</script>
