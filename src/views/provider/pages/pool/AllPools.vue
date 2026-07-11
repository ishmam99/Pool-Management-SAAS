<template>
  <div class="min-h-screen bg-slate-50 font-inter">
    <!-- ===== PAGE HEADER ===== -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 border-b border-slate-200">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"></div>
        <div class="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl"></div>
      </div>

      <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <!-- Top row: title + actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">Pool Operations Center</h1>
                <span
                  class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              </div>
              <p class="text-sm text-slate-500 mt-0.5">Manage your pool portfolio and service operations</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button @click="handleRefresh"
              class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200 hover:border-slate-300 shadow-sm">
              <svg :class="['w-4 h-4', isRefreshing ? 'animate-spin' : '']" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline">Refresh</span>
            </button>
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200 hover:border-slate-300 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span class="hidden sm:inline">Export</span>
            </button>
            <button @click="openAddModal"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:-translate-y-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Pool
            </button>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <!-- Total Pools -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5 cursor-default">
            <div
              class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-400/10 blur-xl group-hover:bg-blue-400/20 transition-all duration-300">
            </div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-100 border border-blue-200">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                  </svg>
                </div>
                <span class="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7" />
                  </svg>
                  12%
                </span>
              </div>
              <div class="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">{{ stats.total }}</div>
              <div class="text-xs font-medium text-slate-500">Total Pools</div>
            </div>
          </div>

          <!-- Active Pools -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-0.5 cursor-default">
            <div
              class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-400/10 blur-xl group-hover:bg-emerald-400/20 transition-all duration-300">
            </div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div
                  class="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7" />
                  </svg>
                  8%
                </span>
              </div>
              <div class="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">{{ stats.active }}</div>
              <div class="text-xs font-medium text-slate-500">Active Pools</div>
            </div>
          </div>

          <!-- Inactive Pools -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 hover:border-rose-300 transition-all duration-300 hover:shadow-lg hover:shadow-rose-100 hover:-translate-y-0.5 cursor-default">
            <div
              class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-rose-400/10 blur-xl group-hover:bg-rose-400/20 transition-all duration-300">
            </div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-100 border border-rose-200">
                  <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="flex items-center gap-1 text-xs font-medium text-rose-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7-7-7" />
                  </svg>
                  3%
                </span>
              </div>
              <div class="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">{{ stats.inactive }}</div>
              <div class="text-xs font-medium text-slate-500">Inactive Pools</div>
            </div>
          </div>

          <!-- Equipment -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 hover:border-violet-300 transition-all duration-300 hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-0.5 cursor-default">
            <div
              class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-violet-400/10 blur-xl group-hover:bg-violet-400/20 transition-all duration-300">
            </div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-100 border border-violet-200">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </div>
                <span class="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7" />
                  </svg>
                  5%
                </span>
              </div>
              <div class="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">{{ stats.equipment }}</div>
              <div class="text-xs font-medium text-slate-500">Total Equipment</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- ===== FILTER BAR ===== -->
      <div class="sticky top-0 z-20 mb-5">
        <div class="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-3 shadow-lg shadow-slate-200/50">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="relative flex-1">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Search pools, customers..."
                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200" />
              <button v-if="searchQuery" @click="searchQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Filter Chips -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <button v-for="chip in filterChips" :key="chip.value" @click="setFilter(chip.value)" :class="[
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
                activeFilter === chip.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-slate-200'
              ]">
                <span v-if="chip.dot" :class="['w-1.5 h-1.5 rounded-full', chip.dot]"></span>
                {{ chip.label }}
              </button>

              <div v-if="activeFilterCount > 0" class="flex items-center gap-2 pl-1.5">
                <span class="w-px h-4 bg-slate-300"></span>
                <span class="text-xs text-slate-500">{{ activeFilterCount }} active</span>
                <button @click="clearFilters"
                  class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== LOADING SKELETON ===== -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="rounded-2xl bg-white border border-slate-200 p-4 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-200 rounded-lg w-1/4"></div>
              <div class="h-3 bg-slate-200 rounded-lg w-1/6"></div>
            </div>
            <div class="hidden md:flex gap-4">
              <div class="h-4 bg-slate-200 rounded-lg w-24"></div>
              <div class="h-4 bg-slate-200 rounded-lg w-16"></div>
              <div class="h-6 bg-slate-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== DESKTOP TABLE ===== -->
      <div v-else-if="filteredPools.length > 0" class="hidden md:block">
        <div class="rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-slate-200/50 bg-white">
          <!-- Table Header -->
          <div class="bg-slate-50 border-b border-slate-200 px-5 py-3">
            <div class="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div class="col-span-3">Pool</div>
              <div class="col-span-2">Customer</div>
              <div class="col-span-2">Chemical Type</div>
              <div class="col-span-1 text-right">Volume</div>
              <div class="col-span-1 text-center">Equipment</div>
              <div class="col-span-1 text-center">Status</div>
              <div class="col-span-2 text-right">Actions</div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="divide-y divide-slate-100">
            <div v-for="pool in paginatedPools" :key="pool.id" class="relative">
              <!-- Main Row -->
              <div
                class="group grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-slate-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-blue-500 cursor-pointer"
                @click="toggleRow(pool.id)">
                <!-- Pool -->
                <div class="col-span-3 flex items-center gap-3">
                  <div
                    class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200 flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-slate-800 truncate">{{ pool.label || pool.name }}</div>
                    <div class="text-xs text-slate-400 font-mono">#{{ pool.id }}</div>
                  </div>
                </div>

                <!-- Customer -->
                <div class="col-span-2 flex items-center gap-2">
                  <div
                    :class="['flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white flex-shrink-0', getAvatarColor(pool.customer?.contact_name)]">
                    {{ (pool.customer?.contact_name || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div class="text-sm text-slate-700 truncate">{{ pool.customer?.contact_name || 'Unknown' }}</div>
                </div>

                <!-- Chemical Type -->
                <div class="col-span-2">
                  <span
                    :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border', getChemicalStyle(pool.chemical_type || pool.chemicalType)]">
                    <span
                      :class="['w-1.5 h-1.5 rounded-full', getChemicalDot(pool.chemical_type || pool.chemicalType)]"></span>
                    {{ formatChemicalType(pool.chemical_type || pool.chemicalType) }}
                  </span>
                </div>

                <!-- Volume -->
                <div class="col-span-1 text-right">
                  <span class="text-sm font-semibold text-slate-700">{{ formatVolume(pool.volume_gallons || pool.volume)
                    }}</span>
                  <span class="text-xs text-slate-400 ml-0.5">gal</span>
                </div>

                <!-- Equipment -->
                <div class="col-span-1 flex justify-center">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    {{ pool.equipment?.length || 0 }}
                    <svg v-if="pool.equipment?.length"
                      :class="['w-3 h-3 transition-transform duration-200', expandedRows.has(pool.id) ? 'rotate-180' : '']"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                <!-- Status -->
                <div class="col-span-1 flex justify-center">
                  <span
                    :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusStyle(pool.is_active)]">
                    <span
                      :class="['w-1.5 h-1.5 rounded-full', pool.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                    {{ pool.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>

                <!-- Actions -->
                <div
                  class="col-span-2 flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  @click.stop>
                  <button @click="openViewModal(pool)"
                    class="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-500 border border-slate-200 hover:border-blue-300 transition-all duration-200"
                    title="View">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(pool)"
                    class="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-600 text-slate-500 border border-slate-200 hover:border-amber-300 transition-all duration-200"
                    title="Edit">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(pool)"
                    class="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 border border-slate-200 hover:border-rose-300 transition-all duration-200"
                    title="Delete">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Expanded Equipment Details -->
              <div v-if="expandedRows.has(pool.id) && pool.equipment?.length"
                class="col-span-12 px-5 py-4 bg-slate-50/80 border-t border-slate-100">
                <div class="flex items-center gap-2 mb-3">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment Details</span>
                  <span class="text-xs text-slate-400">({{ pool.equipment.length }} items)</span>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div v-for="eq in pool.equipment" :key="eq.id"
                    class="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">

                    <!-- Header: Brand, Model, Type, Status -->
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <div
                          :class="['flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0', getEquipmentBgColor(eq.type || eq.component?.type)]">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-semibold text-slate-800">{{ eq.manufacturer?.name ||
                              eq.component?.default_brand || 'N/A' }}</span>
                            <span class="text-xs text-slate-400">{{ eq.equipment_model?.name ||
                              eq.component?.default_model || 'N/A' }}</span>
                          </div>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span
                              class="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize bg-violet-50 text-violet-600 border border-violet-200 whitespace-nowrap">
                              {{ eq.component?.name || eq.type || 'N/A' }}
                            </span>
                            <span :class="[
                              'text-[10px] font-medium px-2 py-0.5 rounded-full capitalize border whitespace-nowrap',
                              eq.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                eq.status === 'inactive' ? 'bg-red-50 text-red-600 border-red-200' :
                                  'bg-amber-50 text-amber-600 border-amber-200'
                            ]">
                              {{ eq.status || 'N/A' }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span class="text-xs font-mono text-slate-400">#{{ eq.id }}</span>
                    </div>

                    <!-- Component Details -->
                    <div v-if="eq.component" class="mb-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                      <div class="flex items-center justify-between text-xs">
                        <div>
                          <span class="font-medium text-indigo-700">Component:</span>
                          <span class="text-indigo-900 ml-1 font-medium">{{ eq.component.name }}</span>
                        </div>
                        <span v-if="eq.component.is_required"
                          class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                          Required
                        </span>
                      </div>
                      <div v-if="eq.component.description" class="text-xs text-indigo-600 mt-0.5">
                        {{ eq.component.description }}
                      </div>
                      <div class="flex items-center gap-3 mt-1 text-[10px] text-indigo-500">
                        <span v-if="eq.component.default_brand">Brand: {{ eq.component.default_brand }}</span>
                        <span v-if="eq.component.default_model">Model: {{ eq.component.default_model }}</span>
                        <span v-if="eq.component.default_price">Price: ${{
                          parseFloat(eq.component.default_price).toFixed(2) }}</span>
                      </div>
                    </div>

                    <!-- Manufacturer Details -->
                    <div v-if="eq.manufacturer" class="mb-2 p-2 bg-slate-50 rounded-lg">
                      <div class="flex items-center gap-2 text-xs">
                        <span class="font-medium text-slate-600">Manufacturer:</span>
                        <span class="text-slate-800">{{ eq.manufacturer.name }}</span>
                  
                      </div>
                     
                    </div>

                    <!-- Equipment Model Details -->
                    <div v-if="eq.equipment_model" class="mb-2 text-xs">
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-slate-600">Model #:</span>
                        <span class="text-slate-800 font-mono">{{ eq.equipment_model.model_number || 'N/A' }}</span>
                        <span v-if="eq.equipment_model.release_year" class="text-slate-400">• Released: {{
                          eq.equipment_model.release_year }}</span>
                      </div>
                      <div v-if="eq.equipment_model.description" class="text-slate-500 mt-0.5">
                        {{ eq.equipment_model.description }}
                      </div>
                    </div>

                    <!-- Serial Number -->
                    <div class="text-xs text-slate-600 mb-2">
                      <span class="font-medium">Serial Number:</span>
                      <span class="font-mono ml-1">{{ eq.serial_number || '—' }}</span>
                    </div>

                    <!-- Dates -->
                    <div class="grid grid-cols-2 gap-2 mb-2 text-xs">
                      <div>
                        <span class="text-slate-500">Installed:</span>
                        <span class="text-slate-700 font-medium ml-1">{{ formatDate(eq.install_date) }}</span>
                      </div>
                      <div>
                        <span class="text-slate-500">Warranty:</span>
                        <span class="text-slate-700 font-medium ml-1">{{ formatDate(eq.warranty_expiry) }}</span>
                        <span v-if="eq.warranty_expiry && isExpired(eq.warranty_expiry)"
                          class="text-red-500 ml-1">⚠️</span>
                      </div>
                    </div>

                    <!-- Purchase Price -->
                    <div v-if="eq.purchase_price" class="text-xs mb-2">
                      <span class="text-slate-500">Purchase Price:</span>
                      <span class="text-slate-700 font-medium ml-1">${{ parseFloat(eq.purchase_price).toFixed(2)
                        }}</span>
                    </div>

                    <!-- Component ID -->
                    <div v-if="eq.component_id" class="text-xs text-slate-400 mb-2">
                      Component ID: {{ eq.component_id }}
                    </div>

                    <!-- Notes -->
                    <div v-if="eq.notes" class="mt-1 p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <div class="text-xs text-amber-700">
                        <span class="font-medium">📝 Notes:</span> {{ eq.notes }}
                      </div>
                    </div>

                    <!-- Timestamps -->
                    <div
                      class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Created: {{ formatDateTime(eq.created_at) }}</span>
                      <span v-if="eq.updated_at !== eq.created_at">Updated: {{ formatDateTime(eq.updated_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MOBILE CARDS ===== -->
      <div v-else-if="filteredPools.length > 0" class="md:hidden space-y-3">
        <div v-for="pool in paginatedPools" :key="pool.id"
          class="rounded-2xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition-all duration-200 shadow-sm"
          @click="toggleRow(pool.id)">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-bold text-slate-800">{{ pool.label || pool.name }}</div>
                <div class="text-xs text-slate-400 font-mono">#{{ pool.id }}</div>
              </div>
            </div>
            <span
              :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusStyle(pool.is_active)]">
              <span
                :class="['w-1.5 h-1.5 rounded-full', pool.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
              {{ pool.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div class="flex items-center gap-2 text-slate-500">
              <div
                :class="['flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white', getAvatarColor(pool.customer?.contact_name)]">
                {{ (pool.customer?.contact_name || 'U').charAt(0).toUpperCase() }}
              </div>
              {{ pool.customer?.contact_name || 'Unknown' }}
            </div>
            <div class="flex items-center justify-end">
              <span
                :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border', getChemicalStyle(pool.chemical_type || pool.chemicalType)]">
                {{ formatChemicalType(pool.chemical_type || pool.chemicalType) }}
              </span>
            </div>
            <div class="text-slate-500">
              <span class="font-semibold text-slate-700">{{ formatVolume(pool.volume_gallons || pool.volume) }}</span>
              gal
            </div>
            <div class="flex items-center justify-end gap-1 text-violet-600">

              <svg v-if="pool.equipment?.length"
                :class="['w-3 h-3 transition-transform duration-200', expandedRows.has(pool.id) ? 'rotate-180' : '']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Mobile Expanded Equipment -->
          <div v-if="expandedRows.has(pool.id) && pool.equipment?.length"
            class="mt-3 pt-3 border-t border-slate-100 space-y-2">
            <div v-for="eq in pool.equipment" :key="eq.id"
              class="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div
                :class="['flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0', getEquipmentBgColor(eq.type)]">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-semibold text-slate-800 truncate">{{ eq.brand }}</span>
                  <span class="text-[10px] text-slate-400 truncate">{{ eq.model }}</span>
                  <span
                    class="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded capitalize bg-violet-50 text-violet-600 border border-violet-200">{{
                    eq.type }}</span>
                </div>
                <div class="text-[10px] text-slate-500 flex items-center gap-1">
                  <span>SN: {{ eq.serial_number || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-slate-100" @click.stop>
            <button @click="openViewModal(pool)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
            <button @click="openEditModal(pool)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 border border-slate-200 hover:border-amber-300 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button @click="confirmDelete(pool)"
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-300 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ===== EMPTY STATE ===== -->
      <div v-else class="flex flex-col items-center justify-center py-20 px-4">
        <div class="relative mb-6">
          <div class="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl scale-150"></div>
          <div
            class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200">
            <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">
          {{ searchQuery || activeFilter !== 'all' ? 'No pools found' : 'No pools yet' }}
        </h3>
        <p class="text-sm text-slate-500 text-center max-w-xs mb-6">
          {{ searchQuery || activeFilter !== 'all'
            ? 'Try adjusting your search or filters to find what you\'re looking for.'
            : 'Add your first pool to start managing your service operations.'
          }}
        </p>
        <div class="flex items-center gap-3">
          <button v-if="searchQuery || activeFilter !== 'all'" @click="clearFilters"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
            Clear Filters
          </button>
          <button @click="openAddModal"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Pool
          </button>
        </div>
      </div>

      <!-- ===== PAGINATION ===== -->
      <div v-if="filteredPools.length > 0" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 text-sm text-slate-500">
          <span>Showing <span class="text-slate-700 font-medium">{{ paginationStart }}–{{ paginationEnd }}</span> of
            <span class="text-slate-700 font-medium">{{ filteredPools.length }}</span> pools</span>
          <span class="w-px h-4 bg-slate-300"></span>
          <div class="flex items-center gap-2">
            <span>Per page:</span>
            <select v-model="perPage"
              class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div class="flex items-center gap-1 px-2">
            <button v-for="page in visiblePages" :key="page" @click="page !== '...' && (currentPage = page)" :class="[
              'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
              page === currentPage
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : page === '...'
                  ? 'text-slate-400 cursor-default'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            ]">{{ page }}</button>
          </div>

          <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
            Next
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== VIEW MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="viewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="viewModal = false"></div>
          <div
            class="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
            <!-- Modal Header -->
            <div class="relative bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5 border-b border-slate-200">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-200">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-slate-800">{{ selectedPool?.label || selectedPool?.name }}</h2>
                    <div class="flex items-center gap-3 mt-1">
                      <span class="text-xs text-slate-400 font-mono">#{{ selectedPool?.id }}</span>
                      <span
                        :class="['inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', getStatusStyle(selectedPool?.is_active)]">
                        <span
                          :class="['w-1.5 h-1.5 rounded-full', selectedPool?.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                        {{ selectedPool?.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                  </div>
                </div>
                <button @click="viewModal = false"
                  class="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <!-- Customer Info -->
              <div class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div
                  :class="['flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white', getAvatarColor(selectedPool?.customer?.contact_name || '')]">
                  {{ (selectedPool?.customer?.contact_name || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-xs text-slate-500 font-medium">Customer</div>
                  <div class="text-sm font-semibold text-slate-800">{{ selectedPool?.customer?.contact_name || 'Unknown'
                    }}</div>
                </div>
              </div>

              <!-- Info Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Chemical Type -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                    </svg>
                    <span class="text-xs text-slate-500 font-medium">Chemical Type</span>
                  </div>
                  <span
                    :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border', getChemicalStyle(selectedPool?.chemical_type || selectedPool?.chemicalType)]">
                    <span
                      :class="['w-1.5 h-1.5 rounded-full', getChemicalDot(selectedPool?.chemical_type || selectedPool?.chemicalType)]"></span>
                    {{ formatChemicalType(selectedPool?.chemical_type || selectedPool?.chemicalType) }}
                  </span>
                </div>

                <!-- Pool Volume -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span class="text-xs text-slate-500 font-medium">Pool Volume</span>
                  </div>
                  <div class="text-lg font-bold text-slate-800">{{ formatVolume(selectedPool?.volume_gallons ||
                    selectedPool?.volume) }} <span class="text-sm font-normal text-slate-500">gallons</span></div>
                </div>

                <!-- Equipment -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <span class="text-xs text-slate-500 font-medium">Equipment Count</span>
                  </div>
                  <div class="text-lg font-bold text-violet-700">{{ selectedPool?.equipment?.length || 0 }} <span
                      class="text-sm font-normal text-slate-500">items</span></div>
                </div>

                <!-- Season -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs text-slate-500 font-medium">Season</span>
                  </div>
                  <div class="text-sm font-semibold text-slate-800">{{ formatSeason(selectedPool?.season) }}</div>
                </div>
              </div>

              <!-- Address -->
              <div v-if="selectedPool?.service_address" class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-xs text-slate-500 font-medium">Service Address</span>
                </div>
                <div class="text-sm font-semibold text-slate-800">{{ selectedPool.service_address }}</div>
              </div>

              <!-- Access Info -->
              <div v-if="selectedPool?.gate_code || selectedPool?.access_notes"
                class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-if="selectedPool?.gate_code" class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span class="text-xs text-slate-500 font-medium">Gate Code</span>
                  </div>
                  <div class="text-sm font-semibold text-slate-800 font-mono">{{ selectedPool.gate_code }}</div>
                </div>
                <div v-if="selectedPool?.has_dog !== undefined"
                  class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span class="text-xs text-slate-500 font-medium">Dog on Property</span>
                  </div>
                  <div class="text-sm font-semibold text-slate-800">{{ selectedPool.has_dog ? 'Yes' : 'No' }}</div>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="selectedPool?.access_notes" class="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="text-xs text-amber-600 font-medium">Access Notes</span>
                </div>
                <div class="text-sm text-slate-700">{{ selectedPool.access_notes }}</div>
              </div>

              <!-- Equipment List in View Modal -->
              <div v-if="selectedPool?.equipment?.length > 0" class="mt-2">
                <div class="flex items-center gap-2 mb-3">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <h4 class="text-sm font-bold text-slate-700">Equipment Details</h4>
                  <span class="text-xs text-slate-400">({{ selectedPool.equipment.length }} items)</span>
                </div>

                <div class="space-y-2">
                  <div v-for="eq in selectedPool.equipment" :key="eq.id"
                    class="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div
                      :class="['flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0', getEquipmentBgColor(eq.type)]">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold text-slate-800">{{ eq.brand }}</span>
                        <span class="text-xs text-slate-400">{{ eq.model }}</span>
                        <span
                          class="ml-auto text-xs font-medium px-2 py-0.5 rounded-full capitalize bg-violet-50 text-violet-600 border border-violet-200">{{
                          eq.type }}</span>
                      </div>
                      <div class="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span>SN: <span class="font-mono text-slate-600">{{ eq.serial_number || '—' }}</span></span>
                        <span>•</span>
                        <span>Installed: {{ formatDate(eq.install_date) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="p-4 text-center rounded-xl bg-slate-50 border border-slate-200">
                <p class="text-sm text-slate-500">No equipment registered for this pool</p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button @click="openEditModal(selectedPool); viewModal = false"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Pool
              </button>
              <button @click="viewModal = false"
                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== EDIT / ADD MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="editModal = false"></div>
          <div class="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5 border-b border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-slate-800">{{ isAdding ? 'Add New Pool' : 'Edit Pool' }}</h2>
                  <p class="text-xs text-slate-500 mt-0.5">{{ isAdding ? 'Register a new pool in your network' : 'Update pool details and settings' }}</p>
                </div>
                <button @click="editModal = false"
                  class="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6 overflow-y-auto max-h-[70vh] space-y-5">
              <!-- Pool Information -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pool Information</h3>
                </div>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Pool Name <span
                        class="text-rose-500">*</span></label>
                    <input v-model="editForm.label" type="text" placeholder="e.g. Lakeside Community Pool"
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold text-slate-600 mb-1.5">Pool Volume (gal)</label>
                      <input v-model="editForm.volume_gallons" type="number" placeholder="e.g. 25000"
                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Chemical Settings -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Chemical Settings</h3>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="col-span-2">
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Chemical Type</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button v-for="type in ['chlorine', 'salt', 'bromine']" :key="type"
                        @click="editForm.chemical_type = type" :class="[
                          'py-2 rounded-xl text-xs font-semibold border transition-all capitalize',
                          editForm.chemical_type === type
                            ? getChemicalStyle(type) + ' scale-105 shadow-md'
                            : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                        ]">{{ type }}</button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Equipment Count</label>
                    <input v-model="editForm.equipment" type="number" placeholder="0"
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Season</label>
                    <select v-model="editForm.season"
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all">
                      <option value="year_round">Year Round</option>
                      <option value="summer">Summer Only</option>
                      <option value="winter">Winter Only</option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                    <div class="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
                      <button v-for="s in [true, false]" :key="s" @click="editForm.is_active = s" :class="[
                        'flex-1 py-2.5 text-xs font-semibold transition-all',
                        editForm.is_active === s
                          ? s ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          : 'text-slate-500 hover:bg-slate-50'
                      ]">{{ s ? 'Active' : 'Inactive' }}</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Service Location -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  </div>
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Location & Access</h3>
                </div>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Service Address</label>
                    <input v-model="editForm.service_address" type="text" placeholder="123 Pool Street, City, State"
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold text-slate-600 mb-1.5">Gate Code</label>
                      <input v-model="editForm.gate_code" type="text" placeholder="e.g. 1234"
                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
                    </div>
                    <div class="flex items-end">
                      <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input v-model="editForm.has_dog" type="checkbox"
                          class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        Has Dog on Property
                      </label>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Access Notes</label>
                    <textarea v-model="editForm.access_notes" rows="2"
                      placeholder="Special instructions, access code, etc..."
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button @click="savePool" :disabled="!editForm.label"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-cyan-600 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isAdding ? 'Add Pool' : 'Save Changes' }}
              </button>
              <button @click="editModal = false"
                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== DELETE CONFIRMATION ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="deleteModal = false"></div>
          <div class="relative w-full max-w-sm bg-white border border-rose-200 rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-6 text-center">
              <div
                class="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 mx-auto mb-4">
                <svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-800 mb-2">Delete Pool?</h3>
              <p class="text-sm text-slate-500 mb-6">
                <span class="text-slate-700 font-semibold">{{ poolToDelete?.label || poolToDelete?.name }}</span> will
                be permanently removed. This cannot be undone.
              </p>
              <div class="flex gap-3">
                <button @click="deleteModal = false"
                  class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
                  Cancel
                </button>
                <button @click="deletePool"
                  class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-0.5">
                  Delete Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import api from "../../../../services/api.js"
import { useAuthStore } from '../../../../store/AuthStore.js'

// ===== API INSTANCE =====
const apiClient = api()
const authStore = useAuthStore()
// ===== STATE =====
const pools = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const isLoading = ref(false)
const isRefreshing = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const expandedRows = ref(new Set())

const viewModal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)
const selectedPool = ref(null)
const poolToDelete = ref(null)
const isAdding = ref(false)

const props = defineProps({
  pool: {
    type: Object,
    required: true
  },
  expandedRows: {
    type: Set,
    required: true
  }
})



const formatDateTime = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isExpired = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}



const editForm = reactive({
  id: null,
  label: '',
  customer: '',
  chemical_type: 'chlorine',
  volume_gallons: '',
  equipment: 0,
  is_active: true,
  service_address: '',
  access_notes: '',
  gate_code: '',
  has_dog: false,
  season: 'year_round'
})

// ===== FILTER CHIPS =====
const filterChips = [
  { label: 'All Pools', value: 'all' },
  { label: 'Active', value: 'active', dot: 'bg-emerald-500' },
  { label: 'Inactive', value: 'inactive', dot: 'bg-rose-500' },
  { label: 'Chlorine', value: 'chlorine' },
  { label: 'Salt', value: 'salt' },
  { label: 'Bromine', value: 'bromine' },
]

// ===== COMPUTED =====
const stats = computed(() => ({
  total: pools.value.length,
  active: pools.value.filter(p => p.is_active).length,
  inactive: pools.value.filter(p => !p.is_active).length,
  equipment: pools.value.reduce((sum, p) => sum + (p.equipment?.length || 0), 0),
}))

const filteredPools = computed(() => {
  let list = pools.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      (p.label || p.name || '').toLowerCase().includes(q) ||
      (p.customer?.contact_name || '').toLowerCase().includes(q)
    )
  }
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'active') {
      list = list.filter(p => p.is_active === true)
    } else if (activeFilter.value === 'inactive') {
      list = list.filter(p => p.is_active === false)
    } else {
      list = list.filter(p => p.chemical_type === activeFilter.value)
    }
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPools.value.length / perPage.value)))
const paginationStart = computed(() => (currentPage.value - 1) * perPage.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * perPage.value, filteredPools.value.length))
const paginatedPools = computed(() => filteredPools.value.slice(paginationStart.value - 1, paginationEnd.value))

