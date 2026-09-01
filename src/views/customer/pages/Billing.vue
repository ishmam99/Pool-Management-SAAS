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
                    <!-- View button -->
                    <button
                      @click="openInvoiceDrawer(invoice)"
                      class="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white hover:text-cyan-50 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      View Invoice
                    </button>
                    <!-- Download button -->
                    <button
                      @click="downloadInvoicePDF(invoice)"
                      class="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white hover:text-gray-100 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                     Download PDF
                    </button>
                    <!-- Pay Now button (if not paid and balance > 0) -->
                    <button
                      v-if="invoice.status !== 'paid' && parseFloat(invoice.balance_due) > 0"
                      @click="openPayModal(invoice)"
                      class="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white hover:text-emerald-50 rounded-lg transition-colors"
                      title="Pay Now"
                    >
                       Pay Now
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Invoice Preview Drawer -->
    <div v-if="showInvoiceDrawer" class="fixed inset-0 z-50 flex items-start justify-end p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeInvoiceDrawer"></div>

      <!-- Drawer panel -->
      <Transition name="slide-drawer" appear>
        <div class="relative w-full max-w-4xl h-full bg-white shadow-2xl overflow-y-auto">
          <!-- Sticky header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Invoice Preview</h2>
            <div class="flex items-center gap-3">
              <!-- Pay Now button inside drawer -->
              <button
                v-if="selectedInvoice && selectedInvoice.status !== 'paid' && parseFloat(selectedInvoice.balance_due) > 0"
                @click="openPayModal(selectedInvoice)"
                class="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v1m0-1v1m0-6v1" />
                </svg>
                Pay Now
              </button>
              <button
                @click="downloadInvoicePDF(selectedInvoice)"
                class="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button @click="closeInvoiceDrawer" class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Invoice content -->
          <div class="p-6 md:p-10" v-if="selectedInvoice">
            <div class="max-w-3xl mx-auto">
              <!-- Header -->
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">PMS</div>
                    <div>
                      <h1 class="text-2xl font-bold text-gray-900">Pool Management System</h1>
                      <p class="text-sm text-gray-500">Customer Billing</p>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-cyan-600">INVOICE</div>
                  <p class="text-sm text-gray-600 font-medium">{{ selectedInvoice.invoice_number }}</p>
                  <div class="flex items-center justify-end gap-3 mt-2">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(selectedInvoice.status)">
                      {{ formatStatus(selectedInvoice.status) }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {{ selectedInvoice.billing_model === 'subscription' ? 'Subscription' : 'Per Pool' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Bill To -->
              <div class="mt-6 pb-6 border-b border-gray-200">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                <div class="text-gray-900">
                  <p class="text-lg font-semibold">{{ tenantFullMap[selectedInvoice.tenant_id]?.company_name || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ tenantFullMap[selectedInvoice.tenant_id]?.email || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ tenantFullMap[selectedInvoice.tenant_id]?.phone || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ tenantFullMap[selectedInvoice.tenant_id]?.website || 'N/A' }}</p>
                </div>
              </div>

              <!-- Invoice Info -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pb-6 border-b border-gray-200">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Billing Period</p>
                  <p class="text-sm font-medium text-gray-900">{{ moment(selectedInvoice.billing_period_start).format('MMMM YYYY') }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Period Start</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.billing_period_start) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Period End</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.billing_period_end) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Due Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.due_date) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Created Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.created_at) }}</p>
                </div>
              </div>

              <!-- Line Items / Details -->
              <div class="mt-6">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Invoice Details</h3>

                <!-- Per Pool Section -->
                <div v-if="selectedInvoice.billing_model === 'per_pool'">
                  <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="p-3 bg-gray-50 rounded-lg text-center">
                      <p class="text-xs text-gray-500">Active Pools</p>
                      <p class="text-lg font-bold text-gray-900">{{ selectedInvoice.total_active_pools || 0 }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg text-center">
                      <p class="text-xs text-gray-500">Billable Pools</p>
                      <p class="text-lg font-bold text-gray-900">{{ selectedInvoice.billable_pools || 0 }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg text-center">
                      <p class="text-xs text-gray-500">Per Pool Price</p>
                      <p class="text-lg font-bold text-gray-900">{{ formatCurrency(selectedInvoice.per_pool_price) }}</p>
                    </div>
                  </div>

                  <!-- Pool breakdown table -->
                  <div v-if="selectedInvoice.pools_snapshot && selectedInvoice.pools_snapshot.length > 0"
                       class="overflow-x-auto border border-gray-200 rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool ID</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="pool in selectedInvoice.pools_snapshot" :key="pool.id || pool.pool_name">
                          <td class="px-4 py-2 text-sm text-gray-600">{{ 'PL-' + selectedInvoice.tenant_id + pool.pool_id || 'N/A' }}</td>
                          <td class="px-4 py-2 text-sm text-gray-900">
                            {{ pool.pool_name || 'Unnamed Pool' }}
                            <span v-if="pool.is_free" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Free</span>
                            <span v-else class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Billable</span>
                          </td>
                          <td class="px-4 py-2 text-sm text-gray-600">{{ pool.customer_name || 'N/A' }}</td>
                          <td class="px-4 py-2 text-sm text-gray-900 text-right">{{ formatCurrency(pool.price) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Subscription Section -->
                <div v-if="selectedInvoice.billing_model === 'subscription'" class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-xs text-gray-500">Plan Name</p>
                  <p class="text-base font-medium text-gray-900">{{ selectedInvoice.plan_name || 'Subscription Plan' }}</p>
                </div>

                <!-- Financial Summary -->
                <div class="mt-6 pt-4 border-t border-gray-200">
                  <div class="space-y-1.5 max-w-xs ml-auto">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Subtotal</span>
                      <span class="text-gray-900 font-medium">{{ formatCurrency(selectedInvoice.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tax</span>
                      <span class="text-gray-900 font-medium">{{ formatCurrency(selectedInvoice.tax) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Discount</span>
                      <span class="text-gray-900 font-medium">-{{ formatCurrency(selectedInvoice.discount) }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                      <span class="text-gray-900">TOTAL</span>
                      <span class="text-cyan-600">{{ formatCurrency(selectedInvoice.total) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Info (if paid) -->
              <div v-if="selectedInvoice.status === 'paid'" class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg ring-1 ring-green-200">
                  <div>
                    <p class="text-xs text-green-600 uppercase tracking-wider">Paid At</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.paid_at) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-green-600 uppercase tracking-wider">Payment Method</p>
                    <p class="text-sm font-medium text-gray-900">{{ selectedInvoice.payment_method || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-green-600 uppercase tracking-wider">Transaction ID</p>
                    <p class="text-sm font-medium text-gray-900">{{ selectedInvoice.transaction_id || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Terms -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Terms &amp; Conditions</h3>
                <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li v-for="term in INVOICE_TERMS" :key="term">{{ term }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ==================== PAYMENT MODAL ==================== -->
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
              <div class="flex justify-between">
                <span class="text-gray-500">Invoice</span>
                <span class="font-mono font-medium">{{ payModalInvoice.invoice_number }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Amount Due</span>
                <span class="font-bold text-lg text-cyan-600">${{ formatAmount(payModalInvoice.balance_due || payModalInvoice.total) }}</span>
              </div>
            </div>

            <!-- Payment Form -->
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
const tenants = ref([])          // full tenant objects
const showInvoiceDrawer = ref(false)
const selectedInvoice = ref(null)

// Payment modal state
const payModalInvoice = ref(null)
const paymentForm = ref({
  name: '',
  number: '',
  expiry: '',
  cvc: ''
})
const payLoading = ref(false)

// ==========================================================
// COMPUTED
// ==========================================================
const tenantMap = computed(() => {
  const map = {}
  tenants.value.forEach(t => {
    map[t.id] = t.company_name || t.legal_name || 'Unnamed Tenant'
  })
  return map
})

const tenantFullMap = computed(() => {
  const map = {}
  tenants.value.forEach(t => {
    map[t.id] = t
  })
  return map
})

const summary = computed(() => {
  const totalPaid = invoices.value.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0)
  const balanceDue = invoices.value.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0)
  return {
    totalPaid,
    balanceDue,
    totalInvoices: invoices.value.length,
  }
})

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
  if (tenantIds.length === 0) {
    tenants.value = []
    return
  }

  try {
    const responses = await Promise.all(
      tenantIds.map(id => api().get(`/tenant/tenants/${id}`))
    )
    tenants.value = responses.map(res => {
      const data = res.data?.data || res.data
      return data
    })
  } catch (error) {
    console.error('Failed to fetch tenant details:', error)
    // Keep tenants empty – will show 'Unknown Tenant'
  }
}

// ==========================================================
// DRAWER CONTROLS
// ==========================================================
const openInvoiceDrawer = (invoice) => {
  selectedInvoice.value = invoice
  showInvoiceDrawer.value = true
}

const closeInvoiceDrawer = () => {
  showInvoiceDrawer.value = false
  selectedInvoice.value = null
}

// ==========================================================
// PAYMENT MODAL CONTROLS
// ==========================================================
const openPayModal = (invoice) => {
  // Close drawer if open (optional)
  if (showInvoiceDrawer.value) {
    closeInvoiceDrawer()
  }
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

const formatAmount = (value) => {
  if (value == null) return '0.00'
  return parseFloat(value).toFixed(2)
}

// ==========================================================
// HANDLE PAYMENT
// ==========================================================
const handlePayment = async () => {
  if (!payModalInvoice.value) return
  payLoading.value = true

  try {
    // Using the same endpoint as the provided code
    await api().post(`/tenant/my-invoices/${payModalInvoice.value.id}/pay`, {
      payment_method: 'stripe'
      // In a real implementation, you would send card details to a payment gateway.
      // For demo, we just call the API to mark as paid.
    })

    await Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: `Invoice ${payModalInvoice.value.invoice_number} has been paid.`,
      timer: 3000,
      showConfirmButton: false,
    })

    closePayModal()
    // Refresh invoices and close drawer if open
    await fetchInvoices()
    if (showInvoiceDrawer.value) {
      closeInvoiceDrawer()
    }
  } catch (error) {
    console.error('Payment failed:', error)
    Swal.fire('Payment Failed', getApiErrorMessage(error), 'error')
  } finally {
    payLoading.value = false
  }
}


// ==========================================================
// PDF GENERATION (fully inline)
// ==========================================================
const PDF_MARGIN = 20
const PDF_PAGE_WIDTH = 210
const PDF_PAGE_HEIGHT = 297
const PDF_CONTENT_WIDTH = PDF_PAGE_WIDTH - PDF_MARGIN * 2

const pdfColors = {
  brand: [6, 182, 212],        // cyan-500
  brandDark: [8, 145, 178],    // cyan-600
  brandLight: [236, 254, 255], // cyan-50
  dark: [30, 41, 59],
  text: [71, 85, 105],
  muted: [148, 163, 184],
  border: [226, 232, 240],
  zebra: [248, 250, 252],
  white: [255, 255, 255],
  paid: [21, 128, 61],
  paidBg: [220, 252, 231],
  pending: [180, 83, 9],
  pendingBg: [254, 243, 199],
  overdue: [185, 28, 28],
  overdueBg: [254, 226, 226],
  cancelled: [100, 116, 139],
  cancelledBg: [241, 245, 249],
  subscription: [37, 99, 235],
  subscriptionBg: [219, 234, 254],
  perPool: [124, 58, 237],
  perPoolBg: [245, 243, 255],
  free: [21, 128, 61],
  freeBg: [220, 252, 231],
  billable: [37, 99, 235],
  billableBg: [219, 234, 254]
}

const pdfFormatCurrency = (amount) => {
  if (amount == null || amount === '') return '$0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(num)
}

const pdfFormatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const pdfFormatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const pdfCheckPageBreak = (doc, cursorY, neededHeight) => {
  if (cursorY + neededHeight > PDF_PAGE_HEIGHT - PDF_MARGIN - 14) {
    doc.addPage()
    return PDF_MARGIN
  }
  return cursorY
}

const pdfTruncateText = (doc, text, maxWidth) => {
  let str = String(text)
  if (doc.getTextWidth(str) <= maxWidth) return str
  while (str.length > 1 && doc.getTextWidth(str + '…') > maxWidth) {
    str = str.slice(0, -1)
  }
  return str + '…'
}

const pdfStatusColors = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'paid') return { fg: pdfColors.paid, bg: pdfColors.paidBg }
  if (s === 'pending') return { fg: pdfColors.pending, bg: pdfColors.pendingBg }
  if (s === 'overdue') return { fg: pdfColors.overdue, bg: pdfColors.overdueBg }
  return { fg: pdfColors.cancelled, bg: pdfColors.cancelledBg }
}

const pdfDrawBadge = (doc, text, x, y, fg, bg, align = 'left') => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  const textWidth = doc.getTextWidth(text.toUpperCase())
  const paddingX = 3
  const badgeWidth = textWidth + paddingX * 2
  const badgeHeight = 5.5
  const drawX = align === 'right' ? x - badgeWidth : x

  doc.setFillColor(...bg)
  doc.roundedRect(drawX, y, badgeWidth, badgeHeight, 2.5, 2.5, 'F')
  doc.setTextColor(...fg)
  doc.text(text.toUpperCase(), drawX + paddingX, y + 3.9)
  return badgeWidth
}

const pdfDrawDivider = (doc, y, color = pdfColors.border) => {
  doc.setDrawColor(...color)
  doc.setLineWidth(0.3)
  doc.line(PDF_MARGIN, y, PDF_MARGIN + PDF_CONTENT_WIDTH, y)
  return y + 4
}

const pdfDrawSectionHeader = (doc, title, y, accentColor = pdfColors.brand) => {
  doc.setFillColor(...accentColor)
  doc.roundedRect(PDF_MARGIN, y, 2.5, 6.5, 1, 1, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...pdfColors.dark)
  doc.text(title.toUpperCase(), PDF_MARGIN + 6, y + 5)
  y += 6.5 + 3
  return pdfDrawDivider(doc, y, pdfColors.border) + 2
}

const pdfDrawHeader = (doc, invoice, tenant) => {
  const bandHeight = 30
  doc.setFillColor(250, 250, 252)
  doc.rect(0, 0, PDF_PAGE_WIDTH, bandHeight, 'F')
  doc.setFillColor(...pdfColors.brand)
  doc.rect(0, bandHeight - 0.8, PDF_PAGE_WIDTH, 0.8, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.setTextColor(...pdfColors.dark)
  doc.text(COMPANY_NAME, PDF_MARGIN, 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...pdfColors.muted)
  doc.text('Customer Billing', PDF_MARGIN, 20)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...pdfColors.brandDark)
  doc.text('INVOICE', PDF_PAGE_WIDTH - PDF_MARGIN, 14, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...pdfColors.muted)
  doc.text(invoice.invoice_number || 'N/A', PDF_PAGE_WIDTH - PDF_MARGIN, 20, { align: 'right' })

  let y = bandHeight + 10

  const statusColors = pdfStatusColors(invoice.status)
  const modelLabel = invoice.billing_model === 'subscription' ? 'Subscription' : 'Per Pool'

  doc.setFontSize(8)
  doc.setTextColor(...pdfColors.muted)
  doc.setFont('helvetica', 'normal')
  doc.text('Status', PDF_MARGIN, y)
  pdfDrawBadge(doc, invoice.status || 'N/A', PDF_MARGIN, y + 2, statusColors.fg, statusColors.bg)

  doc.text('Billing Model', PDF_MARGIN + 45, y)
  pdfDrawBadge(doc, modelLabel, PDF_MARGIN + 45, y + 2, pdfColors.perPool, pdfColors.perPoolBg)

  y += 14
  y = pdfDrawDivider(doc, y, pdfColors.border)
  return y + 2
}

const pdfDrawTenantInfo = (doc, invoice, tenant, y) => {
  y = pdfCheckPageBreak(doc, y, 30)
  y = pdfDrawSectionHeader(doc, 'Bill To', y)

  const lines = [
    ['Company', tenant?.company_name || 'N/A'],
    ['Email', tenant?.email || 'N/A'],
    ['Phone', tenant?.phone || 'N/A'],
    ['Website', tenant?.website || 'N/A']
  ]

  doc.setFontSize(9)
  lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...pdfColors.muted)
    doc.text(`${label}:`, PDF_MARGIN, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...pdfColors.dark)
    doc.text(String(value), PDF_MARGIN + 30, y)
    y += 5.5
  })

  return y + 4
}

const pdfDrawBillingInfo = (doc, invoice, y) => {
  y = pdfCheckPageBreak(doc, y, 35)
  y = pdfDrawSectionHeader(doc, 'Invoice Information', y, pdfColors.brand)

  const lines = [
    ['Billing Period', moment(invoice.billing_period_start).format('MMMM YYYY')],
    ['Period Start', pdfFormatDate(invoice.billing_period_start)],
    ['Period End', pdfFormatDate(invoice.billing_period_end)],
    ['Due Date', pdfFormatDate(invoice.due_date)],
    ['Created Date', pdfFormatDate(invoice.created_at)]
  ]

  doc.setFontSize(9)
  lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...pdfColors.muted)
    doc.text(`${label}:`, PDF_MARGIN, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...pdfColors.dark)
    doc.text(String(value), PDF_MARGIN + 35, y)
    y += 5.5
  })

  return y + 4
}

const pdfDrawInvoiceDetails = (doc, invoice, y) => {
  y = pdfCheckPageBreak(doc, y, 55)
  y = pdfDrawSectionHeader(doc, 'Invoice Details', y, pdfColors.perPool)

  doc.setFontSize(9)

  if (invoice.billing_model === 'subscription') {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...pdfColors.muted)
    doc.text('Plan Name:', PDF_MARGIN, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...pdfColors.dark)
    doc.text(invoice.plan_name || 'Subscription Plan', PDF_MARGIN + 35, y)
    y += 7
  } else {
    const poolLines = [
      ['Active Pools', String(invoice.total_active_pools ?? 0)],
      ['Billable Pools', String(invoice.billable_pools ?? 0)],
      ['Per Pool Price', pdfFormatCurrency(invoice.per_pool_price)]
    ]
    poolLines.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...pdfColors.muted)
      doc.text(`${label}:`, PDF_MARGIN, y)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...pdfColors.dark)
      doc.text(value, PDF_MARGIN + 35, y)
      y += 5.5
    })
    y += 2
  }

  const financialRows = [
    ['Subtotal', pdfFormatCurrency(invoice.subtotal), pdfColors.text],
    ['Tax', pdfFormatCurrency(invoice.tax), pdfColors.pending],
    ['Discount', `- ${pdfFormatCurrency(invoice.discount)}`, pdfColors.paid]
  ]

  financialRows.forEach(([label, value, color]) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...pdfColors.text)
    doc.text(label, PDF_MARGIN, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...color)
    doc.text(value, PDF_PAGE_WIDTH - PDF_MARGIN, y, { align: 'right' })
    y += 6
  })

  y += 2

  const totalBoxHeight = 14
  doc.setFillColor(...pdfColors.brandLight)
  doc.roundedRect(PDF_MARGIN, y, PDF_CONTENT_WIDTH, totalBoxHeight, 2, 2, 'F')
  doc.setDrawColor(...pdfColors.brand)
  doc.setLineWidth(0.4)
  doc.roundedRect(PDF_MARGIN, y, PDF_CONTENT_WIDTH, totalBoxHeight, 2, 2, 'S')

  doc.setFillColor(...pdfColors.brand)
  doc.roundedRect(PDF_MARGIN, y, 3, totalBoxHeight, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...pdfColors.brandDark)
  doc.text('TOTAL DUE', PDF_MARGIN + 8, y + 9)
  doc.setFontSize(14)
  doc.text(pdfFormatCurrency(invoice.total), PDF_PAGE_WIDTH - PDF_MARGIN - 4, y + 9.5, { align: 'right' })

  y += totalBoxHeight + 8
  return y
}

