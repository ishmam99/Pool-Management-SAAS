```vue
<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <!-- KPI Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <!-- Filters Skeleton -->
      <div class="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
        <div class="flex flex-wrap gap-4">
          <div class="h-10 bg-gray-200 rounded w-48"></div>
          <div class="h-10 bg-gray-200 rounded w-32"></div>
          <div class="h-10 bg-gray-200 rounded w-32"></div>
          <div class="h-10 bg-gray-200 rounded w-32"></div>
          <div class="h-10 bg-gray-200 rounded w-32 ml-auto"></div>
        </div>
      </div>
      <!-- Table Skeleton -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
        <div class="p-4 border-b">
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4">
            <div class="h-4 w-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-32"></div>
            <div class="h-4 bg-gray-200 rounded w-28"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">All Pools</h1>
          <p class="text-gray-500 text-sm mt-1">Manage all customer pools, equipment, service details, and maintenance records.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            Import Pools
          </button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            + Add Pool
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Total Pools</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ summary.totalPools }}</p>
          <p class="text-xs text-gray-400 mt-1">Registered Pools</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Residential</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ summary.residentialPools }}</p>
          <p class="text-xs text-gray-400 mt-1">Residential Pools</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Commercial</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ summary.commercialPools }}</p>
          <p class="text-xs text-gray-400 mt-1">Commercial Pools</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Salt Water</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ summary.saltWaterPools }}</p>
          <p class="text-xs text-gray-400 mt-1">Salt Water Pools</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Maintenance Due</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ summary.maintenanceDue }}</p>
          <p class="text-xs text-gray-400 mt-1">Need Attention</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search pools..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
          </div>
          <!-- Pool Type -->
          <select v-model="selectedType" class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option v-for="type in typeOptions" :key="type" :value="type">{{ type }}</option>
          </select>
          <!-- Water Type -->
          <select v-model="selectedWaterType" class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option v-for="water in waterOptions" :key="water" :value="water">{{ water }}</option>
          </select>
          <!-- Status -->
          <select v-model="selectedStatus" class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
          </select>
          <!-- Sort -->
          <select v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option v-for="sort in sortOptions" :key="sort" :value="sort">{{ sort }}</option>
          </select>
          <!-- View Toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1">
            <button 
              @click="viewMode = 'table'"
              class="px-3 py-1.5 text-sm rounded-lg transition-colors"
              :class="viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
            >
              Table
            </button>
            <button 
              @click="viewMode = 'card'"
              class="px-3 py-1.5 text-sm rounded-lg transition-colors"
              :class="viewMode === 'card' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
            >
              Card
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Toolbar -->
      <div v-if="selectedPools.length > 0" class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 mb-6 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">{{ selectedPools.length }} Pools Selected</span>
        <div class="flex items-center gap-3">
          <button class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">Export</button>
          <button class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">Assign Technician</button>
          <button class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">Create Maintenance</button>
          <button class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete Selected</button>
        </div>
      </div>

      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left">
                  <input type="checkbox" @change="toggleAll" v-model="selectAll" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Service</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="pool in filteredPools" :key="pool.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <input type="checkbox" v-model="selectedPools" :value="pool.id" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🏊</span>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ pool.name }}</p>
                      <p class="text-xs text-gray-400">{{ pool.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm text-gray-900">{{ pool.customer }}</p>
                  <p class="text-xs text-gray-400">{{ pool.address }}</p>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ pool.type }}</td>
                <td class="px-4 py-3">
                  <p class="text-sm font-medium text-gray-900">{{ pool.volume.split(' ')[0] }}</p>
                  <p class="text-xs text-gray-400">Gallons</p>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ pool.water_type }}</td>
                <td class="px-4 py-3">
                  <button @click="openEquipment(pool)" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    {{ pool.equipment_count }} Equipment
                  </button>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(pool.last_service) }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(pool.next_service) }}</td>
                <td class="px-4 py-3">
                  <span :class="statusBadgeClass(pool.status)" class="px-2.5 py-1 text-xs font-medium rounded-full">
                    {{ statusLabel(pool.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="relative">
                    <button @click="toggleDropdown(pool.id)" class="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div v-if="openDropdown === pool.id" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                      <button @click="viewPool(pool)" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">View Pool</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Edit Pool</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">View Equipment</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Service History</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Create Maintenance</button>
                      <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete Pool</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="pool in filteredPools" :key="pool.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <input type="checkbox" v-model="selectedPools" :value="pool.id" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="text-2xl">🏊</span>
              <div>
                <h3 class="font-semibold text-gray-900">{{ pool.name }}</h3>
                <p class="text-xs text-gray-400">{{ pool.id }}</p>
              </div>
            </div>
            <span :class="statusBadgeClass(pool.status)" class="px-2.5 py-1 text-xs font-medium rounded-full">
              {{ statusLabel(pool.status) }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <p class="text-gray-700"><span class="font-medium">{{ pool.customer }}</span></p>
            <p class="text-gray-500">{{ pool.type }} • {{ pool.volume }}</p>
            <div class="flex items-center gap-2 text-gray-600">
              <span>💧 {{ pool.water_type }}</span>
              <span>•</span>
              <span>⚙ {{ pool.equipment_count }} Equipment</span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <p class="text-xs text-gray-400">Next Service</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(pool.next_service) }}</p>
              </div>
              <button @click="viewPool(pool)" class="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPools.length === 0 && !loading" class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="text-6xl mb-4">🏊</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No pools found</h3>
        <p class="text-gray-500 mb-6">Start by adding your first customer pool.</p>
        <button class="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          Add Pool
        </button>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <p class="text-sm text-gray-600">Showing {{ paginationStart }}-{{ paginationEnd }} of {{ filteredPools.length }} pools</p>
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Pool Details Modal -->
    <div v-if="selectedPool" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="selectedPool = null">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Pool Details</h2>
          <button @click="selectedPool = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-3">Pool Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div><p class="text-xs text-gray-400">Pool Name</p><p class="text-sm font-medium">{{ selectedPool.name }}</p></div>
              <div><p class="text-xs text-gray-400">Pool Type</p><p class="text-sm font-medium">{{ selectedPool.type }}</p></div>
              <div><p class="text-xs text-gray-400">Shape</p><p class="text-sm font-medium">{{ selectedPool.shape }}</p></div>
              <div><p class="text-xs text-gray-400">Volume</p><p class="text-sm font-medium">{{ selectedPool.volume }}</p></div>
              <div><p class="text-xs text-gray-400">Water Type</p><p class="text-sm font-medium">{{ selectedPool.water_type }}</p></div>
              <div><p class="text-xs text-gray-400">Construction Type</p><p class="text-sm font-medium">Gunite</p></div>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-3">Customer Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div><p class="text-xs text-gray-400">Customer Name</p><p class="text-sm font-medium">{{ selectedPool.customer }}</p></div>
              <div><p class="text-xs text-gray-400">Phone</p><p class="text-sm font-medium">(305) 555-0123</p></div>
              <div class="col-span-2"><p class="text-xs text-gray-400">Email</p><p class="text-sm font-medium">{{ selectedPool.customer_email }}</p></div>
              <div class="col-span-2"><p class="text-xs text-gray-400">Address</p><p class="text-sm font-medium">{{ selectedPool.address }}</p></div>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-3">Equipment Summary</h3>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Pump</span>
              <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Filter</span>
              <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Heater</span>
              <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Salt System</span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-3">Service Summary</h3>
            <div class="grid grid-cols-2 gap-4">
              <div><p class="text-xs text-gray-400">Last Service</p><p class="text-sm font-medium">{{ formatDate(selectedPool.last_service) }}</p></div>
              <div><p class="text-xs text-gray-400">Next Service</p><p class="text-sm font-medium">{{ formatDate(selectedPool.next_service) }}</p></div>
              <div><p class="text-xs text-gray-400">Technician</p><p class="text-sm font-medium">Mike Johnson</p></div>
              <div><p class="text-xs text-gray-400">Agreement</p><p class="text-sm font-medium">Premium Plan</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Loading state
const loading = ref(false)

// Mock Data
const summary = ref({
  totalPools: 214,
  residentialPools: 168,
  commercialPools: 32,
  saltWaterPools: 86,
  maintenanceDue: 14
})

const poolsData = ref([
  {
    id: "POOL-1001",
    name: "Backyard Pool",
    customer: "John Smith",
    customer_email: "john.smith@gmail.com",
    address: "245 Ocean Drive, Miami, FL",
    type: "Residential",
    shape: "Rectangle",
    volume: "18,000 Gallons",
    water_type: "Chlorine",
    equipment_count: 5,
    last_service: "2026-06-20",
    next_service: "2026-06-27",
    status: "Active"
  },
  {
    id: "POOL-1002",
    name: "Villa Main Pool",
    customer: "Sarah Johnson",
    customer_email: "sarah.j@gmail.com",
    address: "890 Palm Ave, Miami, FL",
    type: "Residential",
    shape: "Freeform",
    volume: "24,000 Gallons",
    water_type: "Salt Water",
    equipment_count: 7,
    last_service: "2026-06-18",
    next_service: "2026-06-25",
    status: "Maintenance Required"
  },
  {
    id: "POOL-1003",
    name: "Hotel Main Pool",
    customer: "Ocean Resort",
    customer_email: "admin@oceanresort.com",
    address: "500 Beach Road, Miami, FL",
    type: "Commercial",
    shape: "Custom",
    volume: "65,000 Gallons",
    water_type: "Chlorine",
    equipment_count: 12,
    last_service: "2026-06-15",
    next_service: "2026-06-22",
    status: "Active"
  }
])

// Filters
const searchQuery = ref('')
const selectedType = ref('All')
const selectedWaterType = ref('All')
const selectedStatus = ref('All')
const sortBy = ref('Newest')
const viewMode = ref('table')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Selection
const selectedPools = ref([])
const selectAll = ref(false)

// Dropdown
const openDropdown = ref(null)

// Modal
const selectedPool = ref(null)

// Filter options
const typeOptions = ['All', 'Residential', 'Commercial', 'Spa', 'Hotel', 'Community']
const waterOptions = ['All', 'Chlorine', 'Salt Water']
const statusOptions = ['All', 'Active', 'Inactive', 'Maintenance Required']
const sortOptions = ['Newest', 'Oldest', 'Largest Pool', 'Smallest Pool', 'Maintenance Due']

// Computed
const filteredPools = computed(() => {
  let result = [...poolsData.value]
  
  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.customer.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    )
  }
  
  // Type filter
  if (selectedType.value !== 'All') {
    result = result.filter(p => p.type === selectedType.value)
  }
  
  // Water type filter
  if (selectedWaterType.value !== 'All') {
    result = result.filter(p => p.water_type === selectedWaterType.value)
  }
  
  // Status filter
  if (selectedStatus.value !== 'All') {
    result = result.filter(p => p.status === selectedStatus.value)
  }
  
  // Sort
  switch(sortBy.value) {
    case 'Newest':
      result.sort((a, b) => new Date(b.last_service) - new Date(a.last_service))
      break
    case 'Oldest':
      result.sort((a, b) => new Date(a.last_service) - new Date(b.last_service))
      break
    case 'Largest Pool':
      result.sort((a, b) => parseInt(b.volume) - parseInt(a.volume))
      break
    case 'Smallest Pool':
      result.sort((a, b) => parseInt(a.volume) - parseInt(b.volume))
      break
    case 'Maintenance Due':
      result.sort((a, b) => new Date(a.next_service) - new Date(b.next_service))
      break
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredPools.value.length / itemsPerPage))

const paginatedPools = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPools.value.slice(start, end)
})

const paginationStart = computed(() => {
  if (filteredPools.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredPools.value.length)
})

// Methods
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const statusBadgeClass = (status) => {
  const classes = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Maintenance Required': 'bg-amber-100 text-amber-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const statusLabel = (status) => {
  const labels = {
    'Active': 'Active',
    'Inactive': 'Inactive',
    'Maintenance Required': 'Needs Attention'
  }
  return labels[status] || status
}

const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const toggleAll = () => {
  if (selectAll.value) {
    selectedPools.value = paginatedPools.value.map(p => p.id)
  } else {
    selectedPools.value = []
  }
}

const viewPool = (pool) => {
  selectedPool.value = pool
  openDropdown.value = null
}

const openEquipment = (pool) => {
  // Would open equipment modal
  console.log('Open equipment for:', pool.name)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// API Integration (commented)
/*
import axios from '@/services/api'

const fetchPools = async () => {
  loading.value = true
  try {
    const response = await axios.get('/pools')
    poolsData.value = response.data.data
  } catch(error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
*/

// Lifecycle
onMounted(() => {
  // fetchPools()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
```