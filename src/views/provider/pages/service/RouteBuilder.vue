```vue
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="h-4 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div class="flex gap-3">
          <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-1 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div class="col-span-1 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div class="col-span-1 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!routeData.totalVisits" class="flex flex-col items-center justify-center min-h-[600px]">
      <div class="text-center space-y-4">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900">No visits available</h3>
        <p class="text-gray-500 max-w-sm">Scheduled service visits will appear here for route planning.</p>
        <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Refresh Visits
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Route Builder</h1>
          <p class="text-sm text-gray-500">Build, assign, and optimize technician routes for upcoming service visits.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Generate Routes
          </button>
          <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Optimize Routes</button>
          <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Publish Routes</button>
          <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Export</button>
        </div>
      </div>

      <!-- Date Selection -->
      <div class="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Route Date</span>
          <input type="date" v-model="selectedDate" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div class="flex gap-2">
          <button @click="setDate('today')" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Today</button>
          <button @click="setDate('tomorrow')" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Tomorrow</button>
          <button @click="setDate('week')" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Next 7 Days</button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <p class="text-sm text-gray-500">Total Visits</p>
          <p class="text-2xl font-bold text-gray-900">{{ routeData.totalVisits }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <p class="text-sm text-gray-500">Assigned</p>
          <p class="text-2xl font-bold text-green-600">{{ routeData.assignedVisits }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <p class="text-sm text-gray-500">Unassigned</p>
          <p class="text-2xl font-bold text-orange-500">{{ routeData.unassignedVisits }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <p class="text-sm text-gray-500">Available Technicians</p>
          <p class="text-2xl font-bold text-blue-600">{{ routeData.techniciansAvailable }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <p class="text-sm text-gray-500">Estimated Mileage</p>
          <p class="text-2xl font-bold text-gray-900">{{ routeData.estimatedMileage }} Miles</p>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Column 1: Unassigned Visits -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Unassigned Visits</h2>
              <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{{ unassignedVisits.length }}</span>
            </div>

            <!-- Search -->
            <div class="mb-4">
              <input type="text" placeholder="Search customer..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            </div>

            <!-- Filters -->
            <div class="flex gap-2 mb-4">
              <select class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="priority in priorityOptions" :key="priority">{{ priority }}</option>
              </select>
              <select class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="service in serviceOptions" :key="service">{{ service }}</option>
              </select>
            </div>

            <!-- Visit Cards -->
            <div class="space-y-3 max-h-[600px] overflow-y-auto">
              <div v-for="visit in unassignedVisits" :key="visit.id" class="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-lg">🏊</span>
                      <h3 class="font-medium text-gray-900">{{ visit.customer }}</h3>
                    </div>
                    <p class="text-sm text-gray-600">{{ visit.pool }}</p>
                    <p class="text-sm text-gray-500">{{ visit.service }}</p>
                    <p class="text-sm text-gray-500">📍 {{ visit.address }}</p>
                    <div class="flex items-center gap-3 mt-1">
                      <span class="text-xs text-gray-500">⏱ {{ visit.duration }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full" :class="getPriorityClass(visit.priority)">
                        {{ visit.priority }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <button class="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Assign</button>
                    <button class="p-1 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">View</button>
                  </div>
                </div>
                <!-- Drag & Drop Ready -->
                <!-- Future drag and drop visit assignment -->
                <div class="mt-2 pt-2 border-t border-gray-100">
                  <div class="flex items-center justify-between text-xs text-gray-400">
                    <span>Drag to assign</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: Technician Routes -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-2xl shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Technician Routes</h2>
              <div class="flex gap-2">
                <button class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Auto Assign</button>
              </div>
            </div>

            <!-- Technician Cards -->
            <div class="space-y-4 max-h-[600px] overflow-y-auto">
              <div v-for="tech in technicians" :key="tech.id" class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 font-semibold">{{ tech.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ tech.name }}</h3>
                      <span class="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">{{ tech.status }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Optimize</button>
                    <button class="p-1 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors text-sm">Clear</button>
                    <button class="p-1 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors text-sm">View</button>
                  </div>
                </div>

                <!-- Route Metrics -->
                <div class="grid grid-cols-3 gap-2 mb-3">
                  <div class="text-center p-2 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-gray-900">{{ tech.route_stops }}</p>
                    <p class="text-xs text-gray-500">Stops</p>
                  </div>
                  <div class="text-center p-2 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-gray-900">{{ tech.mileage }}</p>
                    <p class="text-xs text-gray-500">Miles</p>
                  </div>
                  <div class="text-center p-2 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-gray-900">{{ tech.estimated_time }}</p>
                    <p class="text-xs text-gray-500">Est. Time</p>
                  </div>
                </div>

                <!-- Route Stops -->
                <div class="space-y-2">
                  <div v-for="(stop, index) in getRouteStops(tech.id)" :key="stop.id" class="flex items-center gap-2 text-sm">
                    <span class="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">{{ index + 1 }}</span>
                    <span class="text-gray-700">{{ stop.customer }}</span>
                  </div>
                </div>

                <!-- Route Progress -->
                <div class="mt-3">
                  <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{{ tech.route_stops }} / 8 Stops</span>
                    <span>{{ Math.round((tech.route_stops / 8) * 100) }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-600 rounded-full" :style="{ width: `${Math.round((tech.route_stops / 8) * 100)}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3: Route Map -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-2xl shadow-sm p-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Route Map Preview</h2>

            <!-- Map Placeholder -->
            <div class="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center">
              <div class="text-center space-y-2">
                <div class="flex justify-center gap-2 mb-4">
                  <span class="text-3xl">📍</span>
                  <span class="text-3xl">📍</span>
                  <span class="text-3xl">📍</span>
                  <span class="text-3xl">📍</span>
                </div>
                <div class="w-48 h-0.5 bg-blue-300 mx-auto relative">
                  <div class="absolute -top-1 left-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div class="absolute -top-1 left-1/3 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div class="absolute -top-1 left-2/3 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div class="absolute -top-1 right-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <p class="text-sm text-gray-500 mt-4">Route Path</p>
              </div>

              <!-- Route Information Overlay -->
              <div class="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Route Summary</h4>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p class="text-gray-500">Distance</p>
                    <p class="font-medium text-gray-900">42 Miles</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Drive Time</p>
                    <p class="font-medium text-gray-900">1h 25m</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Stops</p>
                    <p class="font-medium text-gray-900">6</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Service Time</p>
                    <p class="font-medium text-gray-900">4h 50m</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Optimization Suggestions -->
            <div class="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <h4 class="text-sm font-semibold text-gray-900 mb-2">Optimization Suggestions</h4>
              <ul class="space-y-1 text-sm">
                <li class="flex items-center justify-between">
                  <span class="text-gray-700">Save 12 Miles</span>
                  <div class="flex gap-2">
                    <button class="text-xs text-blue-600 font-medium hover:text-blue-800">Apply</button>
                    <button class="text-xs text-gray-400 hover:text-gray-600">Ignore</button>
                  </div>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-gray-700">Reduce Travel Time by 22 Minutes</span>
                  <div class="flex gap-2">
                    <button class="text-xs text-blue-600 font-medium hover:text-blue-800">Apply</button>
                    <button class="text-xs text-gray-400 hover:text-gray-600">Ignore</button>
                  </div>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-gray-700">Move Visit #4 Earlier</span>
                  <div class="flex gap-2">
                    <button class="text-xs text-blue-600 font-medium hover:text-blue-800">Apply</button>
                    <button class="text-xs text-gray-400 hover:text-gray-600">Ignore</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (Hidden, for structure) -->
    <!-- Generate Routes Modal -->
    <div class="hidden">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Generate Routes</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Route Date</label>
              <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Technicians</label>
              <select multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg h-24">
                <option>Mike Carter</option>
                <option>Alex Green</option>
                <option>David Ross</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Stops Per Route</label>
              <input type="number" value="8" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Mileage</label>
              <input type="number" value="50" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Optimization</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Optimize Travel Time</option>
                <option>Balance Workload</option>
                <option>Minimize Mileage</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate</button>
            <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Publish Routes Modal -->
    <div class="hidden">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Publish Routes</h3>
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Routes Ready</span>
              <span class="font-semibold text-gray-900">3</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Visits Assigned</span>
              <span class="font-semibold text-gray-900">18</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Estimated Mileage</span>
              <span class="font-semibold text-gray-900">125 Miles</span>
            </div>
          </div>
          <div class="flex gap-3">
            <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Publish To Technicians</button>
            <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Loading State
