<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto">
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Payment Methods</h1>
          <p class="text-slate-500 mt-1">Manage customer cards and ACH payment methods on file.</p>
        </div>
        <button type="button" class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-violet-700 hover:to-purple-700 transition" @click="showAddForm = !showAddForm">
          <i class="ri-add-line text-lg"></i>
          Add Payment Method
        </button>
      </div>

      <!-- Add form -->
      <div v-if="showAddForm" class="mb-6 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Add Payment Method</h2>
        <form class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" @submit.prevent="addMethod">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Customer <span class="text-red-500">*</span></label>
            <select v-model.number="addForm.customer_id" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/40">
              <option :value="null" disabled>Select customer</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.contact_name || c.name }} (#{{ c.id }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Type <span class="text-red-500">*</span></label>
            <select v-model="addForm.type" required class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none">
              <option value="card">Card</option>
              <option value="ach">ACH</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Stripe Payment Method ID <span class="text-red-500">*</span></label>
            <input v-model="addForm.stripe_payment_method_id" type="text" required placeholder="pm_abc123" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Last Four <span class="text-red-500">*</span></label>
            <input v-model="addForm.last_four" type="text" required maxlength="4" placeholder="4242" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm text-slate-700 pb-2.5">
              <input v-model="addForm.is_default" type="checkbox" class="rounded" />
              Set as default
            </label>
          </div>
          <div class="flex items-end gap-2">
            <button type="submit" :disabled="submitting" class="rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
              {{ submitting ? 'Adding...' : 'Save' }}
            </button>
            <button type="button" class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm text-slate-600" @click="showAddForm = false">Cancel</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 space-y-3 animate-pulse">
          <div v-for="i in 4" :key="i" class="h-16 bg-slate-100 rounded-xl"></div>
        </div>

        <div v-else-if="methods.length === 0" class="p-16 text-center">
          <div class="text-5xl mb-4">💳</div>
          <h3 class="text-lg font-semibold text-slate-800">No payment methods on file</h3>
          <p class="text-slate-500 text-sm mt-1">Add a card or ACH method for a customer.</p>
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div v-for="method in methods" :key="method.id" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-slate-50/80 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 text-xl">
                <i :class="method.type === 'ach' ? 'ri-bank-line' : 'ri-bank-card-line'"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-900 capitalize">{{ method.type || 'card' }} •••• {{ method.last_four }}</span>
                  <span v-if="method.is_default" class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Default</span>
                </div>
                <p class="text-sm text-slate-500 mt-0.5">
                  Customer: {{ method.customer?.contact_name || `#${method.customer_id}` }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="!method.is_default"
                type="button"
                class="text-xs font-semibold text-sky-600 hover:text-sky-700 px-3 py-2 rounded-lg hover:bg-sky-50 border border-transparent hover:border-sky-200 transition"
                @click="setDefault(method)"
              >
                Set Default
              </button>
              <button type="button" class="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition" @click="removeMethod(method)">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>{{ pagination.total }} method{{ pagination.total === 1 ? '' : 's' }}</span>
          <div class="flex gap-2">
            <button type="button" :disabled="pagination.current_page <= 1" class="px-3 py-1.5 rounded-lg border disabled:opacity-40" @click="fetchMethods(pagination.current_page - 1)">Prev</button>
            <span>Page {{ pagination.current_page }} / {{ pagination.last_page }}</span>
            <button type="button" :disabled="pagination.current_page >= pagination.last_page" class="px-3 py-1.5 rounded-lg border disabled:opacity-40" @click="fetchMethods(pagination.current_page + 1)">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'
import { financialApi, getApiErrorMessage } from '../../../../services/financialApi.js'

const loading = ref(true)
const submitting = ref(false)
const showAddForm = ref(false)
const methods = ref([])
const customers = ref([])
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })

const addForm = reactive({
  customer_id: null,
  type: 'card',
  stripe_payment_method_id: '',
  last_four: '',
  is_default: false,
})

const fetchCustomers = async () => {
  try {
    const response = await api().get('customer-management/customers-advance')
    customers.value = response.data?.data || response.data || []
  } catch (e) {
    console.error(e)
  }
}

const fetchMethods = async (page = 1) => {
  loading.value = true
  try {
    const payload = await financialApi.getPaymentMethods({ page })
    methods.value = payload?.data || []
    pagination.value = {
      current_page: payload?.current_page || 1,
      last_page: payload?.last_page || 1,
      total: payload?.total || methods.value.length,
    }
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const addMethod = async () => {
  submitting.value = true
  try {
    await financialApi.addPaymentMethod({ ...addForm })
    showAddForm.value = false
    addForm.stripe_payment_method_id = ''
    addForm.last_four = ''
    addForm.is_default = false
    await Swal.fire({ icon: 'success', title: 'Payment Method Added', timer: 2000, showConfirmButton: false })
    await fetchMethods()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Add Failed', text: getApiErrorMessage(error) })
  } finally {
    submitting.value = false
  }
}

const setDefault = async (method) => {
  try {
    await financialApi.setDefaultPaymentMethod(method.id)
    await Swal.fire({ icon: 'success', title: 'Default Updated', timer: 1500, showConfirmButton: false })
    await fetchMethods(pagination.value.current_page)
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Update Failed', text: getApiErrorMessage(error) })
  }
}

const removeMethod = async (method) => {
  const confirm = await Swal.fire({
    icon: 'warning',
    title: 'Remove Payment Method?',
    text: `Remove •••• ${method.last_four} from customer?`,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
  })
  if (!confirm.isConfirmed) return
  try {
    await financialApi.removePaymentMethod(method.id)
    await Swal.fire({ icon: 'success', title: 'Removed', timer: 1500, showConfirmButton: false })
    await fetchMethods(pagination.value.current_page)
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Remove Failed', text: getApiErrorMessage(error) })
  }
}

onMounted(async () => {
  await fetchCustomers()
  await fetchMethods()
})
</script>
