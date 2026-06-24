
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-8">
      <div class="animate-pulse space-y-8">
        <!-- Header Skeleton -->
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <div class="h-8 w-64 bg-gray-200 rounded"></div>
            <div class="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <!-- Stats Skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="i in 5" :key="i" class="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
        <!-- Main Content Skeleton -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="h-64 bg-gray-200 rounded-2xl"></div>
            <div class="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
          <div class="space-y-6">
            <div class="h-48 bg-gray-200 rounded-2xl"></div>
            <div class="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="empty" class="container mx-auto px-4 py-8">
      <div class="text-center py-16">
        <div class="text-6xl mb-4">🏊</div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Welcome to Your Pool Portal</h3>
        <p class="text-gray-500 mb-6">Get started by adding your first pool</p>
        <button class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Add Pool
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-1">
            Good {{ timeOfDay }}, {{ customer.name }} 👋
          </h1>
          <p class="text-gray-500">{{ currentDate }}</p>
        </div>
        <div class="flex items-center gap-4 mt-4 md:mt-0">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
            <span>+</span> Request Maintenance
          </button>
          <button class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
            📞 Contact Provider
          </button>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
            {{ customer.initials }}
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div class="text-3xl font-bold text-gray-800">{{ stats.totalPools }}</div>
          <div class="text-sm text-gray-500">Pools</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div class="text-3xl font-bold text-blue-600">{{ stats.nextService }}</div>
          <div class="text-sm text-gray-500">Upcoming Visit</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div class="text-3xl font-bold text-gray-800">{{ stats.completedServices }}</div>
          <div class="text-sm text-gray-500">Completed Visits</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div class="text-3xl font-bold text-orange-500">{{ stats.openRequests }}</div>
          <div class="text-sm text-gray-500">Maintenance Requests</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div class="text-3xl font-bold text-green-600">{{ stats.agreementStatus }}</div>
          <div class="text-sm text-gray-500">Service Plan</div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Pool Overview -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">My Pools</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="pool in pools" :key="pool.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="text-2xl mb-1">🏊</div>
                    <h3 class="font-semibold text-gray-800">{{ pool.name }}</h3>
                    <span class="text-sm text-gray-500">{{ pool.type }}</span>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{{ pool.status }}</span>
                </div>
                <div class="space-y-1 text-sm text-gray-600">
                  <div>{{ pool.size }}</div>
                  <div>💧 {{ pool.water_type }}</div>
                  <div class="flex justify-between pt-2 border-t border-gray-100">
                    <span>Last: {{ pool.last_service }}</span>
                    <span class="text-blue-600">Next: {{ pool.next_service }}</span>
                  </div>
                </div>
                <button class="mt-3 w-full py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm">
                  View Pool Details →
                </button>
              </div>
            </div>
          </div>

          <!-- Service History -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Service History</h2>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th class="pb-3">Date</th>
                    <th class="pb-3">Service</th>
                    <th class="pb-3">Technician</th>
                    <th class="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="history in serviceHistory" :key="history.date" class="border-b border-gray-50">
                    <td class="py-3 text-sm">{{ history.date }}</td>
                    <td class="py-3 text-sm">{{ history.service }}</td>
                    <td class="py-3 text-sm">{{ history.technician }}</td>
                    <td class="py-3">
                      <span class="px-2 py-1 rounded-full text-xs" :class="{
                        'bg-green-100 text-green-700': history.status === 'Completed',
                        'bg-orange-100 text-orange-700': history.status === 'Pending',
                        'bg-red-100 text-red-700': history.status === 'Cancelled'
                      }">{{ history.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Upcoming Service -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Upcoming Service</h2>
            <div v-if="upcomingService" class="space-y-3">
              <div class="text-lg font-semibold text-blue-600">{{ upcomingService.date }}</div>
              <div class="font-medium text-gray-800">{{ upcomingService.service }}</div>
              <div class="text-sm text-gray-600">Technician: {{ upcomingService.technician }}</div>
              <div class="text-sm text-gray-600">Estimated Arrival: {{ upcomingService.arrival }}</div>
              <div class="flex gap-2 pt-3">
                <button class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                  Reschedule
                </button>
                <button class="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm">
                  View Details
                </button>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No upcoming visits scheduled
            </div>
          </div>

          <!-- Technician -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Technician</h2>
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">{{ technician.name }}</div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span>⭐ {{ technician.rating }}</span>
                  <span>•</span>
                  <span>{{ technician.visits_completed }} visits</span>
                </div>
                <button class="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Contact →
                </button>
              </div>
            </div>
          </div>

          <!-- Agreement -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Current Agreement</h2>
            <div class="space-y-2">
              <div class="font-semibold text-gray-800">{{ agreement.plan }}</div>
              <div class="text-sm text-gray-600">{{ agreement.frequency }}</div>
              <div class="text-2xl font-bold text-blue-600">${{ agreement.monthly_price }}/month</div>
              <div class="text-sm text-gray-500">Renewal: {{ agreement.renewal_date }}</div>
              <div class="flex gap-2 pt-3">
                <button class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                  View Agreement
                </button>
                <button class="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm">
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          <!-- Maintenance Requests -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Maintenance Requests</h2>
            <div v-if="maintenanceRequests.length > 0" class="space-y-3">
              <div v-for="request in maintenanceRequests" :key="request.title" class="flex justify-between items-center border-b border-gray-50 pb-3">
                <div>
                  <div class="font-medium text-gray-800">{{ request.title }}</div>
                  <div class="text-sm text-gray-500">{{ request.created }}</div>
                </div>
                <span class="px-2 py-1 rounded-full text-xs" :class="{
                  'bg-orange-100 text-orange-700': request.status === 'In Progress',
                  'bg-green-100 text-green-700': request.status === 'Completed'
                }">{{ request.status }}</span>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500">
              No maintenance requests
            </div>
            <button class="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + Create Request
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        <button class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition text-center">
          <div class="text-2xl mb-1">🏊</div>
          <div class="text-sm font-medium text-gray-700">View Pools</div>
        </button>
        <button class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition text-center">
          <div class="text-2xl mb-1">📋</div>
          <div class="text-sm font-medium text-gray-700">Service History</div>
        </button>
        <button class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition text-center">
          <div class="text-2xl mb-1">🔧</div>
          <div class="text-sm font-medium text-gray-700">Request Maintenance</div>
        </button>
        <button class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition text-center">
          <div class="text-2xl mb-1">📄</div>
          <div class="text-sm font-medium text-gray-700">My Agreement</div>
        </button>
        <button class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition text-center">
          <div class="text-2xl mb-1">📞</div>
          <div class="text-sm font-medium text-gray-700">Contact Provider</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Loading & Empty States
