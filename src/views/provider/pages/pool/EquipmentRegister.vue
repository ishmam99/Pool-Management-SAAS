<template>
  <div class="min-h-screen bg-slate-50/50 p-4 md:p-8">
    <!-- Page Header -->
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 md:text-3xl">Equipment Register</h1>
        <p class="mt-1 text-sm text-slate-500">
          Track pool equipment, installation details, maintenance history, and replacement schedules.
        </p>
      </div>
      <div class="flex gap-3">
        <button class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
        <button class="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Equipment
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
      <div v-for="(card, index) in kpiCards" :key="index" class="rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ loading ? '--' : card.value }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ card.label }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-2.5" :class="card.iconColor">
            <component :is="card.icon" class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl bg-white p-4 shadow-sm">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search equipment..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
          </div>
        </div>

        <!-- Type Filter -->
        <select v-model="filters.type" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
          <option v-for="type in typeOptions" :key="type" :value="type">{{ type }}</option>
        </select>

        <!-- Brand Filter -->
        <select v-model="filters.brand" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
          <option v-for="brand in brandOptions" :key="brand" :value="brand">{{ brand }}</option>
        </select>

        <!-- Status Filter -->
        <select v-model="filters.status" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
          <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
        </select>

        <!-- Sort -->
        <select v-model="filters.sort" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
          <option v-for="sort in sortOptions" :key="sort" :value="sort">{{ sort }}</option>
        </select>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div v-if="selectedItems.length > 0" class="mb-4 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
      <span class="text-sm font-medium text-indigo-700">{{ selectedItems.length }} Equipment Selected</span>
      <div class="flex gap-2">
        <button class="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">Export</button>
        <button class="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">Create Maintenance</button>
        <button class="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">Assign Technician</button>
        <button class="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all hover:bg-red-100">Delete Selected</button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="h-8 w-full rounded bg-slate-100"></div>
        </div>
        <div v-for="i in 5" :key="i" class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-4">
            <div class="h-4 w-4 rounded bg-slate-100"></div>
            <div class="h-12 w-12 rounded-full bg-slate-100"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-1/4 rounded bg-slate-100"></div>
              <div class="h-3 w-1/3 rounded bg-slate-100"></div>
            </div>
            <div class="h-4 w-20 rounded bg-slate-100"></div>
            <div class="h-4 w-24 rounded bg-slate-100"></div>
            <div class="h-6 w-20 rounded-full bg-slate-100"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEquipment.length === 0" class="py-16 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-800">No equipment found</h3>
        <p class="mt-1 text-sm text-slate-500">Start registering pool equipment to track maintenance and lifecycle.</p>
        <button class="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700">Add Equipment</button>
      </div>

      <!-- Data Table -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50">
                <th class="px-4 py-3 text-left">
                  <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" @change="toggleAll" v-model="selectAll">
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Equipment</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Pool</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Brand / Model</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Installed</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Warranty</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedEquipment" :key="item.id" class="border-b border-slate-50 transition-all hover:bg-slate-50/50">
                <td class="px-4 py-3">
                  <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" v-model="selectedItems" :value="item.id">
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <component :is="getEquipmentIcon(item.type)" class="h-5 w-5" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-800">{{ item.name }}</p>
                      <p class="text-xs text-slate-400">{{ item.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm text-slate-700">{{ item.pool }}</p>
                    <p class="text-xs text-slate-400">{{ item.pool_id }}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm text-slate-700">{{ item.customer }}</p>
                    <p class="text-xs text-slate-400">Miami, FL</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ item.type }}</td>
                <td class="px-4 py-3">
                  <p class="text-sm font-medium text-slate-700">{{ item.brand }}</p>
                  <p class="text-xs text-slate-400">{{ item.model }}</p>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(item.installed_date) }}</td>
                <td class="px-4 py-3">
                  <span v-if="isWarrantyValid(item.warranty_until)" class="text-sm text-green-600">
                    Expires: {{ formatDate(item.warranty_until) }}
                  </span>
                  <span v-else class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">Expired</span>
                </td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-3 py-1 text-xs font-medium" :class="getStatusBadgeClass(item.status)">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="relative inline-block text-left" @click.stop>
                    <button @click="toggleDropdown(item.id)" class="rounded-lg p-2 transition-all hover:bg-slate-100">
                      <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <div v-if="openDropdown === item.id" class="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5">
                      <button @click="viewEquipment(item)" class="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50">View Equipment</button>
                      <button class="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50">Edit Equipment</button>
                      <button class="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50">Create Maintenance</button>
                      <button class="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50">View Service History</button>
                      <button class="block w-full px-4 py-2 text-left text-sm text-amber-600 transition-colors hover:bg-slate-50">Mark For Replacement</button>
                      <button class="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-slate-50">Delete Equipment</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-6 py-4 md:flex-row">
          <p class="text-sm text-slate-500">
            Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredEquipment.length) }} of {{ filteredEquipment.length }} equipment items
          </p>
          <div class="flex gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Equipment Details Drawer -->
    <div v-if="selectedEquipment" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeDrawer"></div>
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl md:max-w-lg">
        <div class="flex h-full flex-col">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 class="text-lg font-semibold text-slate-800">Equipment Details</h2>
            <button @click="closeDrawer" class="rounded-lg p-2 transition-all hover:bg-slate-100">
              <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Equipment Info -->
            <div class="mb-6">
              <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Equipment Information</h3>
              <div class="space-y-3 rounded-xl bg-slate-50/50 p-4">
                <div class="flex justify-between"><span class="text-sm text-slate-500">Equipment Name</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.name }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Type</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.type }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Brand</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.brand }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Model</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.model }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Serial Number</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.serial }}</span></div>
              </div>
            </div>

            <!-- Installation -->
            <div class="mb-6">
              <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Installation</h3>
              <div class="space-y-3 rounded-xl bg-slate-50/50 p-4">
                <div class="flex justify-between"><span class="text-sm text-slate-500">Installed Date</span><span class="text-sm font-medium text-slate-700">{{ formatDate(selectedEquipment.installed_date) }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Installed By</span><span class="text-sm font-medium text-slate-700">Mike's Pool Service</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Warranty Period</span><span class="text-sm font-medium text-slate-700">3 Years</span></div>
              </div>
            </div>

            <!-- Pool Information -->
            <div class="mb-6">
              <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Pool Information</h3>
              <div class="space-y-3 rounded-xl bg-slate-50/50 p-4">
                <div class="flex justify-between"><span class="text-sm text-slate-500">Pool Name</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.pool }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Customer</span><span class="text-sm font-medium text-slate-700">{{ selectedEquipment.customer }}</span></div>
                <div class="flex justify-between"><span class="text-sm text-slate-500">Address</span><span class="text-sm font-medium text-slate-700">123 Main St, Miami, FL</span></div>
              </div>
            </div>

            <!-- Maintenance History -->
            <div>
              <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Maintenance History</h3>
              <div class="space-y-4">
                <div v-for="(record, idx) in maintenanceHistory" :key="idx" class="relative pl-6 before:absolute before:left-2 before:top-4 before:h-full before:w-0.5 before:bg-slate-200 last:before:hidden">
                  <div class="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-indigo-500 ring-2 ring-indigo-100"></div>
                  <div class="rounded-xl bg-slate-50/50 p-3">
                    <p class="text-sm font-medium text-slate-700">{{ record.date }}</p>
                    <p class="text-sm text-slate-600">{{ record.event }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock Data
const mockEquipment = [
  {
    id: "EQ-1001",
    name: "Main Pool Pump",
    type: "Pump",
    brand: "Pentair",
    model: "WhisperFlo",
    serial: "PF-8839201",
    customer: "John Smith",
    pool: "Backyard Pool",
    pool_id: "POOL-1001",
    installed_date: "2024-01-12",
    warranty_until: "2027-01-12",
    last_service: "2026-06-15",
    status: "Active"
  },
  {
    id: "EQ-1002",
    name: "Pool Filter",
    type: "Filter",
    brand: "Hayward",
    model: "ProSeries",
    serial: "HY-552910",
    customer: "Sarah Johnson",
    pool: "Villa Main Pool",
    pool_id: "POOL-1002",
    installed_date: "2023-08-01",
    warranty_until: "2026-08-01",
    last_service: "2026-06-10",
    status: "Needs Service"
  },
  {
    id: "EQ-1003",
    name: "Pool Heater",
    type: "Heater",
    brand: "Raypak",
    model: "RP2100",
    serial: "RP-778812",
    customer: "Ocean Resort",
    pool: "Main Hotel Pool",
    pool_id: "POOL-1003",
    installed_date: "2021-05-15",
    warranty_until: "2024-05-15",
    last_service: "2026-05-20",
    status: "Replacement Required"
  }
]

// State
const loading = ref(false)
const equipment = ref([])
const selectedItems = ref([])
const selectAll = ref(false)
const openDropdown = ref(null)
const selectedEquipment = ref(null)
const currentPage = ref(1)
const pageSize = 10

// Filters
const filters = ref({
  search: '',
  type: 'All',
  brand: 'All',
  status: 'All',
  sort: 'Newest Installed'
})

// Options
const typeOptions = ['All', 'Pump', 'Filter', 'Heater', 'Salt System', 'Automation System', 'Cleaner']
const brandOptions = ['All', 'Pentair', 'Hayward', 'Jandy', 'Raypak']
const statusOptions = ['All', 'Active', 'Needs Service', 'Warranty Expired', 'Replacement Required']
const sortOptions = ['Newest Installed', 'Oldest Installed', 'Warranty Ending Soon', 'Recently Serviced']

// KPI Cards
const kpiCards = ref([
  { label: 'Registered Equipment', value: '642', icon: 'PackageIcon', iconColor: 'text-blue-600 bg-blue-50' },
  { label: 'Pool Pumps', value: '214', icon: 'FanIcon', iconColor: 'text-emerald-600 bg-emerald-50' },
  { label: 'Filters', value: '198', icon: 'FilterIcon', iconColor: 'text-purple-600 bg-purple-50' },
  { label: 'Heating Systems', value: '86', icon: 'FlameIcon', iconColor: 'text-amber-600 bg-amber-50' },
  { label: 'Attention Required', value: '24', icon: 'AlertIcon', iconColor: 'text-red-600 bg-red-50' }
])

// Maintenance History
const maintenanceHistory = [
  { date: 'June 15, 2026', event: 'Routine inspection completed' },
  { date: 'May 10, 2026', event: 'Filter cleaned' },
  { date: 'April 02, 2026', event: 'Pump checked' }
]

// Computed
const filteredEquipment = computed(() => {
  let result = [...equipment.value]

  // Search
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.customer.toLowerCase().includes(search) ||
      item.pool_id.toLowerCase().includes(search) ||
      item.serial.toLowerCase().includes(search) ||
      item.brand.toLowerCase().includes(search)
    )
  }

  // Type filter
  if (filters.value.type !== 'All') {
    result = result.filter(item => item.type === filters.value.type)
  }

  // Brand filter
  if (filters.value.brand !== 'All') {
    result = result.filter(item => item.brand === filters.value.brand)
  }

  // Status filter
  if (filters.value.status !== 'All') {
    result = result.filter(item => item.status === filters.value.status)
  }

  // Sort
  switch (filters.value.sort) {
    case 'Newest Installed':
      result.sort((a, b) => new Date(b.installed_date) - new Date(a.installed_date))
      break
    case 'Oldest Installed':
      result.sort((a, b) => new Date(a.installed_date) - new Date(b.installed_date))
      break
    case 'Warranty Ending Soon':
      result.sort((a, b) => new Date(a.warranty_until) - new Date(b.warranty_until))
      break
    case 'Recently Serviced':
      result.sort((a, b) => new Date(b.last_service) - new Date(a.last_service))
      break
  }

  return result
})

