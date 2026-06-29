<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <router-link to="/provider/billing/invoices" class="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium mb-4">
          <i class="ri-arrow-left-line"></i>
          Back to Invoice List
        </router-link>
        <h1 class="text-3xl font-bold text-slate-900">Create Invoice</h1>
        <p class="text-slate-500 mt-1">Generate a new invoice with line items for a customer.</p>
      </div>

      <form class="space-y-6" @submit.prevent="submitInvoice">
        <!-- Customer & dates -->
        <div class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 class="text-lg font-semibold text-slate-900">Invoice Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Customer <span class="text-red-500">*</span></label>
              <select v-model="form.customer_id" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/40 outline-none">
                <option value="" disabled>Select customer</option>
                <option v-for="c in customers" :key="c.id" :value="String(c.id)">{{ c.contact_name || c.name }} (#{{ c.id }})</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Service Agreement</label>
              <select v-model="form.service_agreement_id" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none">
                <option value="" disabled>Select service agreement</option>
                <option
                  v-if="selectedCustomerAgreements.length === 0"
                  value=""
                  disabled
                >
                  {{ selectedCustomer ? 'No agreements available for this customer' : 'Choose a customer first' }}
                </option>
                <option
                  v-for="agreement in selectedCustomerAgreements"
                  :key="agreement.id"
                  :value="String(agreement.id)"
                >
                  {{ agreement.name || agreement.title || `Agreement #${agreement.id}` }}
                </option>
              </select>
              <p class="text-xs text-slate-400 mt-2">
                {{ selectedCustomerAgreements.length ? 'Select an agreement from the chosen customer.' : 'Choose a customer with active agreements.' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Work Order ID</label>
              <input v-model.number="form.work_order_id" type="number" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Invoice Date <span class="text-red-500">*</span></label>
              <input v-model="form.invoice_date" type="date" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Due Date <span class="text-red-500">*</span></label>
              <input v-model="form.due_date" type="date" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Billing Period Start</label>
              <input v-model="form.billing_period_start" type="date" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Billing Period End</label>
              <input v-model="form.billing_period_end" type="date" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
        </div>

        <!-- Line items -->
        <div class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-900">Line Items</h2>
            <button type="button" class="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1" @click="addLineItem">
              <i class="ri-add-line"></i> Add Item
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(item, index) in form.line_items" :key="index" class="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div class="md:col-span-5">
                <label class="block text-xs text-slate-500 mb-1">Description</label>
                <input v-model="item.description" type="text" required placeholder="Weekly Pool Service" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs text-slate-500 mb-1">Qty</label>
                <input v-model.number="item.quantity" type="number" min="1" step="1" required class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" @input="recalculateTotals" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs text-slate-500 mb-1">Unit Price</label>
                <input v-model.number="item.unit_price" type="number" min="0" step="0.01" required class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" @input="recalculateTotals" />
              </div>
              <div class="md:col-span-2 flex items-end">
                <label class="flex items-center gap-2 text-sm text-slate-600 pb-2">
                  <input v-model="item.taxable" :true-value="1" :false-value="0" type="checkbox" class="rounded" />
                  Taxable
                </label>
              </div>
              <div class="md:col-span-1 flex items-end justify-end">
                <button v-if="form.line_items.length > 1" type="button" class="text-red-500 hover:text-red-600 p-2" @click="removeLineItem(index)">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Totals</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Subtotal</label>
              <input v-model.number="form.subtotal" type="number" step="0.01" min="0" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none bg-slate-50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tax</label>
              <input v-model.number="form.tax" type="number" step="0.01" min="0" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Discount</label>
              <input v-model.number="form.discount" type="number" step="0.01" min="0" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <p class="mt-4 text-lg font-bold text-slate-900">Total: {{ formatCurrency(computedTotal) }}</p>
        </div>

        <button type="submit" :disabled="submitting" class="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-sky-700 hover:to-cyan-700 disabled:opacity-50 transition">
          {{ submitting ? 'Creating...' : 'Create Invoice' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'
import { financialApi, getApiErrorMessage } from '../../../../services/financialApi.js'

const router = useRouter()
const submitting = ref(false)
const customers = ref([])

const today = new Date().toISOString().slice(0, 10)
const dueDefault = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)

const form = reactive({
  customer_id: null,
  service_agreement_id: null,
  work_order_id: null,
  invoice_date: today,
  due_date: dueDefault,
  billing_period_start: '',
  billing_period_end: '',
  subtotal: 0,
  tax: 0,
  discount: 0,
  line_items: [
    { description: '', quantity: 1, unit_price: 0, taxable: 1 },
  ],
})

const selectedCustomer = computed(() => {
  return customers.value.find((customer) => String(customer.id) === String(form.customer_id)) || null
})

const selectedCustomerAgreements = computed(() => {
  return selectedCustomer.value?.agreements || []
})

watch(
  () => form.customer_id,
  () => {
    form.service_agreement_id = null
  }
)

const computedTotal = computed(() => {
  return Math.max(0, Number(form.subtotal || 0) + Number(form.tax || 0) - Number(form.discount || 0))
})

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v) || 0)

const recalculateTotals = () => {
  form.subtotal = form.line_items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
  }, 0)
}

const addLineItem = () => {
  form.line_items.push({ description: '', quantity: 1, unit_price: 0, taxable: 1 })
}

const removeLineItem = (index) => {
  form.line_items.splice(index, 1)
  recalculateTotals()
}

const fetchCustomers = async () => {
  try {
    const response = await api().get('customer-management/customers-advance', {
      params: { with: 'agreements' },
    })
    customers.value = response.data?.data || response.data || []
  } catch (e) {
    console.error(e)
  }
}

const submitInvoice = async () => {
  recalculateTotals()
  submitting.value = true
  try {
    const payload = {
      customer_id: Number(form.customer_id),
      invoice_date: form.invoice_date,
      due_date: form.due_date,
      subtotal: form.subtotal,
      tax: form.tax || 0,
      discount: form.discount || 0,
      line_items: form.line_items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        taxable: Number(item.taxable),
      })),
    }
    if (form.service_agreement_id) payload.service_agreement_id = Number(form.service_agreement_id)
    if (form.work_order_id) payload.work_order_id = form.work_order_id
    if (form.billing_period_start) payload.billing_period_start = form.billing_period_start
    if (form.billing_period_end) payload.billing_period_end = form.billing_period_end

    await financialApi.createInvoice(payload)
    await Swal.fire({ icon: 'success', title: 'Invoice Created', timer: 2000, showConfirmButton: false })
    router.push('/provider/billing/invoices')
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Create Failed', text: getApiErrorMessage(error) })
  } finally {
    submitting.value = false
  }
}

onMounted(fetchCustomers)
</script>
