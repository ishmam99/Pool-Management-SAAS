<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="mt-1 text-sm text-gray-500">Manage all pool service customers and agreements.</p>
      </div>
      <div class="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0 md:mt-0">
        <button class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl">
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Import Customers
        </button>
        <button class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl">
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Customer
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div v-if="!loading" class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.count }}</p>
            <p class="text-sm text-gray-600">{{ kpi.label }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3">
            <component :is="kpi.icon" class="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span :class="kpi.trend > 0 ? 'text-emerald-600' : 'text-red-600'" class="font-medium">
            {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
          </span>
          <span class="ml-1 text-gray-500">vs last month</span>
        </div>
      </div>
    </div>

    <!-- KPI Skeleton Loading -->
    <div v-else class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="animate-pulse">
          <div class="mb-2 h-8 w-20 rounded bg-gray-200"></div>
          <div class="h-4 w-32 rounded bg-gray-200"></div>
          <div class="mt-3 h-4 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
        <!-- Search -->
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or phone..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-40"
        >
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Agreement Filter -->
        <select
          v-model="agreementFilter"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-40"
        >
          <option v-for="status in agreementOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Sort By -->
        <select
          v-model="sortBy"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-44"
        >
          <option v-for="option in sortOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table Section -->
    <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Customer</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Contact</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Address</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Pools</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Agreement</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Monthly Value</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
              <th class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-8">
                <div class="space-y-3">
                  <div v-for="i in 5" :key="i" class="animate-pulse">
                    <div class="flex items-center space-x-4">
                      <div class="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 w-32 rounded bg-gray-200"></div>
                        <div class="h-3 w-48 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-4 w-24 rounded bg-gray-200"></div>
                      <div class="h-4 w-20 rounded bg-gray-200"></div>
                      <div class="h-6 w-16 rounded-full bg-gray-200"></div>
                      <div class="h-6 w-6 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="filteredCustomers.length === 0">
              <td colspan="8" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center">
                  <svg class="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900">No customers found</h3>
                  <p class="mt-1 text-sm text-gray-500">Try adjusting filters or add a new customer.</p>
                  <button class="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Customer
                  </button>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-else v-for="customer in paginatedCustomers" :key="customer.id" class="transition-colors hover:bg-gray-50">
              <!-- Customer -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-semibold text-blue-700">
                    {{ customer.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ customer.name }}</p>
                    <p class="text-xs text-gray-500">{{ customer.id }}</p>
                  </div>
                </div>
              </td>
              <!-- Contact -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm text-gray-900">{{ customer.email }}</div>
                <div class="text-xs text-gray-500">{{ customer.phone }}</div>
              </td>
              <!-- Address -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm text-gray-900">{{ customer.address }}</div>
              </td>
              <!-- Pools -->
              <td class="whitespace-nowrap px-4 py-3 text-center">
                <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                  {{ customer.pool_count }}
                </span>
              </td>
              <!-- Agreement -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm text-gray-900">{{ customer.agreement }}</div>
                <span :class="getAgreementStatusClasses(customer.agreement_status)" class="inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                  {{ customer.agreement_status }}
                </span>
              </td>
              <!-- Monthly Value -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm font-medium text-gray-900">${{ customer.monthly_value }}</div>
              </td>
              <!-- Status -->
              <td class="whitespace-nowrap px-4 py-3">
                <span :class="getCustomerStatusClasses(customer.status)" class="inline-block rounded-full px-3 py-1 text-xs font-medium">
                  {{ customer.status }}
                </span>
              </td>
              <!-- Actions -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="relative" @click.stop>
                  <button @click="toggleDropdown(customer.id)" class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                  <div v-if="activeDropdown === customer.id" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button v-for="action in actions" :key="action" class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      {{ action }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCustomers.length > 0" class="flex flex-col items-center justify-between border-t border-gray-200 px-4 py-4 sm:flex-row">
        <div class="mb-2 text-sm text-gray-600 sm:mb-0">
          Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredCustomers.length) }} of {{ filteredCustomers.length }} customers
        </div>
        <div class="flex space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock Data
