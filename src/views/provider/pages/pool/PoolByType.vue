<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-800">Pools By Type</h1>
        <p class="mt-1 text-sm text-slate-500">
          Analyze and manage pools based on residential, commercial, and specialty categories.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
        <button
          class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40 hover:scale-[1.02]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Pool
        </button>
      </div>
    </div>

    <!-- Loading State for Summary Cards -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-2xl bg-white p-6 shadow-sm">
        <div class="h-8 w-16 rounded bg-slate-200"></div>
        <div class="mt-2 h-4 w-24 rounded bg-slate-200"></div>
        <div class="mt-4 h-6 w-12 rounded bg-slate-200"></div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div
        class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-slate-800">{{ summaryCards.totalPools }}</span>
          <div class="rounded-xl bg-blue-50 p-2 text-blue-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16" />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-sm text-slate-500">Total Pools</p>
        <div class="mt-3 h-1 w-full rounded-full bg-slate-100">
          <div class="h-1 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
        </div>
      </div>

      <div
        class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-emerald-600">{{ summaryCards.residential }}</span>
          <div class="rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-sm text-slate-500">Residential</p>
        <div class="mt-3 h-1 w-full rounded-full bg-slate-100">
          <div class="h-1 w-[78.5%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
        </div>
      </div>

      <div
        class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-purple-600">{{ summaryCards.commercial }}</span>
          <div class="rounded-xl bg-purple-50 p-2 text-purple-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-sm text-slate-500">Commercial</p>
        <div class="mt-3 h-1 w-full rounded-full bg-slate-100">
          <div class="h-1 w-[15%] rounded-full bg-gradient-to-r from-purple-400 to-purple-500"></div>
        </div>
      </div>

      <div
        class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-cyan-600">{{ summaryCards.spa }}</span>
          <div class="rounded-xl bg-cyan-50 p-2 text-cyan-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-sm text-slate-500">Spa / Hot Tub</p>
        <div class="mt-3 h-1 w-full rounded-full bg-slate-100">
          <div class="h-1 w-[4.2%] rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"></div>
        </div>
      </div>

      <div
        class="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-amber-600">{{ summaryCards.hotel }}</span>
          <div class="rounded-xl bg-amber-50 p-2 text-amber-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-sm text-slate-500">Hotels & Resorts</p>
        <div class="mt-3 h-1 w-full rounded-full bg-slate-100">
          <div class="h-1 w-[2.3%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-700">Pool Distribution</h3>
        <div class="mt-4 space-y-3">
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Residential</span>
              <span class="font-medium text-slate-800">78%</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[78%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Commercial</span>
              <span class="font-medium text-slate-800">15%</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[15%] rounded-full bg-gradient-to-r from-purple-400 to-purple-500"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Spa</span>
              <span class="font-medium text-slate-800">4%</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[4%] rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Hotel</span>
              <span class="font-medium text-slate-800">3%</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[3%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-700">Revenue By Type</h3>
        <div class="mt-4 space-y-3">
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Residential</span>
              <span class="font-medium text-slate-800">$27,360</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[65%] rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Commercial</span>
              <span class="font-medium text-slate-800">$14,800</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[35%] rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Hotel</span>
              <span class="font-medium text-slate-800">$8,500</span>
            </div>
            <div class="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[20%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Cards -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold text-slate-800">Pool Type Overview</h2>
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="type in poolTypes"
          :key="type.type"
          class="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          @click="selectedCategory = type.type"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-2xl">
              {{ getIcon(type.type) }}
            </div>
            <span class="text-sm font-medium text-slate-400">{{ type.total }} Pools</span>
          </div>
          <h3 class="mt-3 text-lg font-semibold text-slate-800">{{ type.type }}</h3>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-slate-400">Active Agreements</p>
              <p class="text-sm font-semibold text-slate-700">{{ type.active_agreements }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Monthly Revenue</p>
              <p class="text-sm font-semibold text-emerald-600">${{ type.monthly_revenue.toLocaleString() }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs text-slate-400">Maintenance Due</p>
              <p class="text-sm font-semibold" :class="type.maintenance_due > 0 ? 'text-amber-600' : 'text-emerald-600'">
                {{ type.maintenance_due }}
              </p>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm font-medium text-blue-600 transition-all group-hover:translate-x-1">
            View Pools →
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Table Section -->
    <div class="mt-8">
      <div class="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search pools..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
        <select
          v-model="typeFilter"
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
        >
          <option v-for="option in filterOptions.types" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <select
          v-model="statusFilter"
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
        >
          <option v-for="option in filterOptions.statuses" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <select
          v-model="waterTypeFilter"
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
        >
          <option v-for="option in filterOptions.waterTypes" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- Table -->
      <div class="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div v-if="loading" class="animate-pulse">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 border-b border-slate-100 p-4">
            <div class="h-12 w-12 rounded-lg bg-slate-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-32 rounded bg-slate-200"></div>
              <div class="h-3 w-24 rounded bg-slate-200"></div>
            </div>
            <div class="h-8 w-20 rounded bg-slate-200"></div>
          </div>
        </div>

        <div v-else-if="filteredPools.length === 0" class="py-16 text-center">
          <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-slate-700">No pools found</h3>
          <p class="mt-1 text-sm text-slate-500">No pools match the selected category or filters.</p>
          <button class="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40">
            Add Pool
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/50">
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pool</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Location</th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Size</th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell">Water Type</th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Agreement</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Revenue</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="pool in paginatedPools"
                :key="pool.id"
                class="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
              >
                <td class="px-4 py-3">
                  <div>
                    <p class="font-medium text-slate-800">{{ pool.name }}</p>
                    <p class="text-xs text-slate-400">{{ pool.id }}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm text-slate-700">{{ pool.customer }}</p>
                    <p class="text-xs text-slate-400">{{ pool.location }}</p>
                  </div>
                </td>
                <td class="hidden px-4 py-3 text-sm text-slate-600 md:table-cell">{{ pool.location }}</td>
                <td class="hidden px-4 py-3 text-sm text-slate-600 lg:table-cell">{{ pool.size }}</td>
                <td class="hidden px-4 py-3 text-sm text-slate-600 xl:table-cell">{{ pool.water_type }}</td>
                <td class="hidden px-4 py-3 text-sm text-slate-600 lg:table-cell">{{ pool.agreement }}</td>
                <td class="px-4 py-3 text-sm font-medium text-emerald-600">${{ pool.monthly_value }}/mo</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block rounded-full px-3 py-1 text-xs font-medium"
                    :class="{
                      'bg-emerald-100 text-emerald-700': pool.status === 'Active',
                      'bg-amber-100 text-amber-700': pool.status === 'Maintenance Required',
                      'bg-slate-100 text-slate-500': pool.status === 'Inactive'
                    }"
                  >
                    {{ pool.status === 'Maintenance Required' ? 'Needs Attention' : pool.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="relative inline-block text-left">
                    <button
                      class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      @click="toggleDropdown(pool.id)"
                    >
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div
                      v-if="activeDropdown === pool.id"
                      class="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                    >
                      <div class="py-1">
                        <button
                          v-for="action in actions"
                          :key="action"
                          class="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          {{ action }}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredPools.length > 0" class="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <p class="text-sm text-slate-500">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredPools.length) }}
            of {{ filteredPools.length }} pools
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentPage === 1"
              class="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              @click="currentPage--"
            >
              Previous
            </button>
            <button
              :disabled="currentPage === totalPages"
              class="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer -->
    <div
      v-if="drawerOpen"
      class="fixed inset-0 z-50 overflow-hidden"
      @click.self="drawerOpen = false"
    >
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform">
        <div class="flex h-full flex-col">
          <div class="border-b border-slate-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-slate-800">{{ selectedCategory }} Pools</h2>
                <p class="text-sm text-slate-500">{{ filteredPools.length }} Total</p>
              </div>
              <button class="rounded-lg p-2 text-slate-400 hover:bg-slate-100" @click="drawerOpen = false">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs text-slate-400">Active Agreements</p>
                <p class="text-lg font-semibold text-slate-800">
                  {{ poolTypes.find(t => t.type === selectedCategory)?.active_agreements || 0 }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs text-slate-400">Monthly Revenue</p>
                <p class="text-lg font-semibold text-emerald-600">
                  ${{ poolTypes.find(t => t.type === selectedCategory)?.monthly_revenue.toLocaleString() || 0 }}
                </p>
              </div>
              <div class="col-span-2 rounded-xl bg-slate-50 p-4">
                <p class="text-xs text-slate-400">Average Pool Size</p>
                <p class="text-lg font-semibold text-slate-800">19,500 Gallons</p>
              </div>
            </div>
            <div class="mt-6 space-y-3">
              <div
                v-for="pool in filteredPools.slice(0, 5)"
                :key="pool.id"
                class="rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-slate-800">{{ pool.name }}</p>
                    <p class="text-sm text-slate-500">{{ pool.customer }}</p>
                  </div>
                  <span class="text-sm font-medium text-emerald-600">${{ pool.monthly_value }}/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Loading State
const loading = ref(false)

// Summary Cards Data
const summaryCards = {
  totalPools: 214,
  residential: 168,
  commercial: 32,
  spa: 9,
  hotel: 5
}

// Pool Types Data
const poolTypes = ref([
  {
    type: 'Residential',
    icon: 'Home',
    total: 168,
    active_agreements: 152,
    monthly_revenue: 27360,
    maintenance_due: 10
  },
  {
    type: 'Commercial',
    icon: 'Building',
    total: 32,
    active_agreements: 29,
    monthly_revenue: 14800,
    maintenance_due: 3
  },
  {
    type: 'Spa',
    icon: 'Waves',
    total: 9,
    active_agreements: 8,
    monthly_revenue: 1200,
    maintenance_due: 1
  },
  {
    type: 'Hotel',
    icon: 'Hotel',
    total: 5,
    active_agreements: 5,
    monthly_revenue: 8500,
    maintenance_due: 0
  }
])

// Pools Data
const pools = ref([
  {
    id: 'POOL-1001',
    name: 'Backyard Pool',
    customer: 'John Smith',
    type: 'Residential',
    location: 'Miami, FL',
    size: '18,000 Gallons',
    water_type: 'Chlorine',
    agreement: 'Weekly Pool Care',
    monthly_value: 180,
    status: 'Active'
  },
  {
    id: 'POOL-1002',
    name: 'Villa Main Pool',
    customer: 'Sarah Johnson',
    type: 'Residential',
    location: 'Miami, FL',
    size: '24,000 Gallons',
    water_type: 'Salt Water',
    agreement: 'Premium Pool Care',
    monthly_value: 320,
    status: 'Maintenance Required'
  },
  {
    id: 'POOL-1003',
    name: 'Ocean Resort Pool',
    customer: 'Ocean Resort',
    type: 'Hotel',
    location: 'Miami Beach, FL',
    size: '65,000 Gallons',
    water_type: 'Chlorine',
    agreement: 'Commercial Premium',
    monthly_value: 2500,
    status: 'Active'
  },
  {
    id: 'POOL-1004',
    name: 'Community Center Pool',
    customer: 'City of Miami',
    type: 'Commercial',
    location: 'Miami, FL',
    size: '42,000 Gallons',
    water_type: 'Chlorine',
    agreement: 'Commercial Standard',
    monthly_value: 1200,
    status: 'Active'
  },
  {
    id: 'POOL-1005',
    name: 'Luxury Spa',
    customer: 'Robert Chen',
    type: 'Spa',
    location: 'Coral Gables, FL',
    size: '2,500 Gallons',
    water_type: 'Salt Water',
    agreement: 'Spa Care Plus',
    monthly_value: 150,
    status: 'Active'
  }
])

// Filters
const searchQuery = ref('')
const typeFilter = ref('All')
const statusFilter = ref('All')
const waterTypeFilter = ref('All')
const selectedCategory = ref('Residential')
const drawerOpen = ref(false)
const activeDropdown = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Filter Options
const filterOptions = {
  types: ['All', 'Residential', 'Commercial', 'Spa', 'Hotel', 'Community'],
  statuses: ['All', 'Active', 'Inactive', 'Maintenance Required'],
  waterTypes: ['All', 'Chlorine', 'Salt Water']
}

// Actions
const actions = ['View Pool', 'Edit Pool', 'View Equipment', 'Service History', 'Create Maintenance', 'Delete Pool']

// Computed
const filteredPools = computed(() => {
  let result = pools.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(pool =>
      pool.name.toLowerCase().includes(query) ||
      pool.customer.toLowerCase().includes(query) ||
      pool.id.toLowerCase().includes(query)
    )
  }

  // Type filter
  if (typeFilter.value !== 'All') {
    result = result.filter(pool => pool.type === typeFilter.value)
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    result = result.filter(pool => pool.status === statusFilter.value)
  }

  // Water type filter
  if (waterTypeFilter.value !== 'All') {
    result = result.filter(pool => pool.water_type === waterTypeFilter.value)
  }

  // Category selection filter
  if (selectedCategory.value) {
    result = result.filter(pool => pool.type === selectedCategory.value)
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredPools.value.length / itemsPerPage.value)
})

const paginatedPools = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPools.value.slice(start, end)
})

// Methods
const getIcon = (type) => {
  const icons = {
    'Residential': '🏠',
    'Commercial': '🏢',
    'Spa': '🌊',
    'Hotel': '🏨',
    'Community': '🏘️'
  }
  return icons[type] || '🏊'
}

const toggleDropdown = (poolId) => {
  if (activeDropdown.value === poolId) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = poolId
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative.inline-block')) {
    activeDropdown.value = null
  }
})

// Watch for changes to update pagination
import { watch } from 'vue'
watch([searchQuery, typeFilter, statusFilter, waterTypeFilter, selectedCategory], () => {
  currentPage.value = 1
})

// API Integration (Commented)
/*
import axios from '@/services/api'

const fetchPoolsByType = async (type) => {
  loading.value = true
  try {
    const response = await axios.get(`/pools?type=${type}`)
    pools.value = response.data.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
*/
</script>

<style scoped>
/* Smooth transitions for dropdown and drawer */
.relative.inline-block,
.fixed.inset-0 {
  transition: all 0.2s ease;
}

/* Custom scrollbar for drawer */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>