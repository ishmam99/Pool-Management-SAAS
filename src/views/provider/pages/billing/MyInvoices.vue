<template>
  <div class="p-4 md:p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span class="bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">📄 Invoices</span>
        </h1>
        <p class="text-sm text-slate-500">View and manage your invoices</p>
      </div>
      <div class="mt-2 sm:mt-0">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
          <span class="w-2 h-2 rounded-full bg-sky-400"></span>
          {{ invoices.length }} invoices
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-sky-600 border-t-transparent"></div>
    </div>

    <!-- Table -->
    <div v-else-if="invoices.length > 0" class="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <!-- Gradient Table Header -->
      <div class="bg-gradient-to-r from-indigo-50 via-sky-50 to-purple-50 px-6 py-4 border-b border-slate-200">
        <div class="grid grid-cols-6 gap-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <div>Invoice #</div>
          <div>Billing Period</div>
          <div>Total</div>
          <div>Status</div>
          <div>Due Date</div>
          <div class="text-right">Actions</div>
        </div>
      </div>

      <!-- Rows -->
      <div class="divide-y divide-slate-100">
        <div
          v-for="invoice in invoices"
          :key="invoice.id"
          class="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors"
        >
          <!-- Invoice # -->
          <div class="font-medium text-slate-800 text-sm">
            #{{ invoice.invoice_number || invoice.id }}
          </div>

          <!-- Billing Period -->
          <div class="text-sm text-slate-600">
            {{ formatPeriod(invoice.billing_period) }}
          </div>

          <!-- Total -->
          <div class="text-sm font-semibold text-slate-900">
            ${{ invoice.total || '0.00' }}
          </div>

          <!-- Status Badge -->
          <div>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-emerald-100 text-emerald-700 border border-emerald-200': invoice.status === 'paid',
                'bg-rose-100 text-rose-700 border border-rose-200': invoice.status === 'overdue',
                'bg-amber-100 text-amber-700 border border-amber-200': invoice.status === 'pending',
                'bg-slate-100 text-slate-600 border border-slate-200': invoice.status === 'draft' || !invoice.status,
              }"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="{
                  'bg-emerald-500': invoice.status === 'paid',
                  'bg-rose-500': invoice.status === 'overdue',
                  'bg-amber-500': invoice.status === 'pending',
                  'bg-slate-400': invoice.status === 'draft' || !invoice.status,
                }"
              ></span>
              {{ invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Draft' }}
            </span>
          </div>

          <!-- Due Date -->
          <div class="text-sm text-slate-600">
            {{ invoice.due_date ? formatDate(invoice.due_date) : '—' }}
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2">
            <button
              @click="openDetail(invoice.id)"
              class="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              title="View Invoice"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
            <button
              v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
              @click="payInvoice(invoice.id)"
              class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Pay Now"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 14h.01"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
      <svg class="w-16 h-16 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-slate-700">No invoices yet</h3>
      <p class="text-sm text-slate-500">You don't have any invoices at the moment.</p>
    </div>

    <!-- ==================== MODAL: Invoice Detail ==================== -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      @click.self="closeDetail"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

        <!-- Modal Panel -->
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <!-- Modal Header (gradient) -->
          <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-white" id="modal-title">
                Invoice #{{ selectedInvoice?.invoice_number || selectedInvoice?.id }}
              </h3>
              <button @click="closeDetail" class="text-white/80 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div v-if="loadingDetail" class="p-6 flex justify-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-t-transparent"></div>
          </div>
          <div v-else-if="selectedInvoice" class="p-6 space-y-6">
            <!-- General Info -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-slate-500">Invoice #</p>
                <p class="text-sm font-medium text-slate-900">#{{ selectedInvoice.invoice_number || selectedInvoice.id }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Billing Period</p>
                <p class="text-sm font-medium text-slate-900">{{ formatPeriod(selectedInvoice.billing_period) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Status</p>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-emerald-100 text-emerald-700': selectedInvoice.status === 'paid',
                    'bg-rose-100 text-rose-700': selectedInvoice.status === 'overdue',
                    'bg-amber-100 text-amber-700': selectedInvoice.status === 'pending',
                    'bg-slate-100 text-slate-600': selectedInvoice.status === 'draft' || !selectedInvoice.status,
                  }"
                >
                  {{ selectedInvoice.status ? selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1) : 'Draft' }}
                </span>
              </div>
              <div>
                <p class="text-xs text-slate-500">Due Date</p>
                <p class="text-sm font-medium text-slate-900">{{ selectedInvoice.due_date ? formatDate(selectedInvoice.due_date) : '—' }}</p>
              </div>
            </div>

            <!-- Billing Summary -->
            <div class="border-t border-slate-200 pt-4">
              <h4 class="text-sm font-semibold text-slate-700 mb-3">Billing Summary</h4>
              <div class="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div v-if="selectedInvoice.subscription_plan" class="flex justify-between">
                  <span class="text-slate-600">Plan</span>
                  <span class="font-medium text-slate-900">{{ selectedInvoice.subscription_plan }}</span>
                </div>
                <div v-if="selectedInvoice.amount" class="flex justify-between">
                  <span class="text-slate-600">Monthly Plan Amount</span>
                  <span class="font-medium text-slate-900">${{ selectedInvoice.amount }}</span>
                </div>
                <div v-if="selectedInvoice.total_active_pools !== undefined" class="flex justify-between">
                  <span class="text-slate-600">Active Pools</span>
                  <span class="font-medium text-slate-900">{{ selectedInvoice.total_active_pools }}</span>
                </div>
                <div v-if="selectedInvoice.free_pools !== undefined" class="flex justify-between">
                  <span class="text-slate-600">Free Pools</span>
                  <span class="font-medium text-slate-900">{{ selectedInvoice.free_pools }}</span>
                </div>
                <div v-if="selectedInvoice.billable_pools !== undefined" class="flex justify-between">
                  <span class="text-slate-600">Billable Pools</span>
                  <span class="font-medium text-slate-900">{{ selectedInvoice.billable_pools }}</span>
                </div>
                <div v-if="selectedInvoice.price_per_pool" class="flex justify-between">
                  <span class="text-slate-600">Price Per Pool</span>
                  <span class="font-medium text-slate-900">${{ selectedInvoice.price_per_pool }}</span>
                </div>
                <div v-if="selectedInvoice.total !== undefined" class="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                  <span class="text-slate-800">Total</span>
                  <span class="text-slate-900">${{ selectedInvoice.total }}</span>
                </div>
              </div>
            </div>

            <!-- Pool Snapshot (if available) -->
            <div v-if="selectedInvoice.pools && selectedInvoice.pools.length" class="border-t border-slate-200 pt-4">
              <h4 class="text-sm font-semibold text-slate-700 mb-3">Pool Snapshot</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="bg-slate-50">
                      <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pool</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Free?</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Charge</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="pool in selectedInvoice.pools" :key="pool.id">
                      <td class="px-4 py-2 text-slate-800">{{ pool.name || pool.pool_name || `Pool #${pool.id}` }}</td>
                      <td class="px-4 py-2">
                        <span v-if="pool.is_free" class="text-emerald-600">✓</span>
                        <span v-else class="text-rose-400">—</span>
                      </td>
                      <td class="px-4 py-2 text-right text-slate-900">${{ pool.charge || '0.00' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                @click="closeDetail"
                class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                v-if="selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue'"
                @click="payInvoice(selectedInvoice.id)"
                class="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 14h.01"/>
                </svg>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL: Payment Processing ==================== -->
    <div
      v-if="paymentModal.show"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="payment-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="px-6 py-5">
            <h3 class="text-lg font-semibold text-slate-900" id="payment-title">Confirm Payment</h3>
            <p class="mt-2 text-sm text-slate-500">
              You are about to pay invoice <strong>#{{ paymentModal.invoiceId }}</strong>.
              This action cannot be undone.
            </p>
            <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                @click="paymentModal.show = false"
                class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmPayment"
                :disabled="paymentModal.processing"
                class="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="paymentModal.processing" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span v-else>Pay Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'

const loading = ref(false)
const invoices = ref([])

// Detail modal
const showDetailModal = ref(false)
const loadingDetail = ref(false)
const selectedInvoice = ref(null)

// Payment modal
const paymentModal = ref({
  show: false,
  invoiceId: null,
  processing: false,
})

// ─── Fetch Invoices ───────────────────────────────────────────────
const fetchInvoices = async () => {
  loading.value = true
  try {
    const res = await api().get('/tenant/my-invoices')
    // API returns { success, message, data: [...] }
    invoices.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.error('Failed to fetch invoices:', e)
    Swal.fire('Error', getApiErrorMessage(e), 'error')
  } finally {
    loading.value = false
  }
}

// ─── Open Invoice Detail ─────────────────────────────────────────
const openDetail = async (invoiceId) => {
  showDetailModal.value = true
  loadingDetail.value = true
  selectedInvoice.value = null

  try {
    const res = await api().get(`/tenant/my-invoices/${invoiceId}`)
    selectedInvoice.value = res?.data?.data || res?.data
  } catch (e) {
    console.error('Failed to fetch invoice detail:', e)
    Swal.fire('Error', getApiErrorMessage(e), 'error')
    closeDetail()
  } finally {
    loadingDetail.value = false
  }
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedInvoice.value = null
}

// ─── Pay Invoice ──────────────────────────────────────────────────
const payInvoice = (invoiceId) => {
  paymentModal.value = {
    show: true,
    invoiceId: invoiceId,
    processing: false,
  }
}

const confirmPayment = async () => {
  paymentModal.value.processing = true
  try {
    const res = await api().post(`/tenant/my-invoices/${paymentModal.value.invoiceId}/pay`)
    // Payment successful
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: res?.data?.message || 'Your invoice has been paid.',
      timer: 3000,
      showConfirmButton: false,
    })
    paymentModal.value.show = false
    // Refresh invoice list
    await fetchInvoices()
  } catch (e) {
    console.error('Payment failed:', e)
    Swal.fire('Error', getApiErrorMessage(e), 'error')
  } finally {
    paymentModal.value.processing = false
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
const getApiErrorMessage = (error) => {
  return error?.response?.data?.message || error.message || 'Something went wrong'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatPeriod = (period) => {
  if (!period) return '—'
  // If it's a string like "2024-01", format as "Jan 2024"
  if (typeof period === 'string' && period.length === 7) {
    const [year, month] = period.split('-')
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return period
}

// ─── Lifecycle ────────────────────────────────────────────────────
onMounted(async () => {
  await fetchInvoices()
})
</script>

<style scoped>
/* Optional additional styles */
</style>