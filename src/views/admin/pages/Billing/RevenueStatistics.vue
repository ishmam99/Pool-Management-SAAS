<template>
  <div class="min-h-screen bg-white">
    <div class="px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Revenue Statistics</h1>
          <p class="text-gray-600 mt-1">
            Monitor billing performance, revenue metrics, and platform billing activity.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Period</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">
              {{ stats?.current_period || '—' }}
            </p>
          </div>
          <button
            @click="fetchStats"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              :class="{ 'animate-spin': loading }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg class="mx-auto h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h3 class="mt-3 text-sm font-medium text-red-800">Unable to load revenue statistics.</h3>
        <p class="mt-1 text-sm text-red-600">Please try again.</p>
        <button
          @click="fetchStats"
          class="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !stats" class="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="mt-3 text-sm font-medium text-gray-500">No revenue statistics are available.</p>
        <p class="mt-1 text-sm text-gray-400">
          Statistics will appear once invoices have been generated and billing activity begins.
        </p>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            v-for="card in summaryCards"
            :key="card.label"
            :label="card.label"
            :value="card.value"
            :icon="card.icon"
            :loading="loading"
          />
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Revenue Overview -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-gray-900">Revenue Overview</h3>
              <span class="text-xs font-medium text-gray-400">{{ stats?.current_period }}</span>
            </div>
            <div class="relative h-72">
              <div v-if="loading" class="absolute inset-0 bg-gray-100 rounded-lg animate-pulse"></div>
              <canvas v-else ref="revenueChartRef"></canvas>
            </div>
          </div>

          <!-- Billing Model Distribution -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-gray-900">Billing Model Distribution</h3>
              <span class="text-xs font-medium text-gray-400">{{ stats?.total_tenants }} tenants</span>
            </div>
            <div class="relative h-72">
              <div v-if="loading" class="absolute inset-0 bg-gray-100 rounded-lg animate-pulse"></div>
              <canvas v-else ref="billingModelChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Pool Statistics -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-gray-900">Pool Statistics</h3>
              <span class="text-xs font-medium text-gray-400">Managed vs Billable</span>
            </div>
            <div class="relative h-72">
              <div v-if="loading" class="absolute inset-0 bg-gray-100 rounded-lg animate-pulse"></div>
              <canvas v-else ref="poolChartRef"></canvas>
            </div>
          </div>

          <!-- Current Billing Period Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-900 mb-1">Current Billing Period</h3>
              <p class="text-sm text-gray-500 mb-6">Active billing cycle currently in progress.</p>
            </div>
            <div class="flex items-center justify-center flex-1">
              <div class="text-center">
                <div class="mx-auto w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                  <svg class="w-7 h-7 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p v-if="loading" class="h-6 w-32 bg-gray-100 rounded animate-pulse mx-auto"></p>
                <p v-else class="text-xl font-bold text-gray-900">{{ stats?.current_period || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Insights -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Revenue Insights</h3>
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
          </div>
          <ul v-else-if="insights.length" class="space-y-3">
            <li
              v-for="(insight, idx) in insights"
              :key="idx"
              class="flex items-start gap-3 text-sm text-gray-700"
            >
              <span class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <svg class="w-3 h-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              {{ insight }}
            </li>
          </ul>
          <p v-else class="text-sm text-gray-400">No specific insights at this time.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, h, defineComponent } from 'vue'
import api from '../../../../services/api'
import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

// -------------------- State --------------------
const loading = ref(false)
const error = ref(null)
const stats = ref(null)

const revenueChartRef = ref(null)
const billingModelChartRef = ref(null)
const poolChartRef = ref(null)

let revenueChartInstance = null
let billingModelChartInstance = null
let poolChartInstance = null

// -------------------- Helpers --------------------
const toNumber = (val) => {
  if (val == null) return 0
  const n = typeof val === 'string' ? parseFloat(val) : val
  return isNaN(n) ? 0 : n
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(toNumber(amount))
}

const formatCurrencyShort = (amount) => {
  const n = toNumber(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: n >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  }).format(n)
}

// -------------------- Icons (inline render functions) --------------------
const iconPaths = {
  tenants: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 4a4 4 0 10-8 0 4 4 0 008 0zM8 12a4 4 0 10-8 0 4 4 0 008 0z',
  subscription: 'M17 9V7a4 4 0 00-8 0v2M5 9h14l1 12H4L5 9z',
  perPool: 'M4 7h16M4 12h16M4 17h16',
  invoiced: 'M9 7h6m-6 4h6m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
  collected: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v-2m0-8a9 9 0 100 18 9 9 0 000-18z',
  pending: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  overdue: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
  poolsManaged: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  billablePools: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
}

const StatIcon = defineComponent({
  props: { path: { type: String, required: true } },
  setup(props) {
    return () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor'
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: props.path
          })
        ]
      )
  }
})

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    loading: Boolean
  },
  components: { StatIcon },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow'
        },
        [
          h('div', { class: 'flex items-center justify-between mb-3' }, [
            h('span', { class: 'text-xs font-medium text-gray-500 uppercase tracking-wide' }, props.label),
            h(
              'span',
              { class: 'w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center' },
              [h(StatIcon, { path: props.icon })]
            )
          ]),
          props.loading
            ? h('div', { class: 'h-7 w-20 bg-gray-100 rounded animate-pulse' })
            : h('p', { class: 'text-2xl font-bold text-gray-900' }, props.value)
        ]
      )
  }
})