const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (activeFilter.value !== 'all') count++
  return count
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

// ===== TOGGLE ROW =====
function toggleRow(id) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}



// ===== API METHODS =====

// Get all pools
const fetchPools = async () => {
  try {
    const base = '/pool-management/pools-advance?with=equipment.manufacturer,equipment.component,equipment.equipmentModel,customer';
    const url = authStore.authType === 'admin' ? `${base}&tenant_id=${authStore.tenantId}` : base;
    const { data } = await apiClient.get(url);
    return data.data || data;
  } catch (error) {
    console.error('Error fetching pools:', error);
    throw error;
  }
};

// Create new pool
async function createPool(data) {
  try {
    const response = await apiClient.post('/pool-management/pools', data)
    return response.data || response
  } catch (error) {
    console.error('Error creating pool:', error)
    throw error
  }
}

// Update pool
async function updatePool(id, data) {
  try {
    const response = await apiClient.post(`/pool-management/pools/${id}`, data)
    return response.data || response
  } catch (error) {
    console.error('Error updating pool:', error)
    throw error
  }
}

// Delete pool
async function deletePoolApi(id) {
  try {
    const response = await apiClient.delete(`/pool-management/pools/${id}`)
    return response.data || response
  } catch (error) {
    console.error('Error deleting pool:', error)
    throw error
  }
}

