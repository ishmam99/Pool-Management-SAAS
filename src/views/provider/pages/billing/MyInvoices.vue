<template>
  <div class=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header & Summary Cards (same as before) -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Invoices</h1>
      <span v-if="invoices.length" class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        {{ invoices.length }} invoice{{ invoices.length > 1 ? 's' : '' }}
      </span>
    </div>

    <div v-if="!loading && invoices.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-sky-100/80 rounded-lg shadow p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Total Invoices</p>
        <p class="text-2xl font-bold text-gray-900">{{ invoices.length }}</p>
      </div>
      <div class="bg-indigo-100/80 rounded-lg shadow p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
      </div>
      <div class="bg-cyan-100/80 rounded-lg shadow p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Paid</p>
        <p class="text-2xl font-bold text-green-600">{{ paidCount }}</p>
      </div>
      <div class="bg-pink-100/80 rounded-lg shadow p-4 border border-gray-100">
        <p class="text-sm text-gray-500">Total Amount</p>
        <p class="text-2xl font-bold text-blue-600">${{ totalAmount }}</p>
      </div>
    </div>

    <!-- Loading & Empty States (unchanged) -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-500">Loading invoices...</p>
    </div>

    <div v-else-if="!invoices.length" class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <svg class="w-14 h-14 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6M9 11h6M9 15h4" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900">No invoices found</h3>
      <p class="text-gray-500">You don't have any invoices yet.</p>
    </div>

    <!-- Table (updated actions) -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-emerald-50">
            <tr>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Period</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pools</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 py-3 border-e border-slate-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 transition">
              <!-- ... same columns ... -->
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap">
                <span class="font-mono text-sm font-semibold text-gray-900">{{ invoice.invoice_number }}</span>
              </td>
              <td class="px-4 py-3 border-e border-slate-200">
                <div class="text-sm font-medium text-gray-900">{{ invoice.billing_period }}</div>
                <div class="text-xs text-gray-500" v-if="invoice.period_start && invoice.period_end">
                  {{ formatDate(invoice.period_start) }} – {{ formatDate(invoice.period_end) }}
                </div>
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-semibold text-gray-900">{{ invoice.total_active_pools }}</span>
                  <span class="text-xs text-gray-500">active</span>
                  <button
                    v-if="invoice.pools_snapshot?.length"
                    @click="openPoolsModal(invoice)"
                    class="ml-1 text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                  >
                    View
                  </button>
                </div>
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-sm font-mono text-gray-700">${{ formatAmount(invoice.subtotal) }}</td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap text-sm font-mono font-bold text-gray-900">${{ formatAmount(invoice.total) }}</td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap">
                <div class="text-sm text-gray-700">{{ formatDate(invoice.due_date) }}</div>
                <div v-if="isOverdue(invoice)" class="text-xs font-semibold text-red-600">Overdue</div>
              </td>
              <td class="px-4 py-3 border-e border-slate-200 whitespace-nowrap">
                <span :class="{
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                  'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                  'bg-green-100 text-green-800': invoice.status === 'paid',
                  'bg-red-100 text-red-800': invoice.status === 'overdue',
                  'bg-gray-100 text-gray-800': invoice.status === 'cancelled' || invoice.status === 'refunded'
                }">
                  {{ capitalize(invoice.status) }}
                </span>
                <div v-if="invoice.paid_at" class="text-xs text-gray-500 mt-0.5">Paid {{ formatDate(invoice.paid_at) }}</div>
              </td>
              <!-- Actions: View + Pay Now (if pending) + Download (if paid) -->
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
                    v-if="invoice.status === 'pending'"
                    @click="openPayModal(invoice)"
                    class="px-2 py-1 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                    title="Pay Now"
                  >
                    Pay Now
                  </button>
                  <button
                    v-if="invoice.status === 'paid'"
                    @click="downloadInvoice(invoice)"
                    class="px-2 py-1 rounded-md bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition"
                    title="Download PDF"
                  >
                    Download
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======== MODALS ======== -->

    <!-- 1. View Invoice Modal -->
    <Teleport to="body">
      <div
        v-if="viewModalInvoice"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeViewModal"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fadeInUp">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Invoice Details</h3>
            <button @click="closeViewModal" class="p-1 rounded-full hover:bg-gray-100 transition">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="viewModalInvoice" class="space-y-4 text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div><span class="font-medium text-gray-500">Invoice #</span><br><span class="font-mono font-semibold">{{ viewModalInvoice.invoice_number }}</span></div>
                <div><span class="font-medium text-gray-500">Status</span><br><span :class="{
                  'inline-block px-2 py-0.5 rounded-full text-xs font-medium': true,
                  'bg-yellow-100 text-yellow-800': viewModalInvoice.status === 'pending',
                  'bg-green-100 text-green-800': viewModalInvoice.status === 'paid',
                  'bg-red-100 text-red-800': viewModalInvoice.status === 'overdue',
                  'bg-gray-100 text-gray-800': viewModalInvoice.status === 'cancelled' || viewModalInvoice.status === 'refunded'
                }">{{ capitalize(viewModalInvoice.status) }}</span></div>
              </div>
              <hr class="border-gray-200">
              <div class="grid grid-cols-2 gap-4">
                <div><span class="font-medium text-gray-500">Billing Period</span><br>{{ viewModalInvoice.billing_period }}</div>
                <div><span class="font-medium text-gray-500">Due Date</span><br>{{ formatDate(viewModalInvoice.due_date) }}</div>
                <div><span class="font-medium text-gray-500">Period Start</span><br>{{ formatDate(viewModalInvoice.period_start) }}</div>
                <div><span class="font-medium text-gray-500">Period End</span><br>{{ formatDate(viewModalInvoice.period_end) }}</div>
              </div>
              <hr class="border-gray-200">
              <div class="grid grid-cols-2 gap-4">
                <div><span class="font-medium text-gray-500">Total Active Pools</span><br>{{ viewModalInvoice.total_active_pools }}</div>
                <div><span class="font-medium text-gray-500">Billable Pools</span><br>{{ viewModalInvoice.billable_pools }}</div>
                <div><span class="font-medium text-gray-500">Per Pool Price</span><br>${{ formatAmount(viewModalInvoice.per_pool_price) }}</div>
                <div><span class="font-medium text-gray-500">Plan Name</span><br>{{ viewModalInvoice.plan_name || '—' }}</div>
              </div>
              <hr class="border-gray-200">
              <div class="grid grid-cols-3 gap-4">
                <div><span class="font-medium text-gray-500">Subtotal</span><br>${{ formatAmount(viewModalInvoice.subtotal) }}</div>
                <div><span class="font-medium text-gray-500">Tax</span><br>${{ formatAmount(viewModalInvoice.tax) }}</div>
                <div><span class="font-medium text-gray-500">Discount</span><br>${{ formatAmount(viewModalInvoice.discount) }}</div>
              </div>
              <div class="text-lg font-bold text-blue-600">Total: ${{ formatAmount(viewModalInvoice.total) }}</div>
              <hr class="border-gray-200">
              <div v-if="viewModalInvoice.paid_at" class="grid grid-cols-2 gap-4">
                <div><span class="font-medium text-gray-500">Paid At</span><br>{{ formatDate(viewModalInvoice.paid_at) }}</div>
                <div><span class="font-medium text-gray-500">Payment Method</span><br>{{ viewModalInvoice.payment_method || '—' }}</div>
                <div class="col-span-2"><span class="font-medium text-gray-500">Transaction ID</span><br>{{ viewModalInvoice.transaction_id || '—' }}</div>
              </div>
            </div>
          </div>
          <div class="px-6 py-3 border-t border-gray-200 flex justify-end">
            <button @click="closeViewModal" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 2. Pools Snapshot Modal (unchanged, just kept) -->
    <Teleport to="body">
      <div
        v-if="selectedInvoice"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closePoolsModal"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fadeInUp">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Pools Snapshot</h3>
            <button @click="closePoolsModal" class="p-1 rounded-full hover:bg-gray-100 transition">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <div><span class="font-medium text-gray-700">Invoice:</span> {{ selectedInvoice.invoice_number }}</div>
              <div><span class="font-medium text-gray-700">Period:</span> {{ selectedInvoice.billing_period }}</div>
              <div><span class="font-medium text-gray-700">Total Pools:</span> {{ selectedInvoice.total_active_pools }}</div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(pool, index) in selectedInvoice.pools_snapshot"
                :key="index"
                class="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition"
              >
                <div class="font-semibold text-gray-900">{{ pool.pool_name }}</div>
                <div class="text-sm text-gray-600">{{ pool.customer_name }}</div>
                <div class="text-sm font-medium mt-1" :class="pool.is_free ? 'text-green-600' : 'text-gray-900'">
                  {{ pool.is_free ? 'Free' : '$' + parseFloat(pool.price).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-3 border-t border-gray-200 text-right text-sm text-gray-500">
            Showing {{ selectedInvoice.pools_snapshot?.length || 0 }} pool(s)
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 3. Payment Modal (Stripe‑style) -->
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
              <div class="flex justify-between"><span class="text-gray-500">Amount</span> <span class="font-bold text-lg text-blue-600">${{ formatAmount(payModalInvoice.total) }}</span></div>
            </div>
            <!-- Stripe‑like form -->
            <form @submit.prevent="handlePayment" class="space-y-4">
              <!-- Cardholder Name -->
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
              <!-- Card Number -->
              <div>
                <label class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Card Number</label>
                <div class="relative">
                  <input
                    type="text"
                    v-model="paymentForm.number"
                    placeholder="4242 4242 4242 4242"
                    maxlength="19"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
                    required
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M..."/></svg>
                  </div>
                </div>
              </div>
              <!-- Expiry & CVC -->
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
              <!-- Pay Button -->
              <button
                type="submit"
                :disabled="payLoading"
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="payLoading" class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Pay ${{ formatAmount(payModalInvoice.total) }}
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
import Swal from 'sweetalert2' // only for success/error toasts; can be replaced with custom toasts
import api from '../../../../services/api.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const loading = ref(false)
const invoices = ref([])

// Modal state
const viewModalInvoice = ref(null)
const payModalInvoice = ref(null)
const selectedInvoice = ref(null) // for pools snapshot

// Payment form (demo only)
const paymentForm = ref({
  name: '',
  number: '',
  expiry: '',
  cvc: ''
})
const payLoading = ref(false)

// ─── Computed ───────────────────────────────────────────────────────────────
const pendingCount = computed(() => invoices.value.filter(inv => inv.status === 'pending').length)
const paidCount = computed(() => invoices.value.filter(inv => inv.status === 'paid').length)
const totalAmount = computed(() =>
  invoices.value.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0).toFixed(2)
)

// ─── Fetch ──────────────────────────────────────────────────────────────────
const fetchInvoices = async () => {
  loading.value = true
  try {
    const res = await api().get('/tenant/my-invoices')
    invoices.value = res.data?.data?.data || res.data?.data || []
  } catch (e) {
    console.error('Failed to fetch invoices:', e)
    Swal.fire('Error', getApiErrorMessage(e), 'error')
  } finally {
    loading.value = false
  }
}

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

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const isOverdue = (invoice) => {
  if (invoice.status !== 'pending') return false
  if (!invoice.due_date) return false
  return new Date(invoice.due_date) < new Date()
}

const getApiErrorMessage = (e) => {
  return e.response?.data?.message || e.message || 'Something went wrong'
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

// ─── Pools Modal ────────────────────────────────────────────────────────────
const openPoolsModal = (invoice) => {
  selectedInvoice.value = invoice
  document.body.style.overflow = 'hidden'
}

const closePoolsModal = () => {
  selectedInvoice.value = null
  document.body.style.overflow = ''
}

// ─── Payment Modal ──────────────────────────────────────────────────────────
const openPayModal = (invoice) => {
  payModalInvoice.value = invoice
  // Reset form
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
    // POST to /tenant/my-invoices/{id}/pay with payment_method in body
    await api().post(`/tenant/my-invoices/${payModalInvoice.value.id}/pay`, {
      payment_method: 'stripe'
    })
    // Success
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: `Invoice ${payModalInvoice.value.invoice_number} has been paid.`,
      timer: 3000,
      showConfirmButton: false,
    })
    closePayModal()
    await fetchInvoices() // refresh list
  } catch (e) {
    console.error('Payment failed:', e)
    Swal.fire('Payment Failed', getApiErrorMessage(e), 'error')
  } finally {
    payLoading.value = false
  }
}


