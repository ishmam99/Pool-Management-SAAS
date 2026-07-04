<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/40 p-4 md:p-8">
    <div v-if="loading" class=" mx-auto animate-pulse space-y-6">
      <div class="h-8 w-40 bg-gray-200 rounded-lg"></div>
      <div class="h-96 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else-if="invoice" class="-auto">
      <router-link :to="route.query.type == 'payment' ? '/customer/payments' : '/customer/billing'" class="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-6">
        <i class="ri-arrow-left-line"></i>
        Back to<span class="capitalize">{{ route.query.type }}</span>
      </router-link>

      <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div class="bg-gradient-to-r from-cyan-500 to-sky-600 px-6 py-8 text-white">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p class="text-cyan-100 text-sm mb-1">Invoice</p>
              <h1 class="text-2xl md:text-3xl font-bold">{{ invoice.invoice_number || `#${invoice.id}` }}</h1>
            </div>
            <span class="self-start px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur">
              {{ formatStatus(invoice.status) }}
            </span>
          </div>
        </div>

        <div class="p-6 md:p-8">
          <div class="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Invoice Date</p>
              <p class="font-medium text-gray-900">{{ formatDate(invoice.invoice_date || invoice.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Due Date</p>
              <p class="font-medium text-gray-900">{{ formatDate(invoice.due_date) }}</p>
            </div>
          </div>

          <!-- Line items -->
          <div v-if="lineItems.length" class="mb-8">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Line Items</h3>
            <div class="border rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                    <th class="px-4 py-3 text-right font-medium text-gray-600">Qty</th>
                    <th class="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(item, i) in lineItems" :key="i">
                    <td class="px-4 py-3 text-gray-800">{{ item.description || item.name }}</td>
                    <td class="px-4 py-3 text-right text-gray-600">{{ item.quantity || 1 }}</td>
                    <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(item.amount || item.total || item.price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end mb-8">
            <div class="w-full max-w-xs space-y-2">
              <div v-if="invoice.subtotal != null" class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div v-if="invoice.tax != null" class="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>{{ formatCurrency(invoice.tax) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{{ formatCurrency(invoice.total || invoice.amount) }}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            :disabled="downloading"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold hover:from-cyan-600 hover:to-sky-700 disabled:opacity-60 transition"
            @click="downloadInvoice"
          >
            <i class="ri-download-line"></i>
            {{ downloading ? 'Downloading...' : 'Download PDF' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatCurrency, formatDate, formatStatus } from '../utils/formatters.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const downloading = ref(false)
const invoice = ref(null)

const lineItems = computed(() => invoice.value?.line_items || invoice.value?.items || [])

const fetchInvoice = async () => {
  loading.value = true
  try {
    invoice.value = await customerPortalApi.getInvoice(route.params.id)
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Invoice Not Found', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const downloadInvoice = async () => {
  downloading.value = true
  try {
    const response = await customerPortalApi.downloadInvoice(route.params.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.value?.invoice_number || 'invoice'}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Download Failed', text: getApiErrorMessage(error) })
  } finally {
    downloading.value = false
  }
}

onMounted(fetchInvoice)
</script>
