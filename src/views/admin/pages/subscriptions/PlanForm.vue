<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="w-full">
      <router-link to="/admin/subscription-plans" class="inline-flex items-center gap-2 text-orange-600 text-sm font-medium mb-4"><i class="ri-arrow-left-line"></i> Back</router-link>
      <h1 class="text-3xl font-bold text-slate-900 mb-6">{{ isEdit ? 'Edit Plan' : 'Create Plan' }}</h1>
      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full" @submit.prevent="submit">
        <div class="w-full"><label class="block text-sm font-medium mb-1">Plan Name</label><input v-model="form.name" type="text" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium mb-1">Price</label><input v-model.number="form.price" type="number" step="0.01" min="0" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>
          <div><label class="block text-sm font-medium mb-1">Billing Cycle</label><select v-model="form.billing_cycle" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium mb-1">Max Technicians</label><input v-model.number="form.max_technicians" type="number" min="1" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>
          <div><label class="block text-sm font-medium mb-1">Max Customers</label><input v-model.number="form.max_customers" type="number" min="1" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium mb-3">Features</label>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <label v-for="option in featureOptions" :key="option.key" class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm cursor-pointer hover:border-slate-300">
              <input type="checkbox" v-model="form.features" :value="option.key" class="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
              <span>{{ option.label }}</span>
            </label>
          </div>
          <p class="mt-2 text-xs text-slate-500">Select enabled feature flags for this plan.</p>
        </div>
        <div class="flex gap-3 w-full">
          <button type="submit" :disabled="submitting" class="flex-1 rounded-xl bg-orange-600 text-white py-3 text-sm font-semibold disabled:opacity-50">{{ submitting ? 'Saving...' : (isEdit ? 'Update Plan' : 'Create Plan') }}</button>
          <button type="button" class="px-6 rounded-xl border py-3 text-sm" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const isEdit = computed(() => !!route.params.id)

const featureOptions = [
  { key: 'basic_scheduling', label: 'Basic Scheduling' },
  { key: 'customer_portal', label: 'Customer Portal' },
  { key: 'basic_reports', label: 'Basic Reports' },
  { key: 'email_notifications', label: 'Email Notifications' },
  { key: 'sms_notifications', label: 'SMS Notifications' },
  { key: 'advanced_scheduling', label: 'Advanced Scheduling' },
  { key: 'advanced_reports', label: 'Advanced Reports' },
  { key: 'api_access', label: 'API Access' },
  { key: 'multi_technician', label: 'Multi Technician' },
  { key: 'custom_branding', label: 'Custom Branding' },
  { key: 'priority_support', label: 'Priority Support' },
  { key: 'dedicated_account_manager', label: 'Dedicated Account Manager' },
]

const defaultForm = () => ({ name: '', price: 0, billing_cycle: 'monthly', max_technicians: 5, max_customers: 50, features: [] })
const form = reactive(defaultForm())
const resetForm = () => Object.assign(form, defaultForm())

const loadPlan = async () => {
  if (!isEdit.value) return
  const plans = normalizeList(await adminApi.getPlans())
  const plan = plans.find((p) => String(p.id) === String(route.params.id))
  if (plan) {
    form.name = plan.name || plan.plan_name || ''
    form.price = Number(plan.price || 0)
    form.billing_cycle = plan.billing_cycle || 'monthly'
    form.max_technicians = plan.max_technicians
    form.max_customers = plan.max_customers
    if (Array.isArray(plan.features)) {
      form.features = plan.features
    } else if (plan.features && typeof plan.features === 'object') {
      form.features = Object.keys(plan.features).filter((key) => plan.features[key])
    } else {
      form.features = []
    }
  }
}

const submit = async () => {
  submitting.value = true
  try {
    const payload = {
      name: form.name,
      price: form.price,
      billing_cycle: form.billing_cycle,
      max_technicians: form.max_technicians,
      max_customers: form.max_customers,
      features: Array.isArray(form.features) ? form.features : [],
    }
    if (isEdit.value) await adminApi.updatePlan(route.params.id, payload)
    else await adminApi.createPlan(payload)
    await Swal.fire({ icon: 'success', title: 'Saved', timer: 2000, showConfirmButton: false })
    router.push('/admin/subscription-plans')
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Save Failed', text: getApiErrorMessage(e) })
  } finally {
    submitting.value = false
  }
}

onMounted(loadPlan)
</script>
