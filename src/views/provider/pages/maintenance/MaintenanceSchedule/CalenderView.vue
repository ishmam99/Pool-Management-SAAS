<template>
  <div class="min-h-screen bg-gray-50 p-6" ref="calendarContainer">

    <!-- Error Toast -->
    <Transition name="toast">
      <div v-if="errorMessage"
        class="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow-lg">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="ml-2 text-red-400 hover:text-red-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Initial Loading State (first load only) -->
    <div v-if="initialLoading" class="space-y-6">
      <!-- Month Selector Skeleton -->
      <div class="flex justify-between items-center">
        <div>
          <div class="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      </div>
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
    <div
      v-else-if="!initialLoading && calendarData.total_visits === 0 && calendarDays.every(d => d.visits.length === 0)"
      class="flex flex-col items-center justify-center min-h-[600px]">
      <div class="text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">No scheduled services</h2>
        <p class="text-gray-500 mb-2">No visits found for {{ currentMonthLabel }}.</p>
        <div class="flex items-center justify-center gap-3 mt-4">
          <button @click="prevMonth"
            class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">← Previous
            Month</button>
          <button @click="goToToday"
            class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">Today</button>
          <button @click="nextMonth"
            class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">Next Month
            →</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header with Month Selector on Top -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
          <p class="text-gray-500 mt-1">Manage pool service schedules, technician availability, and daily routes.</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Schedule Maintenance
          </button>
        </div>
      </div>

      <!-- Month Selector (Prominent at top) -->
      <div class="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div class="flex items-center gap-4">
          <button @click="prevMonth" :disabled="loading"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous month">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 class="text-2xl font-semibold text-gray-900 min-w-[200px] text-center">{{ currentMonthLabel }}</h2>

          <button @click="nextMonth" :disabled="loading"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next month">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button @click="goToToday" :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Today
          </button>
        </div>

        <div class="flex items-center gap-1 text-xs text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Scroll to navigate months</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Total Visits</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Scheduled</p>
          <p class="text-3xl font-bold text-blue-600 mt-1">{{ stats.scheduled }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-3xl font-bold text-green-600 mt-1">{{ stats.completed }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-3xl font-bold text-yellow-500 mt-1">{{ stats.pending }}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Cancelled</p>
          <p class="text-3xl font-bold text-red-500 mt-1">{{ stats.cancelled }}</p>
        </div>
      </div>

      <!-- Calendar Layout -->
      <div class="flex gap-6">
        <!-- Calendar Grid -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative"
          :class="{ 'opacity-60 pointer-events-none': loading }">

          <!-- Loading overlay spinner -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-white/60">
            <div class="flex flex-col items-center gap-3">
              <svg class="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span class="text-sm text-gray-500 font-medium">Loading {{ currentMonthLabel }}...</span>
            </div>
          </div>

          <!-- Days of Week Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day"
              class="text-center text-sm font-medium text-gray-500 py-2">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1">
            <!-- Leading empty cells -->
            <div v-for="n in leadingEmptyCells" :key="'empty-start-' + n" class="min-h-[120px]"></div>

            <!-- Day cells -->
            <div v-for="day in calendarDays" :key="day.dateStr"
              class="min-h-[120px] border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow"
              :class="{ 'bg-blue-50 border-blue-200': day.isToday }">
              <div class="flex justify-between items-start">
                <span class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full"
                  :class="day.isToday ? 'bg-blue-600 text-white' : 'text-gray-700'">
                  {{ day.dayNumber }}
                </span>
                <span v-if="day.visits.length > 0"
                  class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                  {{ day.visits.length }}
                </span>
              </div>

              <div class="mt-1 space-y-1">
                <div v-for="visit in day.visits.slice(0, 2)" :key="visit.id"
                  class="text-xs p-1.5 rounded-lg cursor-pointer hover:shadow-md transition-all border"
                  :class="getStatusColor(visit.status)" @click="openEventModal(visit)">
                  <div class="font-semibold truncate text-gray-800">{{ visit.pool?.label || visit.pool_name || '—' }}
                  </div>
                  <div class="truncate text-gray-600">{{ visit.pool?.customer?.contact_name || visit.customer_name ||
                    '—' }}</div>
                  <div class="truncate text-gray-500 mt-0.5">{{ formatTimeWindow(visit.time_window_start,
                    visit.time_window_end) }}</div>
                </div>
                <div v-if="day.visits.length > 2" class="text-xs text-gray-500 font-medium pl-1">
                  +{{ day.visits.length - 2 }} more
                </div>
              </div>
            </div>

            <!-- Trailing empty cells to complete the last row -->
            <div v-for="n in trailingEmptyCells" :key="'empty-end-' + n" class="min-h-[120px]"></div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="w-[350px] space-y-4">
          <!-- Today's Visits -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Visits</h3>
            <div v-if="todayVisits.length === 0" class="text-center py-6">
              <p class="text-sm text-gray-400">No visits scheduled for today.</p>
            </div>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div v-for="visit in todayVisits" :key="visit.id"
                class="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                @click="openEventModal(visit)">
                <div class="flex justify-between items-start gap-2">
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ visit.pool?.label || visit.pool_name || '—' }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ visit.pool?.customer?.contact_name ||
                      visit.customer_name || '—' }}</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 border"
                    :class="getStatusColor(visit.status)">
                    {{ formatLabel(visit.status) }}
                  </span>
                </div>
                <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{{ formatTimeWindow(visit.time_window_start, visit.time_window_end) }}</span>
                  <span class="truncate ml-2">👤 {{ visit.technician?.name || visit.technician_name || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Month Summary -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Month Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span class="text-sm font-medium text-gray-700">Scheduled</span>
                </div>
                <span class="text-sm font-bold text-blue-700">{{ stats.scheduled }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span class="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <span class="text-sm font-bold text-green-700">{{ stats.completed }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span class="text-sm font-medium text-gray-700">Pending</span>
                </div>
                <span class="text-sm font-bold text-yellow-700">{{ stats.pending }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span class="text-sm font-medium text-gray-700">Cancelled / Missed</span>
                </div>
                <span class="text-sm font-bold text-red-700">{{ stats.cancelled + stats.missed }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedEvent" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="selectedEvent = null">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="px-6 pt-6 pb-4 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-2">
                  <span class="text-xs px-2.5 py-1 rounded-full font-semibold border"
                    :class="getStatusColor(selectedEvent.status)">
                    {{ formatLabel(selectedEvent.status) }}
                  </span>
                  <span class="text-xs px-2.5 py-1 rounded-full font-semibold border"
                    :class="getPriorityColor(selectedEvent.priority)">
                    {{ formatLabel(selectedEvent.priority) }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 truncate">
                  {{ selectedEvent.pool?.label || selectedEvent.pool_name || 'Service Visit' }}
                </h3>
              </div>
              <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-4 space-y-1 text-sm">
            <div class="flex justify-between py-2.5 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Customer</span>
              <span class="font-semibold text-gray-900">{{ selectedEvent.pool?.customer?.contact_name ||
                selectedEvent.customer_name || '—' }}</span>
            </div>
            <div class="flex justify-between py-2.5 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Pool</span>
              <span class="font-semibold text-gray-900">{{ selectedEvent.pool?.label || selectedEvent.pool_name || '—'
                }}</span>
            </div>
            <div class="flex justify-between py-2.5 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Technician</span>
              <span class="font-semibold text-gray-900">{{ selectedEvent.technician?.name ||
                selectedEvent.technician_name || '—' }}</span>
            </div>
            <div class="flex justify-between py-2.5 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Time Window</span>
              <span class="font-semibold text-gray-900">{{ formatTimeWindow(selectedEvent.time_window_start,
                selectedEvent.time_window_end) }}</span>
            </div>
            <div class="flex justify-between py-2.5 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Status</span>
              <span class="font-semibold text-gray-900">{{ formatLabel(selectedEvent.status) }}</span>
            </div>
            <div class="flex justify-between py-2.5">
              <span class="text-gray-500 font-medium">Priority</span>
              <span class="font-semibold text-gray-900">{{ formatLabel(selectedEvent.priority) }}</span>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="px-6 pb-6">
            <div class="flex flex-wrap gap-2">
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex-1">
                Start Visit
              </button>
              <button
                class="px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium flex-1 text-gray-700">
                Reschedule
              </button>
              <button
                class="px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium flex-1 text-gray-700">
                Change Tech
              </button>
              <button
                class="px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium flex-1 text-gray-700">
                View Customer
              </button>
              <button
                class="px-4 py-2 border border-red-200 text-red-600 bg-white rounded-xl hover:bg-red-50 transition-colors text-sm font-medium flex-1">
                Cancel Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../../../../../services/api.js'

// ─── Date references ────────────────────────────────────────────────────────
const today = new Date()
const todayYear = today.getFullYear()
const todayMonth = today.getMonth() + 1  // 1-based
const todayDay = today.getDate()

// ─── Reactive state ─────────────────────────────────────────────────────────
const currentMonth = ref(todayMonth)
const currentYear = ref(todayYear)
const calendarData = ref({ days_in_month: 0, first_day_of_month: 1, visits: {}, total_visits: 0 })
const loading = ref(false)
const initialLoading = ref(true)
const errorMessage = ref('')
const selectedEvent = ref(null)

// ─── Computed: month label ───────────────────────────────────────────────────
const currentMonthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value - 1, 1)
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
})

// ─── Computed: leading/trailing empty cells ──────────────────────────────────
// API returns first_day_of_month as ISO weekday: 1 = Monday, 7 = Sunday
const leadingEmptyCells = computed(() => {
  const fd = parseInt(calendarData.value.first_day_of_month ?? 1)
  // Monday-first grid: Monday = 0 empty cells, Sunday = 6 empty cells
  return (fd - 1 + 7) % 7
})

const trailingEmptyCells = computed(() => {
  const total = leadingEmptyCells.value + (calendarData.value.days_in_month ?? 0)
  const remainder = total % 7
  return remainder === 0 ? 0 : 7 - remainder
})

// ─── Computed: calendar days array ──────────────────────────────────────────
const calendarDays = computed(() => {
  const days = []
  const daysInMonth = calendarData.value.days_in_month ?? 0
  const visitsMap = calendarData.value.visits ?? {}
  const isCurrentMonthView = currentMonth.value === todayMonth && currentYear.value === todayYear

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(currentMonth.value).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${currentYear.value}-${mm}-${dd}`
    const visits = visitsMap[dateStr] ?? []
    const isToday = isCurrentMonthView && d === todayDay

    days.push({ dayNumber: d, dateStr, visits, isToday })
  }
  return days
})

// ─── Computed: all visits flat list ─────────────────────────────────────────
const allVisits = computed(() => {
  return Object.values(calendarData.value.visits ?? {}).flat()
})

// ─── Computed: today's visits (sidebar) ─────────────────────────────────────
const todayVisits = computed(() => {
  const mm = String(todayMonth).padStart(2, '0')
  const dd = String(todayDay).padStart(2, '0')
  const key = `${todayYear}-${mm}-${dd}`
  // Only show if we are viewing the current month
  if (currentMonth.value !== todayMonth || currentYear.value !== todayYear) return []
  return (calendarData.value.visits ?? {})[key] ?? []
})

// ─── Computed: stats ─────────────────────────────────────────────────────────
const stats = computed(() => {
  const visits = allVisits.value
  return {
    total: visits.length,
    scheduled: visits.filter(v => normalizeStatus(v.status) === 'scheduled').length,
    completed: visits.filter(v => normalizeStatus(v.status) === 'completed').length,
    pending: visits.filter(v => normalizeStatus(v.status) === 'pending').length,
    cancelled: visits.filter(v => normalizeStatus(v.status) === 'cancelled').length,
    missed: visits.filter(v => normalizeStatus(v.status) === 'missed').length,
  }
})

// ─── API ─────────────────────────────────────────────────────────────────────
async function fetchCalendar() {
  loading.value = true
  try {
  //  const res = await api().get("schedule-visit-management/calendar?type[]=repair&type[]=installation&type[]=inspection&type[]=one_time&type[]=emergency",
   const res = await api().get("schedule-visit-management/calendar",
    {
  params: { 
    month: currentMonth.value, 
    year: currentYear.value,

  }
})
    calendarData.value = res.data
    errorMessage.value = ''
  } catch (err) {
    console.error('Calendar fetch error:', err)
    errorMessage.value = `Failed to load ${currentMonthLabel.value}. Showing previously loaded data.`
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

// ─── Month navigation ────────────────────────────────────────────────────────
function prevMonth() {
  if (loading.value) return
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  fetchCalendar()
}

function nextMonth() {
  if (loading.value) return
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  fetchCalendar()
}

function goToToday() {
  if (loading.value) return
  const changed = currentMonth.value !== todayMonth || currentYear.value !== todayYear
  currentMonth.value = todayMonth
  currentYear.value = todayYear
  if (changed) fetchCalendar()
}

// ─── Mouse wheel navigation ──────────────────────────────────────────────────
let wheelThrottleTimer = null

// function handleWheel(e) {
//   if (wheelThrottleTimer) return
//   wheelThrottleTimer = setTimeout(() => { wheelThrottleTimer = null }, 400)
//   if (e.deltaY < 0) {
//     prevMonth()
//   } else if (e.deltaY > 0) {
//     nextMonth()
//   }
// }

// ─── Modal ───────────────────────────────────────────────────────────────────
function openEventModal(visit) {
  selectedEvent.value = visit
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

/** Convert snake_case / kebab-case to Title Case */
function formatLabel(str) {
  if (!str) return '—'
  return String(str)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Parse ISO datetime string → "7:00 AM" */
function formatTime(timeStr) {
  if (!timeStr) return null

  // Check if it's already in HH:MM format
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    // Convert "07:00" to "7:00 AM"
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Check if it's in HH:MM:SS format
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
    // Convert "07:00:00" to "7:00 AM"
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // If it's ISO date, try parsing
  try {
    const d = new Date(timeStr)
    if (!isNaN(d)) {
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  } catch (e) {
    // Ignore
  }

  // Return as is if nothing else works
  return timeStr
}

/** "7:00 AM – 5:00 PM" or single time if no end */
function formatTimeWindow(start, end) {
  const s = formatTime(start)
  const e = formatTime(end)
  if (s && e) return `${s} – ${e}`
  if (s) return s
  return '—'
}

/** Normalize status string for comparison */
function normalizeStatus(status) {
  return String(status ?? '').toLowerCase().replace(/[_\s-]/g, '_')
}

// ─── Color helpers ────────────────────────────────────────────────────────────

/** Status → Tailwind classes (light theme) */
function getStatusColor(status) {
  const s = normalizeStatus(status)
  const map = {
    completed: 'bg-green-50  text-green-700  border-green-200',
    scheduled: 'bg-blue-50   text-blue-700   border-blue-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-50    text-red-700    border-red-200',
    missed: 'bg-gray-100  text-gray-600   border-gray-200',
    in_progress: 'bg-orange-50 text-orange-700 border-orange-200',
  }
  return map[s] ?? 'bg-gray-50 text-gray-600 border-gray-200'
}

/** Priority → Tailwind classes (light theme) */
function getPriorityColor(priority) {
  const p = normalizeStatus(priority)
  const map = {
    urgent: 'bg-red-50    text-red-700    border-red-200',
    first_visit: 'bg-purple-50 text-purple-700 border-purple-200',
    normal: 'bg-blue-50   text-blue-700   border-blue-200',
  }
  return map[p] ?? 'bg-gray-50 text-gray-600 border-gray-200'
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchCalendar()
})

onUnmounted(() => {
  if (wheelThrottleTimer) clearTimeout(wheelThrottleTimer)
})
</script>

<style scoped>
.calendar-grid {
  transition: all 0.2s ease;
}

/* Toast slide-in */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Modal fade */
.modal-enter-active {
  transition: all 0.2s ease;
}

.modal-leave-active {
  transition: all 0.15s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

/* Sidebar scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>