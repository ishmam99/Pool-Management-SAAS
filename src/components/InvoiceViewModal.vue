<!-- components/invoices/InvoiceViewModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="invoice"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="close"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl animate-fadeInUp">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <h3 class="text-lg font-bold text-gray-900">Invoice</h3>
          <div class="flex items-center gap-2">
            <slot name="actions" :invoice="invoice">
              <button
                v-if="invoice?.status === 'sent'"
                @click="emit('pay', invoice)"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition"
              >
                Pay Now
              </button>
              <button
                @click="emit('download', invoice)"
                class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition"
              >
                Download PDF
              </button>
            </slot>
            <button @click="close" class="p-2 rounded-full hover:bg-gray-200 transition">
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
                <p class="text-sm text-gray-500 mt-1">#{{ invoice.invoice_number }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500">Status</div>
                <StatusBadge :status="invoice.status" class="text-sm font-semibold" />
              </div>
            </div>

            <!-- Company & Customer Info -->
            <div class="grid grid-cols-2 gap-8 my-6">
              <div>
                <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">From</h4>
                <p class="font-medium text-gray-900 mt-1" :style="{ color: brandColor }">
                  {{ tenant?.company_name || 'Pool Management Inc.' }}
                </p>
                <p class="text-sm text-gray-600">{{ tenant?.legal_name || 'Pool Management Inc.' }}</p>
                <p class="text-sm text-gray-600" v-if="tenant?.address">{{ tenant.address }}</p>
                <p class="text-sm text-gray-600" v-if="tenant?.phone">{{ tenant.phone }}</p>
                <p class="text-sm text-gray-600">{{ tenant?.email || 'info@poolmanagement.com' }}</p>
                <p class="text-sm text-gray-600" v-if="tenant?.website">{{ tenant.website }}</p>
                <div class="mt-1 text-xs text-gray-400">
                  <span v-if="tenant?.ein">EIN: {{ tenant.ein }}</span>
                  <span v-if="tenant?.business_license" class="ml-2">License: {{ tenant.business_license }}</span>
                </div>
              </div>
              <div>
                <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill To</h4>
                <p class="font-medium text-gray-900 mt-1">{{ invoice.customer?.contact_name || 'N/A' }}</p>
                <p class="text-sm text-gray-600">Customer ID: #{{ invoice.customer?.id || 'N/A' }}</p>
                <p class="text-sm text-gray-600" v-if="invoice.customer?.email">{{ invoice.customer.email }}</p>
                <p class="text-sm text-gray-600" v-if="invoice.customer?.phone">{{ invoice.customer.phone }}</p>
                <p class="text-sm text-gray-600" v-if="invoice.customer?.address">{{ invoice.customer.address }}</p>
              </div>
            </div>

            <!-- Invoice Details -->
            <div class="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
              <div>
                <p class="text-xs text-gray-500">Invoice Date</p>
                <p class="font-medium">{{ formatDate(invoice.invoice_date) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Due Date</p>
                <p class="font-medium">{{ formatDate(invoice.due_date) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Billing Period</p>
                <p class="font-medium text-sm">{{ formatDate(invoice.billing_period_start) }} – {{ formatDate(invoice.billing_period_end) }}</p>
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
                  <tr v-for="(item, index) in invoice.line_items" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
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
                    <span class="font-medium">${{ formatAmount(invoice.subtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tax</span>
                    <span class="font-medium">${{ formatAmount(invoice.tax) }}</span>
                  </div>
                  <div v-if="invoice.discount > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">Discount</span>
                    <span class="font-medium text-red-600">-${{ formatAmount(invoice.discount) }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span :style="{ color: brandColor }">${{ formatAmount(invoice.total) }}</span>
                  </div>
                  <div v-if="invoice.balance_due > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">Balance Due</span>
                    <span class="font-bold text-red-600">${{ formatAmount(invoice.balance_due) }}</span>
                  </div>
                  <div v-if="invoice.amount_paid > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">Amount Paid</span>
                    <span class="font-medium text-green-600">${{ formatAmount(invoice.amount_paid) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment History -->
            <div v-if="invoice.payments && invoice.payments.length" class="mt-6">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Payment History</h4>
              <div class="space-y-2">
                <div v-for="payment in invoice.payments" :key="payment.id" class="flex justify-between items-center bg-gray-50 rounded-lg p-3">
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
              <p class="text-xs text-gray-400">Thank you for your business with {{ tenant?.company_name || 'Pool Management Inc.' }}!</p>
              <p class="text-xs text-gray-400 mt-1">Generated on {{ new Date().toLocaleString() }}</p>
              <div class="mt-2 text-xs text-gray-400">
                <span v-if="tenant?.billing_model">Billing: {{ tenant.billing_model }}</span>
                <span v-if="tenant?.domain_mode" class="ml-2">Mode: {{ tenant.domain_mode }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  invoice: {
    type: Object,
    default: null
  },
  tenant: {
    type: Object,
    default: () => ({
      company_name: 'Pool Management Inc.',
      brand_color: '#1a73e8',
      email: 'info@poolmanagement.com'
    })
  }
})

const emit = defineEmits(['close', 'pay', 'download'])

const brandColor = computed(() => props.tenant?.brand_color || '#1a73e8')

const formatAmount = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const close = () => {
  document.body.style.overflow = ''
  emit('close')
}
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