const pdfDrawPoolBreakdownTable = (doc, invoice, y) => {
  const pools = invoice.pools_snapshot
  if (invoice.billing_model !== 'per_pool' || !Array.isArray(pools) || pools.length === 0) {
    return y
  }

  y = pdfCheckPageBreak(doc, y, 20)
  y = pdfDrawSectionHeader(doc, 'Pool Breakdown', y, pdfColors.perPool)

  const colX = {
    pool: PDF_MARGIN + 2,
    desc: PDF_MARGIN + 24,
    customer: PDF_MARGIN + 82,
    price: PDF_MARGIN + 122,
    status: PDF_MARGIN + 144
  }
  const colWidth = {
    pool: 20,
    desc: 55,
    customer: 38,
    price: 20
  }

  const drawTableHeaderRow = (yPos) => {
    doc.setFillColor(...pdfColors.brandLight)
    doc.roundedRect(PDF_MARGIN, yPos - 4.5, PDF_CONTENT_WIDTH, 7, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...pdfColors.brandDark)
    doc.text('POOL ID', colX.pool, yPos)
    doc.text('DESCRIPTION', colX.desc, yPos)
    doc.text('CUSTOMER', colX.customer, yPos)
    doc.text('PRICE', colX.price, yPos)
    doc.text('STATUS', colX.status, yPos)
    return yPos + 5
  }

  y = drawTableHeaderRow(y)

  doc.setFontSize(8.5)

  pools.forEach((pool, idx) => {
    const prevY = y
    y = pdfCheckPageBreak(doc, y, 7)
    if (y !== prevY) {
      y = drawTableHeaderRow(y)
    }

    if (idx % 2 === 0) {
      doc.setFillColor(...pdfColors.zebra)
      doc.rect(PDF_MARGIN, y - 3.5, PDF_CONTENT_WIDTH, 6, 'F')
    }

    const poolId = pool.pool_id == null ? 'N/A' : 'PL-' + invoice.tenant_id + pool.pool_id
    const poolName = pool.pool_name == null ? 'Unnamed Pool' : pool.pool_name
    const customerName = pool.customer_name === 'N/A' || !pool.customer_name ? 'N/A' : pool.customer_name
    const price = pdfFormatCurrency(pool.price)
    const statusLabel = pool.is_free ? 'Free' : 'Billable'
    const badgeColors = pool.is_free
      ? { fg: pdfColors.free, bg: pdfColors.freeBg }
      : { fg: pdfColors.billable, bg: pdfColors.billableBg }

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...pdfColors.dark)
    doc.text(pdfTruncateText(doc, poolId, colWidth.pool), colX.pool, y)
    doc.text(pdfTruncateText(doc, poolName, colWidth.desc), colX.desc, y)
    doc.text(pdfTruncateText(doc, customerName, colWidth.customer), colX.customer, y)

    doc.setFont('helvetica', 'bold')
    doc.text(price, colX.price, y)

    pdfDrawBadge(doc, statusLabel, colX.status, y - 4, badgeColors.fg, badgeColors.bg)

    y += 6.5
  })

  return y + 4
}

