<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Water Quality Alerts</h1>
          <p class="text-slate-500 mt-1">Monitor active chemical alerts across your pool inventory.</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Active Alerts</h2>
            <p class="text-sm text-slate-500">Total active alerts: {{ summary.total }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">Critical {{ summary.critical }}</span>
            <span class="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">High {{ summary.high }}</span>
            <span class="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">Medium {{ summary.medium }}</span>
            <span class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Low {{ summary.low }}</span>
          </div>
          <button @click="fetchAlerts" class="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition">Refresh</button>
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="i in 4" :key="i" class="h-24 rounded-3xl bg-slate-100 animate-pulse"></div>
        </div>

        <div v-else>
          <div v-if="alerts.length === 0" class="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No active alerts found.
          </div>
          <div v-else class="space-y-4">
            <div v-for="alert in alerts" :key="alert.pool_id + alert.alert_type" class="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p class="text-sm text-slate-500">{{ alert.pool_label }}</p>
                  <p class="text-lg font-semibold text-slate-900">{{ formatAlertType(alert.alert_type) }}</p>
                </div>
                <span :class="severityClass(alert.severity)" class="rounded-full px-3 py-1 text-sm font-semibold">
                  {{ alert.severity }}</span>
              </div>
              <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                <div>Current: <span class="font-semibold text-slate-900">{{ alert.current_value }}</span></div>
                <div>Recommended: <span class="font-semibold text-slate-900">{{ alert.recommended_value }}</span></div>
                <div>Created: <span class="font-semibold text-slate-900">{{ formatDateTime(alert.created_at) }}</span></div>
              </div>
              <p class="mt-3 text-sm text-slate-500">{{ alert.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { providerApi } from '../../../../services/providerApi.js'

const loading = ref(false)
const alerts = ref([])
const summary = ref({ total: 0, critical: 0, high: 0, medium: 0, low: 0 })

const formatDateTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const severityClass = (severity) => {
  const map = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-rose-100 text-rose-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-emerald-100 text-emerald-700'
  }
  return map[severity] || 'bg-slate-100 text-slate-700'
}

const formatAlertType = (type) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const fetchAlerts = async () => {
  loading.value = true
  try {
    const { alerts: data, summary: stats } = await providerApi.getAlerts({ status: 'active' })
    alerts.value = data
    summary.value = stats
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAlerts)
</script>
