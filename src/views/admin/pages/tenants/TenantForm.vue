<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto w-full">
      <router-link :to="isEdit ? `/admin/tenants/${route.params.id}` : '/admin/tenants'" class="inline-flex items-center gap-2 text-teal-600 text-sm font-medium mb-4"><i class="ri-arrow-left-line"></i> Back</router-link>
      <h1 class="text-3xl font-bold text-slate-900 mb-6">{{ isEdit ? 'Edit Tenant' : 'Create Tenant' }}</h1>

      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full" @submit.prevent="submit">
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
          <input v-model="form.company_name" type="text" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Legal Name</label>
          <input v-model="form.legal_name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">EIN</label>
          <input v-model="form.ein" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option value="trial">Trial</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Domain Mode</label>
          <select v-model="form.domain_mode" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option value="subdomain">Subdomain</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="w-full">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input v-model="form.marketplace_opt_in" :true-value="1" :false-value="0" type="checkbox" class="rounded" />
            Marketplace Opt-in
          </label>
        </div>
        <div class="flex gap-3 pt-2 w-full">
          <button type="submit" :disabled="submitting" class="flex-1 rounded-xl bg-teal-600 text-white py-3 text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">{{ submitting ? 'Saving...' : (isEdit ? 'Update Tenant' : 'Create Tenant') }}</button>
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
const isEdit = computed(() => !!route.params.id && route.path.includes('/edit'))

const defaultForm = () => ({
  company_name: '',
  legal_name: '',
  ein: '',
  status: 'trial',
  domain_mode: 'subdomain',
  marketplace_opt_in: 0,
})
const form = reactive(defaultForm())
const resetForm = () => Object.assign(form, defaultForm())

const loadTenant = async () => {
  if (!isEdit.value) return
  try {
    const tenant = await adminApi.getTenant(route.params.id)
    Object.assign(form, {
      company_name: tenant.company_name || tenant.name || '',
      legal_name: tenant.legal_name || '',
      ein: tenant.ein || '',
      status: tenant.status || 'trial',
      domain_mode: tenant.domain_mode || 'subdomain',
      marketplace_opt_in: tenant.marketplace_opt_in ? 1 : 0,
    })
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Load Failed', text: getApiErrorMessage(e) })
  }
}

const submit = async () => {
  submitting.value = true
  try {
    const payload = { ...form, marketplace_opt_in: Number(form.marketplace_opt_in) }
    if (isEdit.value) {
      await adminApi.updateTenant(route.params.id, payload)
    } else {
      await adminApi.createTenant(payload)
    }
    await Swal.fire({ icon: 'success', title: isEdit.value ? 'Tenant Updated' : 'Tenant Created', timer: 2000, showConfirmButton: false })
    router.push('/admin/tenants')
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Save Failed', text: getApiErrorMessage(e) })
  } finally {
    submitting.value = false
  }
}

onMounted(loadTenant)
</script>
