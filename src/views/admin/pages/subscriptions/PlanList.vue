<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto w-full">
      <div class="mb-6 flex justify-between items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Subscription Plans</h1>
          <p class="text-slate-500 mt-1">Manage available subscription plans.</p>
        </div>
        <router-link to="/admin/subscription-plans/create" class="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">Create Plan</router-link>
      </div>
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse"><div class="h-12 bg-slate-100 rounded-xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-5 py-3 text-left">Plan</th>
                <th class="px-5 py-3 text-left">Price</th>
                <th class="px-5 py-3 text-left">Billing Cycle</th>
                <th class="px-5 py-3 text-left">Features</th>
                <th class="px-5 py-3 text-left">Max Techs</th>
                <th class="px-5 py-3 text-left">Max Customers</th>
                <th class="px-5 py-3 text-left">Active</th>
                <th class="px-5 py-3 text-left">Created</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="plan in plans" :key="plan.id" class="hover:bg-slate-50">
                <td class="px-5 py-4 font-medium">{{ plan.name || plan.plan_name }}</td>
                <td class="px-5 py-4">{{ formatCurrency(plan.price) }}</td>
                <td class="px-5 py-4 capitalize">{{ plan.billing_cycle || '—' }}</td>
                <td class="px-5 py-4 max-w-xs text-slate-600">{{ formatFeatureSummary(plan.features) }}</td>
                <td class="px-5 py-4">{{ plan.max_techs ?? plan.max_technicians ?? '∞' }}</td>
                <td class="px-5 py-4">{{ plan.max_customers ?? '∞' }}</td>
                <td class="px-5 py-4">
                  <span :class="plan.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                    {{ plan.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(plan.created_at) }}</td>
                <td class="px-5 py-4 text-right flex flex-wrap justify-end gap-2">
                  <router-link :to="`/admin/subscription-plans/${plan.id}/edit`" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-sky-600 hover:bg-slate-50">
                    <i class="ri-pencil-line"></i>
                    Edit
                  </router-link>
                  <button type="button" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-slate-50" @click="remove(plan)">
                    <i class="ri-delete-bin-line"></i>
                    Delete
                  </button>
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
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'

const loading = ref(true)
const plans = ref([])

const formatFeatureSummary = (features) => {
  if (!features) return '—'
  const keys = Array.isArray(features)
    ? features
    : Object.entries(features).filter(([, value]) => value).map(([key]) => key)
  if (!keys.length) return '—'
  const labels = keys.map((key) => key.replace(/_/g, ' '))
  if (labels.length <= 3) return labels.join(', ')
  return `${labels.slice(0, 3).join(', ')} +${labels.length - 3} more`
}

const fetchPlans = async () => {
  loading.value = true
  try {
    plans.value = normalizeList(await adminApi.getPlans())
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error', text: getApiErrorMessage(e) })
  } finally {
    loading.value = false
  }
}

const remove = async (plan) => {
  const c = await Swal.fire({ icon: 'warning', title: 'Delete Plan?', showCancelButton: true, confirmButtonColor: '#dc2626' })
  if (!c.isConfirmed) return
  try {
    await adminApi.deletePlan(plan.id)
    await fetchPlans()
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Delete Failed', text: getApiErrorMessage(e) })
  }
}

onMounted(fetchPlans)
</script>
