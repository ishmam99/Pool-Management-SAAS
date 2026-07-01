<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 p-4 md:p-8">
    <div class="w-full">
      <div class="mb-6 rounded-[2rem] bg-gradient-to-r from-sky-600 via-indigo-700 to-purple-700 p-8 shadow-2xl text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-extrabold tracking-tight">Tenant Subscriptions</h1>
            <p class="mt-2 max-w-2xl text-sky-100/90">Manage subscriptions with clearer status, plan context, and quick action controls.</p>
          </div>
          <router-link to="/admin/tenant-subscriptions/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/25 hover:bg-white/30 transition">
            <i class="ri-add-circle-line"></i> Create Subscription
          </router-link>
        </div>
      </div>

      <div class="mb-4 rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 p-5 shadow-xl w-full">
        <select v-model="filters.status" class="w-full md:w-64 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" @change="fetchSubs">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 shadow-xl overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse"><div class="h-12 bg-slate-100 rounded-2xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-900 text-xs uppercase text-slate-100">
              <tr>
                <th class="px-5 py-4 text-left">Tenant</th>
                <th class="px-5 py-4 text-left">Plan</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-left">Period</th>
                <th class="px-5 py-4 text-left">Grace Ends</th>
                <th class="px-5 py-4 text-left">Stripe</th>
                <th class="px-5 py-4 text-left">Amount</th>
                <th class="px-5 py-4 text-left">Created</th>
                <th class="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-4">
                  <div class="font-semibold text-slate-900">{{ sub.tenant?.company_name || `#${sub.tenant_id}` }}</div>
                  <div class="text-slate-500 text-xs">{{ sub.tenant?.email || sub.tenant?.phone || 'No contact' }}</div>
                </td>
                <td class="px-5 py-4">
                  <div class="font-semibold text-slate-900">{{ sub.plan?.name || `Plan #${sub.subscription_plan_id}` }}</div>
                  <div class="text-slate-500 text-xs">{{ formatCurrency(sub.plan?.price) }} / {{ sub.plan?.billing_cycle || sub.billing_cycle || '—' }}</div>
                </td>
                <td class="px-5 py-4"><span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusBadgeClass(sub.status)">{{ formatStatus(sub.status) }}</span></td>
                <td class="px-5 py-4">
                  <div class="font-medium text-slate-800">{{ formatDate(sub.current_period_start) }}</div>
                  <div class="text-slate-500 text-xs">to {{ formatDate(sub.current_period_end) }}</div>
                </td>
                <td class="px-5 py-4 text-slate-600">{{ sub.grace_period_ends_at ? formatDate(sub.grace_period_ends_at) : '—' }}</td>
                <td class="px-5 py-4 space-y-1 text-xs text-slate-500">
                  <div>{{ sub.stripe_customer_id || 'No customer ID' }}</div>
                  <div>{{ sub.stripe_subscription_id || 'No subscription ID' }}</div>
                </td>
                <td class="px-5 py-4 font-semibold text-slate-900">{{ formatCurrency(sub.plan?.price) }}</td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(sub.created_at) }}</td>
                <td class="px-5 py-4 text-right flex justify-end gap-2">
                  <router-link :to="`/admin/tenant-subscriptions/${sub.id}/edit`" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:scale-[1.02] transition-transform" aria-label="Edit subscription">
                    <i class="ri-pencil-line text-lg"></i>
                  </router-link>
                  <button v-if="sub.status !== 'cancelled'" type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md hover:scale-[1.02] transition-transform" @click="cancel(sub)" aria-label="Cancel subscription">
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
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatCurrency, formatDate, formatStatus, statusBadgeClass } from '../../utils/formatters.js'

const loading = ref(true)
const subscriptions = ref([])
const filters = reactive({ status: '' })

const fetchSubs = async () => {
  loading.value = true
  try {
    const params = filters.status ? { status: filters.status } : {}
    subscriptions.value = normalizeList(await adminApi.getSubscriptions(params))
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error', text: getApiErrorMessage(e) })
  } finally {
    loading.value = false
  }
}

const cancel = async (sub) => {
  const c = await Swal.fire({ icon: 'warning', title: 'Cancel Subscription?', text: 'Are you sure you want to cancel this subscription?', showCancelButton: true, confirmButtonText: 'Yes, Cancel', confirmButtonColor: '#dc2626' })
  if (!c.isConfirmed) return
  try {
    await adminApi.cancelSubscription(sub.id)
    await fetchSubs()
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Cancel Failed', text: getApiErrorMessage(e) })
  }
}

onMounted(fetchSubs)
</script>
