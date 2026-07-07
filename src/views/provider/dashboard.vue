<template>
  <div class="space-y-8 p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-8">
      <!-- Header Skeleton -->
      <div class="relative overflow-hidden bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#06B6D4] rounded-3xl p-10 text-white shadow-2xl animate-pulse">
        <div class="h-10 w-72 bg-white/20 rounded-lg mb-3"></div>
        <div class="h-6 w-56 bg-white/20 rounded-lg"></div>
      </div>

      <!-- KPI Cards Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50 animate-pulse">
          <div class="flex items-start justify-between">
            <div class="space-y-3 flex-1">
              <div class="h-4 w-28 bg-gray-200 rounded"></div>
              <div class="h-10 w-20 bg-gray-200 rounded"></div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-gray-200"></div>
          </div>
        </div>
      </div>

      <!-- Revenue Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50 animate-pulse">
          <div class="h-4 w-24 bg-gray-200 rounded mb-3"></div>
          <div class="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Tables Skeleton -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 animate-pulse">
        <div class="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Loaded State -->
    <div v-else>
      <!-- 1. Dashboard Header -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#06B6D4] rounded-3xl p-8 md:p-10 text-white shadow-2xl">
        <!-- Animated Background Elements -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse-slow-delay"></div>
        <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
        
        <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
          <div class="space-y-2">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
              {{ getGreeting() }},
              <span class="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {{ dashboard?.user?.name || 'User' }}
              </span>
              👋
            </h1>
            <p class="text-blue-50 text-lg font-light flex items-center gap-3">
              <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              {{ dashboard?.user?.role || 'Owner' }} Dashboard
              <span class="w-px h-6 bg-white/20"></span>
              {{ getFormattedDate() }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="action in headerActions" 
              :key="action.label"
              @click="handleQuickAction(action.route)"
              class="group px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 border border-white/20 hover:scale-105 hover:shadow-xl"
            >
              <span class="text-xl group-hover:rotate-90 transition-transform duration-300">+</span> 
              {{ action.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- 2. KPI Statistics Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in kpiCards" :key="stat.label" 
             class="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <p class="text-gray-500 text-sm font-medium tracking-wider uppercase">{{ stat.label }}</p>
              <p class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {{ stat.value }}
              </p>
              <div class="flex items-center gap-1 text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>↑</span> <span>12% from last month</span>
              </div>
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" 
                 :style="{ backgroundColor: stat.iconBg + '40', backdropFilter: 'blur(10px)' }">
              {{ stat.icon }}
            </div>
          </div>
          <!-- Animated Progress Bar -->
          <div class="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                 :style="{ width: Math.random() * 100 + '%', backgroundColor: stat.iconBg }"></div>
          </div>
        </div>
      </section>

      <!-- 3. Revenue Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Revenue Overview
          </h2>
          <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm flex items-center gap-1 group transition-all duration-300">
            View Details 
            <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div v-for="rev in revenueCards" :key="rev.label" 
               class="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:-translate-y-1">
            <p class="text-sm text-gray-500 font-medium tracking-wider uppercase">{{ rev.label }}</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">{{ formatCurrency(rev.value) }}</p>
            <p v-if="rev.change" class="text-xs mt-3 flex items-center gap-1" :class="rev.change > 0 ? 'text-emerald-600' : 'text-red-500'">
              <span class="inline-block transition-transform duration-300 group-hover:scale-125">
                {{ rev.change > 0 ? '↑' : '↓' }}
              </span>
              {{ Math.abs(rev.change) }}% from last month
            </p>
          </div>
        </div>
        
        <!-- Revenue Chart -->
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-500">
          <div class="h-72 relative">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
      </section>

      <!-- 4. Upcoming Visits -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Upcoming Visits
          </h2>
          <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm flex items-center gap-1 group transition-all duration-300">
            View Calendar 
            <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
        
        <!-- Empty State -->
        <div v-if="!dashboard?.upcoming_visits?.length" 
             class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-16 text-center hover:shadow-2xl transition-all duration-500">
          <div class="text-7xl mb-6 animate-float">📅</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">No Upcoming Visits</h3>
          <p class="text-gray-500 text-lg">All maintenance visits are scheduled and confirmed.</p>
        </div>

        <!-- Table -->
        <div v-else class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th v-for="col in visitColumns" :key="col" 
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="visit in dashboard?.upcoming_visits" :key="visit.id" 
                    class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group">
                  <td class="px-6 py-4 text-sm font-semibold text-gray-800">
                    <a href="#" class="hover:text-[#0284C7] transition-colors duration-300 flex items-center gap-2">
                      <span class="w-2 h-2 bg-emerald-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                      {{ visit.pool?.customer?.contact_name || 'N/A' }}
                    </a>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    <a href="#" class="hover:text-[#0284C7] transition-colors duration-300">
                      {{ visit.pool?.label || 'N/A' }}
                    </a>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#0284C7] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold">
                        {{ visit.technician?.name?.charAt(0) || 'U' }}
                      </div>
                      {{ visit.technician?.name || 'Unassigned' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(visit.scheduled_date) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    <span class="flex items-center gap-1">
                      <span class="text-xs">🕐</span>
                      {{ formatTime(visit.time_window_start) }} - {{ formatTime(visit.time_window_end) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm" :class="priorityBadge(visit.priority)">
                      {{ visit.priority || 'Normal' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm" :class="statusBadge(visit.status)">
                      {{ visit.status || 'Scheduled' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 5. Recent Work Orders + Invoices -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Work Orders -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Recent Work Orders
            </h2>
            <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm flex items-center gap-1 group transition-all duration-300">
              View All 
              <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
          
          <!-- Empty State -->
          <div v-if="!dashboard?.recent_work_orders?.length" 
               class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-12 text-center hover:shadow-2xl transition-all duration-500">
            <div class="text-6xl mb-4 animate-float">🔧</div>
            <p class="text-gray-500 text-lg">No recent work orders</p>
          </div>

          <!-- Cards -->
          <div v-else class="space-y-4">
            <div v-for="order in dashboard?.recent_work_orders" :key="order.id" 
                 class="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:-translate-y-1 hover:scale-[1.01]">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-3 flex-wrap">
                    <h4 class="font-bold text-gray-800 text-lg">{{ order.customer?.contact_name || 'N/A' }}</h4>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm" :class="statusBadge(order.status)">
                      {{ order.status || 'Pending' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 flex items-center gap-1">
                    <span class="text-xs">🏊</span> {{ order.pool?.label || 'N/A' }}
                  </p>
                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <span class="text-xs">👨‍🔧</span> {{ order.technician?.name || 'Unassigned' }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="text-xs">📋</span> {{ order.type || 'Standard' }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="text-xs">📅</span> {{ formatDate(order.created_at) }}
                    </span>
                  </div>
                  
                  <!-- Checklist Progress -->
                  <div v-if="order.checklist" class="mt-3">
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-semibold text-gray-700">
                        {{ order.checklist.completed || 0 }} / {{ order.checklist.total || 0 }} Completed
                      </span>
                      <div class="flex-1 max-w-40 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 ease-out" 
                             :style="{ width: ((order.checklist.completed || 0) / (order.checklist.total || 1) * 100) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-sm text-gray-400">No checklist</p>
                </div>
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <span v-if="order.started_at" class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold flex items-center gap-1">
                    ✅ Started
                  </span>
                  <span v-if="order.finished_at" class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold flex items-center gap-1">
                    ✅ Finished
                  </span>
                  <span v-if="order.gps_captured" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold flex items-center gap-1">
                    📍 GPS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Recent Invoices
            </h2>
            <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm flex items-center gap-1 group transition-all duration-300">
              View All 
              <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
          
          <!-- Empty State -->
          <div v-if="!dashboard?.recent_invoices?.length" 
               class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-12 text-center hover:shadow-2xl transition-all duration-500">
            <div class="text-6xl mb-4 animate-float">💰</div>
            <p class="text-gray-500 text-lg">No recent invoices</p>
          </div>

          <!-- Table -->
          <div v-else class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th v-for="col in invoiceColumns" :key="col" 
                        class="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="invoice in dashboard?.recent_invoices" :key="invoice.id" 
                      class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group">
                    <td class="px-4 py-4 text-sm font-bold text-gray-800">#{{ invoice.invoice_number }}</td>
                    <td class="px-4 py-4 text-sm text-gray-600">{{ invoice.customer?.contact_name || 'N/A' }}</td>
                    <td class="px-4 py-4 text-sm text-gray-600">{{ formatDate(invoice.invoice_date) }}</td>
                    <td class="px-4 py-4 text-sm text-gray-600">{{ formatDate(invoice.due_date) }}</td>
                    <td class="px-4 py-4 text-sm font-bold text-gray-800">{{ formatCurrency(invoice.total) }}</td>
                    <td class="px-4 py-4 text-sm font-bold text-red-600">{{ formatCurrency(invoice.balance_due) }}</td>
                    <td class="px-4 py-4">
                      <span class="px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm" :class="statusBadge(invoice.status)">
                        {{ invoice.status || 'Draft' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Quick Actions -->
      <section>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Quick Actions
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div v-for="action in quickActions" :key="action.label"
               @click="handleQuickAction(action.route)"
               class="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer border border-white/50">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#06B6D4] flex items-center justify-center text-4xl text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
              {{ action.icon }}
            </div>
            <p class="font-semibold text-gray-800 text-sm group-hover:text-[#0284C7] transition-colors duration-300">
              {{ action.label }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'
import Swal from 'sweetalert2'
import Chart from 'chart.js/auto'
import { useAuthStore } from '../../store/AuthStore.js'

const authStore = useAuthStore()

const router = useRouter()
const loading = ref(true)
const dashboard = ref(null)
const revenueChart = ref(null)
let chartInstance = null



// Columns
const visitColumns = ['Customer', 'Pool', 'Technician', 'Scheduled Date', 'Time Window', 'Priority', 'Status']
const invoiceColumns = ['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Total', 'Balance Due', 'Status']

// Header Actions
const headerActions = [
  { label: 'Add Pool', route: '/pools/create' },
  { label: 'Create Service Request', route: '/work-orders/create' }
]

// Quick Actions
const quickActions = [
  { icon: '➕', label: 'Add Customer', route: '/customers/create' },
  { icon: '🏊', label: 'Add Pool', route: '/pools/create' },
  { icon: '📄', label: 'Create Agreement', route: '/agreements/create' },
  { icon: '📅', label: 'Schedule Visit', route: '/visits/create' },
  { icon: '🔧', label: 'Create Work Order', route: '/work-orders/create' },
  { icon: '💰', label: 'Generate Invoice', route: '/invoices/create' }
]

// Computed KPI Cards
const kpiCards = computed(() => {
  const stats = dashboard.value?.stats || {}
  return [
    { label: 'Total Customers', value: stats.total_customers || 0, icon: '👥', iconBg: '#3B82F6' },
    { label: 'Active Customers', value: stats.active_customers || 0, icon: '✅', iconBg: '#10B981' },
    { label: 'Total Pools', value: stats.total_pools || 0, icon: '🏊', iconBg: '#6366F1' },
    { label: 'Active Pools', value: stats.active_pools || 0, icon: '🌊', iconBg: '#3B82F6' },
    { label: 'Total Agreements', value: stats.total_agreements || 0, icon: '📄', iconBg: '#F59E0B' },
    { label: 'Active Agreements', value: stats.active_agreements || 0, icon: '✅', iconBg: '#10B981' },
    { label: 'Total Technicians', value: stats.total_technicians || 0, icon: '🔧', iconBg: '#EF4444' },
    { label: 'Active Technicians', value: stats.active_technicians || 0, icon: '👨‍🔧', iconBg: '#6366F1' }
  ]
})

// Revenue Cards
const revenueCards = computed(() => {
  const revenue = dashboard.value?.revenue || {}
  return [
    { label: 'Total Revenue', value: revenue.total_revenue || 0, change: 12 },
    { label: 'This Month', value: revenue.this_month || 0, change: 8 },
    { label: 'Last Month', value: revenue.last_month || 0, change: -3 },
    { label: 'Outstanding', value: revenue.outstanding || 0, change: 5 }
  ]
})

// Helper Functions
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatCurrency(value) {
  if (!value && value !== 0) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

function formatTime(timeString) {
  if (!timeString) return 'N/A'
  try {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return 'N/A'
  }
}

function statusBadge(status) {
  const statusMap = {
    'Scheduled': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
    'In Progress': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    'Completed': 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white',
    'Cancelled': 'bg-gradient-to-r from-red-400 to-red-500 text-white',
    'Draft': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
    'Sent': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
    'Paid': 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white',
    'Overdue': 'bg-gradient-to-r from-red-400 to-red-500 text-white',
    'Open': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    'Pending': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
  }
  return statusMap[status] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
}

function priorityBadge(priority) {
  const priorityMap = {
    'High': 'bg-gradient-to-r from-red-400 to-red-500 text-white',
    'Medium': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    'Low': 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white',
    'Critical': 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
  }
  return priorityMap[priority] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
}

function handleQuickAction(route) {
  if (route) {
    router.push(route)
  }
}

// Initialize Revenue Chart
function initRevenueChart() {
  try {
    const canvas = revenueChart.value
    if (!canvas) {
      console.warn('Canvas element not found')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('Could not get canvas context')
      return
    }

    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    const revenue = dashboard.value?.revenue || {}
    const labels = ['Total Revenue', 'This Month', 'Last Month', 'Outstanding']
    const data = [
      revenue.total_revenue || 0,
      revenue.this_month || 0,
      revenue.last_month || 0,
      revenue.outstanding || 0
    ]

    const hasData = data.some(value => value > 0)

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data: data,
          backgroundColor: hasData ? [
            'rgba(59, 130, 246, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ] : ['rgba(200, 200, 200, 0.5)'],
          borderColor: hasData ? [
            'rgba(59, 130, 246, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(239, 68, 68, 1)'
          ] : ['rgba(200, 200, 200, 1)'],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: 'rgba(229, 231, 235, 1)',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            callbacks: {
              label: function(context) {
                return formatCurrency(context.parsed.y)
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value)
              },
              font: {
                size: 11
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12,
                weight: '600'
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    })

    chartInstance.update()
  } catch (error) {
    console.error('Error initializing revenue chart:', error)
  }
}

// Load Dashboard Data
async function loadDashboard() {
  loading.value = true
const url = authStore.authType == 'admin' ? `/tenant-portal/dashboard?tenant_id=${authStore.tenantId}` : '/tenant-portal/dashboard' 

  try {
    const response = await api().get(url)
    dashboard.value = response.data.data
    
    await nextTick()
    setTimeout(() => {
      initRevenueChart()
    }, 100)
  } catch (error) {
    console.error('Error loading dashboard:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error Loading Dashboard',
      text: error.response?.data?.message || 'Failed to load dashboard data. Please try again.',
      confirmButtonColor: '#0284C7'
    })
  } finally {
    loading.value = false
  }
}

watch(() => dashboard.value?.revenue, () => {
  nextTick(() => {
    initRevenueChart()
  })
}, { deep: true })

function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  loadDashboard()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

watch(
  () => authStore.tenantId,
  (newId, oldId) => {
    if (newId === oldId) return

    loadDashboard()
  }
)

</script>

<style scoped>
/* Modern Animations */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes pulse-slow-delay {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.15); }
}

@keyframes spin-slow {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-slow-delay {
  animation: pulse-slow-delay 5s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Glassmorphism Background */
.bg-white\/80 {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Smooth Transitions */
* {
  transition: all 0.2s ease;
}

/* Scrollbar Styling */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(241, 241, 241, 0.5);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #0284C7, #06B6D4);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, #0369a1, #0891b2);
}

/* Table Row Hover */
tbody tr {
  transition: all 0.3s ease;
}

/* Card Shadows */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .text-4xl {
    font-size: 1.875rem;
  }
  
  .text-5xl {
    font-size: 2.25rem;
  }
}

/* Badge Gradients */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Custom Card Hover Effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-6 {
  transform: rotate(6deg);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(4px);
}

/* Chart Canvas */
canvas {
  max-height: 100%;
  max-width: 100%;
}

/* Progress Bar Animation */
.h-full.rounded-full {
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>