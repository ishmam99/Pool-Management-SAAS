<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="mt-1 text-sm text-gray-500">Manage all pool service customers and agreements.</p>
      </div>
      <div class="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0 md:mt-0">

        <router-link to="/provider/customer-create"
          class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl">
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </router-link>
      </div>
    </div>

    <!-- KPI Cards -->
    <div v-if="!loading" class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(kpi, index) in kpis" :key="index"
        class="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
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
          <svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search by name, email, or phone..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>

        <!-- Status Filter -->
        <select v-model="statusFilter"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-40">
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Agreement Filter -->
        <select v-model="agreementFilter"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-40">
          <option v-for="status in agreementOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Sort By -->
        <select v-model="sortBy"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-44">
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
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Customer</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Contact</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Address</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Pools</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Agreement</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Monthly Value</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions</th>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900">No customers found</h3>
                  <p class="mt-1 text-sm text-gray-500">Create your first customer to get started.</p>
                  <button
                    class="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Customer
                  </button>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-else v-for="customer in paginatedCustomers" :key="customer.id"
              class="transition-colors hover:bg-gray-50">
              <!-- Customer -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-semibold text-blue-700">
                    {{ getAvatarInitial(customer) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ customer.contact_name }}</p>
                    <p class="text-xs text-gray-500">ID: {{ customer.id }}</p>
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
                <div class="text-sm text-gray-900">{{ customer.billing_address || 'N/A' }}</div>
              </td>
              <!-- Pools -->
              <td class="whitespace-nowrap px-4 py-3 text-center">
                <span
                  class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                  {{ getPoolCount(customer) }}
                </span>
              </td>
              <!-- Agreement -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm text-gray-900">{{ getAgreementFrequency(customer) }}</div>
                <span :class="getAgreementStatusClasses(customer)"
                  class="inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                  {{ getAgreementStatus(customer) }}
                </span>
              </td>
              <!-- Monthly Value -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm font-medium text-gray-900">${{ getMonthlyValue(customer) }}</div>
              </td>
              <!-- Status -->
              <td class="whitespace-nowrap px-4 py-3">
                <span :class="getCustomerStatusClasses(customer.status)"
                  class="inline-block rounded-full px-3 py-1 text-xs font-medium">
                  {{ capitalizeFirstLetter(customer.status) }}
                </span>
              </td>
              <!-- Actions -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="relative" @click.stop>
                  <button @click="toggleDropdown(customer.id)"
                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <div v-if="activeDropdown === customer.id"
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button v-for="action in actions" :key="action.label" @click="handleAction(action, customer)"
                      class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      {{ action.label }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCustomers.length > 0"
        class="flex flex-col items-center justify-between border-t border-gray-200 px-4 py-4 sm:flex-row">
        <div class="mb-2 text-sm text-gray-600 sm:mb-0">
          Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredCustomers.length) }} of {{ filteredCustomers.length
          }} customers
        </div>
        <div class="flex space-x-2">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
            Previous
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'

const router = useRouter()

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
const statusOptions = computed(() => {
  const statuses = ['All']
  customers.value.forEach(customer => {
    if (customer.status && !statuses.includes(capitalizeFirstLetter(customer.status))) {
      statuses.push(capitalizeFirstLetter(customer.status))
    }
  })
  return statuses
})

const agreementOptions = ['All', 'Active', 'Pending', 'Expired', 'Cancelled']
const sortOptions = ['Newest', 'Oldest', 'Highest Revenue', 'Lowest Revenue']

const actions = [
  { label: 'View Customer', action: 'view' },
  { label: 'Edit Customer', action: 'edit' },
  { label: 'View Pools', action: 'pools' },
  { label: 'View Agreements', action: 'agreements' },
  { label: 'Create Agreement', action: 'createAgreement' },
  { label: 'Deactivate Customer', action: 'deactivate' },
  { label: 'Delete Customer', action: 'delete' }
]

