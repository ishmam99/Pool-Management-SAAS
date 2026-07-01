<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 p-4 md:p-8">
    <div class="w-full">
      <div class="mb-6 rounded-[2rem] bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 p-8 shadow-2xl text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-extrabold tracking-tight">Subscription Plans</h1>
            <p class="mt-2 max-w-2xl text-orange-100/90">An overview of every plan, pricing, and included features in one polished admin view.</p>
          </div>
          <router-link to="/admin/subscription-plans/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/25 hover:bg-white/30 transition">
            <i class="ri-add-circle-line"></i> Create Plan
          </router-link>
        </div>
      </div>

      <div class="rounded-[1.75rem] bg-white/95 ring-1 ring-slate-200/80 shadow-xl overflow-hidden">
        <div v-if="loading" class="p-8 animate-pulse"><div class="h-12 bg-slate-100 rounded-2xl"></div></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-900 text-xs uppercase text-slate-100">
              <tr>
                <th class="px-5 py-4 text-left">Plan</th>
                <th class="px-5 py-4 text-left">Price</th>
                <th class="px-5 py-4 text-left">Billing Cycle</th>
                <th class="px-5 py-4 text-left">Features</th>
                <th class="px-5 py-4 text-left">Max Techs</th>
                <th class="px-5 py-4 text-left">Max Customers</th>
                <th class="px-5 py-4 text-left">Active</th>
                <th class="px-5 py-4 text-left">Created</th>
                <th class="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="plan in plans" :key="plan.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-4 font-semibold text-slate-900">{{ plan.name || plan.plan_name }}</td>
                <td class="px-5 py-4 text-slate-700">{{ formatCurrency(plan.price) }}</td>
                <td class="px-5 py-4 capitalize text-slate-600">{{ plan.billing_cycle || '—' }}</td>
                <td class="px-5 py-4 max-w-xs text-slate-600">{{ formatFeatureSummary(plan.features) }}</td>
                <td class="px-5 py-4 text-slate-700">{{ plan.max_techs ?? plan.max_technicians ?? '∞' }}</td>
                <td class="px-5 py-4 text-slate-700">{{ plan.max_customers ?? '∞' }}</td>
                <td class="px-5 py-4">
                  <span :class="plan.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                    {{ plan.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-slate-500">{{ formatDate(plan.created_at) }}</td>
                <td class="px-5 py-4 text-right flex flex-wrap justify-end gap-2">
                  <router-link :to="`/admin/subscription-plans/${plan.id}/edit`" class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-transform">
                    <i class="ri-pencil-line"></i>
                    Edit
                  </router-link>
                  <button type="button" class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-transform" @click="remove(plan)">
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
