<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Invoices</h1>
          <p class="text-slate-500 mt-1">Manage invoices, send to customers, and record payments.</p>
        </div>
        <router-link
          to="/provider/billing/invoices/create"
          class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-sky-700 hover:to-cyan-700 transition"
        >
          <i class="ri-add-line text-lg"></i>
          Create Invoice
        </router-link>
      </div>

      <!-- Summary KPIs -->
      <div v-if="summary" class="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Invoices</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ summary.total_invoices ?? 0 }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-emerald-600 uppercase tracking-wide">Total Paid</p>
          <p class="text-2xl font-bold text-emerald-700 mt-1">{{ formatCurrency(summary.total_paid) }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-amber-600 uppercase tracking-wide">Pending</p>
          <p class="text-2xl font-bold text-amber-700 mt-1">{{ formatCurrency(summary.total_pending) }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Overdue</p>
          <p class="text-2xl font-bold text-red-700 mt-1">{{ formatCurrency(summary.total_overdue) }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm col-span-2 lg:col-span-1">
          <p class="text-xs font-medium text-sky-600 uppercase tracking-wide">This Month</p>
          <p class="text-2xl font-bold text-sky-700 mt-1">{{ summary.this_month?.count ?? 0 }}</p>
          <p class="text-xs text-slate-500">{{ formatCurrency(summary.this_month?.total) }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select v-model="filters.status" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
            <option value="">All Statuses</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ formatStatus(s) }}</option>
          </select>
          <input v-model.number="filters.customer_id" type="number" placeholder="Customer ID" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
          <input v-model="filters.date_from" type="date" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
          <input v-model="filters.date_to" type="date" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
          <button type="button" class="rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition" @click="fetchInvoices(1)">
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 space-y-3 animate-pulse">
          <div v-for="i in 5" :key="i" class="h-14 bg-slate-100 rounded-xl"></div>
        </div>

        <div v-else-if="invoices.length === 0" class="p-16 text-center">
          <div class="text-5xl mb-4">📄</div>
          <h3 class="text-lg font-semibold text-slate-800">No invoices found</h3>
          <p class="text-slate-500 text-sm mt-1">Create your first invoice or adjust filters.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-5 py-3">Invoice</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3">Due</th>
                <th class="px-5 py-3">Total</th>
                <th class="px-5 py-3">Balance</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-slate-50/80 transition">
                <td class="px-5 py-4 font-medium text-slate-900">{{ inv.invoice_number || `#${inv.id}` }}</td>
                <td class="px-5 py-4 text-slate-600">{{ inv.customer?.contact_name || inv.customer?.name || `#${inv.customer_id}` }}</td>
                <td class="px-5 py-4 text-slate-600">{{ formatDate(inv.invoice_date) }}</td>
                <td class="px-5 py-4 text-slate-600">{{ formatDate(inv.due_date) }}</td>
                <td class="px-5 py-4 font-semibold">{{ formatCurrency(inv.total ?? inv.subtotal) }}</td>
                <td class="px-5 py-4 font-semibold" :class="(inv.balance_due ?? 0) > 0 ? 'text-red-600' : 'text-emerald-600'">
                  {{ formatCurrency(inv.balance_due ?? 0) }}
                </td>
                <td class="px-5 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(inv.status)">
                    {{ formatStatus(inv.status) }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1.5">
                    <button type="button" title="Download PDF" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition flex items-center justify-center" @click="downloadInvoice(inv)">
                      <i class="ri-download-line"></i>
                    </button>
                    <button v-if="inv.status !== 'paid' && inv.status !== 'void'" type="button" title="Send Invoice" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition flex items-center justify-center" @click="sendInvoice(inv)">
                      <i class="ri-send-plane-line"></i>
                    </button>
                    <button v-if="(inv.balance_due ?? 0) > 0" type="button" title="Add Payment" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 transition flex items-center justify-center" @click="openPaymentModal(inv)">
                      <i class="ri-money-dollar-circle-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>{{ pagination.total }} invoice{{ pagination.total === 1 ? '' : 's' }}</span>
          <div class="flex gap-2">
            <button type="button" :disabled="pagination.current_page <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40" @click="fetchInvoices(pagination.current_page - 1)">Prev</button>
            <span class="px-2 py-1.5">Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
            <button type="button" :disabled="pagination.current_page >= pagination.last_page" class="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40" @click="fetchInvoices(pagination.current_page + 1)">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Payment Modal -->
    <Teleport to="body">
      <div v-if="paymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="paymentModal = false"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Record Payment</h3>
          <p class="text-sm text-slate-500 mb-4">{{ selectedInvoice?.invoice_number || `#${selectedInvoice?.id}` }} · Balance {{ formatCurrency(selectedInvoice?.balance_due) }}</p>
          <form class="space-y-4" @submit.prevent="submitPayment">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input v-model.number="paymentForm.amount" type="number" step="0.01" min="0" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500/40 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Method</label>
              <select v-model="paymentForm.method" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500/40 outline-none">
                <option value="card">Card</option>
                <option value="ach">ACH</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="auto_pay">Auto Pay</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Transaction ID <span class="text-slate-400">(optional)</span></label>
              <input v-model="paymentForm.transaction_id" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="paymentSubmitting" class="flex-1 rounded-xl bg-violet-600 text-white py-2.5 text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
                {{ paymentSubmitting ? 'Saving...' : 'Add Payment' }}
              </button>
              <button type="button" class="px-5 rounded-xl border border-slate-200 text-slate-600 py-2.5 text-sm" @click="paymentModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { financialApi, getApiErrorMessage } from '../../../../services/financialApi.js'

const loading = ref(true)
const invoices = ref([])
const summary = ref(null)
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })
const statusOptions = ['draft', 'sent', 'paid', 'overdue', 'void']

const filters = reactive({
  status: '',
  customer_id: null,
  date_from: '',
  date_to: '',
})

const paymentModal = ref(false)
const paymentSubmitting = ref(false)
const selectedInvoice = ref(null)
const paymentForm = reactive({ amount: 0, method: 'card', transaction_id: '' })

const formatCurrency = (v) => {
  const n = Number(v)
  if (Number.isNaN(n)) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatStatus = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—')

const statusBadgeClass = (status) => {
  const map = {
    paid: 'bg-emerald-100 text-emerald-700',
    sent: 'bg-sky-100 text-sky-700',
    draft: 'bg-slate-100 text-slate-600',
    overdue: 'bg-red-100 text-red-700',
    void: 'bg-gray-100 text-gray-500',
  }
  return map[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-700'
}

const buildParams = (page) => {
  const params = { page }
  if (filters.status) params.status = filters.status
  if (filters.customer_id) params.customer_id = filters.customer_id
  if (filters.date_from) params.date_from = filters.date_from
  if (filters.date_to) params.date_to = filters.date_to
  return params
}

const fetchSummary = async () => {
  try {
    summary.value = await financialApi.getInvoiceSummary()
  } catch (e) {
    console.error(e)
  }
}

const fetchInvoices = async (page = 1) => {
  loading.value = true
  try {
    const payload = await financialApi.getInvoices(buildParams(page))
    invoices.value = payload?.data || []
    pagination.value = {
      current_page: payload?.current_page || 1,
      last_page: payload?.last_page || 1,
      total: payload?.total || invoices.value.length,
    }
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Invoices', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const sendInvoice = async (inv) => {
  const confirm = await Swal.fire({
    icon: 'question',
    title: 'Send Invoice?',
    text: `Send ${inv.invoice_number || `#${inv.id}`} to the customer?`,
    showCancelButton: true,
    confirmButtonText: 'Send',
  })
  if (!confirm.isConfirmed) return
  try {
    await financialApi.sendInvoice(inv.id)
    await Swal.fire({ icon: 'success', title: 'Invoice Sent', timer: 2000, showConfirmButton: false })
    await fetchInvoices(pagination.value.current_page)
    await fetchSummary()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Send Failed', text: getApiErrorMessage(error) })
  }
}

const downloadInvoice = async (inv) => {
  try {
    const response = await financialApi.downloadInvoice(inv.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${inv.invoice_number || `invoice-${inv.id}`}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Download Failed', text: getApiErrorMessage(error) })
  }
}

const openPaymentModal = (inv) => {
  selectedInvoice.value = inv
  paymentForm.amount = Number(inv.balance_due) || 0
  paymentForm.method = 'card'
  paymentForm.transaction_id = ''
  paymentModal.value = true
}

const submitPayment = async () => {
  paymentSubmitting.value = true
  try {
    await financialApi.addInvoicePayment(selectedInvoice.value.id, {
      amount: paymentForm.amount,
      method: paymentForm.method,
      ...(paymentForm.transaction_id && { transaction_id: paymentForm.transaction_id }),
    })
    paymentModal.value = false
    await Swal.fire({ icon: 'success', title: 'Payment Recorded', timer: 2000, showConfirmButton: false })
    await fetchInvoices(pagination.value.current_page)
    await fetchSummary()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Payment Failed', text: getApiErrorMessage(error) })
  } finally {
    paymentSubmitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchSummary(), fetchInvoices()])
})
</script>
