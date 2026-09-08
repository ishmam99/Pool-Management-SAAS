<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/40 p-4 md:p-8">
    <!-- Skeleton loading -->
    <div v-if="loading" class="mx-auto animate-pulse space-y-6">
      <div class="h-10 w-48 bg-gray-200 rounded-xl"></div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-24 bg-gray-200 rounded-2xl"></div>
      </div>
      <div class="h-64 bg-gray-200 rounded-2xl"></div>
    </div>

    <!-- Main content -->
    <div v-else class="mx-auto">
      <!-- Header -->
      <header class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-white text-xl shadow-lg">
            <i class="ri-bank-card-line"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Billing</h1>
            <p class="text-gray-500">Invoices, payments, and account balance.</p>
          </div>
        </div>
      </header>

      <!-- Summary cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-emerald-50 rounded-2xl shadow-sm border p-5">
          <div class="text-sm text-gray-500 mb-1">Total Paid</div>
          <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(summary.totalPaid) }}</div>
        </div>
        <div class="bg-amber-50 rounded-2xl shadow-sm border p-5">
          <div class="text-sm text-gray-500 mb-1">Balance Due</div>
          <div class="text-2xl font-bold" :class="summary.balanceDue > 0 ? 'text-red-600' : 'text-gray-800'">
            {{ formatCurrency(summary.balanceDue) }}
          </div>
        </div>
        <div class="bg-sky-50 rounded-2xl shadow-sm border p-5">
          <div class="text-sm text-gray-500 mb-1">Total Invoices</div>
          <div class="text-2xl font-bold text-gray-800">{{ summary.totalInvoices }}</div>
        </div>
      </div>

      <!-- Invoices table -->
      <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Invoices</h2>
        </div>

        <div v-if="invoices.length === 0" class="p-12 text-center text-gray-500">
          <div class="text-4xl mb-3">📄</div>
          No invoices found.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full table-zebra">
            <thead class="bg-sky-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th class="px-6 py-3 border-e border-slate-300">Invoice</th>
                <th class="px-6 py-3 border-e border-slate-300">Tenant Name</th>
                <th class="px-6 py-3 border-e border-slate-300">Date</th>
                <th class="px-6 py-3 border-e border-slate-300">Due</th>
                <th class="px-6 py-3 border-e border-slate-300">Amount</th>
                <th class="px-6 py-3 border-e border-slate-300">Balance</th>
                <th class="px-6 py-3 border-e border-slate-300">Status</th>
                <th class="px-6 py-3 border-e border-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="invoice in invoices" :key="invoice.id || invoice.invoice_number" class="hover:bg-gray-50/80 transition">
                <td class="px-6 py-4 border-b border-e border-slate-300">
                  <div class="font-medium text-gray-900">{{ invoice.invoice_number || `#${invoice.id}` }}</div>
                  <div class="text-xs text-gray-500">Agreement #{{ invoice.service_agreement_id || '—' }}</div>
                </td>
                <td class="px-6 py-4 border-b border-e border-slate-300 text-sm text-gray-600">
                  {{ tenantMap[invoice.tenant_id] || 'Unknown Tenant' }}
                </td>
                <td class="px-6 py-4 border-b border-e border-slate-300 text-sm text-gray-600">{{ formatDate(invoice.invoice_date || invoice.created_at) }}</td>
                <td class="px-6 py-4 border-b border-e border-slate-300 text-sm text-gray-600">{{ formatDate(invoice.due_date) }}</td>
                <td class="px-6 py-4 border-b border-e border-slate-300 font-semibold text-gray-900">{{ formatCurrency(invoice.total || invoice.amount || invoice.subtotal) }}</td>
                <td class="px-6 py-4 border-b border-e border-slate-300 font-semibold text-gray-900">{{ formatCurrency(invoice.balance_due || 0) }}</td>
                <td class="px-6 py-4 border-b border-e border-slate-300">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(invoice.status)">
                    {{ formatStatus(invoice.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 border-b border-e border-slate-300 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openInvoiceModal(invoice)"
                      class="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    >
                      View
                    </button>
                    <button
                      @click="downloadInvoicePDF(invoice)"
                      class="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Download
                    </button>
                    <button
                      v-if="invoice.status !== 'paid' && parseFloat(invoice.balance_due) > 0"
                      @click="openPayModal(invoice)"
                      class="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Pay
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- INVOICE VIEW MODAL (exact copy of your component)            -->
    <!-- ============================================================ -->
    <Teleport to="body">
      <div
        v-if="showInvoiceModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeInvoiceModal"
      >
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl animate-fadeInUp">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <h3 class="text-lg font-bold text-gray-900">Invoice</h3>
            <div class="flex items-center gap-2">
              <button
                v-if="selectedInvoice && selectedInvoice.status === 'sent' && parseFloat(selectedInvoice.balance_due) > 0"
                @click="openPayModal(selectedInvoice)"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition"
              >
                Pay Now
              </button>
              <button
                @click="downloadInvoicePDF(selectedInvoice)"
                class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition"
              >
                Download PDF
              </button>
              <button @click="closeInvoiceModal" class="p-2 rounded-full hover:bg-gray-200 transition">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Invoice Content -->
          <div class="p-8 overflow-y-auto flex-1 bg-white" id="invoice-content">
            <div class="max-w-3xl mx-auto">
              <!-- Invoice Header with Brand Color -->
              <div class="flex justify-between items-start border-b-2 pb-6" :style="{ borderColor: brandColor }">
                <div>
                  <h1 class="text-3xl font-bold" :style="{ color: brandColor }">INVOICE</h1>
                  <p class="text-sm text-gray-500 mt-1">#{{ selectedInvoice?.invoice_number }}</p>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500">Status</div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(selectedInvoice?.status)">
                    {{ formatStatus(selectedInvoice?.status) }}
                  </span>
                </div>
              </div>

              <!-- Company & Customer Info -->
              <div class="grid grid-cols-2 gap-8 my-6">
                  
                <div>
                  <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill From</h4>
                  <p class="font-medium text-gray-900 mt-1" :style="{ color: brandColor }">
                    {{ selectedTenant?.company_name || 'Pool Management Inc.' }}
                  </p>
                  <p class="text-sm text-gray-600">{{ selectedTenant?.legal_name || 'Pool Management Inc.' }}</p>
                  <p class="text-sm text-gray-600" v-if="selectedTenant?.address">{{ selectedTenant.address }}</p>
                  <p class="text-sm text-gray-600" v-if="selectedTenant?.phone">{{ selectedTenant.phone }}</p>
                  <p class="text-sm text-gray-600">{{ selectedTenant?.email || 'info@poolmanagement.com' }}</p>
                  <p class="text-sm text-gray-600" v-if="selectedTenant?.website">{{ selectedTenant.website }}</p>
                  <div class="mt-1 text-xs text-gray-400">
                    <span v-if="selectedTenant?.ein">EIN: {{ selectedTenant.ein }}</span>
                    <span v-if="selectedTenant?.business_license" class="ml-2">License: {{ selectedTenant.business_license }}</span>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill To</h4>
                  <p class="font-medium text-gray-900 mt-1">{{ authStore?.user.name || 'User' }}</p>
                  <p class="text-sm text-gray-600">Customer ID: #{{ authStore?.user?.id || 'N/A' }}</p>
                  <p class="text-sm text-gray-600" v-if="authStore?.user?.email">{{ authStore.user.email }}</p>
                  <p class="text-sm text-gray-600" v-if="authStore?.user?.phone">{{ authStore.user.phone }}</p>
                  <p class="text-sm text-gray-600" v-if="authStore?.user?.address">{{ authStore.user.address }}</p>
                </div>
              
              </div>

              <!-- Invoice Details -->
              <div class="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
                <div>
                  <p class="text-xs text-gray-500">Invoice Date</p>
                  <p class="font-medium">{{ formatDate(selectedInvoice?.invoice_date) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Due Date</p>
                  <p class="font-medium">{{ formatDate(selectedInvoice?.due_date) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Billing Period</p>
                  <p class="font-medium text-sm">{{ formatDate(selectedInvoice?.billing_period_start) }} – {{ formatDate(selectedInvoice?.billing_period_end) }}</p>
                </div>
              </div>

              <!-- Line Items Table -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Line Items</h4>
                <table class="w-full">
                  <thead>
                    <tr :style="{ backgroundColor: brandColor }">
                      <th class="text-left text-xs font-medium text-white uppercase tracking-wider py-2 px-3">#</th>
                      <th class="text-left text-xs font-medium text-white uppercase tracking-wider py-2 px-3">Description</th>
                      <th class="text-right text-xs font-medium text-white uppercase tracking-wider py-2 px-3">Qty</th>
                      <th class="text-right text-xs font-medium text-white uppercase tracking-wider py-2 px-3">Unit Price</th>
                      <th class="text-right text-xs font-medium text-white uppercase tracking-wider py-2 px-3">Total</th>
                      <th class="text-center text-xs font-medium text-white uppercase tracking-wider py-2 px-3">Taxable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in selectedInvoice?.line_items || []" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-2 px-3 text-sm text-gray-500">{{ index + 1 }}</td>
                      <td class="py-2 px-3 text-sm font-medium text-gray-900">{{ item.description || 'Service' }}</td>
                      <td class="py-2 px-3 text-right text-sm">{{ item.quantity || 1 }}</td>
                      <td class="py-2 px-3 text-right text-sm">${{ formatAmount(item.unit_price) }}</td>
                      <td class="py-2 px-3 text-right text-sm font-medium">${{ formatAmount(item.total) }}</td>
                      <td class="py-2 px-3 text-center text-sm">
                        <span :class="item.taxable ? 'text-green-600' : 'text-gray-400'">
                          {{ item.taxable ? '✓' : '—' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Summary -->
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-end">
                  <div class="w-72 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Subtotal</span>
                      <span class="font-medium">${{ formatAmount(selectedInvoice?.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tax</span>
                      <span class="font-medium">${{ formatAmount(selectedInvoice?.tax) }}</span>
                    </div>
                    <div v-if="selectedInvoice?.discount > 0" class="flex justify-between text-sm">
                      <span class="text-gray-600">Discount</span>
                      <span class="font-medium text-red-600">-${{ formatAmount(selectedInvoice.discount) }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span :style="{ color: brandColor }">${{ formatAmount(selectedInvoice?.total) }}</span>
                    </div>
                    <div v-if="selectedInvoice?.balance_due > 0" class="flex justify-between text-sm">
                      <span class="text-gray-600">Balance Due</span>
                      <span class="font-bold text-red-600">${{ formatAmount(selectedInvoice.balance_due) }}</span>
                    </div>
                    <div v-if="selectedInvoice?.amount_paid > 0" class="flex justify-between text-sm">
                      <span class="text-gray-600">Amount Paid</span>
                      <span class="font-medium text-green-600">${{ formatAmount(selectedInvoice.amount_paid) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment History -->
              <div v-if="selectedInvoice?.payments && selectedInvoice.payments.length" class="mt-6">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Payment History</h4>
                <div class="space-y-2">
                  <div v-for="payment in selectedInvoice.payments" :key="payment.id" class="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <div>
                      <p class="text-sm font-medium">{{ formatDate(payment.paid_at) }}</p>
                      <p class="text-xs text-gray-500">Method: {{ payment.method || 'N/A' }}</p>
                      <p class="text-xs text-gray-500" v-if="payment.transaction_id">Txn: {{ payment.transaction_id }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-bold text-green-600">${{ formatAmount(payment.amount) }}</p>
                      <p class="text-xs text-gray-500">Status: {{ payment.status || 'Completed' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-8 pt-4 border-t border-gray-200 text-center">
                <p class="text-xs text-gray-400">Thank you for your business with {{ selectedTenant?.company_name || 'Pool Management Inc.' }}!</p>
                <p class="text-xs text-gray-400 mt-1">Generated on {{ new Date().toLocaleString() }}</p>
                <div class="mt-2 text-xs text-gray-400">
                  <span v-if="selectedTenant?.billing_model">Billing: {{ selectedTenant.billing_model }}</span>
                  <span v-if="selectedTenant?.domain_mode" class="ml-2">Mode: {{ selectedTenant.domain_mode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================================ -->
    <!-- PAYMENT MODAL (updated API)                                   -->
    <!-- ============================================================ -->
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
            <div class="mb-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Invoice</span>
                <span class="font-mono font-medium">{{ payModalInvoice.invoice_number }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Amount Due</span>
                <span class="font-bold text-lg text-cyan-600">${{ formatAmount(payModalInvoice.balance_due || payModalInvoice.total) }}</span>
              </div>
            </div>

            <form @submit.prevent="handlePayment" class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Cardholder Name</label>
                <input
                  type="text"
                  v-model="paymentForm.name"
                  placeholder="John Doe"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition pr-10"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                :disabled="payLoading"
                class="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatCurrency, formatDate, formatStatus, statusBadgeClass } from '../utils/formatters.js'
import { useAuthStore } from '../../../store/AuthStore.js'
import api from '../../../services/api.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'   // <-- new import
import moment from 'moment'

// ==========================================================
// CONSTANTS
// ==========================================================
const COMPANY_NAME = 'Pool Management System'
const INVOICE_TERMS = [
  'Payment is due by the invoice due date.',
  'All charges shown on this invoice are based on the selected billing period.',
  'Any applicable taxes, discounts, or adjustments are reflected in the invoice total.',
  'Please contact Pool Management System if there are any questions regarding this invoice.'
]

// ==========================================================
// STATE
// ==========================================================
const authStore = useAuthStore()

const loading = ref(true)
const invoices = ref([])
const tenants = ref([])

const showInvoiceModal = ref(false)
const selectedInvoice = ref(null)
const selectedTenant = ref(null)

const payModalInvoice = ref(null)
const paymentForm = ref({ name: '', number: '', expiry: '', cvc: '' })
const payLoading = ref(false)

const brandColor = ref('#1a73e8') // default brand color

// ==========================================================
// COMPUTED
// ==========================================================
const tenantMap = computed(() => {
  const map = {}
  tenants.value.forEach(t => { map[t.id] = t.company_name || t.legal_name || 'Unnamed Tenant' })
  return map
})

const tenantFullMap = computed(() => {
  const map = {}
  tenants.value.forEach(t => { map[t.id] = t })
  return map
})

const summary = computed(() => ({
  totalPaid: invoices.value.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0),
  balanceDue: invoices.value.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0),
  totalInvoices: invoices.value.length,
}))

// ==========================================================
// DATA FETCHING
// ==========================================================
const fetchInvoices = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getInvoices()
    invoices.value = Array.isArray(data) ? data : data?.data || data?.invoices || []
    await fetchTenantsForInvoices()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Invoices', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const fetchTenantsForInvoices = async () => {
  const tenantIds = [...new Set(invoices.value.map(inv => inv.tenant_id).filter(id => id != null))]
  if (tenantIds.length === 0) { tenants.value = []; return }
  try {
    const responses = await Promise.all(tenantIds.map(id => api().get(`/tenant/tenants/${id}`)))
    tenants.value = responses.map(res => res.data?.data || res.data)
  } catch (error) {
    console.error('Failed to fetch tenant details:', error)
  }
}

// ==========================================================
// MODAL CONTROLS
// ==========================================================
const openInvoiceModal = (invoice) => {
  selectedInvoice.value = invoice
  selectedTenant.value = tenantFullMap.value[invoice.tenant_id] || null
  showInvoiceModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeInvoiceModal = () => {
  showInvoiceModal.value = false
  selectedInvoice.value = null
  selectedTenant.value = null
  document.body.style.overflow = ''
}

const openPayModal = (invoice) => {
  if (showInvoiceModal.value) closeInvoiceModal()
  payModalInvoice.value = invoice
  paymentForm.value = { name: '', number: '', expiry: '', cvc: '' }
  document.body.style.overflow = 'hidden'
}

const closePayModal = () => {
  payModalInvoice.value = null
  document.body.style.overflow = ''
  payLoading.value = false
}

// --------------------------------------------------------------
//  PDF GENERATION – NEW IMPLEMENTATION (copy from composable)
// --------------------------------------------------------------
const formatAmount = (value) => {
  if (value == null) return '0.00'
  return parseFloat(value).toFixed(2)
}

// (we already have formatDate from imported utils, but we'll keep it here for PDF)
const pdfFormatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const hexToRgb = (hex) => {
  hex = hex.replace('#', '')
  let r, g, b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }
  return { r, g, b }
}

const generateInvoicePDF = (invoice, tenant) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let y = margin

  const brandColor = tenant?.brand_color || '#1a73e8'
  const brandColorRgb = hexToRgb(brandColor)

  // Header with brand color
  doc.setFillColor(brandColorRgb.r, brandColorRgb.g, brandColorRgb.b)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', pageWidth / 2, 30, { align: 'center' })
  y = 55

  // Invoice number & status
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice #:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.invoice_number, margin + 30, y)

  const statusColors = {
    paid: [0, 128, 0],
    sent: [200, 150, 0],
    draft: [128, 128, 128],
    overdue: [200, 0, 0],
    void: [128, 128, 128]
  }
  const color = statusColors[invoice.status] || [128, 128, 128]
  doc.setTextColor(...color)
  doc.setFont('helvetica', 'bold')
  doc.text(capitalize(invoice.status), pageWidth - margin - 30, y)
  doc.setTextColor(0, 0, 0)
  y += 12

  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // FROM section
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('FROM:', margin, y)
  doc.setFont('helvetica', 'normal')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(brandColorRgb.r, brandColorRgb.g, brandColorRgb.b)
  doc.text(tenant?.company_name || 'Pool Management Inc.', margin, y + 5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)

  if (tenant?.legal_name) {
    doc.text(tenant.legal_name, margin, y + 10)
    y += 5
  }
  if (tenant?.address) {
    doc.text(tenant.address, margin, y + 10)
    y += 5
  }
  if (tenant?.phone) {
    doc.text(`Phone: ${tenant.phone}`, margin, y + 10)
    y += 5
  }
  doc.text(tenant?.email || 'info@poolmanagement.com', margin, y + 10)
  y += 5
  if (tenant?.website) {
    doc.text(tenant.website, margin, y + 10)
    y += 5
  }
  if (tenant?.ein || tenant?.business_license) {
    let info = ''
    if (tenant?.ein) info += `EIN: ${tenant.ein}`
    if (tenant?.business_license) info += `  License: ${tenant.business_license}`
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(info, margin, y + 10)
    y += 5
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
  }

  // BILL TO section
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('BILL TO:', pageWidth / 2, y - 20)
  doc.setFont('helvetica', 'normal')

  doc.setFont('helvetica', 'bold')
  doc.text(authStore?.user?.name || 'N/A', pageWidth / 2, y - 15)
  doc.setFont('helvetica', 'normal')

  let customerY = y - 10
  if (authStore.user.email) {
    doc.text(`Email: ${authStore.user.email}`, pageWidth / 2, customerY)
    customerY += 5
  }
  if (authStore.user.phone) {
    doc.text(`Phone: ${authStore?.user.phone}`, pageWidth / 2, customerY)
    customerY += 5
  }
  if (authStore.user.address) {
    doc.text(authStore?.user?.address, pageWidth / 2, customerY)
    customerY += 5
  }
  doc.text(`Customer ID: #${authStore.user?.id || 'N/A'}`, pageWidth / 2, customerY + 5)

  y += 30

  // Invoice details box
  const boxY = y
  const boxHeight = 30
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(margin, boxY, pageWidth - (margin * 2), boxHeight, 4, 4, 'F')

  const colWidth = (pageWidth - (margin * 2)) / 3
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)

  doc.text('Invoice Date', margin + 5, boxY + 8)
  doc.setTextColor(0, 0, 0)
  doc.text(pdfFormatDate(invoice.invoice_date), margin + 5, boxY + 18)

  doc.setTextColor(100, 100, 100)
  doc.text('Due Date', margin + colWidth + 5, boxY + 8)
  doc.setTextColor(0, 0, 0)
  doc.text(pdfFormatDate(invoice.due_date), margin + colWidth + 5, boxY + 18)

  doc.setTextColor(100, 100, 100)
  doc.text('Billing Period', margin + (colWidth * 2) + 5, boxY + 8)
  doc.setTextColor(0, 0, 0)
  doc.text(pdfFormatDate(invoice.billing_period_start), margin + (colWidth * 2) + 5, boxY + 14)
  doc.text(pdfFormatDate(invoice.billing_period_end), margin + (colWidth * 2) + 5, boxY + 22)

  y = boxY + boxHeight + 15

  // Line items table
  if (invoice.line_items && invoice.line_items.length) {
    const tableData = invoice.line_items.map(item => [
      item.description || 'Service',
      item.quantity || 1,
      `$${formatAmount(item.unit_price)}`,
      `$${formatAmount(item.total)}`,
      item.taxable ? 'Yes' : 'No'
    ])
    autoTable(doc, {
      startY: y,
      head: [['Description', 'Qty', 'Unit Price', 'Total', 'Taxable']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [brandColorRgb.r, brandColorRgb.g, brandColorRgb.b],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 25, halign: 'center' }
      }
    })
    y = doc.lastAutoTable.finalY + 10
  } else {
    doc.setFontSize(10)
    doc.text(`Line Items: ${invoice.line_items_count || 0}`, margin, y)
    y += 10
  }

  // Summary
  const summaryX = pageWidth - margin - 70
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  doc.setTextColor(100, 100, 100)
  doc.text('Subtotal', summaryX, y)
  doc.setTextColor(0, 0, 0)
  doc.text(`$${formatAmount(invoice.subtotal)}`, pageWidth - margin, y, { align: 'right' })

  doc.setTextColor(100, 100, 100)
  doc.text('Tax', summaryX, y + 7)
  doc.setTextColor(0, 0, 0)
  doc.text(`$${formatAmount(invoice.tax)}`, pageWidth - margin, y + 7, { align: 'right' })

  if (invoice.discount > 0) {
    doc.setTextColor(100, 100, 100)
    doc.text('Discount', summaryX, y + 14)
    doc.setTextColor(200, 0, 0)
    doc.text(`-$${formatAmount(invoice.discount)}`, pageWidth - margin, y + 14, { align: 'right' })
    y += 7
  }

  y += 10
  doc.setDrawColor(200, 200, 200)
  doc.line(summaryX, y, pageWidth - margin, y)
  y += 5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(brandColorRgb.r, brandColorRgb.g, brandColorRgb.b)
  doc.text('TOTAL', summaryX, y + 5)
  doc.text(`$${formatAmount(invoice.total)}`, pageWidth - margin, y + 5, { align: 'right' })

  if (invoice.balance_due > 0) {
    y += 12
    doc.setFontSize(10)
    doc.setTextColor(200, 0, 0)
    doc.text('Balance Due:', summaryX, y + 3)
    doc.text(`$${formatAmount(invoice.balance_due)}`, pageWidth - margin, y + 3, { align: 'right' })
  }
  if (invoice.amount_paid > 0) {
    y += 8
    doc.setFontSize(9)
    doc.setTextColor(0, 128, 0)
    doc.text('Amount Paid:', summaryX, y + 3)
    doc.text(`$${formatAmount(invoice.amount_paid)}`, pageWidth - margin, y + 3, { align: 'right' })
  }

  y += 15

  // Payment History
  if (invoice.payments && invoice.payments.length) {
    y += 5
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Payment History', margin, y)
    y += 5

    const paymentData = invoice.payments.map(p => [
      pdfFormatDate(p.paid_at),
      p.method || 'N/A',
      p.status || 'Completed',
      `$${formatAmount(p.amount)}`
    ])
    autoTable(doc, {
      startY: y,
      head: [['Date', 'Method', 'Status', 'Amount']],
      body: paymentData,
      theme: 'plain',
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30, halign: 'right' }
      }
    })
    y = doc.lastAutoTable.finalY + 10
  }

  // Footer
  const footerY = pageHeight - 25
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.setFont('helvetica', 'italic')
  doc.text(`Thank you for your business with ${tenant?.company_name || 'Pool Management Inc.'}!`, pageWidth / 2, footerY, { align: 'center' })

  const footerInfo = []
  if (tenant?.phone) footerInfo.push(`Phone: ${tenant.phone}`)
  if (tenant?.email) footerInfo.push(`Email: ${tenant.email}`)
  if (tenant?.website) footerInfo.push(`Web: ${tenant.website}`)
  if (footerInfo.length) {
    doc.setFont('helvetica', 'normal')
    doc.text(footerInfo.join('  |  '), pageWidth / 2, footerY + 5, { align: 'center' })
  }
  doc.setFont('helvetica', 'italic')
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 10, { align: 'center' })
  if (tenant?.billing_model) {
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(`Billing: ${tenant.billing_model}  |  Status: ${tenant?.status || 'active'}`, pageWidth / 2, footerY + 15, { align: 'center' })
  }

  doc.save(`invoice-${invoice.invoice_number}.pdf`)
}

const downloadInvoicePDF = (invoice) => {
  if (!invoice) return
  const tenant = tenantFullMap.value[invoice.tenant_id] || null
  generateInvoicePDF(invoice, tenant)
}

// ==========================================================
// HANDLE PAYMENT (unchanged)
// ==========================================================
const handlePayment = async () => {
  if (!payModalInvoice.value) return
  payLoading.value = true
  const transactionId = 'txn_' + Date.now() + Math.random().toString(36).substr(2, 6)

  try {
    await api().post(`/financial-management/${payModalInvoice.value.id}/payments`, {
      amount: parseFloat(payModalInvoice.value.balance_due || payModalInvoice.value.total),
      method: 'card',
      transaction_id: transactionId
    })

    await Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: `Invoice ${payModalInvoice.value.invoice_number} has been paid.`,
      timer: 3000,
      showConfirmButton: false,
    })

    closePayModal()
    await fetchInvoices()
  } catch (error) {
    console.error('Payment failed:', error)
    Swal.fire('Payment Failed', getApiErrorMessage(error), 'error')
  } finally {
    payLoading.value = false
  }
}

// ==========================================================
// LIFECYCLE
// ==========================================================
watch(() => authStore.customerId, () => fetchInvoices())
onMounted(fetchInvoices)
</script>

<style scoped>
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