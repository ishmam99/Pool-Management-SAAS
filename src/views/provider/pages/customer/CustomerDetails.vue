<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-30">
      <div v-if="loading.customer" class="animate-pulse">
        <div class="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-48 mb-2"></div>
        <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-72"></div>
      </div>
      <div v-else class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-3 flex-wrap">
            <h1
              class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {{ customer?.contact_name }}
            </h1>
            <span :class="customerStatusBadge(customer?.status)" class="shadow-sm">
              {{ formatStatus(customer?.status) }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-medium">{{ formatStatus(customer?.type) }}</span>
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${customer?.phone}`" class="text-blue-600 hover:text-blue-800 transition-colors">
                {{ customer?.phone }}
              </a>
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="`mailto:${customer?.email}`" class="text-blue-600 hover:text-blue-800 transition-colors">
                {{ customer?.email }}
              </a>
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-slate-500">Prefers {{ formatStatus(customer?.preferred_contact) }}</span>
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 shrink-0">
          <!-- <button @click="editCustomer"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Customer
          </button> -->
          <button @click="createAgreement"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create Agreement
          </button>
          <button @click="addPool"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Pool
          </button>
        </div>
      </div>
    </header>

    <div class="px-4 sm:px-6 lg:px-8 py-8 space-y-8 ">

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <template v-if="loading.customer">
          <div v-for="i in 6" :key="i"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 animate-pulse">
            <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-16 mb-2"></div>
            <div class="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-12"></div>
          </div>
        </template>
        <template v-else>
          <div v-for="(stat, index) in kpiStats" :key="index"
            class="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-5 hover:border-blue-200/60">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
              {{ stat.value }}
            </p>
            <div
              class="mt-2 h-1 w-12 bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-full group-hover:from-blue-500/40 transition-all duration-300">
            </div>
          </div>
        </template>
      </div>

      <!-- Customer Information Card -->
      <div
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div
          class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
          <h2 class="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
            Customer Information
          </h2>
          <span class="text-xs text-slate-400">📋 {{ customer?.contact_name }}</span>
        </div>
        <div v-if="loading.customer" class="p-6 animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 10" :key="i">
            <div class="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24 mb-1.5"></div>
            <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-36"></div>
          </div>
        </div>
        <div v-else class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <div v-for="(field, key) in customerFields" :key="key" class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ field.label }}</span>
            <span class="text-sm text-slate-900 font-medium">{{ field.value }}</span>
          </div>
        </div>
      </div>

      <!-- Pools Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
            Pools
          </h2>
          <span class="text-sm text-slate-400">{{ customer?.pools?.length || 0 }} pools</span>
        </div>
        <div v-if="loading.customer" class="space-y-4">
          <div v-for="i in 2" :key="i"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
            <div class="p-6 space-y-4">
              <div class="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-40"></div>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="j in 7" :key="j" class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!customer?.pools?.length"
          class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300/60 shadow-sm hover:border-blue-400/60 transition-all duration-300">
          <div
            class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p class="text-base font-medium text-slate-700">No pools found</p>
          <p class="text-sm text-slate-400 mt-1 max-w-xs">Add a pool to start tracking service and maintenance
            schedules.</p>
          <button @click="addPool"
            class="inline-flex items-center justify-center px-5 py-2.5 mt-6 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Pool
          </button>
        </div>
        <div v-else class="space-y-6">
          <div v-for="pool in customer.pools" :key="pool.id"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :class="pool.is_active ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                <h3 class="text-base font-semibold text-slate-800">{{ pool.label }}</h3>
                <span :class="poolActiveBadge(pool.is_active)" class="shadow-sm">{{ pool.is_active ? 'Active' :
                  'Inactive'
                }}</span>
              </div>
              <div class="flex gap-2 sm:ml-auto">
                <!-- <button @click="viewPool(pool.id)"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                  View Pool
                </button> -->
                <!-- <button @click="editPool(pool.id)"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                  Edit Pool
                </button> -->
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-6">
                <div v-for="(field, key) in getPoolFields(pool)" :key="key" class="flex flex-col gap-0.5">
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ field.label }}</span>
                  <span class="text-sm text-slate-900 font-medium">{{ field.value }}</span>
                </div>
              </div>

              <!-- Schedules inside pool card -->
              <div class="border-t border-slate-200/60 pt-6 space-y-6">
                <!-- Regular Service Schedule -->
                <div>
                  <h4 class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <span class="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                    Regular Service Schedule
                  </h4>
                  <div v-if="!schedulesLoaded" class="animate-pulse space-y-2">
                    <div v-for="i in 2" :key="i" class="h-10 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg">
                    </div>
                  </div>
                  <template v-else>
                    <div v-if="getPoolScheduleStatus(pool.id) === 'failed'"
                      class="text-sm text-rose-600 bg-rose-50/50 rounded-xl p-4 border border-rose-200/50">
                      <span class="font-medium">⚠️ Unable to load schedules.</span> Please try refreshing the page.
                    </div>
                    <div v-else-if="routineVisits(pool.id).length" class="overflow-x-auto">
                      <table class="min-w-full text-sm">
                        <thead>
                          <tr class="border-b border-slate-200/60">
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Scheduled Date
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Time
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Technician
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Status
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Priority
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="visit in routineVisits(pool.id)" :key="visit.id"
                            class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap font-medium">
                              {{ formatDate(visit.scheduled_date) }}
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                              {{ formatTimeRange(visit.time_window_start, visit.time_window_end) }}
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              {{ visit.technician?.name || '—' }}
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              <span :class="visitStatusBadge(visit.status)">{{ formatStatus(visit.status) }}</span>
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              <span :class="priorityBadge(visit.priority)">{{ formatStatus(visit.priority) }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-else
                      class="text-sm text-slate-400 italic bg-slate-50/50 rounded-xl p-4 text-center border border-slate-200/40">
                      No schedules found
                    </div>
                  </template>
                </div>

                <!-- Maintenance Schedule -->
                <div>
                  <h4 class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <span class="w-1 h-4 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></span>
                    Maintenance Schedule
                  </h4>
                  <div v-if="!schedulesLoaded" class="animate-pulse space-y-2">
                    <div v-for="i in 2" :key="i" class="h-10 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg">
                    </div>
                  </div>
                  <template v-else>
                    <div v-if="getPoolScheduleStatus(pool.id) === 'failed'"
                      class="text-sm text-rose-600 bg-rose-50/50 rounded-xl p-4 border border-rose-200/50">
                      <span class="font-medium">⚠️ Unable to load schedules.</span> Please try refreshing the page.
                    </div>
                    <div v-else-if="maintenanceVisits(pool.id).length" class="overflow-x-auto">
                      <table class="min-w-full text-sm">
                        <thead>
                          <tr class="border-b border-slate-200/60">
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Scheduled Date
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Type
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Technician
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Status
                            </th>
                            <th
                              class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              Priority
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="visit in maintenanceVisits(pool.id)" :key="visit.id"
                            class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap font-medium">
                              {{ formatDate(visit.scheduled_date) }}
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              {{ formatStatus(visit.work_order?.type) || 'Maintenance' }}
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              {{ visit.technician?.name || '—' }}
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              <span :class="visitStatusBadge(visit.status)">{{ formatStatus(visit.status) }}</span>
                            </td>
                            <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                              <span :class="priorityBadge(visit.priority)">{{ formatStatus(visit.priority) }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-else
                      class="text-sm text-slate-400 italic bg-slate-50/50 rounded-xl p-4 text-center border border-slate-200/40">
                      No maintenance schedules found
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agreements Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></span>
            Agreements
          </h2>
          <span class="text-sm text-slate-400">{{ customer?.agreements?.length || 0 }} agreements</span>
        </div>
        <div
          class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div v-if="loading.customer" class="p-6 animate-pulse space-y-3">
            <div v-for="i in 3" :key="i" class="h-12 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg"></div>
          </div>
          <div v-else-if="!customer?.agreements?.length" class="p-6">
            <div class="flex flex-col items-center justify-center py-16 text-center">
              <div
                class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-base font-medium text-slate-700">No agreements yet</p>
              <p class="text-sm text-slate-400 mt-1 max-w-xs">Create an agreement to set billing terms and service
                frequency.
              </p>
              <button @click="createAgreement"
                class="inline-flex items-center justify-center px-5 py-2.5 mt-6 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Agreement
              </button>
            </div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200/60 bg-slate-50/50">
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Agreement ID
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Frequency
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Price
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Billing Cycle
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Technician
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Start Date
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    End Date
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Auto Renew
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="agreement in customer.agreements" :key="agreement.id"
                  class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">#{{ agreement.id }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    <span :class="agreementStatusBadge(agreement.status)">{{ formatStatus(agreement.status) }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatStatus(agreement.frequency) }}
                  </td>
                  <td class="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                    {{ formatCurrency(agreement.price) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatStatus(agreement.billing_cycle) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ agreement.assigned_technician_id || '—' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatDate(agreement.start_date) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatDate(agreement.end_date) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    <span :class="agreement.auto_renew ? 'text-emerald-600' : 'text-slate-400'">
                      {{ agreement.auto_renew ? '✅ Yes' : '❌ No' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    <div class="relative" v-click-outside="() => closeMenu('agreement', agreement.id)">
                      <button @click="toggleMenu('agreement', agreement.id)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      <div v-if="openMenu.type === 'agreement' && openMenu.id === agreement.id"
                        class="absolute right-0 z-10 mt-1 w-40 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5">
                        <!-- <button @click="viewAgreement(agreement.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          View
                        </button> -->
                        <!-- <button @click="editAgreement(agreement.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          Edit
                        </button> -->
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Invoice Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-rose-500 to-rose-600 rounded-full"></span>
            Invoices
          </h2>
          <span class="text-sm text-slate-400">{{ customer?.invoices?.length || 0 }} invoices</span>
        </div>
        <div
          class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div v-if="loading.customer" class="p-6 animate-pulse space-y-3">
            <div v-for="i in 3" :key="i" class="h-12 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg"></div>
          </div>
          <div v-else-if="!customer?.invoices?.length" class="p-6">
            <div class="flex flex-col items-center justify-center py-16 text-center">
              <div
                class="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <p class="text-base font-medium text-slate-700">No invoices</p>
              <p class="text-sm text-slate-400 mt-1 max-w-xs">Invoices will appear here once they're generated.</p>
            </div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200/60 bg-slate-50/50">
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Invoice #
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Invoice Date
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Due Date
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Billing Period
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Total
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Amount Paid
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Balance Due
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Discount
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Tax
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in customer.invoices" :key="invoice.id"
                  class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {{ invoice.invoice_number }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatDate(invoice.invoice_date) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatDate(invoice.due_date) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ invoice.billing_period || '—' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    <span :class="invoiceStatusBadge(invoice.status)">{{ formatStatus(invoice.status) }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                    {{ formatCurrency(invoice.total) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-emerald-600 font-medium whitespace-nowrap">
                    {{ formatCurrency(invoice.amount_paid) }}
                  </td>
                  <td class="px-4 py-3 text-sm whitespace-nowrap"
                    :class="invoice.balance_due > 0 ? 'text-rose-600 font-semibold' : 'text-slate-700'">
                    {{ formatCurrency(invoice.balance_due) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatCurrency(invoice.discount) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatCurrency(invoice.tax) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    <div class="relative" v-click-outside="() => closeMenu('invoice', invoice.id)">
                      <button @click="toggleMenu('invoice', invoice.id)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      <div v-if="openMenu.type === 'invoice' && openMenu.id === invoice.id"
                        class="absolute right-0 z-10 mt-1 w-40 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5">
                        <button @click="viewInvoice(invoice.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          View Invoice
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Payments Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
            Payments
          </h2>
          <span class="text-sm text-slate-400">{{ customer?.payments?.length || 0 }} payments</span>
        </div>
        <div
          class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div v-if="loading.customer" class="p-6 animate-pulse space-y-3">
            <div v-for="i in 3" :key="i" class="h-12 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg"></div>
          </div>
          <div v-else-if="!customer?.payments?.length" class="p-6">
            <div class="flex flex-col items-center justify-center py-16 text-center">
              <div
                class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p class="text-base font-medium text-slate-700">No payments recorded</p>
              <p class="text-sm text-slate-400 mt-1 max-w-xs">Payments will be listed here once they're received.</p>
            </div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200/60 bg-slate-50/50">
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Amount
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Payment Method
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Transaction ID
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Created Date
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Paid At
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in customer.payments" :key="payment.id"
                  class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {{ formatCurrency(payment.amount) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatStatus(payment.method) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-500 font-mono text-xs whitespace-nowrap">
                    {{ payment.transaction_id || '—' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    <span :class="paymentStatusBadge(payment.status)">{{ formatStatus(payment.status) }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatDate(payment.created_at) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {{ formatDate(payment.paid_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Message Threads -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></span>
            Message Threads
          </h2>
          <span class="text-sm text-slate-400">{{ customer?.message_threads?.length || 0 }} threads</span>
        </div>
        <div v-if="loading.customer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
            <div class="p-5 space-y-4">
              <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-24"></div>
              <div class="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-32"></div>
              <div class="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-28"></div>
            </div>
          </div>
        </div>
        <div v-else-if="!customer?.message_threads?.length"
          class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300/60 shadow-sm hover:border-indigo-400/60 transition-all duration-300">
          <div
            class="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p class="text-base font-medium text-slate-700">No message threads</p>
          <p class="text-sm text-slate-400 mt-1 max-w-xs">Conversations with this customer will appear here.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="thread in customer.message_threads" :key="thread.id"
            class="group bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-200/60">
            <div class="p-5">
              <div class="flex items-start justify-between mb-4">
                <span class="text-sm font-semibold text-slate-800">Thread #{{ thread.id }}</span>
                <span :class="threadStatusBadge(thread.status)">{{ formatStatus(thread.status) }}</span>
              </div>
              <div class="space-y-1.5 text-sm text-slate-600">
                <p v-if="thread.work_order_id" class="flex items-center gap-1.5">
                  <span class="text-slate-400">🔧</span> Work Order: #{{ thread.work_order_id }}
                </p>
                <p v-if="thread.invoice_id" class="flex items-center gap-1.5">
                  <span class="text-slate-400">📄</span> Invoice: #{{ thread.invoice_id }}
                </p>
                <p class="text-slate-400 text-xs">Created {{ formatDate(thread.created_at) }}</p>
                <p class="text-slate-400 text-xs">Updated {{ formatDate(thread.updated_at) }}</p>
              </div>
              <button @click="openConversation(thread.id)"
                class="inline-flex items-center justify-center w-full px-4 py-2 mt-4 text-xs font-medium rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 group-hover:border-indigo-300">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12H9m6 0l-3-3m3 3l-3 3" />
                </svg>
                Open Conversation
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../../../services/api.js'

// --- Router ---
const route = useRoute()
const router = useRouter()

// --- State ---
const customer = ref(null)
const poolSchedules = ref({})
const poolScheduleErrors = ref({})
const openMenu = ref({ type: null, id: null })

const loading = ref({
  customer: true,
  schedules: false,
})

// --- KPI Stats ---
const kpiStats = computed(() => [
  { label: 'Pools', value: customer.value?.pools?.length ?? 0 },
  { label: 'Active Agreements', value: activeAgreementsCount.value },
  { label: 'Total Invoices', value: customer.value?.invoices?.length ?? 0 },
  { label: 'Payments', value: customer.value?.payments?.length ?? 0 },
  { label: 'Message Threads', value: customer.value?.message_threads?.length ?? 0 },
  // { label: 'Balance Due', value: formatCurrency(outstandingBalance.value) },
])

// --- Computed ---
const activeAgreementsCount = computed(() =>
  customer.value?.agreements?.filter(a => a.status === 'active').length ?? 0
)

const outstandingBalance = computed(() =>
  customer.value?.invoices?.reduce((sum, inv) => sum + (inv.balance_due > 0 ? inv.balance_due : 0), 0) ?? 0
)

// --- Customer Fields for Display ---
const customerFields = computed(() => ({
  contactName: { label: 'Contact Name', value: customer.value?.contact_name || '—' },
  companyName: { label: 'Company Name', value: customer.value?.company_name || '—' },
  customerType: { label: 'Customer Type', value: formatStatus(customer.value?.type) || '—' },
  email: { label: 'Email', value: customer.value?.email || '—' },
  phone: { label: 'Phone', value: customer.value?.phone || '—' },
  billingAddress: { label: 'Billing Address', value: customer.value?.billing_address || '—' },
  preferredContact: { label: 'Preferred Contact', value: formatStatus(customer.value?.preferred_contact) || '—' },
  status: { label: 'Status', value: customer.value?.status ? formatStatus(customer.value.status) : '—' },
  createdAt: { label: 'Created At', value: formatDate(customer.value?.created_at) },
  updatedAt: { label: 'Updated At', value: formatDate(customer.value?.updated_at) },
}))

// --- Pool Fields Helper ---
function getPoolFields(pool) {
  return {
    serviceAddress: { label: 'Service Address', value: pool.service_address || '—' },
    volume: { label: 'Volume (gallons)', value: pool.volume_gallons ? pool.volume_gallons + ' gal' : '—' },
    chemicalType: { label: 'Chemical Type', value: formatStatus(pool.chemical_type) || '—' },
    season: { label: 'Season', value: formatStatus(pool.season) || '—' },
    gateCode: { label: 'Gate Code', value: pool.gate_code || '—' },
    hasDog: { label: 'Has Dog', value: pool.has_dog ? 'Yes' : 'No' },
    accessNotes: { label: 'Access Notes', value: pool.access_notes || '—' },
  }
}

// --- Helpers ---
function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTimeRange(start, end) {
  if (!start && !end) return '—'
  const formatTime = (time) => {
    if (!time) return ''
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  const startStr = formatTime(start)
  const endStr = formatTime(end)
  if (startStr && endStr) return `${startStr} - ${endStr}`
  return startStr || endStr || '—'
}

function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

function formatStatus(val) {
  if (!val) return '—'
  return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// --- Badges ---
function customerStatusBadge(status) {
  const map = {
    active: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    suspended: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function agreementStatusBadge(status) {
  const map = {
    active: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    expired: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function invoiceStatusBadge(status) {
  const map = {
    paid: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    sent: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    overdue: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    draft: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function visitStatusBadge(status) {
  const map = {
    completed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    scheduled: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    in_progress: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function paymentStatusBadge(status) {
  const map = {
    completed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    failed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    refunded: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function priorityBadge(priority) {
  const map = {
    high: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    medium: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    low: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    urgent: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  }
  return map[priority] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function poolActiveBadge(active) {
  return active
    ? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    : 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function threadStatusBadge(status) {
  const map = {
    open: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    closed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    resolved: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

// --- Schedule helpers ---
const MAINTENANCE_TYPES = ['one_time', 'emergency', 'inspection', 'repair', 'installation']

function getPoolVisits(poolId) {
  return poolSchedules.value[poolId] ?? []
}

function getPoolScheduleStatus(poolId) {
  return poolScheduleErrors.value[poolId] ? 'failed' : 'success'
}

function routineVisits(poolId) {
  const visits = getPoolVisits(poolId)
  return visits.filter(v => v.work_order === null || v.work_order?.type === 'routine')
}

function maintenanceVisits(poolId) {
  const visits = getPoolVisits(poolId)
  return visits.filter(v => v.work_order !== null && MAINTENANCE_TYPES.includes(v.work_order?.type))
}

// --- Action menu ---
function toggleMenu(type, id) {
  if (openMenu.value.type == type && openMenu.value.id === id) {
    openMenu.value = { type: null, id: null }
  } else {
    openMenu.value = { type, id }
  }
}

function closeMenu(type, id) {
  if (openMenu.value.type === type && openMenu.value.id === id) {
    openMenu.value = { type: null, id: null }
  }
}

// --- Navigation Actions ---
function editCustomer() { }
function createAgreement() { router.push(`/provider/customer-service-agreements-create`) }
function addPool() { router.push(`/provider/pools-create`) }
function viewPool(id) { }
function editPool(id) { }
function viewAgreement(id) { }
function editAgreement(id) { }
function viewInvoice(id) { }
function openConversation(id) { }

// --- API calls ---
async function loadCustomer() {
  loading.value.customer = true
  try {
    const response = await api().get(
      `/customer-management/customers/${route.params.id}?with=pools,agreements,invoices,payments,message_threads`
    )
    const data = response.data?.data ?? response.data
    customer.value = data
  } catch (err) {
    const Swal = (await import('sweetalert2')).default
    Swal.fire({
      icon: 'error',
      title: 'Failed to load customer',
      text: err?.response?.data?.message ?? 'An unexpected error occurred.',
    })
  } finally {
    loading.value.customer = false
  }
}

const schedulesLoaded = computed(() => {
  if (!customer.value?.pools?.length) return false
  return customer.value.pools.every(pool => poolSchedules.value[pool.id] !== undefined)
})

async function loadSchedules() {
  const pools = customer.value?.pools
  if (!pools?.length) return

  loading.value.schedules = true
  poolScheduleErrors.value = {}

  try {
    const requests = pools.map(pool =>
      api().get(`/schedule-visit-management/visits?pool_id=${pool.id}`)
    )

    const results = await Promise.allSettled(requests)
    const schedules = {}

    results.forEach((result, index) => {
      const poolId = pools[index].id
      if (result.status === 'fulfilled') {
        const response = result.value
        const visitsData = response.data?.data ?? []
        schedules[poolId] = visitsData
        poolScheduleErrors.value[poolId] = false
      } else {
        schedules[poolId] = []
        poolScheduleErrors.value[poolId] = true
      }
    })

    poolSchedules.value = schedules
  } catch (err) {
    console.error('Unexpected error loading schedules:', err)
    pools.forEach(pool => {
      if (!poolScheduleErrors.value[pool.id]) {
        poolScheduleErrors.value[pool.id] = true
      }
    })
  } finally {
    loading.value.schedules = false
  }
}

async function loadAllData() {
  await loadCustomer()
  await loadSchedules()
}

// --- v-click-outside directive ---
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  },
}

// --- Watch for route changes ---
watch(() => route.params.id, () => {
  loadAllData()
})

// --- Init ---
onMounted(loadAllData)
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>