// ===== LOAD DATA =====
async function loadPools() {
  try {
    isLoading.value = true
    const data = await fetchPools()
    pools.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to load pools from API:', error)
    pools.value = []
  } finally {
    isLoading.value = false
  }
}

// ===== UI METHODS =====

function setFilter(val) {
  activeFilter.value = val
  currentPage.value = 1
}

function clearFilters() {
  searchQuery.value = ''
  activeFilter.value = 'all'
  currentPage.value = 1
}

async function handleRefresh() {
  isRefreshing.value = true
  await loadPools()
  isRefreshing.value = false
}

function openViewModal(pool) {
  selectedPool.value = pool
  viewModal.value = true
}

function openEditModal(pool) {
  isAdding.value = false
  if (pool) {
    Object.assign(editForm, {
      ...pool,
      label: pool.label || pool.name || '',
      customer: pool.customer?.contact_name || '',
      chemical_type: pool.chemical_type || pool.chemicalType || 'chlorine',
      volume_gallons: pool.volume_gallons || pool.volume || '',
      equipment: pool.equipment?.length || 0,
      is_active: pool.is_active !== undefined ? pool.is_active : true,
      service_address: pool.service_address || pool.address || '',
      access_notes: pool.access_notes || pool.notes || '',
      gate_code: pool.gate_code || '',
      has_dog: pool.has_dog || false,
      season: pool.season || 'year_round'
    })
  }
  editModal.value = true
}

