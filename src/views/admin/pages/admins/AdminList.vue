<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto w-full">
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Admin List</h1>
          <p class="text-slate-500 mt-1">Manage platform administrators.</p>
        </div>
        <router-link to="/admin/admins/create" class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
          <i class="ri-user-add-line"></i> Create Admin
        </router-link>
      </div>

      <div class="mb-4 rounded-2xl bg-white border border-slate-200 p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
          <input v-model="search.name" type="text" placeholder="Search name" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/40" />
          <input v-model="search.email" type="text" placeholder="Search email" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
          <select v-model="search.role" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none">
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
          <button type="button" class="w-full rounded-xl bg-slate-900 text-white text-sm font-semibold" @click="applySearch">Search</button>
        </div>
      </div>

      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse space-y-3"><div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-5 py-3 text-left">Name</th>
                <th class="px-5 py-3 text-left">Email</th>
                <th class="px-5 py-3 text-left">Role</th>
                <th class="px-5 py-3 text-left">Created</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-slate-50">
                <td class="px-5 py-4 font-medium">{{ admin.name }}</td>
                <td class="px-5 py-4">{{ admin.email }}</td>
                <td class="px-5 py-4 capitalize">{{ (admin.role || '').replace(/_/g, ' ') }}</td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(admin.created_at) }}</td>
                <td class="px-5 py-4 text-right flex justify-end gap-2">
                  <router-link :to="`/admin/admins/${admin.id}/edit`" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sky-600 hover:bg-slate-50" aria-label="Edit admin">
                    <i class="ri-pencil-line text-lg"></i>
                  </router-link>
                  <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-600 hover:bg-slate-50" @click="removeAdmin(admin)" aria-label="Delete admin">
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

onMounted(fetchAdmins)
</script>
