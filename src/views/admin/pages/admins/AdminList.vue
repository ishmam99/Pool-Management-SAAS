<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 p-4 md:p-8">
    <div class="w-full">
      <div class="mb-6 rounded-[2rem] bg-gradient-to-r from-indigo-700 via-violet-700 to-sky-600 p-8 shadow-2xl text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.24em] text-sky-200/80">Administrator Hub</p>
            <h1 class="mt-3 text-4xl font-extrabold tracking-tight">Admin List</h1>
            <p class="mt-2 max-w-2xl text-slate-100/90">Manage platform administrators and keep your team organized with quick search controls.</p>
          </div>
          <router-link to="/admin/admins/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 hover:bg-white/25 transition">
            <i class="ri-user-add-line"></i> Create Admin
          </router-link>
        </div>
      </div>

      <div class="mb-4 rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 p-5 shadow-xl">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full">
          <input v-model="search.name" type="text" placeholder="Search name" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />
          <input v-model="search.email" type="text" placeholder="Search email" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />
          <select v-model="search.role" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20">
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
          <button type="button" class="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-violet-600 hover:to-fuchsia-600 transition" @click="applySearch">Search</button>
        </div>
      </div>

      <div class="rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 shadow-xl overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse space-y-3"><div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-2xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-900 text-xs uppercase text-slate-100">
              <tr>
                <th class="px-5 py-3 text-left">Name</th>
                <th class="px-5 py-3 text-left">Email</th>
                <th class="px-5 py-3 text-left">Role</th>
                <th class="px-5 py-3 text-left">Created</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-4 font-medium text-slate-900">{{ admin.name }}</td>
                <td class="px-5 py-4 text-slate-600">{{ admin.email }}</td>
                <td class="px-5 py-4">
                  <span :class="roleBadgeClass(admin.role)" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
                    {{ (admin.role || '').replace(/_/g, ' ') }}
                  </span>
                </td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(admin.created_at) }}</td>
                <td class="px-5 py-4 text-right">
                  <div class="inline-flex items-center justify-end gap-2">
                    <router-link :to="`/admin/admins/${admin.id}/edit`" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:scale-[1.02] transition-transform" aria-label="Edit admin">
                      <i class="ri-pencil-line text-lg"></i>
                    </router-link>
                    <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md hover:scale-[1.02] transition-transform" @click="removeAdmin(admin)" aria-label="Delete admin">
                      <i class="ri-delete-bin-line text-lg"></i>
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
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatDate } from '../../utils/formatters.js'

const loading = ref(true)
const admins = ref([])
const search = ref({ name: '', email: '', role: '' })

const filteredAdmins = computed(() => {
  return admins.value.filter((a) => {
    if (search.value.name && !a.name?.toLowerCase().includes(search.value.name.toLowerCase())) return false
    if (search.value.email && !a.email?.toLowerCase().includes(search.value.email.toLowerCase())) return false
    if (search.value.role && (a.role || '').toLowerCase() !== search.value.role) return false
    return true
  })
})

const fetchAdmins = async () => {
  loading.value = true
  try {
    const res = await adminApi.getAdmins()
    admins.value = normalizeList(res)
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error', text: getApiErrorMessage(e) })
  } finally {
    loading.value = false
  }
}

const applySearch = () => {}

const removeAdmin = async (admin) => {
  const c = await Swal.fire({ icon: 'warning', title: 'Delete Admin?', text: admin.email, showCancelButton: true, confirmButtonColor: '#dc2626' })
  if (!c.isConfirmed) return
  try {
    await adminApi.deleteAdmin(admin.id)
    await Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false })
    await fetchAdmins()
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Delete Failed', text: getApiErrorMessage(e) })
  }
}

const roleBadgeClass = (role) => {
  const normalized = (role || '').toLowerCase()
  if (normalized === 'super_admin') return 'bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white'
  if (normalized === 'admin') return 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white'
  if (normalized === 'support') return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
  return 'bg-slate-200 text-slate-700'
}

onMounted(fetchAdmins)
</script>