// KPI Data
const kpis = computed(() => {
  const total = customers.value.length
  const active = customers.value.filter(c => c.status === 'active').length
  const suspended = customers.value.filter(c => c.status === 'suspended').length
  const totalPools = customers.value.reduce((sum, customer) => sum + (customer.pools?.length || 0), 0)

  return [
    {
      count: total,
      label: 'Total Customers',
      trend: 12,
      icon: 'UsersIcon'
    },
    {
      count: active,
      label: 'Active Customers',
      trend: 8,
      icon: 'UserCheckIcon'
    },
    {
      count: suspended,
      label: 'Suspended Customers',
      trend: -3,
      icon: 'PauseIcon'
    },
    {
      count: totalPools,
      label: 'Total Pools',
      trend: 5,
      icon: 'UserXIcon'
    }
  ]
})

// Computed
const filteredCustomers = computed(() => {
  let result = [...customers.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.contact_name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.includes(query) ||
      c.company_name?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    const filterStatus = statusFilter.value.toLowerCase()
    result = result.filter(c => c.status?.toLowerCase() === filterStatus)
  }

  // Agreement filter
  if (agreementFilter.value !== 'All') {
    const filterAgreement = agreementFilter.value.toLowerCase()
    result = result.filter(c => {
      const agreement = c.agreements?.[0]
      return agreement?.status?.toLowerCase() === filterAgreement
    })
  }

  // Sorting
  switch (sortBy.value) {
    case 'Newest':
      result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'Oldest':
      result = [...result].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'Highest Revenue':
      result = [...result].sort((a, b) => (b.agreements?.[0]?.price || 0) - (a.agreements?.[0]?.price || 0))
      break
    case 'Lowest Revenue':
      result = [...result].sort((a, b) => (a.agreements?.[0]?.price || 0) - (b.agreements?.[0]?.price || 0))
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
const fetchCustomers = async () => {
  loading.value = true

  try {
    const response = await api().get(
      'customer-management/customers-advance?with=pools,agreements'
    )

    customers.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching customers:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Load Customers',
      text: error.response?.data?.message || 'Something went wrong'
    })
  } finally {
    loading.value = false
  }
}

const getAvatarInitial = (customer) => {
  return customer.contact_name?.charAt(0) || '?'
}

const getPoolCount = (customer) => {
  return customer.pools?.length || 0
}

const getAgreementFrequency = (customer) => {
  const agreement = customer.agreements?.[0]
  return agreement?.frequency || 'No Agreement'
}

const getAgreementStatus = (customer) => {
  const agreement = customer.agreements?.[0]
  return agreement?.status ? capitalizeFirstLetter(agreement.status) : 'No Agreement'
}

const getAgreementStatusClasses = (customer) => {
  const agreement = customer.agreements?.[0]
  const status = agreement?.status?.toLowerCase()

  const classes = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'expired': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  }

  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getMonthlyValue = (customer) => {
  const agreement = customer.agreements?.[0]
  return agreement?.price == null ? agreement?.price : '0.00'
}

const getCustomerStatusClasses = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'suspended': 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const handleAction = (action, customer) => {
  activeDropdown.value = null

  switch (action.action) {
    case 'view':
      router.push(`/provider/customers/${customer.id}`)
      break
    case 'edit':
      // Implement edit functionality
      console.log('Edit customer:', customer.id)
      break
    case 'pools':
      router.push(`/provider/customers/${customer.id}/pools`)
      break
    case 'agreements':
      router.push(`/provider/customers/${customer.id}/agreements`)
      break
    case 'createAgreement':
      // Implement create agreement functionality
      console.log('Create agreement for customer:', customer.id)
      break
    case 'deactivate':
      // Implement deactivate functionality
      console.log('Deactivate customer:', customer.id)
      break
    case 'delete':
      // Implement delete functionality
      console.log('Delete customer:', customer.id)
      break
  }
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
  fetchCustomers()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* No additional styles needed - all styling is done with Tailwind */
</style>