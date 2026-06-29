<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Payments</h1>
        <p class="text-slate-500 mt-1">View payment history, revenue stats, and process refunds.</p>
      </div>

      <!-- Payment Stats -->
      <div v-if="stats" class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Revenue</p>
          <p class="text-2xl font-bold text-emerald-700 mt-1">{{ formatCurrency(stats.total_revenue) }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-sky-600 uppercase tracking-wide">This Month</p>
          <p class="text-2xl font-bold text-sky-700 mt-1">{{ formatCurrency(stats.this_month) }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-violet-600 uppercase tracking-wide">Last Month</p>
          <p class="text-2xl font-bold text-violet-700 mt-1">{{ formatCurrency(stats.last_month) }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">By Method</p>
          <div v-if="stats.by_method?.length" class="space-y-1">
            <div v-for="m in stats.by_method" :key="m.method" class="flex justify-between text-sm">
              <span class="capitalize text-slate-600">{{ m.method }}</span>
              <span class="font-semibold text-slate-800">{{ formatCurrency(m.total) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">No data</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select v-model="filters.method" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/40">
            <option value="">All Methods</option>
            <option v-for="m in methodOptions" :key="m" :value="m">{{ formatStatus(m) }}</option>
          </select>
          <select v-model="filters.status" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/40">
            <option value="">All Statuses</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ formatStatus(s) }}</option>
          </select>
          <input v-model.number="filters.customer_id" type="number" placeholder="Customer ID" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
          <button type="button" class="rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800" @click="fetchPayments(1)">Apply</button>
        </div>
      </div>

      <!-- Payments table -->
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 space-y-3 animate-pulse">
          <div v-for="i in 5" :key="i" class="h-14 bg-slate-100 rounded-xl"></div>
        </div>

        <div v-else-if="payments.length === 0" class="p-16 text-center">
          <div class="text-5xl mb-4">💳</div>
          <h3 class="text-lg font-semibold text-slate-800">No payments found</h3>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-5 py-3">Payment</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Invoice</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Method</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="payment in payments" :key="payment.id" class="hover:bg-slate-50/80">
                <td class="px-5 py-4 font-medium text-slate-900">#{{ payment.id }}</td>
                <td class="px-5 py-4 text-slate-600">{{ payment.customer?.contact_name || `#${payment.customer_id}` }}</td>
                <td class="px-5 py-4 text-slate-600">{{ payment.invoice?.invoice_number || `#${payment.invoice_id}` }}</td>
                <td class="px-5 py-4 font-semibold text-emerald-700">{{ formatCurrency(payment.amount) }}</td>
                <td class="px-5 py-4 capitalize text-slate-600">{{ payment.method?.replace('_', ' ') }}</td>
                <td class="px-5 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(payment.status)">
                    {{ formatStatus(payment.status) }}
                  </span>
                </td>
                <td class="px-5 py-4 text-slate-600">{{ formatDate(payment.created_at || payment.paid_at) }}</td>
                <td class="px-5 py-4 text-right">
                  <button
                    v-if="payment.status === 'completed'"
                    type="button"
                    class="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                    @click="refundPayment(payment)"
                  >
                    Refund
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pagination.total > 0" class="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>{{ pagination.total }} payment{{ pagination.total === 1 ? '' : 's' }}</span>
          <div class="flex gap-2">
            <button type="button" :disabled="pagination.current_page <= 1" class="px-3 py-1.5 rounded-lg border disabled:opacity-40" @click="fetchPayments(pagination.current_page - 1)">Prev</button>
            <span>Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
            <button type="button" :disabled="pagination.current_page >= pagination.last_page" class="px-3 py-1.5 rounded-lg border disabled:opacity-40" @click="fetchPayments(pagination.current_page + 1)">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { financialApi, getApiErrorMessage } from '../../../../services/financialApi.js'

const loading = ref(true)
const payments = ref([])
const stats = ref(null)
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })
const methodOptions = ['card', 'ach', 'check', 'cash', 'auto_pay']
const statusOptions = ['pending', 'completed', 'failed', 'refunded']

const filters = reactive({ method: '', status: '', customer_id: null })

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v) || 0)

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatStatus = (s) => (s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—')

const statusBadgeClass = (status) => {
  const map = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-slate-100 text-slate-600',
  }
  return map[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-700'
}

const buildParams = (page) => {
  const params = { page }
  if (filters.method) params.method = filters.method
  if (filters.status) params.status = filters.status
  if (filters.customer_id) params.customer_id = filters.customer_id
  return params
}

const fetchStats = async () => {
  try {
    stats.value = await financialApi.getPaymentStats()
  } catch (e) {
    console.error(e)
  }
}

const fetchPayments = async (page = 1) => {
  loading.value = true
  try {
    const payload = await financialApi.getPayments(buildParams(page))
    payments.value = payload?.data || []
    pagination.value = {
      current_page: payload?.current_page || 1,
      last_page: payload?.last_page || 1,
      total: payload?.total || payments.value.length,
    }
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Payments', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const refundPayment = async (payment) => {
  const confirm = await Swal.fire({
    icon: 'warning',
    title: 'Refund Payment?',
    text: `Refund ${formatCurrency(payment.amount)} for payment #${payment.id}?`,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Refund',
  })
  if (!confirm.isConfirmed) return
  try {
    await financialApi.refundPayment(payment.id)
    await Swal.fire({ icon: 'success', title: 'Payment Refunded', timer: 2000, showConfirmButton: false })
    await fetchPayments(pagination.value.current_page)
    await fetchStats()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Refund Failed', text: getApiErrorMessage(error) })
  }
}

onMounted(async () => {
  await Promise.all([fetchStats(), fetchPayments()])
})
</script>