const loading = ref(false)
const empty = ref(false)

// Mock Data
const customer = {
  name: 'Rasik Abdullah',
  initials: 'RA'
}

const stats = {
  totalPools: 2,
  nextService: 'June 27',
  completedServices: 48,
  openRequests: 1,
  agreementStatus: 'Active'
}

const pools = [
  {
    id: 'POOL-1001',
    name: 'Backyard Pool',
    type: 'Residential',
    size: '18,000 Gallons',
    water_type: 'Chlorine',
    status: 'Healthy',
    last_service: 'June 20, 2026',
    next_service: 'June 27, 2026'
  },
  {
    id: 'POOL-1002',
    name: 'Spa Area',
    type: 'Spa',
    size: '800 Gallons',
    water_type: 'Salt Water',
    status: 'Healthy',
    last_service: 'June 18, 2026',
    next_service: 'July 02, 2026'
  }
]

const upcomingService = {
  date: 'June 27, 2026',
  service: 'Weekly Pool Cleaning',
  technician: 'Mike Carter',
  arrival: '10:00 AM - 12:00 PM'
}

const technician = {
  name: 'Mike Carter',
  phone: '(305) 555-1234',
  rating: 4.9,
  visits_completed: 320
}

const serviceHistory = [
  {
    date: 'June 20, 2026',
    service: 'Weekly Pool Cleaning',
    technician: 'Mike Carter',
    status: 'Completed'
  },
  {
    date: 'June 13, 2026',
    service: 'Chemical Balance',
    technician: 'Mike Carter',
    status: 'Completed'
  },
  {
    date: 'June 05, 2026',
    service: 'Equipment Inspection',
    technician: 'Alex Green',
    status: 'Completed'
  }
]

const agreement = {
  plan: 'Premium Pool Care',
  frequency: 'Weekly Service',
  start_date: 'January 01, 2026',
  renewal_date: 'December 31, 2026',
  monthly_price: 320,
  status: 'Active'
}

const maintenanceRequests = [
  {
    title: 'Pool Pump Noise',
    created: 'June 20',
    status: 'In Progress'
  },
  {
    title: 'Replace Filter',
    created: 'May 15',
    status: 'Completed'
  }
]

// Computed Properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
})

// API Integration (Commented)
// import axios from '@/services/api'
// const fetchDashboard = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get('/customer/dashboard')
//     dashboard.value = response.data.data
//   } catch(error) {
//     console.error(error)
//   } finally {
//     loading.value = false
//   }
// }
</script>

<style scoped>
/* Smooth transitions and hover effects */
.transition {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
```