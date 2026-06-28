<template>
    <div class="min-h-screen bg-gray-50">

        <!-- Page Header -->
        <div class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900">Perform Service</h1>
                    <p class="mt-1 text-sm text-gray-500">View and perform scheduled service visits for this pool.</p>
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
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Scheduled Visits</p>
                        <p class="text-2xl font-bold text-gray-900">{{ summary.total }}</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
                        <p class="text-2xl font-bold text-emerald-600">{{ summary.completed }}</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pending / Upcoming</p>
                        <p class="text-2xl font-bold text-blue-600">{{ summary.pending }}</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Missed / Cancelled</p>
                        <p class="text-2xl font-bold text-rose-600">{{ summary.missed }}</p>
                    </div>
                </template>
            </div>

            <!-- Table Card -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                <!-- Loading Skeleton -->
                <div v-if="loading" class="animate-pulse">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <div class="h-4 bg-gray-200 rounded w-40"></div>
                    </div>
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-b border-gray-100 bg-gray-50">
                                <th v-for="i in 9" :key="i" class="px-4 py-3">
                                    <div class="h-3 bg-gray-200 rounded w-16"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in 5" :key="i" :class="i % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
                                class="border-b border-gray-100">
                                <td v-for="j in 9" :key="j" class="px-4 py-4">
                                    <div class="h-3 bg-gray-200 rounded"
                                        :class="j === 1 ? 'w-10' : j === 3 ? 'w-28' : 'w-20'">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div v-else-if="!sortedVisits.length"
                    class="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p class="text-base font-medium text-gray-700">No scheduled visits found.</p>
                    <p class="text-sm text-gray-400 mt-1 max-w-xs">Visits assigned to this pool will appear here.</p>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead class="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Visit ID</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Scheduled Date</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Time Window</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Technician</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Priority</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Visit Status</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Agreement</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Work Order</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                    Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(visit, index) in sortedVisits" :key="visit.id"
                                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                                class="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                                <!-- Visit ID -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top font-mono text-xs text-gray-500">
                                    #{{ visit.id
                                    }}</td>

                                <!-- Scheduled Date -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <span class="font-medium text-gray-900">{{ formatDate(visit.scheduled_date)
                                        }}</span>
                                </td>

                                <!-- Time Window -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top whitespace-nowrap text-gray-600">
                                    {{ formatTimeWindow(visit.time_window_start, visit.time_window_end) }}
                                </td>

                                <!-- Technician -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <span v-if="visit.technician?.name" class="text-gray-900">{{ visit.technician.name
                                        }}</span>
                                    <span v-else class="text-gray-400 italic text-xs">Unassigned</span>
                                </td>

                                <!-- Priority -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <span :class="priorityBadge(visit.priority)"
                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">{{
                                        formatPriority(visit.priority) }}</span>
                                </td>

                                <!-- Visit Status -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <span :class="visitStatusBadge(visit.status)"
                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">{{
                                        formatStatus(visit.status) }}</span>
                                </td>

                                <!-- Agreement -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <div v-if="visit.service_agreement">
                                        <p class="font-medium text-gray-900">
                                            {{ formatStatus(visit.service_agreement?.frequency) }}
                                        </p>
                                        <p class="text-xs text-gray-500">$ {{
                                            formatStatus(visit.service_agreement?.price) }}</p>
                                    </div>
                                    <span v-else class="text-gray-400 italic text-xs">No Agreement</span>
                                </td>

                                <!-- Work Order -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <div v-if="visit.work_order">
                                        <span :class="workOrderTypeBadge(visit.work_order?.type)"
                                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">{{
                                            formatStatus(visit.work_order?.type) }}</span>
                                        <div class="mt-1">
                                            <span :class="workOrderStatusBadge(visit.work_order?.status)"
                                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">{{
                                                formatStatus(visit.work_order?.status) }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400 italic text-xs">No Work Order</span>
                                </td>

                                <!-- Action -->
                                <td class="px-4 py-3 text-sm text-gray-700 align-top">
                                    <button @click="performService(visit.work_order)"
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Perform Service
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
const sortedVisits = computed(() =>
    [...visits.value].sort((a, b) => {
        const da = new Date(a.scheduled_date ?? 0)
        const db = new Date(b.scheduled_date ?? 0)
        return da - db
    })
)

const summary = computed(() => {
    const total = visits.value.length
    const completed = visits.value.filter(v => v.status === 'completed').length
    const pending = visits.value.filter(v => ['scheduled', 'pending', 'in_progress'].includes(v.status)).length
    const missed = visits.value.filter(v => ['missed', 'cancelled'].includes(v.status)).length
    return { total, completed, pending, missed }
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
    return new Date(`1970-01-01T${val}`).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
    })
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

function formatCurrency(val) {
    if (val == null) return '—'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

// ─── Badge Helpers ────────────────────────────────────────────────────────────
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

function workOrderStatusBadge(status) {
    const map = {
        completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        in_progress: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    }
    return map[status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

function workOrderTypeBadge(type) {
    const map = {
        routine: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
        emergency: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        inspection: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
        repair: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
        installation: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
        one_time: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    }
    return map[type] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function loadVisits() {
    loading.value = true
    try {
        const response = await api().get(`/schedule-visit-management/visits?pool_id=${poolId}`)
        visits.value = response.data?.data ?? []
    } catch (err) {
        const Swal = (await import('sweetalert2')).default
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
    console.log(workOrder);

    if (workOrder == null) {
        Swal.fire({
            icon: 'warning',
            title: 'No Work Order Created',
            text: 'Please create work order',
            confirmButtonColor: '#6b7280',
            confirmButtonText: 'OK'
        });
    } else {
        router.push(`/provider/services-perform-service/${workOrder?.id}`)
    }

}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
    loadVisits()
})
</script>