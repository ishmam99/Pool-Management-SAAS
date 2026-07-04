<template>
    <div class="max-w-screen-2xl min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <!-- Premium Dashboard Header -->
        <div
            class="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-5 sticky top-0 z-10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div
                        class="hidden sm:flex h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <h1
                            class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                            Today's Pool Visits
                        </h1>
                        <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Manage today's scheduled pool service visits
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-3 flex-wrap">
                    <div
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
                        <span class="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total</span>
                        <span class="text-lg sm:text-xl font-bold text-blue-600">{{ summary.total }}</span>
                    </div>

                    <div class="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div
                        class="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white px-3 sm:px-4 py-2 rounded-2xl border border-slate-200/60 shadow-sm">
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="font-medium">{{ formattedDate }}</span>
                    </div>

                    <button @click="loadVisits" :disabled="loading"
                        class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            <!-- Summary Cards -->
            <!-- <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <template v-if="loading">
                    <div v-for="i in 4" :key="i"
                        class="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-4 sm:p-5 animate-pulse">
                        <div class="flex items-start justify-between">
                            <div class="space-y-3 flex-1">
                                <div class="h-3 bg-slate-200 rounded w-20"></div>
                                <div class="h-7 sm:h-8 bg-slate-200 rounded w-12"></div>
                            </div>
                            <div class="h-9 w-9 sm:h-10 sm:w-10 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="group rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 p-4 sm:p-5 cursor-default">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Visits
                                </p>
                                <p class="text-2xl sm:text-3xl font-bold text-slate-800 mt-1.5">{{ summary.total }}</p>
                            </div>
                            <div
                                class="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>All visits</span>
                        </div>
                    </div>

                    <div
                        class="group rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-emerald-200/50 transition-all duration-300 p-4 sm:p-5 cursor-default">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
                                <p class="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1.5">{{ summary.completed
                                }}</p>
                            </div>
                            <div
                                class="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span>+{{ summary.completed > 0 ? Math.round(summary.completed / summary.total * 100) : 0
                            }}% completion</span>
                        </div>
                    </div>

                    <div
                        class="group rounded-2xl bg-gradient-to-br from-white to-amber-50/30 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-amber-200/50 transition-all duration-300 p-4 sm:p-5 cursor-default">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
                                <p class="text-2xl sm:text-3xl font-bold text-amber-600 mt-1.5">{{ summary.pending }}
                                </p>
                            </div>
                            <div
                                class="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>In progress / Upcoming</span>
                        </div>
                    </div>

                    <div
                        class="group rounded-2xl bg-gradient-to-br from-white to-rose-50/30 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-rose-200/50 transition-all duration-300 p-4 sm:p-5 cursor-default">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending /
                                    Missed</p>
                                <p class="text-2xl sm:text-3xl font-bold text-rose-600 mt-1.5">{{ summary.missed }}</p>
                            </div>
                            <div
                                class="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Needs attention</span>
                        </div>
                    </div>
                </template>
            </div> -->

            <!-- Loading Skeleton -->
            <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4">
                <div v-for="i in 6" :key="i"
                    class="flex-shrink-0 w-72 sm:w-80 lg:w-96 rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden animate-pulse">
                    <div class="h-14 bg-gradient-to-r from-slate-100 to-slate-200"></div>
                    <div class="p-4 space-y-4">
                        <div v-for="j in 3" :key="j" class="h-32 bg-slate-100 rounded-xl"></div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!totalVisits"
                class="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                <div class="relative">
                    <div
                        class="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
                        <svg class="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div
                        class="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                </div>
                <h3 class="mt-6 text-base sm:text-lg font-bold text-slate-700">No visits scheduled today</h3>
                <p class="text-sm text-slate-500 mt-1.5 max-w-sm">New visits assigned to you will appear here once
                    they're
                    scheduled.</p>
                <button @click="loadVisits"
                    class="mt-6 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            <!-- Time Slots Columns (Kanban Style) -->
            <div v-else class="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar">
                <div v-for="slot in timeSlots" :key="slot.label"
                    class="flex-shrink-0 w-72 sm:w-80 lg:w-76 rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden snap-start transition-all duration-300 hover:shadow-lg hover:border-blue-200/50">



                    <!-- Slot Header with Gradient -->
                    <div
                        class="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-blue-500/10 border-b border-slate-200/60 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div
                                class="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-slate-700">{{ slot.label }}</span>
                            </div>
                        </div>
                        <span
                            class="text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 px-2.5 py-1 rounded-full shadow-md shadow-blue-500/20">
                            {{ slot.visits.length }} visits
                        </span>
                    </div>

                    <!-- Visits List -->
                    <div class="divide-y divide-slate-100 max-h-[1200px] overflow-y-auto p-3 custom-scrollbar-inner">
                        <div v-if="!slot.visits.length"
                            class="py-8 text-center text-sm text-slate-400 font-medium italic">
                            No visits in this slot
                        </div>
                        <div v-for="visit in slot.visits" :key="visit.id" class="py-2.5">
                            <!-- Premium Visit Card -->
                            <div
                                class="group relative p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/60 hover:border-blue-200/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

                                <!-- Top Row: ID + Badges -->
                                <div class="flex items-start justify-between gap-2 mb-2.5">
                                    <span
                                        class="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                        #{{ visit.id }}
                                    </span>
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span :class="priorityBadge(visit.priority)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200">
                                            {{ formatPriority(visit.priority) }}
                                        </span>
                                        <span :class="visitStatusBadge(visit.status)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200">
                                            {{ formatStatus(visit.status) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Customer Name (Prominent) -->
                                <div class="flex items-center gap-2.5 mb-1.5">
                                    <div
                                        class="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span class="text-sm sm:text-base font-bold text-slate-800 truncate">
                                        {{ visit.pool?.customer?.contact_name || '—' }}
                                    </span>
                                </div>



                                <!-- Maintenance -->
                                <div class="flex items-start gap-2 mb-2.5 ml-0.5">
                                    <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" :class="{
                                        'text-red-500': visit?.service_agreement == null,
                                        'text-blue-500': visit?.service_agreement != null
                                    }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span class="text-xs leading-relaxed break-words" :class="{
                                        'text-red-600': visit?.service_agreement == null,
                                        'text-blue-600': visit?.service_agreement != null
                                    }">
                                        {{ visit?.service_agreement == null ? 'Maintenance Visit' : 'Routine Visit' }}
                                    </span>
                                </div>

                                <!-- Address -->
                                <div class="flex items-start gap-2 mb-2.5 ml-0.5">
                                    <svg class="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span class="text-xs text-slate-600 leading-relaxed break-words">
                                        {{ visit.pool?.service_address || 'No address provided' }}
                                    </span>
                                </div>

                                <!-- Technician + Pool + Time -->
                                <div class="grid grid-cols-1 gap-1.5 mb-3 text-xs">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="h-5 w-5 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
                                            <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span class="font-medium text-slate-700">
                                            {{ visit.technician?.name || 'Unassigned' }}
                                        </span>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span class="text-slate-600">{{ visit.pool?.label || '—' }}</span>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span class="text-slate-600">{{ formatTimeWindow(visit.time_window_start,
                                            visit.time_window_end) }}</span>
                                    </div>
                                </div>

                                <!-- Perform Button (Full width) -->
                                <button @click="performService(visit.work_order)"
                                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group">
                                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Perform Service
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

const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
})

