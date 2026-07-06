<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="w-full">
      <!-- Header -->
      <div class="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-slate-900 via-violet-900 to-sky-900 rounded-[2rem] p-6 shadow-2xl text-white">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-slate-300">Admin Control Center</p>
          <h1 class="text-4xl font-extrabold tracking-tight mt-3">Platform Dashboard</h1>
          <p class="text-slate-200 mt-2 max-w-2xl">A high-level view of tenants, admins, subscriptions, and revenue across your platform.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link to="/admin/admins/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25 transition shadow-sm">
            <i class="ri-user-add-line"></i> Create Admin
          </router-link>
          <router-link to="/admin/tenants/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25 transition shadow-sm">
            <i class="ri-building-add-line"></i> Create Tenant
          </router-link>
          <router-link to="/admin/tenant-subscriptions/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25 transition shadow-sm">
            <i class="ri-add-circle-line"></i> Create Subscription
          </router-link>
          <router-link to="/admin/subscription-plans/create" class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25 transition shadow-sm">
            <i class="ri-list-settings-line"></i> Create Plan
          </router-link>
          <button type="button" class="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition shadow-sm" @click="loadDashboard">
            <i class="ri-refresh-line"></i> Refresh
          </button>
        </div>
      </div>

      <div v-if="loading" class="space-y-6 animate-pulse">
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div v-for="i in 12" :key="i" class="h-24 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>

      <template v-else>
        <!-- Tenant stats -->
        <section class="mb-8">
          <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Tenant Statistics</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <AdminStatCard label="Total Tenants" :value="tenantStats.total" card-class="bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            <AdminStatCard label="Active" :value="tenantStats.active" card-class="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            <AdminStatCard label="Trial" :value="tenantStats.trial" card-class="bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            <AdminStatCard label="Suspended" :value="tenantStats.suspended" card-class="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 shadow-lg" label-class="text-slate-900/80" value-class="text-slate-900" />
            <AdminStatCard label="Cancelled" :value="tenantStats.cancelled" card-class="bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            <AdminStatCard label="Past Due" :value="tenantStats.past_due" card-class="bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
          </div>
        </section>

        <!-- Admin + Subscription + Revenue -->
        <section class="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div class="bg-white/80 ring-1 ring-slate-200 rounded-3xl p-5 shadow-sm">
            <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Admin Statistics</h2>
            <div class="grid grid-cols-2 gap-3">
              <AdminStatCard label="Total Admins" :value="adminStats.total" card-class="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Super Admins" :value="adminStats.super_admin" card-class="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Admins" :value="adminStats.admin" card-class="bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Support Staff" :value="adminStats.support" card-class="bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            </div>
          </div>
          <div class="bg-white/80 ring-1 ring-slate-200 rounded-3xl p-5 shadow-sm">
            <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Subscription Statistics</h2>
            <div class="grid grid-cols-2 gap-3">
              <AdminStatCard label="Total" :value="subStats.total" card-class="bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Active" :value="subStats.active" card-class="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Failed" :value="subStats.failed" card-class="bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Cancelled" :value="subStats.cancelled" card-class="bg-gradient-to-br from-slate-500 to-zinc-700 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            </div>
          </div>
          <div class="bg-white/80 ring-1 ring-slate-200 rounded-3xl p-5 shadow-sm">
            <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Revenue</h2>
            <div class="grid grid-cols-1 gap-3">
              <AdminStatCard label="Total Monthly Revenue" :value="formatCurrency(revenue.monthly)" card-class="bg-gradient-to-br from-emerald-500 to-sky-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
              <AdminStatCard label="Active Subscription Value" :value="formatCurrency(revenue.activeValue)" card-class="bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg" label-class="text-white/80" value-class="text-white" />
            </div>
          </div>
        </section>

        <!-- Charts -->
        <section class="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="rounded-[2rem] bg-gradient-to-br from-cyan-500 to-slate-900 text-white p-6 shadow-2xl ring-1 ring-white/10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Tenant Status</h3>
              <span class="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">Live</span>
            </div>
            <div class="h-64 flex items-center justify-center">
              <canvas ref="tenantChartRef"></canvas>
            </div>
          </div>
          <div class="rounded-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-700 text-white p-6 shadow-2xl ring-1 ring-white/10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Subscription Status</h3>
              <span class="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">Trends</span>
            </div>
            <div class="h-64 flex items-center justify-center">
              <canvas ref="subscriptionChartRef"></canvas>
            </div>
          </div>
          <div class="rounded-[2rem] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-slate-900 p-6 shadow-2xl ring-1 ring-white/20">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Revenue by Plan</h3>
              <span class="rounded-full bg-slate-900/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-900/70">Insights</span>
            </div>
            <div class="h-64">
              <canvas ref="revenueChartRef"></canvas>
            </div>
          </div>
        </section>

        <!-- Tables -->
        <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 class="font-semibold text-slate-900">Recent Tenants</h3>
              <router-link to="/admin/tenants" class="text-sm font-medium text-teal-600 hover:text-teal-700">View All →</router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th class="px-5 py-3 text-left">Company</th>
                    <th class="px-5 py-3 text-left">Status</th>
                    <th class="px-5 py-3 text-left">Domain</th>
                    <th class="px-5 py-3 text-left">Created</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="t in recentTenants" :key="t.id" class="hover:bg-slate-50">
                    <td class="px-5 py-3 font-medium">{{ t.company_name || t.name }}</td>
                    <td class="px-5 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusBadgeClass(t.status)">{{ formatStatus(t.status) }}</span></td>
                    <td class="px-5 py-3 capitalize">{{ t.domain_mode || '—' }}</td>
                    <td class="px-5 py-3 text-slate-500">{{ formatDate(t.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 class="font-semibold text-slate-900">Active Subscriptions</h3>
              <router-link to="/admin/tenant-subscriptions" class="text-sm font-medium text-orange-600 hover:text-orange-700">View All →</router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th class="px-5 py-3 text-left">Tenant</th>
                    <th class="px-5 py-3 text-left">Plan</th>
                    <th class="px-5 py-3 text-left">Cycle</th>
                    <th class="px-5 py-3 text-left">Next Bill</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="s in activeSubscriptions" :key="s.id" class="hover:bg-slate-50">
                    <td class="px-5 py-3">{{ s.tenant?.company_name || s.tenant_name || `#${s.tenant_id}` }}</td>
                    <td class="px-5 py-3">{{ s.plan?.name || s.plan_name || '—' }}</td>
                    <td class="px-5 py-3 capitalize">{{ s.billing_cycle || '—' }}</td>
                    <td class="px-5 py-3 text-slate-500">{{ formatDate(s.next_billing_date || s.next_renewal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-semibold text-slate-900">Recent Admins</h3>
            <router-link to="/admin/admins" class="text-sm font-medium text-violet-600 hover:text-violet-700">View All →</router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th class="px-5 py-3 text-left">Name</th>
                  <th class="px-5 py-3 text-left">Email</th>
                  <th class="px-5 py-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="a in recentAdmins" :key="a.id" class="hover:bg-slate-50">
                  <td class="px-5 py-3 font-medium">{{ a.name }}</td>
                  <td class="px-5 py-3 text-slate-600">{{ a.email }}</td>
                  <td class="px-5 py-3 capitalize">{{ formatRole(a.role) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Chart, DoughnutController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import Swal from 'sweetalert2'
import AdminStatCard from '../../components/AdminStatCard.vue'
import { adminApi, normalizeList, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatCurrency, formatDate, formatStatus, statusBadgeClass } from '../../utils/formatters.js'
import { useAuthStore } from '../../../../store/AuthStore.js'

Chart.register(DoughnutController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const loading = ref(true)
const tenants = ref([])
const admins = ref([])
const subscriptions = ref([])
const authStore = useAuthStore()

const tenantStats = ref({ total: 0, active: 0, trial: 0, suspended: 0, cancelled: 0, past_due: 0 })
const adminStats = ref({ total: 0, super_admin: 0, admin: 0, support: 0 })
const subStats = ref({ total: 0, active: 0, failed: 0, cancelled: 0 })
const revenue = ref({ monthly: 0, activeValue: 0 })

const recentTenants = ref([])
const recentAdmins = ref([])
const activeSubscriptions = ref([])

const tenantChartRef = ref(null)
const subscriptionChartRef = ref(null)
const revenueChartRef = ref(null)
let charts = []

const formatRole = (role) => (role || '').replace(/_/g, ' ')

const getSubAmount = (sub) => Number(sub.amount ?? sub.plan?.price ?? sub.price ?? 0)

const countBy = (items, key) => {
  const counts = {}
  items.forEach((item) => {
    const k = (item[key] || 'unknown').toLowerCase()
    counts[k] = (counts[k] || 0) + 1
  })
  return counts
}

const destroyCharts = () => {
  charts.forEach((c) => c.destroy())
  charts = []
}

const buildCharts = () => {
  destroyCharts()
  const tc = countBy(tenants.value, 'status')
  if (tenantChartRef.value) {
    charts.push(new Chart(tenantChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Trial', 'Suspended', 'Past Due', 'Cancelled'],
        datasets: [{
          data: [tc.active || 0, tc.trial || 0, tc.suspended || 0, tc.past_due || 0, tc.cancelled || 0],
          backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#94a3b8'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f8fafc', boxWidth: 12, boxHeight: 12 }
          }
        },
      },
    }))
  }

  const sc = countBy(subscriptions.value, 'status')
  if (subscriptionChartRef.value) {
    charts.push(new Chart(subscriptionChartRef.value, {
      type: 'bar',
      data: {
        labels: ['Active', 'Failed', 'Cancelled'],
        datasets: [{ label: 'Subscriptions', data: [sc.active || 0, sc.failed || 0, sc.cancelled || 0], backgroundColor: ['#10b981', '#ef4444', '#94a3b8'] }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { bodyColor: '#f8fafc', titleColor: '#ffffff', backgroundColor: '#0f172a' }
        },
        scales: {
          x: { ticks: { color: '#f8fafc' }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 1, color: '#f8fafc' }, grid: { color: 'rgba(248, 250, 252, 0.12)' } }
        }
      },
    }))
  }

  const planRevenue = {}
  subscriptions.value.filter((s) => (s.status || '').toLowerCase() === 'active').forEach((s) => {
    const name = s.plan?.name || s.plan_name || 'Unknown'
    planRevenue[name] = (planRevenue[name] || 0) + getSubAmount(s)
  })
  const labels = Object.keys(planRevenue)
  if (revenueChartRef.value && labels.length) {
    charts.push(new Chart(revenueChartRef.value, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Revenue', data: labels.map((l) => planRevenue[l]), backgroundColor: '#6366f1' }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { bodyColor: '#0f172a', titleColor: '#0f172a', backgroundColor: '#f8fafc' }
        },
        scales: {
          x: { ticks: { color: '#0f172a' }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { color: '#0f172a' }, grid: { color: 'rgba(15, 23, 42, 0.08)' } }
        }
      },
    }))
  }
}

const computeStats = () => {
  const tc = countBy(tenants.value, 'status')
  tenantStats.value = {
    total: tenants.value.length,
    active: tc.active || 0,
    trial: tc.trial || 0,
    suspended: tc.suspended || 0,
    cancelled: tc.cancelled || 0,
    past_due: tc.past_due || 0,
  }

  const ac = { super_admin: 0, admin: 0, support: 0 }
  admins.value.forEach((a) => {
    const role = (a.role || a.roles?.[0] || 'admin').toLowerCase()
    if (ac[role] !== undefined) ac[role] += 1
    else ac.admin += 1
  })
  adminStats.value = {
    total: admins.value.length,
    super_admin: ac.super_admin,
    admin: ac.admin,
    support: ac.support,
  }

  const sc = countBy(subscriptions.value, 'status')
  subStats.value = {
    total: subscriptions.value.length,
    active: sc.active || 0,
    failed: sc.failed || 0,
    cancelled: sc.cancelled || 0,
  }

  const activeSubs = subscriptions.value.filter((s) => (s.status || '').toLowerCase() === 'active')
  const monthly = activeSubs.reduce((sum, s) => sum + getSubAmount(s), 0)
  revenue.value = { monthly, activeValue: monthly }

  recentTenants.value = [...tenants.value]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 8)
  recentAdmins.value = [...admins.value].slice(0, 5)
  activeSubscriptions.value = activeSubs.slice(0, 8)
}

const loadDashboard = async () => {
  loading.value = true
  try {
    const [tRes, aRes, sRes] = await Promise.all([
      adminApi.getTenants(),
      adminApi.getAdmins(),
      adminApi.getSubscriptions(),
    ])
    tenants.value = normalizeList(tRes)
    admins.value = normalizeList(aRes)
    subscriptions.value = normalizeList(sRes)
    computeStats()
    loading.value = false
    await nextTick()
    buildCharts()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Dashboard Error', text: getApiErrorMessage(error) })
    loading.value = false
  }
}

onMounted(loadDashboard)
onBeforeUnmount(destroyCharts)
</script>