const loading = ref(false)

// Date Selection
const selectedDate = ref('2026-06-23')

const setDate = (period) => {
  const date = new Date()
  if (period === 'today') {
    selectedDate.value = date.toISOString().split('T')[0]
  } else if (period === 'tomorrow') {
    date.setDate(date.getDate() + 1)
    selectedDate.value = date.toISOString().split('T')[0]
  } else if (period === 'week') {
    date.setDate(date.getDate() + 7)
    selectedDate.value = date.toISOString().split('T')[0]
  }
}

// Route Data
const routeData = ref({
  totalVisits: 48,
  assignedVisits: 38,
  unassignedVisits: 10,
  techniciansAvailable: 6,
  estimatedMileage: 182
})

// Unassigned Visits
const unassignedVisits = ref([
  {
    id: 1,
    customer: "John Smith",
    pool: "Backyard Pool",
    service: "Weekly Cleaning",
    address: "Miami, FL",
    duration: "45 min",
    priority: "Normal"
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    pool: "Villa Pool",
    service: "Chemical Balance",
    address: "Miami Beach, FL",
    duration: "30 min",
    priority: "High"
  },
  {
    id: 3,
    customer: "Ocean Resort",
    pool: "Main Hotel Pool",
    service: "Inspection",
    address: "Miami, FL",
    duration: "90 min",
    priority: "Emergency"
  }
])