const paginatedEquipment = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredEquipment.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredEquipment.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

// Methods
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isWarrantyValid = (dateStr) => {
  return new Date(dateStr) > new Date()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Active': 'bg-green-100 text-green-700',
    'Needs Service': 'bg-amber-100 text-amber-700',
    'Warranty Expired': 'bg-slate-100 text-slate-600',
    'Replacement Required': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-slate-100 text-slate-600'
}

const getEquipmentIcon = (type) => {
  const icons = {
    'Pump': 'FanIcon',
    'Filter': 'FilterIcon',
    'Heater': 'FlameIcon',
    'Salt System': 'WavesIcon',
    'Automation System': 'CpuIcon',
    'Cleaner': 'PackageIcon'
  }
  return icons[type] || 'PackageIcon'
}

const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const toggleAll = () => {
  if (selectAll.value) {
    selectedItems.value = paginatedEquipment.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

const viewEquipment = (item) => {
  selectedEquipment.value = item
  openDropdown.value = null
}

const closeDrawer = () => {
  selectedEquipment.value = null
}

// Mock loading simulation
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    equipment.value = mockEquipment
    loading.value = false
  }, 800)
}

// API Integration (commented)
/*
import axios from '@/services/api'

const fetchEquipment = async () => {
  loading.value = true
  try {
    const response = await axios.get('/equipment')
    equipment.value = response.data.data
  } catch(error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
*/

onMounted(() => {
  loadData()
})

// Icon Components (simplified)
const PackageIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' }
const FanIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' }
const FilterIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>' }
const FlameIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11H11"/></svg>' }
const WavesIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 8.25h16.5"/></svg>' }
const CpuIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>' }
const AlertIcon = { template: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>' }
</script>

<style scoped>
/* Smooth transitions for dropdown */
.absolute {
  transition: all 0.15s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>