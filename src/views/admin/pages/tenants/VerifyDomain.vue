<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-3xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-slate-900 mb-6">Verify Domain</h1>

      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full mb-6" @submit.prevent="verify">
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
          <select v-model.number="tenantId" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option :value="null" disabled>Select tenant</option>
            <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.company_name || t.name }} (#{{ t.id }})</option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Domain</label>
          <input v-model="domain" type="text" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
        </div>
        <button type="submit" :disabled="loading" class="w-full rounded-xl bg-teal-600 text-white py-3 text-sm font-semibold disabled:opacity-50">{{ loading ? 'Checking...' : 'Verify Domain' }}</button>
      </form>

      <div v-if="result" class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full">
        <h2 class="text-lg font-semibold">Verification Result</h2>
        <p class="text-sm"><span class="text-slate-500">Status:</span> <span class="font-semibold capitalize">{{ result.verification_status || result.status || '—' }}</span></p>
        <p v-if="result.ssl_status" class="text-sm"><span class="text-slate-500">SSL:</span> {{ result.ssl_status }}</p>
        <div v-if="Array.isArray(result) && result.length" class="text-sm">
          <p class="font-medium mb-2">Result Payload</p>
          <pre class="bg-slate-50 p-4 rounded-xl overflow-x-auto text-xs">{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
        <div v-else-if="result.dns_records?.length" class="text-sm">
          <p class="font-medium mb-2">DNS Records</p>
          <pre class="bg-slate-50 p-4 rounded-xl overflow-x-auto text-xs">{{ JSON.stringify(result.dns_records, null, 2) }}</pre>
        </div>
        <pre v-else class="bg-slate-50 p-4 rounded-xl overflow-x-auto text-xs">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'

const route = useRoute()
const loading = ref(false)
const tenants = ref([])
const tenantId = ref(route.query.tenant_id ? Number(route.query.tenant_id) : null)
const domain = ref(route.query.domain || '')
const result = ref(null)

const loadTenants = async () => {
  try {
    tenants.value = normalizeList(await adminApi.getTenants())
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error Loading Tenants', text: getApiErrorMessage(e) })
  }
}

const verify = async () => {
  loading.value = true
  result.value = null
  try {
    result.value = await adminApi.verifyTenantDomain(tenantId.value, domain.value)
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Verification Failed', text: getApiErrorMessage(e) })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTenants()
  if (tenantId.value && domain.value) verify()
})
</script>
