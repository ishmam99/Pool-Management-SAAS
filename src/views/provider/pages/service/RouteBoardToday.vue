<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="animate-pulse">
        <div class="h-8 w-48 bg-gray-200 rounded"></div>
        <div class="h-4 w-64 bg-gray-200 rounded mt-2"></div>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="w-2/3 animate-pulse">
          <div class="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
        <div class="w-1/3 animate-pulse">
          <div class="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="emptyState" class="flex flex-col items-center justify-center min-h-[600px]">
      <div class="text-center">
        <div class="text-6xl mb-4">🗺️</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">No routes scheduled today</h2>
        <p class="text-gray-500 mb-6">Create service visits and assign technicians to build today's routes.</p>
        <button class="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Create Route
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Page Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Route Board</h1>
          <p class="text-gray-500 mt-1">Manage today's service routes, technician assignments, and visit progress.</p>
        </div>
        <div class="flex gap-3">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span>+</span> Create Route
          </button>
          <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Optimize Routes
          </button>
          <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            View Map
          </button>
          <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Export Route
          </button>
        </div>
      </div>

      <!-- Date Header -->
      <div class="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">‹</button>
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">Today</button>
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">›</button>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-900">Today</div>
          <div class="text-sm text-gray-500">Monday, June 22, 2026</div>
        </div>
        <div class="w-24"></div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-gray-900">{{ summary.totalVisits }}</div>
          <div class="text-sm text-gray-500">Today's Visits</div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-green-600">{{ summary.completed }}</div>
          <div class="text-sm text-gray-500">Completed</div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-orange-500">{{ summary.inProgress }}</div>
          <div class="text-sm text-gray-500">Currently Active</div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-blue-500">{{ summary.pending }}</div>
          <div class="text-sm text-gray-500">Waiting</div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-red-500">{{ summary.unassigned }}</div>
          <div class="text-sm text-gray-500">Need Assignment</div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex gap-6">
        <!-- Left Section: Technician Routes -->
        <div class="w-2/3 space-y-4">
          <!-- Filters -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
            <select class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Technicians</option>
              <option>Mike Carter</option>
              <option>Alex Green</option>
              <option>David Ross</option>
            </select>
            <select class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Delayed</option>
            </select>
            <select class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option>
              <option>Pool Cleaning</option>
              <option>Chemical Balance</option>
              <option>Repair</option>
              <option>Inspection</option>
            </select>
          </div>

          <!-- Technician Cards -->
          <div v-for="tech in technicians" :key="tech.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Technician Header -->
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {{ tech.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ tech.name }}</div>
                  <div class="text-sm text-gray-500">{{ tech.total_visits }} Visits</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-sm text-gray-600">
                  <span class="block">{{ tech.duration }}</span>
                  <span class="text-gray-400">{{ tech.distance }}</span>
                </div>
                <span :class="getStatusColor(tech.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ tech.status }}
                </span>
                <select class="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Available</option>
                  <option>On Route</option>
                  <option>Working</option>
                  <option>Break</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <!-- Route Stops -->
            <div class="p-4 space-y-3">
              <div v-for="(visit, index) in tech.visits" :key="visit.id" 
                   class="relative pl-6 border-l-2 border-gray-200 last:border-l-0 hover:bg-gray-50 rounded-lg p-3 transition-colors cursor-pointer"
                   @click="openVisitModal(visit)">
                <!-- Connector Line -->
                <div v-if="index < tech.visits.length - 1" class="absolute left-[-1px] top-8 w-0.5 h-8 bg-gray-200"></div>
                
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-3">
                    <div class="text-sm font-medium text-gray-500 w-16">{{ visit.time }}</div>
                    <div>
                      <div class="font-medium text-gray-900">🏊 {{ visit.customer }}</div>
                      <div class="text-sm text-gray-600">{{ visit.pool }}</div>
                      <div class="text-sm text-gray-400">📍 {{ visit.address }}</div>
                      <div class="text-xs text-gray-500 mt-1">{{ visit.serviceType }}</div>
                      <div class="text-xs text-gray-400">Est: {{ visit.duration }}</div>
                    </div>
                  </div>
                  <span :class="getVisitStatusColor(visit.status)" class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                    {{ visit.status }}
                  </span>
                </div>
              </div>

              <!-- Drag & Drop Ready Comment -->
              <!-- Future drag and drop route optimization -->
              <div class="text-center text-xs text-gray-400 border-t border-gray-100 pt-3 mt-2">
                ↕ Drag to reorder visits
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section: Map Preview -->
        <div class="w-1/3">
          <div class="bg-gray-200 rounded-2xl h-[600px] relative overflow-hidden shadow-sm border border-gray-100">
            <!-- Map Placeholder -->
            <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div class="text-center">
                <div class="text-4xl mb-2">🗺️</div>
                <div class="text-gray-600 font-medium">MAP VIEW</div>
                <div class="text-sm text-gray-500 mt-2 flex gap-2 justify-center">
                  <span>📍</span>
                  <span>📍</span>
                  <span>📍</span>
                  <span>📍</span>
                </div>
                <div class="mt-4 text-sm text-gray-600">
                  Route: Mike Carter
                  <div class="text-gray-400">42 miles</div>
                </div>
              </div>
            </div>

            <!-- Map Controls -->
            <div class="absolute top-4 right-4 flex flex-col gap-2">
              <button class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-50 transition-colors">+</button>
              <button class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-50 transition-colors">−</button>
              <button class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-50 transition-colors">⛶</button>
              <button class="bg-blue-600 text-white rounded-lg p-2 shadow-md hover:bg-blue-700 transition-colors text-sm">
                Optimize Route
              </button>
            </div>

            <!-- Route Summary Panel -->
            <div class="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
              <div class="text-sm font-semibold text-gray-900 mb-2">Today's Route Summary</div>
              <div class="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <div class="text-gray-500">Total Distance</div>
                  <div class="font-semibold text-gray-900">125 miles</div>
                </div>
                <div>
                  <div class="text-gray-500">Estimated Time</div>
                  <div class="font-semibold text-gray-900">18h 40m</div>
                </div>
                <div>
                  <div class="text-gray-500">Technicians</div>
                  <div class="font-semibold text-gray-900">6</div>
                </div>
                <div>
                  <div class="text-gray-500">Stops</div>
                  <div class="font-semibold text-gray-900">42</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unassigned Visits Section -->
      <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-semibold text-yellow-800">Unassigned Visits</h3>
            <p class="text-sm text-yellow-700">⚠ 4 visits need assignment</p>
          </div>
          <button class="text-sm text-yellow-800 hover:text-yellow-900 font-medium">View Details</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="visit in unassignedVisits" :key="visit.customer" 
               class="bg-white rounded-lg p-3 flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">{{ visit.customer }}</div>
              <div class="text-sm text-gray-600">{{ visit.pool }}</div>
              <div class="text-xs text-gray-500">{{ visit.service }}</div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{{ visit.priority }}</span>
              <button class="text-xs text-blue-600 hover:text-blue-700">Assign Technician</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="fixed bottom-8 right-8 flex flex-col gap-3">
        <button class="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          +
        </button>
        <button class="bg-white text-gray-700 p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200">
          🔄
        </button>
        <button class="bg-white text-gray-700 p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200">
          📤
        </button>
      </div>
    </div>

    <!-- Visit Details Modal -->
    <div v-if="selectedVisit" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-gray-900">Visit Details</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-semibold text-gray-500 mb-2">Customer</h4>
            <div class="space-y-1">
              <div class="font-medium">{{ selectedVisit.customer }}</div>
              <div class="text-sm text-gray-600">(555) 123-4567</div>
              <div class="text-sm text-gray-600">customer@email.com</div>
              <div class="text-sm text-gray-600">{{ selectedVisit.address }}</div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-500 mb-2">Pool</h4>
            <div class="space-y-1">
              <div class="font-medium">{{ selectedVisit.pool }}</div>
              <div class="text-sm text-gray-600">In-ground</div>
              <div class="text-sm text-gray-600">20,000 gallons</div>
              <div class="text-sm text-gray-600">Saltwater</div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-500 mb-2">Service</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">Service Type</div>
              <div class="font-medium">{{ selectedVisit.serviceType }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Scheduled Time</div>
              <div class="font-medium">{{ selectedVisit.time }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Assigned Technician</div>
              <div class="font-medium">{{ selectedVisit.technician || 'Unassigned' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Status</div>
              <span :class="getVisitStatusColor(selectedVisit.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ selectedVisit.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button class="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">Start Visit</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">Complete Visit</button>
          <button class="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">Reschedule</button>
          <button class="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-colors">Change Technician</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">Cancel Visit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock Data
const technicians = ref([
  {
    id: 1,
    name: "Mike Carter",
    avatar: "",
    status: "On Route",
    total_visits: 6,
    completed: 3,
    remaining: 3,
    distance: "42 miles",
    duration: "6h 20m",
    visits: [
      {
        id: 101,
        time: "10:00 AM",
        customer: "John Smith",
        pool: "Backyard Pool",
        address: "Miami, FL",
        serviceType: "Weekly Cleaning",
        status: "Completed",
        duration: "45 mins",
        technician: "Mike Carter"
      },
      {
        id: 102,
        time: "12:00 PM",
        customer: "Sarah Johnson",
        pool: "Villa Pool",
        address: "Miami, FL",
        serviceType: "Chemical Balance",
        status: "Pending",
        duration: "30 mins",
        technician: "Mike Carter"
      }
    ]
  },
  {
    id: 2,
    name: "Alex Green",
    status: "Working",
    total_visits: 8,
    completed: 5,
    remaining: 3,
    distance: "55 miles",
    duration: "7h 10m",
    visits: [
      {
        id: 201,
        time: "09:00 AM",
        customer: "Robert Wilson",
        pool: "Garden Pool",
        address: "Fort Lauderdale, FL",
        serviceType: "Filter Cleaning",
        status: "In Progress",
        duration: "60 mins",
        technician: "Alex Green"
      },
      {
        id: 202,
        time: "11:30 AM",
        customer: "Emily Davis",
        pool: "Spa",
        address: "Fort Lauderdale, FL",
        serviceType: "Chemical Check",
        status: "Pending",
        duration: "30 mins",
        technician: "Alex Green"
      }
    ]
  },
  {
    id: 3,
    name: "David Ross",
    status: "Available",
    total_visits: 4,
    completed: 1,
    remaining: 3,
    distance: "28 miles",
    duration: "4h 40m",
    visits: [
      {
        id: 301,
        time: "08:30 AM",
        customer: "Linda Martinez",
        pool: "Family Pool",
        address: "Hollywood, FL",
        serviceType: "Inspection",
        status: "Completed",
        duration: "30 mins",
        technician: "David Ross"
      },
      {
        id: 302,
        time: "10:00 AM",
        customer: "James Brown",
        pool: "Luxury Pool",
        address: "Hollywood, FL",
        serviceType: "Pool Cleaning",
        status: "Delayed",
        duration: "45 mins",
        technician: "David Ross"
      }
    ]
  }
])

const unassignedVisits = ref([
  {
    customer: "Robert Wilson",
    pool: "Garden Pool",
    service: "Filter Cleaning",
    priority: "Normal"
  },
  {
    customer: "Emily Davis",
    pool: "Spa",
    service: "Chemical Check",
    priority: "High"
  }
])

const summary = computed(() => ({
  totalVisits: technicians.value.reduce((acc, tech) => acc + tech.total_visits, 0),
  completed: technicians.value.reduce((acc, tech) => acc + tech.completed, 0),
  inProgress: technicians.value.reduce((acc, tech) => acc + tech.visits.filter(v => v.status === 'In Progress').length, 0),
  pending: technicians.value.reduce((acc, tech) => acc + tech.remaining, 0),
  unassigned: unassignedVisits.value.length
}))

const loading = ref(false)
const emptyState = ref(false)
const selectedVisit = ref(null)

const getStatusColor = (status) => {
  const colors = {
    'On Route': 'bg-blue-100 text-blue-700',
    'Working': 'bg-orange-100 text-orange-700',
    'Available': 'bg-green-100 text-green-700',
    'Break': 'bg-gray-100 text-gray-700',
    'Completed': 'bg-green-100 text-green-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const getVisitStatusColor = (status) => {
  const colors = {
    'Completed': 'bg-green-100 text-green-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    'Pending': 'bg-blue-100 text-blue-700',
    'Delayed': 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const openVisitModal = (visit) => {
  selectedVisit.value = visit
}

const closeModal = () => {
  selectedVisit.value = null
}

// Future API integration (commented)
// import axios from '@/services/api'
// const fetchTodayRoutes = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get('/service-routes/today')
//     routes.value = response.data.data
//   } catch(error) {
//     console.error(error)
//   } finally {
//     loading.value = false
//   }
// }

// Future drag and drop implementation ready
// const handleDragStart = (event, visit) => {
//   event.dataTransfer.setData('visitId', visit.id)
// }
// const handleDragOver = (event) => {
//   event.preventDefault()
// }
// const handleDrop = (event, targetVisit) => {
//   event.preventDefault()
//   // Reorder logic here
// }
</script>

<style scoped>
/* Additional custom styles if needed */
</style>