// ─── Time Slots ──────────────────────────────────────────────────────────────
const timeSlots = computed(() => {
    const slots = [];

    // 6:00 AM to 6:00 PM in 2-hour intervals
    for (let hour = 6; hour < 18; hour += 2) {
        const start = `${hour.toString().padStart(2, '0')}:00`;
        const end = `${(hour + 2).toString().padStart(2, '0')}:00`;

        slots.push({
            startHour: hour,
            endHour: hour + 2,
            label: `${start} – ${end}`,
            visits: []
        });
    }

    const unassigned = [];

    visits.value.forEach(visit => {
        if (!visit.time_window_start) {
            unassigned.push(visit);
            return;
        }

        const hour = parseInt(visit.time_window_start.split(':')[0], 10);

        // Only place visits between 6 AM and 6 PM into time slots
        if (hour >= 6 && hour < 18) {
            const slotIndex = Math.floor((hour - 6) / 2);
            slots[slotIndex].visits.push(visit);
        } else {
            // Visits outside working hours go to Unassigned
            unassigned.push(visit);
        }
    });

    if (unassigned.length) {
        slots.push({
            label: 'Unassigned',
            visits: unassigned
        });
    }

    return slots;
});

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
        completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        missed: 'bg-rose-50 text-rose-700 border-rose-200',
        cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
        rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
        in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    }
    return map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

function priorityBadge(priority) {
    const map = {
        normal: 'bg-slate-100 text-slate-600 border-slate-200',
        low: 'bg-slate-100 text-slate-600 border-slate-200',
        high: 'bg-orange-50 text-orange-700 border-orange-200',
        urgent: 'bg-rose-50 text-rose-700 border-rose-200',
        first_visit: 'bg-teal-50 text-teal-700 border-teal-200',
    }
    return map[priority] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function loadVisits() {
    loading.value = true
    try {
        const response = await api().get(`/schedule-visit-management/visits?today=today&with=pool.customer`)
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

<style scoped>
/* Custom Scrollbar Styles */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1;
}

.custom-scrollbar-inner {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}

.custom-scrollbar-inner::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar-inner::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar-inner::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
}

.custom-scrollbar-inner::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1;
}

/* Smooth Transitions */
* {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}
</style>