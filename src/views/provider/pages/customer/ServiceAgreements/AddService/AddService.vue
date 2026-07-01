<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-30">
      <div v-if="loading.customer" class="animate-pulse">
        <div class="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-48 mb-2"></div>
        <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-72"></div>
      </div>
      <div v-else class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-3 flex-wrap">
            <h1
              class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
             Add Service for {{ customer?.contact_name }}
            </h1>
            <span :class="customerStatusBadge(customer?.status)" class="shadow-sm">
              {{ formatStatus(customer?.status) }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-medium">{{ formatStatus(customer?.type) }}</span>
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${customer?.phone}`" class="text-blue-600 hover:text-blue-800 transition-colors">
                {{ customer?.phone }}
              </a>
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="`mailto:${customer?.email}`" class="text-blue-600 hover:text-blue-800 transition-colors">
                {{ customer?.email }}
              </a>
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-slate-500">Prefers {{ formatStatus(customer?.preferred_contact) }}</span>
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 shrink-0">
          <!-- <button @click="editCustomer"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Customer
          </button> -->
          <button @click="createAgreement"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create Agreement
          </button>
          <button @click="addPool"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Pool
          </button>
        </div>
      </div>
    </header>

    <div class="px-4 sm:px-6 lg:px-8 py-8 space-y-8 ">

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <template v-if="loading.customer">
          <div v-for="i in 6" :key="i"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 animate-pulse">
            <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-16 mb-2"></div>
            <div class="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-12"></div>
          </div>
        </template>
        <template v-else>
          <div v-for="(stat, index) in kpiStats" :key="index"
            class="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-5 hover:border-blue-200/60">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
              {{ stat.value }}
            </p>
            <div
              class="mt-2 h-1 w-12 bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-full group-hover:from-blue-500/40 transition-all duration-300">
            </div>
          </div>
        </template>
      </div>

      <!-- Customer Information Card -->
      <div
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div
          class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
          <h2 class="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
            Customer Information
          </h2>
          <span class="text-xs text-slate-400">📋 {{ customer?.contact_name }}</span>
        </div>
        <div v-if="loading.customer" class="p-6 animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 10" :key="i">
            <div class="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24 mb-1.5"></div>
            <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-36"></div>
          </div>
        </div>
        <div v-else class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <div v-for="(field, key) in customerFields" :key="key" class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ field.label }}</span>
            <span class="text-sm text-slate-900 font-medium">{{ field.value }}</span>
          </div>
        </div>
      </div>

      <!-- Pools Section -->
      <!-- <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
            Pools
          </h2>
          <span class="text-sm text-slate-400">{{ customer?.pools?.length || 0 }} pools</span>
        </div>
        <div v-if="loading.customer" class="space-y-4">
          <div v-for="i in 2" :key="i"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
            <div class="p-6 space-y-4">
              <div class="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-40"></div>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="j in 7" :key="j" class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!customer?.pools?.length"
          class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300/60 shadow-sm hover:border-blue-400/60 transition-all duration-300">
          <div
            class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p class="text-base font-medium text-slate-700">No pools found</p>
          <p class="text-sm text-slate-400 mt-1 max-w-xs">Add a pool to start tracking service and maintenance
            schedules.</p>
          <button @click="addPool"
            class="inline-flex items-center justify-center px-5 py-2.5 mt-6 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Pool
          </button>
        </div>
        <div v-else class="space-y-6">
          <div v-for="pool in customer.pools" :key="pool.id"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :class="pool.is_active ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                <h3 class="text-base font-semibold text-slate-800">{{ pool.label }}</h3>
                <span :class="poolActiveBadge(pool.is_active)" class="shadow-sm">{{ pool.is_active ? 'Active' :
                  'Inactive'
                }}</span>
              </div>
              <div class="flex gap-2 sm:ml-auto">
              
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-6">
                <div v-for="(field, key) in getPoolFields(pool)" :key="key" class="flex flex-col gap-0.5">
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ field.label }}</span>
                  <span class="text-sm text-slate-900 font-medium">{{ field.value }}</span>
                </div>
              </div>

            
            </div>
          </div>
        </div>
      </div> -->

   
    <!-- <div>
      <Price :customer="customer" @refresh="loadAllData" />
    </div> -->

    <div>
      <Services :customer="customer" @refresh="loadAllData" />
    </div>

    <!-- <div>
      <Terms :customer="customer" @refresh="loadAllData" />
    </div> -->

    <!-- <div>
      <button
        @click="activateAgreement"
        :disabled="hasActiveAgreement || submittingAgreement"
        class="bg-green-600 hover:bg-green-700 text-base font-semibold text-white p-2 rounded-lg w-1/3 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <i v-if="submittingAgreement" class="ri-loader-4-line animate-spin mr-2"></i>
        {{ agreementButtonLabel }}
      </button>
    </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../../../../../services/api.js'
import Price from '../../AllCustomers/comps/price.vue'
import Services from '../../AllCustomers/comps/services.vue'
import Terms from '../../AllCustomers/comps/terms.vue'

// --- Router ---
const route = useRoute()
const router = useRouter()

// --- State ---
const customer = ref(null)
const poolSchedules = ref({})
const poolScheduleErrors = ref({})
const openMenu = ref({ type: null, id: null })

const loading = ref({
  customer: true,
  schedules: false,
})

// --- KPI Stats ---
const kpiStats = computed(() => [
  { label: 'Pools', value: customer.value?.pools?.length ?? 0 },
  { label: 'Active Agreements', value: activeAgreementsCount.value },
  { label: 'Total Invoices', value: customer.value?.invoices?.length ?? 0 },
  { label: 'Payments', value: customer.value?.payments?.length ?? 0 },
  { label: 'Message Threads', value: customer.value?.message_threads?.length ?? 0 },
  // { label: 'Balance Due', value: formatCurrency(outstandingBalance.value) },
])

// --- Computed ---
const activeAgreementsCount = computed(() =>
  customer.value?.agreements?.filter(a => a.status === 'active').length ?? 0
)

const outstandingBalance = computed(() =>
  customer.value?.invoices?.reduce((sum, inv) => sum + (inv.balance_due > 0 ? inv.balance_due : 0), 0) ?? 0
)

// --- Customer Fields for Display ---
const customerFields = computed(() => ({
  contactName: { label: 'Contact Name', value: customer.value?.contact_name || '—' },
  companyName: { label: 'Company Name', value: customer.value?.company_name || '—' },
  customerType: { label: 'Customer Type', value: formatStatus(customer.value?.type) || '—' },
  email: { label: 'Email', value: customer.value?.email || '—' },
  phone: { label: 'Phone', value: customer.value?.phone || '—' },
  billingAddress: { label: 'Billing Address', value: customer.value?.billing_address || '—' },
  preferredContact: { label: 'Preferred Contact', value: formatStatus(customer.value?.preferred_contact) || '—' },
  status: { label: 'Status', value: customer.value?.status ? formatStatus(customer.value.status) : '—' },
  createdAt: { label: 'Created At', value: formatDate(customer.value?.created_at) },
  updatedAt: { label: 'Updated At', value: formatDate(customer.value?.updated_at) },
}))

// --- Pool Fields Helper ---
function getPoolFields(pool) {
  return {
    serviceAddress: { label: 'Service Address', value: pool.service_address || '—' },
    volume: { label: 'Volume (gallons)', value: pool.volume_gallons ? pool.volume_gallons + ' gal' : '—' },
    chemicalType: { label: 'Chemical Type', value: formatStatus(pool.chemical_type) || '—' },
    season: { label: 'Season', value: formatStatus(pool.season) || '—' },
    gateCode: { label: 'Gate Code', value: pool.gate_code || '—' },
    hasDog: { label: 'Has Dog', value: pool.has_dog ? 'Yes' : 'No' },
    accessNotes: { label: 'Access Notes', value: pool.access_notes || '—' },
  }
}

// --- Helpers ---
function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTimeRange(start, end) {
  if (!start && !end) return '—'
  const formatTime = (time) => {
    if (!time) return ''
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  const startStr = formatTime(start)
  const endStr = formatTime(end)
  if (startStr && endStr) return `${startStr} - ${endStr}`
  return startStr || endStr || '—'
}

const formatTime = (t) => {
  if (!t) return '—';
  if (t.includes(':')) {
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return t;
};


function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

function formatStatus(val) {
  if (!val) return '—'
  return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// --- Badges ---
function customerStatusBadge(status) {
  const map = {
    active: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    suspended: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function agreementStatusBadge(status) {
  const map = {
    active: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    expired: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function invoiceStatusBadge(status) {
  const map = {
    paid: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    sent: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    overdue: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    draft: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function visitStatusBadge(status) {
  const map = {
    completed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    scheduled: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    in_progress: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function paymentStatusBadge(status) {
  const map = {
    completed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    failed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    refunded: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function priorityBadge(priority) {
  const map = {
    high: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    medium: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    low: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    urgent: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  }
  return map[priority] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function poolActiveBadge(active) {
  return active
    ? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    : 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function threadStatusBadge(status) {
  const map = {
    open: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    closed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    resolved: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

// --- Schedule helpers ---
const MAINTENANCE_TYPES = ['one_time', 'emergency', 'inspection', 'repair', 'installation']

function getPoolVisits(poolId) {
  return poolSchedules.value[poolId] ?? []
}

function getPoolScheduleStatus(poolId) {
  return poolScheduleErrors.value[poolId] ? 'failed' : 'success'
}

function routineVisits(poolId) {
  const visits = getPoolVisits(poolId)
  return visits.filter(v => v.work_order === null || v.work_order?.type === 'routine')
}

function maintenanceVisits(poolId) {
  const visits = getPoolVisits(poolId)
  return visits.filter(v => v.work_order !== null && MAINTENANCE_TYPES.includes(v.work_order?.type))
}

// --- Action menu ---
function toggleMenu(type, id) {
  if (openMenu.value.type == type && openMenu.value.id === id) {
    openMenu.value = { type: null, id: null }
  } else {
    openMenu.value = { type, id }
  }
}

function closeMenu(type, id) {
  if (openMenu.value.type === type && openMenu.value.id === id) {
    openMenu.value = { type: null, id: null }
  }
}

// --- Navigation Actions ---
function editCustomer() { }
function createAgreement() { router.push(`/provider/customer-service-agreements-create`) }
function addPool() { router.push(`/provider/pools-create`) }
function viewPool(id) { }
function editPool(id) { }
function viewAgreement(id) { }
function editAgreement(id) { }
function viewInvoice(id) { }
function openConversation(id) { }

// --- API calls ---
async function loadCustomer() {
  loading.value.customer = true
  try {
    const response = await api().get(
      `/customer-management/customers/${route.params.id}?with=pools,agreements,invoices,payments,message_threads&agreement_status=active`
    )
    const data = response.data?.data ?? response.data
    customer.value = data
  } catch (err) {
    const Swal = (await import('sweetalert2')).default
    Swal.fire({
      icon: 'error',
      title: 'Failed to load customer',
      text: err?.response?.data?.message ?? 'An unexpected error occurred.',
    })
  } finally {
    loading.value.customer = false
  }
}

const schedulesLoaded = computed(() => {
  if (!customer.value?.pools?.length) return false
  return customer.value.pools.every(pool => poolSchedules.value[pool.id] !== undefined)
})

async function loadSchedules() {
  const pools = customer.value?.pools
  if (!pools?.length) return

  loading.value.schedules = true
  poolScheduleErrors.value = {}

  try {
    const requests = pools.map(pool =>
      api().get(`/schedule-visit-management/visits?pool_id=${pool.id}`)
    )

    const results = await Promise.allSettled(requests)
    const schedules = {}

    results.forEach((result, index) => {
      const poolId = pools[index].id
      if (result.status === 'fulfilled') {
        const response = result.value
        const visitsData = response.data?.data ?? []
        schedules[poolId] = visitsData
        poolScheduleErrors.value[poolId] = false
      } else {
        schedules[poolId] = []
        poolScheduleErrors.value[poolId] = true
      }
    })

    poolSchedules.value = schedules
  } catch (err) {
    console.error('Unexpected error loading schedules:', err)
    pools.forEach(pool => {
      if (!poolScheduleErrors.value[pool.id]) {
        poolScheduleErrors.value[pool.id] = true
      }
    })
  } finally {
    loading.value.schedules = false
  }
}

async function loadAllData() {
  await loadCustomer()
  await loadSchedules()
}

// --- v-click-outside directive ---
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  },
}

const submittingAgreement = ref(false)

// --- Computed for Agreement Button ---
const hasActiveAgreement = computed(() => {
  return customer.value?.agreements?.some(a => a.status === 'draft') ?? false
})

const agreementButtonLabel = computed(() => {
  return hasActiveAgreement.value ? 'Already Created' : 'Create Agreement'
})

// --- Activate Agreement ---
const activateAgreement = async () => {
  // If already active, do nothing
  if (hasActiveAgreement.value) return

  const agreement = customer.value?.agreements?.[0]
  if (!agreement) {
    await Swal.fire({
      icon: 'warning',
      title: 'No Agreement Found',
      text: 'Please create a Price agreement first.',
      confirmButtonColor: '#4f46e5'
    })
    return
  }

  submittingAgreement.value = true
  try {
    const payload = {
      status: 'active',
      _method: 'PUT'
    }
    await api().post(`/service-agreement-management/agreements/${agreement.id}`, payload)

    await Swal.fire({
      icon: 'success',
      title: 'Activated',
      text: 'Agreement has been activated successfully.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })

    // Refresh customer data to reflect the updated status
    await loadAllData()
  } catch (error) {
    console.error('Failed to activate agreement:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Activation Failed',
      text: error.response?.data?.message || 'Something went wrong.',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    submittingAgreement.value = false
  }
}

// --- Watch for route changes ---
watch(() => route.params.id, () => {
  loadAllData()
})

// --- Init ---
onMounted(loadAllData)
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>