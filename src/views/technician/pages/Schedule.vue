<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40 p-4 md:p-8">
    <div v-if="loading" class="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div class="h-10 w-72 bg-gray-200 rounded-xl"></div>
      <div v-for="i in 3" :key="i" class="h-28 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else class="w-full">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-calendar-check-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p class="text-gray-500">Upcoming and past scheduled pool service visits.</p>
        </div>
      </header>

      <div v-if="visits.length === 0" class="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <div class="text-5xl mb-4">📅</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No visits scheduled</h3>
        <p class="text-gray-500">Your upcoming service visits will appear here.</p>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Service Calendar</h1>
              <p class="text-gray-500 mt-1">View your upcoming service visits as events on a monthly calendar.</p>
            </div>
            <div class="flex items-center gap-3">
              <button @click="prevMonth" class="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                <i class="ri-arrow-left-s-line"></i>
              </button>
              <div class="text-sm font-semibold text-gray-900">{{ monthLabel }}</div>
              <button @click="nextMonth" class="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                <i class="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-sm text-gray-500">Total Visits</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900">{{ visits.length }}</p>
            </div>
            <div class="rounded-2xl bg-sky-50 p-4">
              <p class="text-sm text-sky-700">Scheduled</p>
              <p class="mt-2 text-2xl font-semibold text-sky-900">{{ statusCounts.scheduled }}</p>
            </div>
            <div class="rounded-2xl bg-emerald-50 p-4">
              <p class="text-sm text-emerald-700">Completed</p>
              <p class="mt-2 text-2xl font-semibold text-emerald-900">{{ statusCounts.completed }}</p>
            </div>
            <div class="rounded-2xl bg-orange-50 p-4">
              <p class="text-sm text-orange-700">Missed / Rescheduled</p>
              <p class="mt-2 text-2xl font-semibold text-orange-900">{{ statusCounts.other }}</p>
            </div>
          </div>

          <div class="flex flex-col xl:flex-row gap-6">
            <div class="flex-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div class="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-gray-500 mb-2">
                <div v-for="day in weekHeaders" :key="day">{{ day }}</div>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  class="min-h-[140px] rounded-2xl border border-gray-100 p-2 flex flex-col overflow-hidden"
                  :class="{ 'bg-slate-50': !cell.isCurrentMonth, 'bg-blue-50': cell.isToday }"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span :class="{ 'text-blue-700 font-semibold': cell.isToday, 'text-gray-400': !cell.isCurrentMonth }">{{ cell.day }}</span>
                    <span v-if="cell.events.length" class="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{{ cell.events.length }}</span>
                  </div>
                  <div class="space-y-1 overflow-hidden">
                    <button
                      v-for="event in cell.events.slice(0, 2)"
                      :key="event.id"
                      @click="openEventModal(event)"
                      class="w-full text-left rounded-xl px-2 py-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap hover:bg-gray-50 transition"
                      :class="getEventClass(event.status)"
                    >
                      <div class="font-medium truncate">{{ event.pool_name }}</div>
                      <div class="text-[11px] text-gray-600 truncate">{{ event.time_window }}</div>
                    </button>
                    <div v-if="cell.events.length > 2" class="text-[11px] text-gray-500">+{{ cell.events.length - 2 }} more</div>
                  </div>
                </div>
              </div>
            </div>

            <aside class="w-full xl:w-80 space-y-4">
              <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Upcoming Visits</h3>
                <div class="space-y-3">
                  <button
                    v-for="visit in upcomingVisits"
                    :key="visit.id"
                    @click="openEventModal(visit)"
                    class="w-full text-left rounded-2xl border border-gray-100 p-3 hover:bg-orange-50 transition"
                  >
                    <div class="flex justify-between gap-2">
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 truncate">{{ visit.pool_name }}</p>
                        <p class="text-sm text-gray-500 truncate">{{ visit.technician_name }} · {{ visit.time_window }}</p>
                      </div>
                      <span class="text-xs px-2 py-1 rounded-full font-semibold" :class="statusBadgeClass(visit.status || 'scheduled')">
                        {{ formatStatus(visit.status || 'scheduled') }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div v-if="selectedEvent" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" @click.self="selectedEvent = null">
          <div class="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6">
            <div class="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ selectedEvent.pool_name }}</h2>
                <p class="text-sm text-gray-500">{{ selectedEvent.technician_name }} · {{ selectedEvent.time_window }}</p>
              </div>
              <button class="text-gray-400 hover:text-gray-600" @click="selectedEvent = null">
                <i class="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div class="space-y-3 text-sm text-gray-700">
              <div class="flex justify-between border-b border-gray-100 pb-3">
                <span class="text-gray-500">Date</span>
                <span>{{ formatDate(selectedEvent.scheduled_date) }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-100 pb-3">
                <span class="text-gray-500">Pool</span>
                <span>{{ selectedEvent.pool_name }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-100 pb-3">
                <span class="text-gray-500">Technician</span>
                <span>{{ selectedEvent.technician_name }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-100 pb-3">
                <span class="text-gray-500">Status</span>
                <span>{{ formatStatus(selectedEvent.status || 'scheduled') }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-100 pb-3">
                <span class="text-gray-500">Priority</span>
                <span>{{ selectedEvent.priority || 'Normal' }}</span>
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
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatDate, formatStatus, statusBadgeClass } from '../utils/formatters.js'

const loading = ref(true)
const visits = ref([])
const selectedEvent = ref(null)
const displayDate = ref(new Date())

const weekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatDay = (d) => (d ? new Date(d).getDate() : '—')
const formatMonth = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short' }) : '')

const formatTimeWindow = (start, end) => {
  const formatTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const startLabel = formatTime(start)
  const endLabel = formatTime(end)

  if (!startLabel && !endLabel) return ''
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`
  return startLabel || endLabel
}

const normalizeVisit = (visit) => ({
  ...visit,
  pool_name: visit.pool?.label || visit.pool_name || 'Pool Visit',
  technician_name: visit.technician?.name || visit.technician_name || '',
  service_address: visit.pool?.service_address || visit.service_address || '',
  time_window: formatTimeWindow(visit.time_window_start, visit.time_window_end) || visit.time_window || visit.scheduled_time || '',
  service_type: visit.service_type || formatStatus(visit.priority) || '',
})

const monthLabel = computed(() => displayDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

const statusCounts = computed(() => {
  const counts = { scheduled: 0, completed: 0, other: 0 }
  visits.value.forEach((visit) => {
    const status = (visit.status || 'scheduled').toLowerCase()
    if (status === 'scheduled') counts.scheduled += 1
    else if (status === 'completed') counts.completed += 1
    else counts.other += 1
  })
  return counts
})

const normalizedVisits = computed(() => visits.value.map(normalizeVisit))

const calendarCells = computed(() => {
  const year = displayDate.value.getFullYear()
  const month = displayDate.value.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const currentMonthDays = new Date(year, month + 1, 0).getDate()

  const cells = []
  const prevMonthDays = startWeekday
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  for (let i = prevMonthDays; i > 0; i -= 1) {
    const day = prevMonthLastDay - i + 1
    cells.push({ key: `prev-${day}`, day, isCurrentMonth: false, isToday: false, events: [] })
  }

  for (let day = 1; day <= currentMonthDays; day += 1) {
    const date = new Date(year, month, day)
    const dayEvents = normalizedVisits.value.filter((visit) => {
      const eventDate = new Date(visit.scheduled_date)
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      )
    })
    cells.push({ key: `current-${day}`, day, isCurrentMonth: true, isToday: isSameDay(date, new Date()), events: dayEvents })
  }

  const remainder = (7 - (cells.length % 7)) % 7
  for (let day = 1; day <= remainder; day += 1) {
    cells.push({ key: `next-${day}`, day, isCurrentMonth: false, isToday: false, events: [] })
  }

  return cells
})

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const upcomingVisits = computed(() => {
  const now = new Date()
  return normalizedVisits.value
    .filter((visit) => new Date(visit.scheduled_date) >= now)
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 5)
})

const getEventClass = (status) => {
  const map = {
    completed: 'bg-emerald-100 text-emerald-700',
    scheduled: 'bg-sky-100 text-sky-700',
    missed: 'bg-orange-100 text-orange-700',
    rescheduled: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700',
  }
  return map[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-700'
}

const openEventModal = (event) => {
  selectedEvent.value = event
}

const prevMonth = () => {
  const date = new Date(displayDate.value)
  date.setMonth(date.getMonth() - 1)
  displayDate.value = date
}

const nextMonth = () => {
  const date = new Date(displayDate.value)
  date.setMonth(date.getMonth() + 1)
  displayDate.value = date
}

const fetchVisits = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getScheduledVisits()
    const source = Array.isArray(data) ? data : data?.data || data?.visits || data?.scheduled_visits || []
    visits.value = source.map(normalizeVisit)
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Schedule', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

onMounted(fetchVisits)
</script>
