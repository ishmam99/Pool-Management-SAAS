<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header & Summary Cards -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Invoices</h1>
      <span v-if="invoices.length" class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        {{ invoices.length }} invoice{{ invoices.length > 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Summary Cards -->
    <InvoiceStats :stats="stats" />

    <!-- Loading & Empty States -->
    <LoadingState v-if="loading" message="Loading invoices..." />
    <EmptyState v-else-if="!invoices.length">
      <template #icon>
        <svg class="w-14 h-14 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6M9 11h6M9 15h4" />
        </svg>
      </template>
      <template #title>No invoices found</template>
      <template #message>You don't have any invoices yet.</template>
    </EmptyState>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-emerald-50">
            <tr>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Due</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap">
                <span class="font-mono text-sm font-semibold text-gray-900">{{ invoice.invoice_number }}</span>
              </td>
              <td class="px-4 py-3 border-e border-slate-200">
                <div class="text-sm font-medium text-gray-900">{{ invoice.customer?.contact_name || '—' }}</div>
                <div class="text-xs text-gray-500">ID: {{ invoice.customer?.id || '—' }}</div>
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-sm text-gray-700">
                {{ formatDate(invoice.invoice_date) }}
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap">
                <div class="text-sm text-gray-700">{{ formatDate(invoice.due_date) }}</div>
                <div v-if="isOverdue(invoice)" class="text-xs font-semibold text-red-600">Overdue</div>
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-right text-sm text-gray-700">
                {{ invoice.line_items_count || 0 }}
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-right text-sm font-mono font-bold text-gray-900">
                ${{ formatAmount(invoice.total) }}
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-right">
                <span class="text-sm font-mono" :class="parseFloat(invoice.balance_due) > 0 ? 'text-red-600 font-bold' : 'text-gray-700'">
                  ${{ formatAmount(invoice.balance_due) }}
                </span>
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-center">
                <StatusBadge :status="invoice.status" />
                <div v-if="invoice.paid_at" class="text-xs text-gray-500 mt-0.5">Paid {{ formatDate(invoice.paid_at) }}</div>
                <div v-if="invoice.amount_paid > 0 && invoice.status !== 'paid'" class="text-xs text-gray-500 mt-0.5">
                  Paid: ${{ formatAmount(invoice.amount_paid) }}
                </div>
              </td>
              <!-- Actions -->
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="openViewModal(invoice)"
                    class="px-2 py-1 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition"
                    title="View Details"
                  >
                    View
                  </button>
                  <button
                    v-if="invoice.status === 'sent'"
                    @click="openPayModal(invoice)"
                    class="px-2 py-1 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                    title="Pay Now"
                  >
                    Pay Now
                  </button>
                  <button
                    v-if="invoice.status === 'paid' || invoice.status === 'sent'"
                    @click="handleDownload(invoice)"
                    class="px-2 py-1 rounded-md bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition"
                    title="Download PDF"
                  >
                    Download
                  </button>
                  <button
                    v-if="invoice.status === 'draft'"
                    @click="editInvoice(invoice)"
                    class="px-2 py-1 rounded-md bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
                    title="Edit Draft"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination :pagination="pagination" @page-change="fetchPage" />
    </div>

    <!-- Invoice View Modal -->
    <InvoiceViewModal
      :invoice="viewModalInvoice"
      :tenant="tenant"
      @close="closeViewModal"
      @pay="openPayModal"
      @download="handleDownload"
    />

    <!-- Payment Modal (kept as is) -->
    <Teleport to="body">
      <div
        v-if="payModalInvoice"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closePayModal"
      >
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fadeInUp">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Pay Invoice</h3>
            <button @click="closePayModal" class="p-1 rounded-full hover:bg-gray-100 transition">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <!-- Invoice summary -->
            <div class="mb-4 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Invoice</span> <span class="font-mono font-medium">{{ payModalInvoice.invoice_number }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Amount Due</span> <span class="font-bold text-lg text-blue-600">${{ formatAmount(payModalInvoice.balance_due || payModalInvoice.total) }}</span></div>
            </div>

            <!-- Payment Form -->
            <form @submit.prevent="handlePayment" class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Cardholder Name</label>
                <input
                  type="text"
                  v-model="paymentForm.name"
                  placeholder="John Doe"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Card Number</label>
                <input
                  type="text"
                  v-model="paymentForm.number"
                  placeholder="4242 4242 4242 4242"
                  maxlength="19"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Expiry</label>
                  <input
                    type="text"
                    v-model="paymentForm.expiry"
                    placeholder="MM / YY"
                    maxlength="7"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">CVC</label>
                  <input
                    type="text"
                    v-model="paymentForm.cvc"
                    placeholder="123"
                    maxlength="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                :disabled="payLoading"
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="payLoading" class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Pay ${{ formatAmount(payModalInvoice.balance_due || payModalInvoice.total) }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'
import { useAuthStore } from '../../../../store/AuthStore.js'


// Import composable
import { useInvoicePDF } from '@/composables/tenant/useInvoicePDF.js'
import InvoiceStats from '../../../../components/InvoiceStats.vue'
import LoadingState from '../../../../components/LoadingState.vue'
import EmptyState from '../../../../components/EmptyState.vue'
import Pagination from '../../../../components/Pagination.vue'
import InvoiceViewModal from '../../../../components/InvoiceViewModal.vue'

const authStore = useAuthStore()
const { downloadInvoice } = useInvoicePDF()

const loading = ref(false)
const invoices = ref([])
const pagination = ref(null)
const tenant = ref(authStore.tenant)

// Modal state
const viewModalInvoice = ref(null)
const payModalInvoice = ref(null)

// Payment form
const paymentForm = ref({
  name: '',
  number: '',
  expiry: '',
  cvc: ''
})
const payLoading = ref(false)

// ─── Computed ───────────────────────────────────────────────────────────────
const stats = computed(() => ({
  total: invoices.value.length,
  sent: invoices.value.filter(inv => inv.status === 'sent').length,
  paid: invoices.value.filter(inv => inv.status === 'paid').length,
  totalAmount: invoices.value.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0).toFixed(2)
}))

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatAmount = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isOverdue = (invoice) => {
  if (invoice.status !== 'sent') return false
  if (!invoice.due_date) return false
  return new Date(invoice.due_date) < new Date()
}

const getApiErrorMessage = (e) => {
  return e.response?.data?.message || e.message || 'Something went wrong'
}

// ─── Fetch ──────────────────────────────────────────────────────────────────
const fetchInvoices = async (page = 1) => {
  loading.value = true
  try {
    const res = await api().get(`/financial-management/invoices?page=${page}`)
    const responseData = res.data?.data || res.data
    
    if (Array.isArray(responseData)) {
      invoices.value = responseData
    } else if (responseData?.data) {
      invoices.value = responseData.data
      pagination.value = {
        current_page: responseData.current_page,
        last_page: responseData.last_page,
        from: responseData.from,
        to: responseData.to,
        total: responseData.total,
        prev_page_url: responseData.prev_page_url,
        next_page_url: responseData.next_page_url,
        links: responseData.links || []
      }
    }
  } catch (e) {
    console.error('Failed to fetch invoices:', e)
    Swal.fire('Error', getApiErrorMessage(e), 'error')
  } finally {
    loading.value = false
  }
}

const fetchPage = (page) => {
  if (page && page >= 1 && page <= pagination.value?.last_page) {
    fetchInvoices(page)
  }
}

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

const closePayModal = () => {
  payModalInvoice.value = null
  document.body.style.overflow = ''
  payLoading.value = false
}

// ─── Handle Payment ────────────────────────────────────────────────────────
const handlePayment = async () => {
  if (!payModalInvoice.value) return
  payLoading.value = true
  try {
    await api().post(`/tenant/my-invoices/${payModalInvoice.value.id}/pay`, {
      payment_method: 'stripe'
    })
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: `Invoice ${payModalInvoice.value.invoice_number} has been paid.`,
      timer: 3000,
      showConfirmButton: false,
    })
    closePayModal()
    await fetchInvoices(pagination.value?.current_page || 1)
  } catch (e) {
    console.error('Payment failed:', e)
    Swal.fire('Payment Failed', getApiErrorMessage(e), 'error')
  } finally {
    payLoading.value = false
  }
}

// ─── Handle Download ──────────────────────────────────────────────────────
const handleDownload = (invoice) => {
  downloadInvoice(invoice, tenant.value)
}

// ─── Edit Draft ────────────────────────────────────────────────────────────
const editInvoice = (invoice) => {
  console.log('Edit invoice:', invoice)
}

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchInvoices()
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