<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-cyan-50/30">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-8">
      <div class="animate-pulse space-y-8">
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <div class="h-8 w-64 bg-gray-200 rounded"></div>
            <div class="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="i in 6" :key="i" class="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
          <div class="space-y-6">
            <div class="h-48 bg-gray-200 rounded-2xl"></div>
            <div class="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-1">
            Good {{ timeOfDay }}, {{ customerName }} 👋
          </h1>
          <p class="text-gray-500">{{ currentDate }}</p>
        </div>
        <div class="flex items-center gap-3 mt-4 md:mt-0">
          <router-link
            to="/customer/messages"
            class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium"
          >
            <i class="ri-chat-3-line"></i>
            Contact Provider
          </router-link>
          <div class="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {{ customerInitials }}
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="text-2xl font-bold text-gray-800">{{ stats.total_pools ?? 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">Pools</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="text-2xl font-bold text-emerald-600">{{ stats.active_agreements ?? 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">Active Plans</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="text-2xl font-bold text-gray-800">{{ stats.completed_services ?? 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">Completed Visits</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="text-2xl font-bold text-sky-600">{{ stats.total_invoices ?? 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">Invoices</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(stats.total_paid) }}</div>
          <div class="text-xs text-gray-500 mt-1">Total Paid</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="text-2xl font-bold" :class="(stats.balance_due ?? 0) > 0 ? 'text-red-600' : 'text-gray-800'">
            {{ formatCurrency(stats.balance_due) }}
          </div>
          <div class="text-xs text-gray-500 mt-1">Balance Due</div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Pool Overview -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">My Pools</h2>
              <router-link to="/customer/pools" class="text-sm text-teal-600 hover:text-teal-700 font-medium">
                View all →
              </router-link>
            </div>
            <div v-if="pools.length === 0" class="text-center py-8 text-gray-500">
              No pools on your account yet.
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="pool in pools"
                :key="pool.id"
                class="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-teal-200 transition"
              >
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <div class="text-2xl mb-1">🏊</div>
                    <h3 class="font-semibold text-gray-800">{{ pool.label || pool.name }}</h3>
                  </div>
                  <span
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="pool.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ pool.is_active !== false ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <router-link
                  :to="`/customer/pools/${pool.id}/history`"
                  class="flex items-center justify-center gap-1 w-full py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition text-sm font-medium"
                >
                  <i class="ri-history-line"></i>
                  Service History
                </router-link>
              </div>
            </div>
          </div>

          <!-- Recent Invoices -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">Recent Invoices</h2>
              <router-link to="/customer/billing" class="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                View all →
              </router-link>
            </div>
            <div v-if="recentInvoices.length === 0" class="text-center py-6 text-gray-500 text-sm">
              No recent invoices.
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-xs text-gray-500 border-b border-gray-100 uppercase tracking-wide">
                    <th class="pb-3">Invoice</th>
                    <th class="pb-3">Amount</th>
                    <th class="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inv in recentInvoices" :key="inv.invoice_number || inv.id" class="border-b border-gray-50">
                    <td class="py-3 text-sm font-medium text-gray-800">{{ inv.invoice_number || `#${inv.id}` }}</td>
                    <td class="py-3 text-sm">{{ formatCurrency(inv.total) }}</td>
                    <td class="py-3">
                      <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(inv.status)">
                        {{ formatStatus(inv.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Upcoming Visits -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">Upcoming Visits</h2>
              <router-link to="/customer/schedule" class="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Schedule →
              </router-link>
            </div>
            <div v-if="upcomingVisits.length === 0" class="text-center py-8 text-gray-500 text-sm">
              No upcoming visits scheduled.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="(visit, i) in upcomingVisits.slice(0, 3)"
                :key="i"
                class="p-4 bg-orange-50 rounded-xl border border-orange-100"
              >
                <div class="text-sm font-semibold text-orange-700">{{ formatDate(visit.scheduled_date) }}</div>
                <div class="font-medium text-gray-800 mt-1">{{ visit.pool?.label || 'Pool Visit' }}</div>
                <div v-if="visit.technician?.name" class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <i class="ri-user-line"></i>
                  {{ visit.technician.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 gap-3">
              <router-link
                v-for="action in quickActions"
                :key="action.to"
                :to="action.to"
                class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-sky-50 hover:border-sky-200 border border-transparent transition text-center"
              >
                <i :class="action.icon" class="text-2xl text-sky-600"></i>
                <span class="text-xs font-medium text-gray-700">{{ action.label }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '../../store/AuthStore.js'
import { customerPortalApi, getApiErrorMessage } from '../../services/customerPortalApi.js'
import { formatCurrency, formatDate, formatStatus, statusBadgeClass, getInitials } from './utils/formatters.js'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({})
const pools = ref([])
const upcomingVisits = ref([])
const recentInvoices = ref([])

const customerName = computed(() => {
  return dashboardCustomer.value?.name || authStore.user?.name || 'Customer'
})

const customerInitials = computed(() => getInitials(customerName.value))

const dashboardCustomer = ref(null)

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
})

const quickActions = [
  { to: '/customer/pools', icon: 'ri-drop-fill', label: 'My Pools' },
  { to: '/customer/schedule', icon: 'ri-calendar-check-line', label: 'Schedule' },
  { to: '/customer/billing', icon: 'ri-bank-card-line', label: 'Billing' },
  { to: '/customer/agreements', icon: 'ri-file-text-line', label: 'Agreements' },
  { to: '/customer/messages', icon: 'ri-chat-3-line', label: 'Messages' },
  { to: '/customer/profile', icon: 'ri-user-3-line', label: 'Profile' },
]

const fetchDashboard = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getDashboard()
    dashboardCustomer.value = data.customer
    stats.value = data.stats || {}
    pools.value = data.pools || []
    upcomingVisits.value = data.upcoming_visits || []
    recentInvoices.value = data.recent_invoices || []
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Load Dashboard',
      text: getApiErrorMessage(error),
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return

    fetchDashboard()
  }
)

onMounted(fetchDashboard)
</script>