// Technicians
const technicians = ref([
  {
    id: 1,
    name: "Mike Carter",
    status: "Available",
    route_stops: 6,
    estimated_time: "6h 20m",
    mileage: "42 miles"
  },
  {
    id: 2,
    name: "Alex Green",
    status: "Available",
    route_stops: 8,
    estimated_time: "7h 10m",
    mileage: "55 miles"
  },
  {
    id: 3,
    name: "David Ross",
    status: "Available",
    route_stops: 4,
    estimated_time: "4h 30m",
    mileage: "28 miles"
  }
])

// Route Stops (mapped to technicians)
const routeStops = ref({
  1: [
    { id: 1, customer: "John Smith" },
    { id: 2, customer: "Sarah Johnson" },
    { id: 3, customer: "Ocean Resort" }
  ],
  2: [
    { id: 4, customer: "Robert Wilson" },
    { id: 5, customer: "Emma Davis" },
    { id: 6, customer: "Green Valley Pool" }
  ],
  3: [
    { id: 7, customer: "Lakeside Resort" },
    { id: 8, customer: "Sunset Villas" }
  ]
})

// Filters
const priorityOptions = ref(["All", "Normal", "High", "Emergency"])
const serviceOptions = ref(["All", "Pool Cleaning", "Chemical Balance", "Equipment Inspection", "Repair"])

// Computed
const getPriorityClass = (priority) => {
  const classes = {
    Normal: "bg-gray-100 text-gray-700",
    High: "bg-yellow-100 text-yellow-800",
    Emergency: "bg-red-100 text-red-800"
  }
  return classes[priority] || "bg-gray-100 text-gray-700"
}

const getRouteStops = (techId) => {
  return routeStops.value[techId] || []
}

// API Structure (Commented Only)
// import axios from '@/services/api'
//
// const fetchRouteBuilderData = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get('/service-routes/builder')
//     routeData.value = response.data.data
//   } catch(error) {
//     console.error(error)
//   } finally {
//     loading.value = false
//   }
// }

onMounted(() => {
  // fetchRouteBuilderData()
  // For demo, we'll just use mock data
  loading.value = false
})
</script>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c7cd;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0a7ae;
}
</style>
```