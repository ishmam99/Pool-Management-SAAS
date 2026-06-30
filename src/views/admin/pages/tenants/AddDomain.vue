<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-3xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-slate-900 mb-6">Add Custom Domain</h1>
      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full" @submit.prevent="submit">
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
          <select v-model.number="form.tenant_id" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40">
            <option :value="null" disabled>Select tenant</option>
            <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.company_name || t.name }} (#{{ t.id }})</option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Domain Name</label>
          <input v-model="form.domain" type="text" required placeholder="pools.example.com" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40" />
        </div>
        <button type="submit" :disabled="submitting" class="w-full rounded-xl bg-teal-600 text-white py-3 text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">{{ submitting ? 'Adding...' : 'Add Domain' }}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const tenants = ref([])
const form = reactive({ tenant_id: route.query.tenant_id ? Number(route.query.tenant_id) : null, domain: '', type: 'custom' })

const submit = async () => {
  submitting.value = true
  try {
    await adminApi.addTenantDomain(form.tenant_id, { domain: form.domain, domain_name: form.domain, type: form.type })
    await Swal.fire({ icon: 'success', title: 'Domain Added', timer: 2000, showConfirmButton: false })
    router.push(`/admin/tenants/${form.tenant_id}`)
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Failed', text: getApiErrorMessage(e) })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const res = await adminApi.getTenants()
  tenants.value = normalizeList(res)
})
</script>
