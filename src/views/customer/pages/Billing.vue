<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/40 p-4 md:p-8">
    <div v-if="loading" class=" mx-auto animate-pulse space-y-6">
      <div class="h-10 w-48 bg-gray-200 rounded-xl"></div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-24 bg-gray-200 rounded-2xl"></div>
      </div>
      <div class="h-64 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else class=" mx-auto">
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
            <thead class="!bg-sky-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              
                <th class="px-6 py-3 border-e border-slate-300">Invoice</th>
                <th class="px-6 py-3 border-e border-slate-300">Date</th>
                <th class="px-6 py-3 border-e border-slate-300">Due</th>
                <th class="px-6 py-3 border-e border-slate-300">Amount</th>
                <th class="px-6 py-3 border-e border-slate-300">Balance</th>
                <th class="px-6 py-3 border-e border-slate-300">Status</th>
                <th class="px-6 py-3 border-e border-slate-300 text-right">Actions</th>
              
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="invoice in invoices" :key="invoice.id || invoice.invoice_number" class="hover:bg-gray-50/80 transition">
                <td class="px-6 py-4 border-b border-e border-slate-300">
                  <div class="font-medium text-gray-900">{{ invoice.invoice_number || `#${invoice.id}` }}</div>
                  <div class="text-xs text-gray-500">Agreement #{{ invoice.service_agreement_id || '—' }}</div>
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
                  <router-link
  :to="{ path: `/customer/billing/${invoice.id}`, query: { type: 'invoice' } }"
  class="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700"
>
  View
  <i class="ri-arrow-right-s-line"></i>
</router-link>
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
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatCurrency, formatDate, formatStatus, statusBadgeClass } from '../utils/formatters.js'
import { useAuthStore } from '../../../store/AuthStore.js'

const authStore = useAuthStore()

const loading = ref(true)
const invoices = ref([])

const summary = computed(() => {
  const totalPaid = invoices.value.reduce((sum, invoice) => sum + Number(invoice.amount_paid || 0), 0)
  const balanceDue = invoices.value.reduce((sum, invoice) => sum + Number(invoice.balance_due || 0), 0)
  return {
    totalPaid,
    balanceDue,
    totalInvoices: invoices.value.length,
  }
})

const fetchInvoices = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getInvoices()
    invoices.value = Array.isArray(data) ? data : data?.data || data?.invoices || []
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Invoices', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return

    fetchInvoices()
  }
)


onMounted(fetchInvoices)
</script>

<style scoped>
/* Style even rows */
tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* Style odd rows */
tr:nth-child(odd) {
  background-color: #ffffff;
}

</style>