const pdfDrawPaymentInfo = (doc, invoice, y) => {
  if (invoice.status !== 'paid') return y

  y = pdfCheckPageBreak(doc, y, 28)
  y = pdfDrawSectionHeader(doc, 'Payment Information', y, pdfColors.paid)

  doc.setFillColor(...pdfColors.paidBg)
  doc.roundedRect(PDF_MARGIN, y - 4, PDF_CONTENT_WIDTH, 20, 2, 2, 'F')

  const lines = [
    ['Paid At', pdfFormatDate(invoice.paid_at)],
    ['Payment Method', invoice.payment_method || 'N/A'],
    ['Transaction ID', invoice.transaction_id || 'N/A']
  ]

  let lineY = y + 1
  doc.setFontSize(9)
  lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...pdfColors.text)
    doc.text(`${label}:`, PDF_MARGIN + 4, lineY)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...pdfColors.paid)
    doc.text(String(value), PDF_MARGIN + 42, lineY)
    lineY += 5.5
  })

  return y + 20 + 4
}

const pdfDrawTermsAndConditions = (doc, y) => {
  y = pdfCheckPageBreak(doc, y, 35)
  y = pdfDrawSectionHeader(doc, 'Terms & Conditions', y, pdfColors.muted)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...pdfColors.text)

  INVOICE_TERMS.forEach((term) => {
    doc.text(`• ${term}`, PDF_MARGIN + 4, y)
    y += 5.5
  })

  return y + 4
}

const pdfDrawFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const footerY = PDF_PAGE_HEIGHT - 14

    doc.setDrawColor(...pdfColors.border)
    doc.setLineWidth(0.4)
    doc.line(PDF_MARGIN, footerY - 6, PDF_PAGE_WIDTH - PDF_MARGIN, footerY - 6)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...pdfColors.brandDark)
    doc.text(`Generated by ${COMPANY_NAME}`, PDF_MARGIN, footerY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...pdfColors.muted)
    doc.text('Customer Billing System', PDF_MARGIN, footerY + 4)

    doc.text(
      `Generated on: ${pdfFormatDateTime(new Date())}`,
      PDF_PAGE_WIDTH - PDF_MARGIN,
      footerY,
      { align: 'right' }
    )
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...pdfColors.brandDark)
    doc.text(
      `Page ${i} of ${pageCount}`,
      PDF_PAGE_WIDTH - PDF_MARGIN,
      footerY + 4,
      { align: 'right' }
    )
  }
}

// Main PDF generation function
const generateInvoicePDF = (invoice) => {
  if (!invoice) return

  const tenant = tenantFullMap.value[invoice.tenant_id] || null

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  let y = pdfDrawHeader(doc, invoice, tenant)
  y = pdfDrawTenantInfo(doc, invoice, tenant, y)
  y = pdfDrawBillingInfo(doc, invoice, y)
  y = pdfDrawInvoiceDetails(doc, invoice, y)
  y = pdfDrawPoolBreakdownTable(doc, invoice, y)
  y = pdfDrawPaymentInfo(doc, invoice, y)
  y = pdfDrawTermsAndConditions(doc, y)
  pdfDrawFooter(doc)

  const fileName = `Invoice-${invoice.invoice_number || 'invoice'}.pdf`
  doc.save(fileName)
}

// Direct download function (called from buttons)
const downloadInvoicePDF = (invoice) => {
  generateInvoicePDF(invoice)
}

// ==========================================================
// WATCH & LIFECYCLE
// ==========================================================
watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return
    fetchInvoices()
  }
)
watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return
    fetchInvoices()
  }
)

onMounted(() => {
  fetchInvoices()
})
</script>

<style scoped>
/* Slide drawer animation */
.slide-drawer-enter-active,
.slide-drawer-leave-active {
  transition: all 0.3s ease;
}
.slide-drawer-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-drawer-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Payment modal fade-in */
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