// ─── Download Invoice as PDF ─────────────────────────────────────────────
const downloadInvoice = (invoice) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let y = margin

  // ── Header (blue bar) ──
  doc.setFillColor(26, 115, 232) // #1a73e8
  doc.rect(0, 0, pageWidth, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' })
  y = 45

  // ── Invoice meta (left / right) ──
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  const leftCol = margin
  const rightCol = pageWidth - margin

  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Number:', leftCol, y)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.invoice_number, leftCol + 40, y)

  doc.setFont('helvetica', 'bold')
  doc.text('Date:', leftCol, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(invoice.created_at), leftCol + 40, y + 7)

  doc.setFont('helvetica', 'bold')
  doc.text('Due Date:', leftCol, y + 14)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(invoice.due_date), leftCol + 40, y + 14)

  doc.setFont('helvetica', 'bold')
  doc.text('Billing Period:', rightCol - 50, y)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.billing_period, rightCol - 50, y + 7)

  y += 24

  // ── Pools Table ──
  if (invoice.pools_snapshot && invoice.pools_snapshot.length) {
    const tableData = invoice.pools_snapshot.map(pool => [
      pool.pool_name,
      pool.customer_name,
      pool.is_free ? 'Free' : '$' + parseFloat(pool.price).toFixed(2)
    ])
    autoTable(doc, {
      startY: y,
      head: [['Pool Name', 'Customer', 'Price']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 115, 232],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [240, 247, 255] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 70 },
        2: { cellWidth: 30, halign: 'right' }
      }
    })
    y = doc.lastAutoTable.finalY + 10
  } else {
    // Fallback if no pool list
    doc.setFontSize(11)
    doc.text(`Total Active Pools: ${invoice.total_active_pools}`, margin, y)
    doc.text(`Billable Pools: ${invoice.billable_pools}`, margin, y + 7)
    doc.text(`Per Pool Price: $${formatAmount(invoice.per_pool_price)}`, margin, y + 14)
    y += 24
  }

  // ── Totals (right‑aligned) ──
  const totalX = pageWidth - margin - 55
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal:', totalX, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${formatAmount(invoice.subtotal)}`, totalX + 40, y, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.text('Tax:', totalX, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${formatAmount(invoice.tax)}`, totalX + 40, y + 7, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.text('Discount:', totalX, y + 14)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${formatAmount(invoice.discount)}`, totalX + 40, y + 14, { align: 'right' })

  // ── Total (blue pill) ──
  y += 24
  doc.setFillColor(26, 115, 232)
  doc.roundedRect(totalX - 6, y - 4, 70, 12, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: $${formatAmount(invoice.total)}`, totalX + 29, y + 6, { align: 'center' })

  // ── Status ──
  y += 20
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Status:', margin, y)
  const statusColor = invoice.status === 'paid' ? [0, 128, 0] : [200, 150, 0]
  doc.setTextColor(...statusColor)
  doc.setFont('helvetica', 'normal')
  doc.text(capitalize(invoice.status), margin + 30, y)

  if (invoice.paid_at) {
    doc.setTextColor(0, 0, 0)
    doc.text(`Paid on: ${formatDate(invoice.paid_at)}`, margin + 30, y + 7)
    if (invoice.payment_method) {
      doc.text(`Payment Method: ${invoice.payment_method}`, margin + 30, y + 14)
    }
    if (invoice.transaction_id) {
      doc.text(`Transaction ID: ${invoice.transaction_id}`, margin + 30, y + 21)
    }
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 15
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' })
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 5, { align: 'center' })

  // ── Save ──
  doc.save(`invoice-${invoice.invoice_number}.pdf`)
}

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchInvoices()
})
</script>

<style>
/* Simple fade-in animation for modals */
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