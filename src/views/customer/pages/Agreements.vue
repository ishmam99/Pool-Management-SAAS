<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/40 p-4 md:p-8">
    <div v-if="loading" class="max-w-5xl mx-auto animate-pulse space-y-6">
      <div class="h-10 w-56 bg-gray-200 rounded-xl"></div>
      <div v-for="i in 2" :key="i" class="h-40 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else class="mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-file-text-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Service Agreements</h1>
          <p class="text-gray-500">Your active service plans and contract details.</p>
        </div>
      </header>

      <div v-if="agreements.length === 0" class="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <div class="text-5xl mb-4">📋</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No agreements found</h3>
        <p class="text-gray-500">Contact your service provider to set up a service plan.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article v-for="agreement in agreements" :key="agreement.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
          <div class="h-1.5 bg-gradient-to-r from-emerald-400 to-green-500"></div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ agreement.name || agreement.plan_name || `Agreement
                  #${agreement.id}` }}</h2>
                <p v-if="agreement.frequency || agreement.billing_cycle" class="text-sm text-gray-500 mt-1">
                  <span v-if="agreement.frequency">Frequency: {{ agreement.frequency }}</span>
                  <span v-if="agreement.frequency && agreement.billing_cycle"> • </span>
                  <span v-if="agreement.billing_cycle">Billing: {{ agreement.billing_cycle }}</span>
                </p>
                <p v-if="agreement.assigned_technician?.name" class="text-sm text-gray-500 mt-1">Technician: {{
                  agreement.assigned_technician.name }}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(agreement.status)">
                {{ formatStatus(agreement.status || 'active') }}
              </span>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-emerald-600">{{ formatCurrency(agreement.price) }}</span>
                <span class="text-sm text-gray-500">{{ agreement.billing_cycle ? `/ ${agreement.billing_cycle}` : ''
                  }}</span>
              </div>

              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div v-if="agreement.start_date" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Start Date</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ formatDate(agreement.start_date) }}</dd>
                </div>
                <div v-if="agreement.end_date" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">End Date</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ formatDate(agreement.end_date) }}</dd>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Auto Renew</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ agreement.auto_renew ? 'Yes' : 'No' }}</dd>
                </div>
                <div v-if="agreement.pools?.length" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Pools Included</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ agreement.pools.length }}</dd>
                </div>
              </dl>
            </div>

            <div v-if="agreement.pools?.length" class="space-y-3 mb-6">
              <h3 class="text-sm font-semibold text-gray-900">Pools</h3>
              <div class="space-y-2">
                <div v-for="pool in agreement.pools" :key="pool.id"
                  class="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                  <div class="flex items-center justify-between gap-3 mb-1">
                    <p class="font-semibold text-gray-900">{{ pool.label || pool.name || 'Pool' }}</p>
                    <span class="text-xs text-gray-500 uppercase">{{ pool.is_active ? 'Active' : 'Inactive' }}</span>
                  </div>
                  <p class="text-sm text-gray-500">{{ pool.service_address }}</p>
                  <p class="text-sm text-gray-500 mt-1">Volume: {{ pool.volume_gallons ? `${pool.volume_gallons} gal` :
                    'N/A' }} • Chemical: {{ pool.chemical_type || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div v-if="agreement.description" class="text-sm text-gray-600 border-t pt-4 leading-relaxed">
              {{ agreement.description }}
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatCurrency, formatDate, formatStatus, statusBadgeClass } from '../utils/formatters.js'
import { useAuthStore } from '../../../store/AuthStore.js'

const authStore = useAuthStore()

const loading = ref(true)
const agreements = ref([])

const fetchAgreements = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getServiceAgreements()
    agreements.value = Array.isArray(data) ? data : data?.agreements || []
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Agreements', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return

    fetchAgreements()
  }
)


onMounted(fetchAgreements)
</script>
