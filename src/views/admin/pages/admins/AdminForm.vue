<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto w-full">
      <router-link to="/admin/admins" class="inline-flex items-center gap-2 text-violet-600 text-sm font-medium mb-4"><i class="ri-arrow-left-line"></i> Back</router-link>
      <h1 class="text-3xl font-bold text-slate-900 mb-6">{{ isEdit ? 'Edit Admin' : 'Create Admin' }}</h1>

      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full" @submit.prevent="submit">
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input v-model="form.name" type="text" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">{{ isEdit ? 'New Password (optional)' : 'Password' }}</label>
          <input v-model="form.password" type="password" :required="!isEdit" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
          <input v-model="form.password_confirmation" type="password" :required="!isEdit && !!form.password" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select v-model="form.role" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40">
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2 w-full">
          <button type="submit" :disabled="submitting" class="flex-1 rounded-xl bg-violet-600 text-white py-3 text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">{{ submitting ? 'Saving...' : (isEdit ? 'Update Admin' : 'Create Admin') }}</button>
          <button type="button" class="px-6 rounded-xl border border-slate-200 text-slate-600 py-3 text-sm" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, getApiErrorMessage } from '../../../../services/adminApi.js'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const isEdit = computed(() => !!route.params.id)

const defaultForm = () => ({ name: '', email: '', password: '', password_confirmation: '', role: 'admin' })
const form = reactive(defaultForm())

const resetForm = () => Object.assign(form, defaultForm())

const loadAdmin = async () => {
  if (!isEdit.value) return
  try {
    const admins = await adminApi.getAdmins()
    const list = Array.isArray(admins?.data) ? admins.data : (Array.isArray(admins) ? admins : [])
    const admin = list.find((a) => String(a.id) === String(route.params.id))
    if (admin) {
      form.name = admin.name
      form.email = admin.email
      form.role = admin.role || 'admin'
    }
  } catch (e) {
    console.error(e)
  }
}

const submit = async () => {
  if (form.password && form.password !== form.password_confirmation) {
    await Swal.fire({ icon: 'warning', title: 'Passwords do not match' })
    return
  }
  submitting.value = true
  try {
    const payload = { name: form.name, email: form.email, role: form.role }
    if (form.password) {
      payload.password = form.password
      payload.password_confirmation = form.password_confirmation
    }
    if (isEdit.value) {
      await adminApi.updateAdmin(route.params.id, payload)
    } else {
      await adminApi.createAdmin(payload)
    }
    await Swal.fire({ icon: 'success', title: isEdit.value ? 'Admin Updated' : 'Admin Created', timer: 2000, showConfirmButton: false })
    router.push('/admin/admins')
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Save Failed', text: getApiErrorMessage(e) })
  } finally {
    submitting.value = false
  }
}

onMounted(loadAdmin)
</script>
