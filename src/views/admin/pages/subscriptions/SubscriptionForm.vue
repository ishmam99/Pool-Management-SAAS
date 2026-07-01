<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-3xl mx-auto w-full">
      <router-link to="/admin/tenant-subscriptions" class="inline-flex items-center gap-2 text-orange-600 text-sm font-medium mb-4"><i class="ri-arrow-left-line"></i> Back</router-link>
      <h1 class="text-3xl font-bold text-slate-900 mb-6">{{ isEdit ? 'Edit Subscription' : 'Create Subscription' }}</h1>
      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full" @submit.prevent="submit">
        <div class="w-full">
          <label class="block text-sm font-medium mb-1">Tenant</label>
          <select v-model.number="form.tenant_id" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option :value="null" disabled>Select tenant</option>
            <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.company_name || t.name }}</option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium mb-1">Plan</label>
          <select v-model.number="form.subscription_plan_id" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option :value="null" disabled>Select plan</option>
            <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name || p.plan_name }} — {{ formatCurrency(p.price) }}</option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Billing Cycle</label>
            <select v-model="form.billing_cycle" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="form.status" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
              <option value="active">Active</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Period Start</label>
            <input v-model="form.current_period_start" type="date" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Period End</label>
            <input v-model="form.current_period_end" type="date" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
          </div>
        </div>
        <button type="submit" :disabled="submitting" class="w-full rounded-xl bg-orange-600 text-white py-3 text-sm font-semibold disabled:opacity-50">{{ submitting ? 'Saving...' : (isEdit ? 'Update Subscription' : 'Create Subscription') }}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatCurrency } from '../../utils/formatters.js'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const tenants = ref([])
const plans = ref([])
const isEdit = computed(() => !!route.params.id)

const today = new Date().toISOString().slice(0, 10)
const form = reactive({ tenant_id: null, subscription_plan_id: null, billing_cycle: 'monthly', current_period_start: today, current_period_end: today, status: 'active' })

const loadData = async () => {
  tenants.value = normalizeList(await adminApi.getTenants())
  plans.value = normalizeList(await adminApi.getPlans())
  if (isEdit.value) {
    const subs = normalizeList(await adminApi.getSubscriptions())
    const sub = subs.find((s) => String(s.id) === String(route.params.id))
    if (sub) {
      form.tenant_id = sub.tenant_id
      form.subscription_plan_id = sub.subscription_plan_id
      form.billing_cycle = sub.billing_cycle || 'monthly'
      form.current_period_start = (sub.current_period_start || '').slice(0, 10)
      form.current_period_end = (sub.current_period_end || '').slice(0, 10)
      form.status = sub.status || 'active'
    }
  }
}

const submit = async () => {
  submitting.value = true
  try {
    const payload = {
      tenant_id: form.tenant_id,
      subscription_plan_id: form.subscription_plan_id,
      billing_cycle: form.billing_cycle,
      current_period_start: form.current_period_start,
      current_period_end: form.current_period_end,
      status: form.status,
    }
    if (isEdit.value) await adminApi.updateSubscription(route.params.id, payload)
    else await adminApi.createSubscription(payload)
    await Swal.fire({ icon: 'success', title: 'Saved', timer: 2000, showConfirmButton: false })
    router.push('/admin/tenant-subscriptions')
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Save Failed', text: getApiErrorMessage(e) })
  } finally {
    submitting.value = false
  }
}

onMounted(loadData)
</script>
