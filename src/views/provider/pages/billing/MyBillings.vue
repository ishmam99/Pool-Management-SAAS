<template>
  <div class="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span class="bg-gradient-to-r from-sky-600 to-cyan-500 text-white p-2 rounded-xl shadow-lg shadow-sky-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </span>
            My Billing
          </h1>
          <p class="text-slate-500 mt-1">Manage your subscription and pool usage at a glance</p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="billingData?.subscription_plan" class="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-sm font-bold rounded-full shadow-md shadow-sky-200/50">
            {{ billingData.subscription_plan }}
          </span>
          <button @click="fetchBillings" class="p-2 text-slate-400 hover:text-sky-600 transition-colors" title="Refresh">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="relative">
        <div class="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-sm text-slate-500">Loading your billing info…</p>
      </div>
    </div>

    <!-- Data -->
    <div v-else-if="billingData" class="space-y-6">
      <!-- First row: Plan & Pricing + Pool Usage -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Plan card -->
        <div class="bg-white rounded-2xl shadow-md shadow-slate-200/50 p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
              <h2 class="text-2xl font-bold text-slate-800 mt-1">{{ billingData.billing_model === 'subscription' ? 'Subscription' : 'Pay-as-you-go' }}</h2>
              <p class="text-sm text-slate-500 mt-1">{{ billingData.subscription_plan || 'No plan' }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-sky-200/50">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-100">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Monthly price</span>
              <span class="font-semibold text-slate-800">${{ billingData.subscription_price || '0.00' }}</span>
            </div>
            <div v-if="billingData.per_pool_price" class="flex justify-between text-sm mt-1">
              <span class="text-slate-500">Per extra pool</span>
              <span class="font-semibold text-slate-800">${{ billingData.per_pool_price }}</span>
            </div>
          </div>
        </div>

        <!-- Pool Usage card -->
        <div class="bg-white rounded-2xl shadow-md shadow-slate-200/50 p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Pool Usage</span>
              <h2 class="text-xl font-bold text-slate-800 mt-1">{{ billingData.active_pools }} Active Pools</h2>
            </div>
            <div class="flex gap-4">
              <div class="text-center">
                <span class="block text-sm font-semibold text-slate-700">{{ billingData.billable_pools }}</span>
                <span class="text-xs text-slate-400">Billable</span>
              </div>
              <div class="text-center">
                <span class="block text-sm font-semibold text-emerald-600">{{ billingData.free_pools }}</span>
                <span class="text-xs text-slate-400">Free remaining</span>
              </div>
            </div>
          </div>
          <!-- Progress bar -->
          <div class="mt-4">
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500" :style="{ width: usagePercentage + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>{{ billingData.billable_pools }} billable</span>
              <span>{{ billingData.active_pools }} total</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Second row: Financial summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Estimated next bill -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl shadow-md shadow-amber-200/30 p-6 border border-amber-200/30 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-300 flex items-center justify-center shadow-md shadow-amber-200">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-amber-600">Next Bill</p>
              <p class="text-2xl font-bold text-slate-800">${{ billingData.estimated_next_bill || '0.00' }}</p>
            </div>
          </div>
          <p class="text-xs text-amber-600/70 mt-3">Estimated for next billing cycle</p>
        </div>

        <!-- Pending amount -->
        <div class="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl shadow-md shadow-rose-200/30 p-6 border border-rose-200/30 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-400 to-pink-300 flex items-center justify-center shadow-md shadow-rose-200">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-rose-600">Pending</p>
              <p class="text-2xl font-bold text-slate-800">${{ billingData.pending_amount || '0.00' }}</p>
            </div>
          </div>
          <p class="text-xs text-rose-600/70 mt-3">{{ billingData.pending_amount > 0 ? 'Awaiting payment' : 'All clear' }}</p>
        </div>

        <!-- Current invoice status -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl shadow-md shadow-purple-200/30 p-6 border border-purple-200/30 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-300 flex items-center justify-center shadow-md shadow-purple-200">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-purple-600">Invoice Status</p>
              <p class="text-2xl font-bold text-slate-800">{{ billingData.current_invoice ? 'Active' : 'None' }}</p>
            </div>
          </div>
          <p class="text-xs text-purple-600/70 mt-3">{{ billingData.current_invoice ? 'An invoice is open' : 'No active invoice' }}</p>
        </div>
      </div>

      <!-- Extra: pool breakdown (optional) -->
      <div class="bg-white rounded-2xl shadow-md shadow-slate-200/50 p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-300 flex items-center justify-center shadow-md shadow-emerald-200">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4H4zm4 2v12h8V6H8z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-slate-700">Pool Usage Summary</h3>
            <p class="text-xs text-slate-400">Breakdown of your active and free pools</p>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="block text-2xl font-bold text-slate-800">{{ billingData.active_pools }}</span>
            <span class="text-xs text-slate-500">Active</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="block text-2xl font-bold text-sky-600">{{ billingData.billable_pools }}</span>
            <span class="text-xs text-slate-500">Billable</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="block text-2xl font-bold text-emerald-600">{{ billingData.free_pools }}</span>
            <span class="text-xs text-slate-500">Free</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty / Error -->
    <div v-else class="text-center py-16 bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100">
      <svg class="w-16 h-16 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-slate-700">No billing data available</h3>
      <p class="text-sm text-slate-500">We couldn’t retrieve your billing information. Please try again later.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'
import { useAuthStore } from '../../../../store/AuthStore.js'

const loading = ref(false)
const billingData = ref(null)
const authStore = useAuthStore()
const fetchBillings = async () => {
  loading.value = true
  try {
    let endpoint = '/tenant/my-billing'
    if(authStore.authType === 'admin') {
     endpoint += `?tenant_id=${authStore.tenantId}`
    }
    const res = await api().get(endpoint)
    if (res?.data?.data) {
      billingData.value = res.data.data
    } else {
      billingData.value = null
    }
  } catch (e) {
    console.error('Failed to fetch billings:', e)
    Swal.fire('Error', getApiErrorMessage(e), 'error')
  } finally {
    loading.value = false
  }
}

const getApiErrorMessage = (error) => {
  return error?.response?.data?.message || error.message || 'Something went wrong'
}

// Compute usage percentage for progress bar
const usagePercentage = computed(() => {
  if (!billingData.value) return 0
  const { billable_pools, active_pools } = billingData.value
  if (active_pools === 0) return 0
  return Math.round((billable_pools / active_pools) * 100)
})

onMounted(async () => {
  await fetchBillings()
})
</script>

<style scoped>
/* You can add any custom animations or transitions here */
</style>