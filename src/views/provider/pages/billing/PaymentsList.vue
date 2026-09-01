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
                <th class="px-5 py-3">Invoice(s)</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Method</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="payment in payments" :key="payment.id" class="hover:bg-slate-50/80">
                <!-- Payment ID -->
                <td class="px-5 py-4 font-medium text-slate-900">
                  <span class="font-mono text-sm">#{{ payment.id }}</span>
                </td>

                <!-- Customer -->
                <td class="px-5 py-4">
                  <div class="font-medium text-slate-900">{{ payment.customer?.contact_name || `Customer #${payment.customer_id}` }}</div>
                  <div class="text-xs text-slate-500">ID: {{ payment.customer_id }}</div>
                </td>

                <!-- Invoice(s) -->
                <td class="px-5 py-4">
                  <div v-if="payment.invoices && payment.invoices.length" class="space-y-1.5">
                    <div v-for="invoice in payment.invoices" :key="invoice.id" class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-slate-600 text-xs">{{ invoice.invoice_number }}</span>
                        <span class="text-xs text-slate-400">({{ formatCurrency(invoice.pivot?.amount_applied || invoice.total) }})</span>
                      </div>
                      <!-- View Invoice Button -->
                      <button
                        type="button"
                        class="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline transition"
                        @click="viewInvoice(invoice.id)"
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <span v-else class="text-slate-400 text-xs">No invoice</span>
                </td>

                <!-- Amount -->
                <td class="px-5 py-4 font-semibold text-emerald-700">
                  {{ formatCurrency(payment.amount) }}
                </td>

                <!-- Method -->
                <td class="px-5 py-4">
                  <span class="capitalize text-slate-600">{{ payment.method?.replace('_', ' ') || '—' }}</span>
                  <div v-if="payment.transaction_id" class="text-xs text-slate-400 font-mono truncate max-w-[80px]">
                    {{ payment.transaction_id }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-5 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(payment.status)">
                    {{ formatStatus(payment.status) }}
                  </span>
                </td>

                <!-- Date -->
                <td class="px-5 py-4 text-slate-600">
                  <div>{{ formatDate(payment.paid_at || payment.created_at) }}</div>
                  <div v-if="payment.paid_at" class="text-xs text-slate-400">Paid</div>
                  <div v-else class="text-xs text-slate-400">Created</div>
                </td>

                <!-- Actions -->
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <!-- View Payment Details Button -->
                    <button
                      type="button"
                      class="text-xs font-semibold text-sky-600 hover:text-sky-700 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition"
                      @click="viewPaymentDetails(payment)"
                    >
                      Details
                    </button>

                    <!-- Refund Button (only for completed payments) -->
                    <button
                      v-if="payment.status === 'completed'"
                      type="button"
                      class="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                      @click="refundPayment(payment)"
                    >
                      Refund
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pagination.total > 0" class="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {{ pagination.from || 1 }} to {{ pagination.to || pagination.total }} of {{ pagination.total }} payment{{ pagination.total === 1 ? '' : 's' }}
          </span>
          <div class="flex gap-2 items-center">
            <button 
              type="button" 
              :disabled="pagination.current_page <= 1" 
              class="px-3 py-1.5 rounded-lg border disabled:opacity-40 hover:bg-slate-50 transition"
              @click="fetchPayments(pagination.current_page - 1)"
            >
              Prev
            </button>
            <span class="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700">
              {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <button 
              type="button" 
              :disabled="pagination.current_page >= pagination.last_page" 
              class="px-3 py-1.5 rounded-lg border disabled:opacity-40 hover:bg-slate-50 transition"
              @click="fetchPayments(pagination.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    <InvoiceViewModal
      :invoice="viewModalInvoice"
      :tenant="tenant"
      @close="closeViewModal"
      @pay="openPayModal"
      @download="handleDownload"
    />
    <!-- ======== PAYMENT DETAILS MODAL ======== -->
    <Teleport to="body">
      <div
        v-if="selectedPayment"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closePaymentModal"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fadeInUp">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <h3 class="text-lg font-bold text-gray-900">Payment Details</h3>
            <button @click="closePaymentModal" class="p-2 rounded-full hover:bg-gray-200 transition">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="selectedPayment" class="space-y-4">
              <!-- Payment Header -->
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-xs text-gray-500">Payment ID</p>
                  <p class="font-mono text-lg font-bold text-gray-900">#{{ selectedPayment.id }}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-semibold" :class="statusBadgeClass(selectedPayment.status)">
                  {{ formatStatus(selectedPayment.status) }}
                </span>
              </div>

              <!-- Customer Info -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 uppercase tracking-wider">Customer</p>
                <p class="font-medium text-gray-900">{{ selectedPayment.customer?.contact_name || `Customer #${selectedPayment.customer_id}` }}</p>
                <p class="text-sm text-gray-600">Customer ID: {{ selectedPayment.customer_id }}</p>
              </div>

              <!-- Payment Details Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                  <p class="text-2xl font-bold text-emerald-600">{{ formatCurrency(selectedPayment.amount) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Method</p>
                  <p class="font-medium text-gray-900 capitalize">{{ selectedPayment.method?.replace('_', ' ') || '—' }}</p>
                  <p v-if="selectedPayment.transaction_id" class="text-xs text-gray-500 font-mono">Txn: {{ selectedPayment.transaction_id }}</p>
                </div>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Created At</p>
                  <p class="font-medium text-gray-900">{{ formatDate(selectedPayment.created_at) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Paid At</p>
                  <p class="font-medium text-gray-900">{{ selectedPayment.paid_at ? formatDate(selectedPayment.paid_at) : '—' }}</p>
                </div>
              </div>

              <!-- Invoices -->
              <div v-if="selectedPayment.invoices && selectedPayment.invoices.length" class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-3">Applied to Invoices</p>
                <div class="space-y-2">
                  <div v-for="invoice in selectedPayment.invoices" :key="invoice.id" class="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                    <div>
                      <p class="font-mono font-medium text-gray-900">{{ invoice.invoice_number }}</p>
                      <p class="text-xs text-gray-500">Invoice #{{ invoice.id }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="text-right">
                        <p class="font-semibold text-emerald-600">{{ formatCurrency(invoice.pivot?.amount_applied || invoice.total) }}</p>
                        <p class="text-xs text-gray-500">of {{ formatCurrency(invoice.total) }}</p>
                      </div>
                      <!-- View Invoice Button -->
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg transition"
                        @click="viewInvoice(invoice.id)"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Refund Button (for completed payments) -->
              <div v-if="selectedPayment.status === 'completed'" class="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  @click="refundPayment(selectedPayment)"
                >
                  Refund Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { financialApi, getApiErrorMessage } from '../../../../services/financialApi.js'
import { useAuthStore } from '../../../../store/AuthStore.js'
import { useInvoicePDF } from '@/composables/tenant/useInvoicePDF.js'
import InvoiceViewModal from '@/components/InvoiceViewModal.vue'



const authStore = useAuthStore()
const tenant = ref(authStore.tenant) // Assuming tenant info is stored in authStore
const router = useRouter()
const loading = ref(true)
const payments = ref([])
const stats = ref(null)
const selectedPayment = ref(null)
const { downloadInvoice } = useInvoicePDF()
// Modal state
const viewModalInvoice = ref(null)
const payModalInvoice = ref(null)
const pagination = ref({ 
  current_page: 1, 
  last_page: 1, 
  total: 0,
  from: 1,
  to: 0
})
const methodOptions = ['card', 'ach', 'check', 'cash', 'auto_pay']
const statusOptions = ['pending', 'completed', 'failed', 'refunded']
const filters = reactive({ method: '', status: '', customer_id: null })

// Payment form
const paymentForm = ref({
  name: '',
  number: '',
  expiry: '',
  cvc: ''
})
const payLoading = ref(false)

// ─── View Modal ────────────────────────────────────────────────────────────
const openViewModal = (invoice) => {
  viewModalInvoice.value = invoice
  document.body.style.overflow = 'hidden'
}

const closeViewModal = () => {
  viewModalInvoice.value = null
  document.body.style.overflow = ''
}

// ─── Payment Modal ──────────────────────────────────────────────────────────
const openPayModal = (invoice) => {
  closeViewModal()
  payModalInvoice.value = invoice
  paymentForm.value = { name: '', number: '', expiry: '', cvc: '' }
  document.body.style.overflow = 'hidden'
}
const handleDownload = (invoice) => {
  downloadInvoice(invoice, tenant.value)
}

const closePayModal = () => {
  payModalInvoice.value = null
  document.body.style.overflow = ''
  payLoading.value = false
}
// ─── Helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (v) => {
  if (v === null || v === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(Number(v) || 0)
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatStatus = (s) => {
  if (!s) return '—'
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const statusBadgeClass = (status) => {
  const map = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-slate-100 text-slate-600',
  }
  return map[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-700'
}

// ─── Navigation ─────────────────────────────────────────────────────────────
const viewInvoice = async(invoiceId) => {
  const invoice = await financialApi.getInvoice(invoiceId)
  viewModalInvoice.value = invoice
  document.body.style.overflow = 'hidden'
}

// ─── Build Params ──────────────────────────────────────────────────────────
const buildParams = (page) => {
  const params = { page }
  if (filters.method) params.method = filters.method
  if (filters.status) params.status = filters.status
  if (filters.customer_id) params.customer_id = filters.customer_id
  if (authStore.authType === 'admin') params.tenant_id = authStore.tenantId
  return params
}

// ─── API Calls ─────────────────────────────────────────────────────────────
const fetchStats = async () => {
  try {
    stats.value = await financialApi.getPaymentStats()
  } catch (e) {
    console.error('Failed to fetch stats:', e)
  }
}

const fetchPayments = async (page = 1) => {
  loading.value = true
  try {
    const payload = await financialApi.getPayments(buildParams(page))
    
    // Handle both array and paginated responses
    if (Array.isArray(payload)) {
      payments.value = payload
      pagination.value = {
        current_page: 1,
        last_page: 1,
        total: payload.length,
        from: 1,
        to: payload.length
      }
    } else {
      payments.value = payload?.data || []
      pagination.value = {
        current_page: payload?.current_page || 1,
        last_page: payload?.last_page || 1,
        total: payload?.total || 0,
        from: payload?.from || 1,
        to: payload?.to || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    await Swal.fire({ 
      icon: 'error', 
      title: 'Failed to Load Payments', 
      text: getApiErrorMessage(error) 
    })
  } finally {
    loading.value = false
  }
}

// ─── Payment Actions ──────────────────────────────────────────────────────
const viewPaymentDetails = (payment) => {
  selectedPayment.value = payment
  document.body.style.overflow = 'hidden'
}

const closePaymentModal = () => {
  selectedPayment.value = null
  document.body.style.overflow = ''
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
    await Swal.fire({ 
      icon: 'success', 
      title: 'Payment Refunded', 
      timer: 2000, 
      showConfirmButton: false 
    })
    
    // Close modal if open
    closePaymentModal()
    
    // Refresh data
    await Promise.all([
      fetchPayments(pagination.value.current_page),
      fetchStats()
    ])
  } catch (error) {
    await Swal.fire({ 
      icon: 'error', 
      title: 'Refund Failed', 
      text: getApiErrorMessage(error) 
    })
  }
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchStats(), fetchPayments()])
})
</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fadeInUp {
  animation: fadeInUp 0.2s ease-out;
}
</style>