function openAddModal() {
  isAdding.value = true
  Object.assign(editForm, {
    id: null,
    label: '',
    customer: '',
    chemical_type: 'chlorine',
    volume_gallons: '',
    equipment: 0,
    is_active: true,
    service_address: '',
    access_notes: '',
    gate_code: '',
    has_dog: false,
    season: 'year_round'
  })
  editModal.value = true
}

async function savePool() {
  try {
    isLoading.value = true

    const poolData = {
      label: editForm.label,
      customer: editForm.customer,
      service_address: editForm.service_address,
      access_notes: editForm.access_notes,
      gate_code: editForm.gate_code,
      has_dog: editForm.has_dog == true ? 1 : 0,
      volume_gallons: Number(editForm.volume_gallons) || 0,
      chemical_type: editForm.chemical_type,
      season: editForm.season,
      is_active: editForm.is_active == true ? 1 : 0,
      equipment: Number(editForm.equipment) || 0,
      _method: "PUT"
    }

    if (isAdding.value) {
      const newPool = await createPool(poolData)
      pools.value.push(newPool)
    } else {
      await updatePool(editForm.id, poolData)
      await loadPools()
    }

    editModal.value = false
  } catch (error) {
    console.error('Error saving pool:', error)
    alert('Failed to save pool. Please try again.')
  } finally {
    isLoading.value = false
  }
}

