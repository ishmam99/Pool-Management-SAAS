<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto w-full">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Tenant Subscriptions</h1>
          <p class="text-slate-500 mt-1">Manage tenant subscription assignments.</p>
        </div>
        <router-link to="/admin/tenant-subscriptions/create" class="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white">Create Subscription</router-link>
      </div>

      <div class="mb-4 rounded-2xl bg-white border p-4 w-full">
        <select v-model="filters.status" class="w-full md:w-64 rounded-xl border px-4 py-2.5 text-sm" @change="fetchSubs">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="rounded-2xl bg-white border shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse"><div class="h-12 bg-slate-100 rounded-xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-5 py-3 text-left">Tenant</th>
                <th class="px-5 py-3 text-left">Plan</th>
                <th class="px-5 py-3 text-left">Status</th>
                <th class="px-5 py-3 text-left">Period</th>
                <th class="px-5 py-3 text-left">Grace Ends</th>
                <th class="px-5 py-3 text-left">Stripe</th>
                <th class="px-5 py-3 text-left">Amount</th>
                <th class="px-5 py-3 text-left">Created</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-slate-50">
                <td class="px-5 py-4">
                  <div class="font-medium">{{ sub.tenant?.company_name || `#${sub.tenant_id}` }}</div>
                  <div class="text-slate-500 text-xs">{{ sub.tenant?.email || sub.tenant?.phone || 'No contact' }}</div>
                </td>
                <td class="px-5 py-4">
                  <div class="font-medium">{{ sub.plan?.name || `Plan #${sub.subscription_plan_id}` }}</div>
                  <div class="text-slate-500 text-xs">{{ formatCurrency(sub.plan?.price) }} / {{ sub.plan?.billing_cycle || sub.billing_cycle || '—' }}</div>
                </td>
                <td class="px-5 py-4"><span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusBadgeClass(sub.status)">{{ formatStatus(sub.status) }}</span></td>
                <td class="px-5 py-4">
                  <div class="font-medium">{{ formatDate(sub.current_period_start) }}</div>
                  <div class="text-slate-500 text-xs">to {{ formatDate(sub.current_period_end) }}</div>
                </td>
                <td class="px-5 py-4">{{ sub.grace_period_ends_at ? formatDate(sub.grace_period_ends_at) : '—' }}</td>
                <td class="px-5 py-4 space-y-1 text-xs text-slate-500">
                  <div>{{ sub.stripe_customer_id || 'No customer ID' }}</div>
                  <div>{{ sub.stripe_subscription_id || 'No subscription ID' }}</div>
                </td>
                <td class="px-5 py-4 font-semibold">{{ formatCurrency(sub.plan?.price) }}</td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(sub.created_at) }}</td>
                <td class="px-5 py-4 text-right flex justify-end gap-2">
                  <router-link :to="`/admin/tenant-subscriptions/${sub.id}/edit`" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sky-600 hover:bg-slate-50" aria-label="Edit subscription">
                    <i class="ri-pencil-line text-lg"></i>
                  </router-link>
                  <button v-if="sub.status !== 'cancelled'" type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-600 hover:bg-slate-50" @click="cancel(sub)" aria-label="Cancel subscription">
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