const mockCustomers = [
  {
    id: 'CUS-1001',
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    phone: '(305) 555-1234',
    address: '245 Ocean Drive, Miami, FL',
    pool_count: 1,
    agreement: 'Weekly Pool Care',
    agreement_status: 'Active',
    monthly_value: 180,
    status: 'Active'
  },
  {
    id: 'CUS-1002',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    phone: '(305) 555-8899',
    address: '890 Palm Ave, Miami, FL',
    pool_count: 2,
    agreement: 'Premium Pool Care',
    agreement_status: 'Expiring',
    monthly_value: 320,
    status: 'Active'
  },
  {
    id: 'CUS-1003',
    name: 'Michael Brown',
    email: 'm.brown@gmail.com',
    phone: '(786) 555-4321',
    address: '455 Bayview Rd, Miami, FL',
    pool_count: 1,
    agreement: 'Monthly Inspection',
    agreement_status: 'Cancelled',
    monthly_value: 95,
    status: 'On Hold'
  },
  {
    id: 'CUS-1004',
    name: 'Emily Davis',
    email: 'emily.davis@gmail.com',
    phone: '(305) 555-6789',
    address: '123 Coral Way, Miami, FL',
    pool_count: 1,
    agreement: 'Weekly Pool Care',
    agreement_status: 'Active',
    monthly_value: 200,
    status: 'Active'
  },
  {
    id: 'CUS-1005',
    name: 'Robert Wilson',
    email: 'robert.w@gmail.com',
    phone: '(786) 555-9876',
    address: '678 Bayshore Dr, Miami, FL',
    pool_count: 3,
    agreement: 'Premium Pool Care',
    agreement_status: 'Expiring',
    monthly_value: 450,
    status: 'Active'
  },
  {
    id: 'CUS-1006',
    name: 'Jennifer Martinez',
    email: 'j.martinez@gmail.com',
    phone: '(305) 555-5432',
    address: '901 Biscayne Blvd, Miami, FL',
    pool_count: 1,
    agreement: 'Monthly Inspection',
    agreement_status: 'Cancelled',
    monthly_value: 85,
    status: 'Cancelled'
  },
  {
    id: 'CUS-1007',
    name: 'David Thompson',
    email: 'david.t@gmail.com',
    phone: '(305) 555-1111',
    address: '456 Collins Ave, Miami, FL',
    pool_count: 2,
    agreement: 'Weekly Pool Care',
    agreement_status: 'Active',
    monthly_value: 310,
    status: 'On Hold'
  },
  {
    id: 'CUS-1008',
    name: 'Lisa Anderson',
    email: 'lisa.a@gmail.com',
    phone: '(786) 555-2222',
    address: '789 Sunset Dr, Miami, FL',
    pool_count: 1,
    agreement: 'Premium Pool Care',
    agreement_status: 'Active',
    monthly_value: 240,
    status: 'Active'
  }
]

// State
const loading = ref(false)
const customers = ref([])
const searchQuery = ref('')
const statusFilter = ref('All')
const agreementFilter = ref('All')
const sortBy = ref('Newest')
const currentPage = ref(1)
const itemsPerPage = 5
const activeDropdown = ref(null)

// Options
const statusOptions = ['All', 'Active', 'On Hold', 'Cancelled']
const agreementOptions = ['All', 'Active', 'Expiring', 'Cancelled']
const sortOptions = ['Newest', 'Oldest', 'Highest Revenue', 'Lowest Revenue']
const actions = [
  'View Customer',
  'Edit Customer',
  'View Pools',
  'Create Agreement',
  'Suspend Customer',
  'Delete Customer'
]

// KPI Data
const kpis = [
  {
    count: 186,
    label: 'Total Customers',
    trend: 12,
    icon: 'UsersIcon'
  },
  {
    count: 174,
    label: 'Active Customers',
    trend: 8,
    icon: 'UserCheckIcon'
  },
  {
    count: 8,
    label: 'On Hold Customers',
    trend: -3,
    icon: 'PauseIcon'
  },
  {
    count: 4,
    label: 'Cancelled Customers',
    trend: -5,
    icon: 'UserXIcon'
  }
]

// Computed
const filteredCustomers = computed(() => {
  let result = customers.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    result = result.filter(c => c.status === statusFilter.value)
  }

  // Agreement filter
  if (agreementFilter.value !== 'All') {
    result = result.filter(c => c.agreement_status === agreementFilter.value)
  }

  // Sorting
  switch (sortBy.value) {
    case 'Newest':
      result = [...result].reverse()
      break
    case 'Oldest':
      result = [...result]
      break
    case 'Highest Revenue':
      result = [...result].sort((a, b) => b.monthly_value - a.monthly_value)
      break
    case 'Lowest Revenue':
      result = [...result].sort((a, b) => a.monthly_value - b.monthly_value)
      break
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage
})

const paginatedCustomers = computed(() => {
  return filteredCustomers.value.slice(startIndex.value, endIndex.value)
})

// Methods
const getCustomerStatusClasses = (status) => {
  const classes = {
    'Active': 'bg-emerald-100 text-emerald-800',
    'On Hold': 'bg-amber-100 text-amber-800',
    'Cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getAgreementStatusClasses = (status) => {
  const classes = {
    'Active': 'bg-blue-100 text-blue-800',
    'Expiring': 'bg-orange-100 text-orange-800',
    'Cancelled': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Close dropdown on outside click
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}

// Lifecycle
onMounted(() => {
  // Load mock data
  customers.value = mockCustomers
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)

  // API integration example (commented out)
  // const fetchCustomers = async () => {
  //   loading.value = true
  //   try {
  //     // const response = await axios.get('/customers')
  //     // customers.value = response.data.data
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 1000))
  //     customers.value = mockCustomers
  //   } catch (error) {
  //     console.error('Error fetching customers:', error)
  //   } finally {
  //     loading.value = false
  //   }
  // }
  // fetchCustomers()
})

// Cleanup
onMounted(() => {
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
/* No additional styles needed - all styling is done with Tailwind */
</style>