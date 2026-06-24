```vue
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <!-- Header Skeleton -->
      <div class="flex justify-between items-start">
        <div>
          <div class="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 w-96 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
        <div class="flex gap-3">
          <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <!-- Stats Skeleton -->
      <div class="grid grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      </div>

      <!-- Calendar Skeleton -->
      <div class="flex gap-6">
        <div class="flex-1 bg-white rounded-2xl shadow-sm p-6">
          <div class="grid grid-cols-7 gap-2">
            <div v-for="i in 35" :key="i" class="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div class="w-[350px] space-y-4">
          <div class="bg-white rounded-2xl shadow-sm p-6 h-64 animate-pulse"></div>
          <div class="bg-white rounded-2xl shadow-sm p-6 h-48 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center min-h-[600px]">
      <div class="text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">No scheduled services</h2>
        <p class="text-gray-500 mb-6">Create a service appointment to start scheduling visits.</p>
        <button class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          + Schedule Service
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Service Calendar</h1>
          <p class="text-gray-500 mt-1">Manage pool service schedules, technician availability, and daily routes.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Schedule Service
          </button>
          <button class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Today
          </button>
          <button class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Today's Visits</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.todayVisits }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Scheduled</p>
          <p class="text-3xl font-bold text-blue-600 mt-1">{{ stats.scheduled }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">In Progress</p>
          <p class="text-3xl font-bold text-orange-500 mt-1">{{ stats.inProgress }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-3xl font-bold text-green-600 mt-1">{{ stats.completed }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Unassigned</p>
          <p class="text-3xl font-bold text-red-500 mt-1">{{ stats.unassigned }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-4 mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <select class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Technicians</option>
          <option>Mike Carter</option>
          <option>Alex Green</option>
          <option>David Ross</option>
        </select>
        <select class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All</option>
          <option>Pool Cleaning</option>
          <option>Chemical Balance</option>
          <option>Equipment Inspection</option>
          <option>Repair</option>
        </select>
        <select class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All</option>
          <option>Scheduled</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <div class="flex-1"></div>
        <span class="text-sm text-gray-500">{{ events.length }} events</span>
      </div>

      <!-- Calendar Layout -->
      <div class="flex gap-6">
        <!-- Calendar Grid -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <!-- Calendar Toolbar -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Today
              </button>
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <h2 class="text-xl font-semibold text-gray-900 ml-2">June 2026</h2>
            </div>
            <div class="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button class="px-4 py-1.5 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-900">Month</button>
              <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">Week</button>
              <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">Day</button>
              <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">Agenda</button>
            </div>
          </div>

          <!-- Calendar Grid - Days of Week -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="text-center text-sm font-medium text-gray-500 py-2">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid - Dates -->
          <div class="grid grid-cols-7 gap-1">
            <div v-for="day in calendarDays" :key="day.date" 
                 class="min-h-[120px] border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow"
                 :class="{'bg-blue-50': day.isToday}">
              <div class="flex justify-between items-start">
                <span class="text-sm font-medium" :class="{'text-blue-600': day.isToday}">{{ day.date }}</span>
                <span v-if="day.events.length > 0" class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {{ day.events.length }}
                </span>
              </div>
              <div class="mt-1 space-y-1">
                <!-- Event Cards - Drag & Drop Ready -->
                <!-- @dragstart="handleDragStart(event)" @dragover.prevent @drop="handleDrop(event, day)" -->
                <div v-for="event in day.events.slice(0, 2)" :key="event.id"
                     class="text-xs p-1.5 rounded-lg cursor-pointer hover:shadow-md transition-all"
                     :class="getEventColor(event.status)"
                     @click="openEventModal(event)">
                  <div class="font-medium truncate">{{ event.customer }}</div>
                  <div class="text-gray-600 truncate">{{ event.time }}</div>
                </div>
                <div v-if="day.events.length > 2" class="text-xs text-gray-500 font-medium">
                  +{{ day.events.length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="w-[350px] space-y-4">
          <!-- Today's Schedule -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Visits</h3>
            <div class="space-y-3">
              <div v-for="visit in todayVisits" :key="visit.customer" 
                   class="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">{{ visit.customer }}</p>
                    <p class="text-sm text-gray-500">{{ visit.service }}</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full font-medium" :class="getStatusBadge(visit.status)">
                    {{ visit.status }}
                  </span>
                </div>
                <div class="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{{ visit.time }}</span>
                  <span>👤 {{ visit.technician }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Technician Availability -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Technician Availability</h3>
            <div class="space-y-3">
              <div v-for="tech in technicians" :key="tech.name" class="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <div>
                  <p class="font-medium text-gray-900">{{ tech.name }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="w-2 h-2 rounded-full" :class="tech.status === 'Available' ? 'bg-green-500' : 'bg-orange-500'"></span>
                    <span class="text-sm text-gray-500">{{ tech.status }}</span>
                  </div>
                </div>
                <span class="text-sm text-gray-600">{{ tech.visits }} visits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="selectedEvent = null">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs px-3 py-1 rounded-full font-medium" :class="getEventColor(selectedEvent.status)">
              {{ selectedEvent.status }}
            </span>
            <h3 class="text-xl font-bold text-gray-900 mt-2">{{ selectedEvent.title }}</h3>
          </div>
          <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">Customer</span>
            <span class="font-medium text-gray-900">{{ selectedEvent.customer }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">Pool</span>
            <span class="font-medium text-gray-900">{{ selectedEvent.pool }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">Technician</span>
            <span class="font-medium text-gray-900">{{ selectedEvent.technician }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">Time</span>
            <span class="font-medium text-gray-900">{{ selectedEvent.time }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-6">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm flex-1">
            Start Visit
          </button>
          <button class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm flex-1">
            Reschedule
          </button>
          <button class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm flex-1">
            Change Tech
          </button>
          <button class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm flex-1">
            View Customer
          </button>
          <button class="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm flex-1">
            Cancel Visit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Loading state
const loading = ref(false)

// Selected event for modal
const selectedEvent = ref(null)

// Mock Statistics
const stats = ref({
  todayVisits: 24,
  scheduled: 18,
  inProgress: 3,
  completed: 42,
  unassigned: 5
})

// Mock Events
const events = ref([
  {
    id: 1,
    title: 'Weekly Pool Cleaning',
    customer: 'John Smith',
    pool: 'Backyard Pool',
    technician: 'Mike Carter',
    date: '2026-06-20',
    time: '10:00 AM',
    status: 'Scheduled'
  },
  {
    id: 2,
    title: 'Chemical Balance',
    customer: 'Sarah Johnson',
    pool: 'Villa Main Pool',
    technician: 'Alex Green',
    date: '2026-06-20',
    time: '02:00 PM',
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'Equipment Inspection',
    customer: 'Ocean Resort',
    pool: 'Main Hotel Pool',
    technician: 'David Ross',
    date: '2026-06-21',
    time: '09:00 AM',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Weekly Pool Cleaning',
    customer: 'Robert Wilson',
    pool: 'Backyard Pool',
    technician: 'Mike Carter',
    date: '2026-06-22',
    time: '11:30 AM',
    status: 'Scheduled'
  },
  {
    id: 5,
    title: 'Repair Service',
    customer: 'Linda Martinez',
    pool: 'Pool House',
    technician: 'Alex Green',
    date: '2026-06-23',
    time: '08:00 AM',
    status: 'Scheduled'
  },
  {
    id: 6,
    title: 'Chemical Balance',
    customer: 'James Brown',
    pool: 'Villa Main Pool',
    technician: 'David Ross',
    date: '2026-06-24',
    time: '03:00 PM',
    status: 'Scheduled'
  },
  {
    id: 7,
    title: 'Weekly Pool Cleaning',
    customer: 'Patricia Davis',
    pool: 'Backyard Pool',
    technician: 'Mike Carter',
    date: '2026-06-25',
    time: '09:00 AM',
    status: 'Scheduled'
  },
  {
    id: 8,
    title: 'Equipment Inspection',
    customer: 'Michael Miller',
    pool: 'Hotel Pool',
    technician: 'Alex Green',
    date: '2026-06-26',
    time: '01:00 PM',
    status: 'Scheduled'
  }
])

// Today's visits (sidebar)
const todayVisits = ref([
  {
    time: '09:00 AM',
    customer: 'John Smith',
    service: 'Weekly Pool Cleaning',
    technician: 'Mike Carter',
    status: 'Scheduled'
  },
  {
    time: '11:30 AM',
    customer: 'Sarah Johnson',
    service: 'Chemical Balance',
    technician: 'Alex Green',
    status: 'In Progress'
  },
  {
    time: '02:00 PM',
    customer: 'Ocean Resort',
    service: 'Equipment Inspection',
    technician: 'David Ross',
    status: 'Completed'
  }
])

// Technicians availability
const technicians = ref([
  { name: 'Mike Carter', status: 'Available', visits: 6 },
  { name: 'Alex Green', status: 'Busy', visits: 8 },
  { name: 'David Ross', status: 'Available', visits: 5 }
])

// Calendar Days computed
const calendarDays = computed(() => {
  const days = []
  // Simplified: Generate first 35 days of June 2026
  for (let i = 1; i <= 35; i++) {
    const date = i
    const isToday = i === 20
    const dayEvents = events.value.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate.getDate() === i && eventDate.getMonth() === 5 && eventDate.getFullYear() === 2026
    })
    days.push({
      date: i,
      isToday,
      events: dayEvents
    })
  }
  return days
})

// Helper functions
const getEventColor = (status) => {
  const colors = {
    'Scheduled': 'bg-blue-50 text-blue-700 border border-blue-200',
    'In Progress': 'bg-orange-50 text-orange-700 border border-orange-200',
    'Completed': 'bg-green-50 text-green-700 border border-green-200',
    'Cancelled': 'bg-red-50 text-red-700 border border-red-200',
    'Emergency': 'bg-purple-50 text-purple-700 border border-purple-200'
  }
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200'
}

const getStatusBadge = (status) => {
  const colors = {
    'Scheduled': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    'Completed': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const openEventModal = (event) => {
  selectedEvent.value = event
}

// Future Integration: Drag & Drop
// const handleDragStart = (event) => {
//   event.dataTransfer.setData('eventId', event.id)
// }

// const handleDrop = (event, day) => {
//   const eventId = event.dataTransfer.getData('eventId')
//   // Update event date logic here
// }

// API Integration (Commented)
// import axios from '@/services/api'
// const fetchCalendarEvents = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get('/service-visits/calendar')
//     events.value = response.data.data
//   } catch(error) {
//     console.error(error)
//   } finally {
//     loading.value = false
//   }
// }
</script>

<style scoped>
/* Smooth transitions for calendar interactions */
.calendar-grid {
  transition: all 0.2s ease;
}

/* Custom scrollbar for sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
```