<template>
    <div class="min-h-screen overflow-hidden bg-gray-50">

        <!-- Page Header -->
        <div class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900">Perform Service - Today</h1>
                    <p class="mt-1 text-sm text-gray-500">View scheduled visits grouped by time – scroll horizontally.</p>
                </div>
                <button @click="loadVisits" :disabled="loading"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50">
                    <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            <!-- Summary Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <template v-if="loading">
                    <div v-for="i in 4" :key="i"
                        class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                        <div class="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                        <div class="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                </template>
                <template v-else>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Visits</p>
                        <p class="text-2xl font-bold text-gray-900">{{ summary.total }}</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
                        <p class="text-2xl font-bold text-emerald-600">{{ summary.completed }}</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">In Progress / Upcoming</p>
                        <p class="text-2xl font-bold text-blue-600">{{ summary.pending }}</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Missed / Cancelled</p>
                        <p class="text-2xl font-bold text-rose-600">{{ summary.missed }}</p>
                    </div>
                </template>
            </div>

            <!-- Horizontal Time Slots -->
            <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4">
                <div v-for="i in 6" :key="i"
                    class="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                    <div class="h-5 bg-gray-200 rounded w-24 mb-3"></div>
                    <div class="space-y-2">
                        <div v-for="j in 2" :key="j" class="h-12 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="!totalVisits" class="flex flex-col items-center justify-center py-20 text-center px-4">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p class="text-base font-medium text-gray-700">No scheduled visits found.</p>
                <p class="text-sm text-gray-400 mt-1 max-w-xs">Visits assigned to this pool will appear here.</p>
            </div>

            <div v-else class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                <div v-for="slot in timeSlots" :key="slot.label"
                    class="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden snap-start">
                    <!-- Slot Header -->
                    <div class="px-4 py-3 bg-sky-50/80 border-b border-gray-200 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="ri-time-line text-blue-500 text-sm"></i>
                            <span class="text-sm font-semibold text-gray-700">{{ slot.label }}</span>
                        </div>
                        <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ slot.visits.length }}</span>
                    </div>

                    <!-- Visits List -->
                    <div class="divide-y divide-gray-100 max-h-[500px] overflow-y-auto p-2">
                        <div v-if="!slot.visits.length" class="py-6 text-center text-sm text-gray-400 italic">
                            No visits
                        </div>
                        <div v-for="visit in slot.visits" :key="visit.id" class="py-2 px-1">
                            <div class="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-mono text-gray-500">#{{ visit.id }}</span>
                                    <span :class="visitStatusBadge(visit.status)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                                        {{ formatStatus(visit.status) }}
                                    </span>
                                </div>
                                <div class="text-sm font-medium text-gray-800">
                                    {{ formatDate(visit.scheduled_date) }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ formatTimeWindow(visit.time_window_start, visit.time_window_end) }}
                                </div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span :class="priorityBadge(visit.priority)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                                        {{ formatPriority(visit.priority) }}
                                    </span>
                                    
                                </div>
                                <span class="text-xs text-gray-500 truncate max-w-[220px]">
                                        Technician: {{ visit.technician?.name || 'Unassigned' }}
                                    </span>
                                <button @click="performService(visit.work_order)"
                                    class="mt-1 inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full">
                                    <i class="ri-play-circle-line"></i> Perform
                                </button>
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
import { useRoute, useRouter } from 'vue-router'
import api from '../../../../../services/api'
import Swal from 'sweetalert2'

// ─── Router ───────────────────────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const poolId = route.params.id

// ─── State ────────────────────────────────────────────────────────────────────
const visits = ref([])
const loading = ref(false)

// ─── Computed ─────────────────────────────────────────────────────────────────
const summary = computed(() => {
    const total = visits.value.length
    const completed = visits.value.filter(v => v.status === 'completed').length
    const pending = visits.value.filter(v => ['scheduled', 'pending', 'in_progress'].includes(v.status)).length
    const missed = visits.value.filter(v => ['missed', 'cancelled'].includes(v.status)).length
    return { total, completed, pending, missed }
})

const totalVisits = computed(() => visits.value.length)

// ─── Time Slots ──────────────────────────────────────────────────────────────
const timeSlots = computed(() => {
    const slots = []
    for (let i = 0; i < 24; i += 2) {
        const start = i.toString().padStart(2, '0') + ':00'
        const end = (i + 2).toString().padStart(2, '0') + ':00'
        slots.push({
            label: `${start} – ${end}`,
            visits: []
        })
    }
    // Assign visits to slots
    visits.value.forEach(visit => {
        if (!visit.time_window_start) {
            // Will be added to Unassigned later
            return
        }
        const hour = parseInt(visit.time_window_start.split(':')[0])
        let slotIndex = Math.floor(hour / 2)
        if (slotIndex >= 12) slotIndex = 11
        slots[slotIndex].visits.push(visit)
    })
    // Add Unassigned slot
    const unassigned = visits.value.filter(v => !v.time_window_start)
    if (unassigned.length) {
        slots.push({
            label: 'Unassigned',
            visits: unassigned
        })
    }
    return slots
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(val) {
    if (!val) return '—'
    return new Date(val).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    })
}

function formatTime(val) {
    if (!val) return '—'
    const parts = val.split(':')
    const hour = parseInt(parts[0])
    const minute = parts[1]
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minute} ${ampm}`
}

function formatTimeWindow(start, end) {
    if (!start && !end) return '—'
    const s = start ? formatTime(start) : '?'
    const e = end ? formatTime(end) : '?'
    return `${s} – ${e}`
}

function formatStatus(val) {
    if (!val) return '—'
    return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatPriority(val) {
    if (!val) return '—'
    return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ─── Badges ──────────────────────────────────────────────────────────────────
function visitStatusBadge(status) {
    const map = {
        completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        scheduled: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
        pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        missed: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        rescheduled: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
        in_progress: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    }
    return map[status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

function priorityBadge(priority) {
    const map = {
        normal: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
        low: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
        high: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
        urgent: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        first_visit: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
    }
    return map[priority] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function loadVisits() {
    loading.value = true
    try {
        const response = await api().get(`/schedule-visit-management/visits?today=today`)
        visits.value = response.data?.data ?? []
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Failed to load visits',
            text: err?.response?.data?.message ?? 'An unexpected error occurred.',
        })
    } finally {
        loading.value = false
    }
}

// ─── Methods ──────────────────────────────────────────────────────────────────
function performService(workOrder) {
    if (!workOrder) {
        Swal.fire({
            icon: 'warning',
            title: 'No Work Order',
            text: 'Please create a work order before performing service.',
            confirmButtonColor: '#6b7280',
        })
        return
    }
    router.push(`/provider/services-perform-service/${workOrder.id}`)
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
    loadVisits()
})
</script>