// -------------------- Computed --------------------
const summaryCards = computed(() => {
  if (!stats.value) return []
  const s = stats.value
  return [
    { label: 'Total Tenants', value: s.total_tenants ?? 0, icon: iconPaths.tenants },
    { label: 'Subscription Tenants', value: s.subscription_tenants ?? 0, icon: iconPaths.subscription },
    { label: 'Per Pool Tenants', value: s.per_pool_tenants ?? 0, icon: iconPaths.perPool },
    { label: 'Total Invoiced This Month', value: formatCurrency(s.total_invoiced_this_month), icon: iconPaths.invoiced },
    { label: 'Total Collected', value: formatCurrency(s.total_collected_this_month), icon: iconPaths.collected },
    { label: 'Pending Amount', value: formatCurrency(s.pending_amount), icon: iconPaths.pending },
    { label: 'Overdue Amount', value: formatCurrency(s.overdue_amount), icon: iconPaths.overdue },
    { label: 'Total Pools Managed', value: s.total_pools_managed ?? 0, icon: iconPaths.poolsManaged },
    { label: 'Total Billable Pools', value: s.total_billable_pools ?? 0, icon: iconPaths.billablePools }
  ]
})

const insights = computed(() => {
  if (!stats.value) return []
  const s = stats.value
  const list = []

  if (toNumber(s.pending_amount) > 0) {
    list.push('There are outstanding invoices awaiting payment.')
  }

  if (toNumber(s.total_collected_this_month) === 0) {
    list.push('No payments have been collected during the current billing period.')
  }

  if (toNumber(s.overdue_amount) > 0) {
    list.push('Some invoices are overdue and require follow-up.')
  }

  if (toNumber(s.total_billable_pools) < toNumber(s.total_pools_managed)) {
    list.push('Some managed pools are currently outside the billable pool count.')
  }

  return list
})

// -------------------- Chart Builders --------------------
const buildRevenueChart = () => {
  if (!revenueChartRef.value || !stats.value) return
  if (revenueChartInstance) revenueChartInstance.destroy()

  const s = stats.value
  const dataPoints = [
    toNumber(s.total_invoiced_this_month),
    toNumber(s.total_collected_this_month),
    toNumber(s.pending_amount),
    toNumber(s.overdue_amount)
  ]

  revenueChartInstance = new Chart(revenueChartRef.value, {
    type: 'bar',
    data: {
      labels: ['Invoiced', 'Collected', 'Pending', 'Overdue'],
      datasets: [
        {
          label: 'Amount',
          data: dataPoints,
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          borderRadius: 8,
          maxBarThickness: 56
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => formatCurrency(ctx.raw)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: {
            callback: (value) => formatCurrencyShort(value)
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

const buildBillingModelChart = () => {
  if (!billingModelChartRef.value || !stats.value) return
  if (billingModelChartInstance) billingModelChartInstance.destroy()

  const s = stats.value
  const dataPoints = [toNumber(s.subscription_tenants), toNumber(s.per_pool_tenants)]

  billingModelChartInstance = new Chart(billingModelChartRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Subscription', 'Per Pool'],
      datasets: [
        {
          data: dataPoints,
          backgroundColor: ['#3b82f6', '#a855f7'],
          borderWidth: 0,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      animation: { duration: 600, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 8, padding: 16 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw} tenant${ctx.raw === 1 ? '' : 's'}`
          }
        }
      }
    }
  })
}

const buildPoolChart = () => {
  if (!poolChartRef.value || !stats.value) return
  if (poolChartInstance) poolChartInstance.destroy()

  const s = stats.value
  const dataPoints = [toNumber(s.total_pools_managed), toNumber(s.total_billable_pools)]

  poolChartInstance = new Chart(poolChartRef.value, {
    type: 'bar',
    data: {
      labels: ['Total Pools Managed', 'Total Billable Pools'],
      datasets: [
        {
          label: 'Pools',
          data: dataPoints,
          backgroundColor: ['#6366f1', '#14b8a6'],
          borderRadius: 8,
          maxBarThickness: 56
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} pools`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: { precision: 0 }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  })
}

const renderCharts = async () => {
  await nextTick()
  // Guard: bail if refs somehow aren't attached yet
  if (!revenueChartRef.value || !billingModelChartRef.value || !poolChartRef.value) {
    return
  }
  buildRevenueChart()
  buildBillingModelChart()
  buildPoolChart()
}
const destroyCharts = () => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
    revenueChartInstance = null
  }
  if (billingModelChartInstance) {
    billingModelChartInstance.destroy()
    billingModelChartInstance = null
  }
  if (poolChartInstance) {
    poolChartInstance.destroy()
    poolChartInstance = null
  }
}

// -------------------- API --------------------
const fetchStats = async () => {
  loading.value = true
  error.value = null
  destroyCharts()

  try {
    const response = await api().get('/admin/billing/stats')
    const payload = response.subscriptions.data

    if (payload && payload.success && payload.data) {
      stats.value = payload.data
    } else {
      stats.value = null
    }
  } catch (err) {
    error.value = err.message || 'Failed to load revenue statistics.'
    stats.value = null
  } finally {
    loading.value = false
  }

  // Only attempt to render charts once loading is false and
  // the v-else canvas elements have actually mounted.
  if (stats.value) {
    await renderCharts()
  }
}
// -------------------- Lifecycle --------------------
onMounted(() => {
  fetchStats()
})

onBeforeUnmount(() => {
  destroyCharts()
})
</script>