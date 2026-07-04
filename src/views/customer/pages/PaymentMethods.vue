<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 p-4 md:p-8">
    <div class=" mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-bank-card-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p class="text-gray-500">Manage your saved payment cards and default billing method.</p>
        </div>
      </header>

      <div class="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <div v-if="paymentMethods.length" class="space-y-3 mb-6">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center justify-between p-4 rounded-xl border border-gray-100"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <i class="ri-bank-card-line"></i>
              </div>
              <div>
                <div class="font-medium text-gray-900 capitalize">{{ method.type || 'Card' }} •••• {{ method.last_four }}</div>
                <div v-if="method.is_default" class="text-xs text-indigo-600 font-medium">Default</div>
              </div>
            </div>
            <button type="button" class="text-red-500 hover:text-red-600 text-sm font-medium" @click="removePaymentMethod(method.id)">
              Remove
            </button>
          </div>
        </div>

        <p v-else class="text-gray-500 text-sm mb-6">No payment methods on file.</p>

        <div class="border-t pt-6">
          <h3 class="font-medium text-gray-900 mb-4">Add Payment Method</h3>
          <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="addPaymentMethod">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stripe Payment Method ID</label>
              <input v-model="newMethod.stripe_payment_method_id" type="text" required placeholder="pm_abc123" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Four Digits</label>
              <input v-model="newMethod.last_four" type="text" required maxlength="4" placeholder="4242" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
            </div>
            <div class="md:col-span-2 flex items-center gap-2">
              <input v-model="newMethod.is_default" type="checkbox" id="default-method" class="rounded text-indigo-600" />
              <label for="default-method" class="text-sm text-gray-700">Set as default payment method</label>
            </div>
            <button type="submit" :disabled="addingMethod" class="md:col-span-2 w-full md:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
              {{ addingMethod ? 'Adding...' : 'Add Payment Method' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'

const paymentMethods = ref([])
const addingMethod = ref(false)

const newMethod = reactive({
  type: 'card',
  stripe_payment_method_id: '',
  last_four: '',
  is_default: true,
})

const fetchPaymentMethods = async () => {
  try {
    const data = await customerPortalApi.getPaymentMethods()
    paymentMethods.value = Array.isArray(data) ? data : data?.payment_methods || data?.data || []
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Payment Methods', text: getApiErrorMessage(error) })
  }
}

const addPaymentMethod = async () => {
  addingMethod.value = true
  try {
    const method = await customerPortalApi.addPaymentMethod({ ...newMethod })
    paymentMethods.value.push(method)
    newMethod.stripe_payment_method_id = ''
    newMethod.last_four = ''
    await Swal.fire({ icon: 'success', title: 'Payment Method Added', timer: 2000, showConfirmButton: false })
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Add', text: getApiErrorMessage(error) })
  } finally {
    addingMethod.value = false
  }
}

const removePaymentMethod = async (methodId) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Remove Payment Method?',
    text: 'This action cannot be undone.',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
  })
  if (!result.isConfirmed) return

  try {
    await customerPortalApi.removePaymentMethod(methodId)
    paymentMethods.value = paymentMethods.value.filter((m) => m.id !== methodId)
    await Swal.fire({ icon: 'success', title: 'Removed', timer: 1500, showConfirmButton: false })
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Remove Failed', text: getApiErrorMessage(error) })
  }
}

onMounted(fetchPaymentMethods)
</script>