function confirmDelete(pool) {
  poolToDelete.value = pool
  deleteModal.value = true
}

async function deletePool() {
  try {
    isLoading.value = true
    await deletePoolApi(poolToDelete.value.id)
    pools.value = pools.value.filter(p => p.id !== poolToDelete.value.id)
    deleteModal.value = false
    poolToDelete.value = null
  } catch (error) {
    console.error('Error deleting pool:', error)
    alert('Failed to delete pool. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// ===== STYLE HELPERS =====
function getStatusStyle(isActive) {
  return isActive !== undefined && isActive
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-rose-50 text-rose-700 border-rose-200'
}

function getChemicalStyle(type) {
  const map = {
    chlorine: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    salt: 'bg-blue-50 text-blue-700 border-blue-200',
    bromine: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return map[type] || 'bg-slate-50 text-slate-700 border-slate-200'
}

function getChemicalDot(type) {
  const map = { chlorine: 'bg-cyan-500', salt: 'bg-blue-500', bromine: 'bg-amber-500' }
  return map[type] || 'bg-slate-500'
}

function getAvatarColor(name) {
  const colors = ['bg-violet-600', 'bg-blue-600', 'bg-cyan-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-pink-600', 'bg-indigo-600']
  return colors[(name?.charCodeAt(0) || 0) % colors.length]
}

function getEquipmentBgColor(type) {
  const map = {
    pump: 'bg-blue-500',
    filter: 'bg-emerald-500',
    heater: 'bg-amber-500',
    other: 'bg-violet-500'
  }
  return map[type] || 'bg-slate-500'
}

function formatVolume(v) {
  return v ? Number(v).toLocaleString() : '—'
}

function formatChemicalType(type) {
  if (!type) return 'Unknown'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatSeason(season) {
  if (!season) return 'Unknown'
  const map = {
    year_round: 'Year Round',
    summer: 'Summer Only',
    winter: 'Winter Only'
  }
  return map[season] || season.charAt(0).toUpperCase() + season.slice(1)
}

function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

watch(() => authStore.tenantId, () => {
  fetchPools();
})

// ===== LIFECYCLE =====
onMounted(() => {
  loadPools()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
}
</style>