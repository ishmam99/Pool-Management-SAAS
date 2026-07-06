<template>
  <div class="min-h-screen bg-gray-50 font-inter">

    <!-- ===== PAGE HEADER ===== -->
    <div class="relative overflow-hidden bg-white border-b border-gray-200">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl"></div>
      </div>
      <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Equipment Register</h1>
              <p class="text-sm text-gray-500 mt-0.5">Manage pool equipment across your service network.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="exportExcel" class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span class="hidden sm:inline">Export</span>
            </button>
            <button @click="openAddModal" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add Equipment
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- ===== KPI CARDS ===== -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="loadingEquipment">
          <div v-for="i in 4" :key="i" class="rounded-2xl bg-white border border-gray-200 p-5 animate-pulse shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gray-200"></div>
              <div class="h-4 bg-gray-200 rounded-lg w-24"></div>
            </div>
            <div class="h-8 bg-gray-200 rounded-lg w-16 mb-1"></div>
            <div class="h-3 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </template>
        <template v-else>
          <!-- Total Equipment -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-100 hover:-translate-y-0.5 cursor-default">
            <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-cyan-100/30 blur-xl group-hover:bg-cyan-100/50 transition-all duration-300"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
                  <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-1">{{ kpi.total }}</div>
              <div class="text-xs font-medium text-gray-500">Total Equipment</div>
            </div>
          </div>
          <!-- Total Price -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5 cursor-default">
            <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-100/30 blur-xl group-hover:bg-blue-100/50 transition-all duration-300"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 border border-blue-200">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-1">${{ kpi.totalPrice.toLocaleString() }}</div>
              <div class="text-xs font-medium text-gray-500">Total Value</div>
            </div>
          </div>
          <!-- Components -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-0.5 cursor-default">
            <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-100/30 blur-xl group-hover:bg-emerald-100/50 transition-all duration-300"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-1">{{ kpi.totalComponents }}</div>
              <div class="text-xs font-medium text-gray-500">Total Components</div>
            </div>
          </div>
          <!-- Avg Components per Pool -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-0.5 cursor-default">
            <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-orange-100/30 blur-xl group-hover:bg-orange-100/50 transition-all duration-300"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 border border-orange-200">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-1">{{ kpi.avgComponents }}</div>
              <div class="text-xs font-medium text-gray-500">Avg Components per Pool</div>
            </div>
          </div>
        </template>
      </div>

      <!-- ===== FILTER BAR ===== -->
      <div class="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Search -->
          <div class="relative lg:col-span-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input v-model="filters.search" type="text" placeholder="Search pool, model, serial..." class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"/>
          </div>
          <!-- Pool -->
          <select v-model="filters.pool_id" @change="applyFilters" class="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
            <option value="">All Pools</option>
            <option v-for="pool in pools" :key="pool.id" :value="pool.id">{{ pool.name }}</option>
          </select>
          <!-- Manufacturer -->
          <select v-model="filters.manufacturer_id" @change="fetchModelsForFilter" class="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
            <option value="">All Manufacturers</option>
            <option v-for="m in manufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
          <!-- Equipment Model -->
          <select v-model="filters.equipment_model_id" class="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all" :disabled="!filters.manufacturer_id">
            <option value="">All Models</option>
            <option v-for="m in filterModels" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2 mt-3">
          <button @click="applyFilters" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            Apply Filters
          </button>
          <button @click="resetFilters" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            Reset
          </button>
          <span v-if="activeFilterCount > 0" class="ml-auto text-xs text-cyan-600 font-medium">{{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }} active</span>
        </div>
      </div>

      <!-- ===== TABLE ===== -->
      <!-- Skeleton -->
      <div v-if="loadingEquipment" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div class="bg-gray-50 border-b border-gray-200 px-5 py-3 animate-pulse">
          <div class="h-4 bg-gray-200 rounded-lg w-full"></div>
        </div>
        <div class="divide-y divide-gray-100 bg-white">
          <div v-for="i in 6" :key="i" class="px-5 py-4 animate-pulse">
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-xl bg-gray-200"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                <div class="h-3 bg-gray-200 rounded-lg w-1/5"></div>
              </div>
              <div class="hidden md:flex gap-6">
                <div class="h-4 bg-gray-200 rounded-lg w-20"></div>
                <div class="h-4 bg-gray-200 rounded-lg w-24"></div>
                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="equipment.length === 0" class="flex flex-col items-center justify-center py-24 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="relative mb-6">
          <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
          <div class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
            <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">No Equipment Found</h3>
        <p class="text-sm text-gray-500 text-center max-w-xs mb-6">There are no registered equipment sets yet. Add your first equipment set to get started.</p>
        <button @click="openAddModal" class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Add Equipment
        </button>
      </div>

      <!-- Data Table -->
      <div v-else class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div class="overflow-x-auto">
          <!-- Header -->
          <div class="bg-gray-50 border-b border-gray-200 px-5 py-3 min-w-[1100px]">
            <div class="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div class="col-span-1">ID</div>
              <div class="col-span-2">Pool</div>
              <div class="col-span-2">Manufacturer</div>
              <div class="col-span-2">Model</div>
              <div class="col-span-1">Components</div>
              <div class="col-span-1">Total Price</div>
              <div class="col-span-2">Installed Components</div>
              <div class="col-span-1 text-right">Actions</div>
            </div>
          </div>
          <!-- Body -->
          <div class="divide-y divide-gray-100 bg-white min-w-[1100px]">
            <div
              v-for="item in equipment"
              :key="item.id"
              class="group grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-gray-50 transition-all duration-200 border-l-2 border-transparent hover:border-cyan-500"
            >
              <!-- ID -->
              <div class="col-span-1">
                <span class="text-xs font-mono text-gray-400">#{{ String(item.id).padStart(4, '0') }}</span>
              </div>
              <!-- Pool -->
              <div class="col-span-2">
                <div v-if="item.pool" class="min-w-0">
                  <div class="text-sm font-medium text-gray-800 truncate">{{ item.pool.name }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ item.pool.customer?.contact_name }}</div>
                </div>
                <span v-else class="text-xs text-gray-400">—</span>
              </div>
              <!-- Manufacturer -->
              <div class="col-span-2">
                <span class="text-sm text-gray-700 truncate block">{{ item.manufacturer?.name || '—' }}</span>
              </div>
              <!-- Model -->
              <div class="col-span-2">
                <span class="text-sm text-gray-700 truncate block">{{ item.equipment_model?.name || '—' }}</span>
              </div>
              <!-- Components Count -->
              <div class="col-span-1">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 font-semibold text-sm border border-cyan-200">
                  {{ item.components?.length || 0 }}
                </span>
              </div>
              <!-- Total Price -->
              <div class="col-span-1">
                <span class="text-sm font-semibold text-gray-900">${{ calculateTotalPrice(item.components).toLocaleString() }}</span>
              </div>
              <!-- Installed Components -->
              <div class="col-span-2">
                <div class="flex flex-wrap gap-1">
                  <span v-for="comp in (item.components || []).slice(0, 3)" :key="comp.id" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {{ comp.component?.name || 'Component' }}
                  </span>
                  <span v-if="(item.components || []).length > 3" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                    +{{ (item.components || []).length - 3 }}
                  </span>
                </div>
              </div>
              <!-- Actions -->
              <div class="col-span-1 flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button @click="openViewModal(item)" class="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 hover:bg-cyan-100 hover:text-cyan-600 text-gray-400 border border-gray-200 hover:border-cyan-300 transition-all" title="View">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button @click="openEditModal(item)" class="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-600 text-gray-400 border border-gray-200 hover:border-amber-300 transition-all" title="Edit">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button @click="handleDelete(item.id)" class="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 hover:bg-rose-100 hover:text-rose-600 text-gray-400 border border-gray-200 hover:border-rose-300 transition-all" title="Delete">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== PAGINATION ===== -->
      <div v-if="pagination.total > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 text-sm text-gray-500">
          <span>Showing <span class="text-gray-900 font-medium">{{ paginationStart }}–{{ paginationEnd }}</span> of <span class="text-gray-900 font-medium">{{ pagination.total }}</span> equipment sets</span>
          <span class="w-px h-4 bg-gray-300"></span>
          <div class="flex items-center gap-2">
            <span>Per page:</span>
            <select v-model="perPage" @change="fetchEquipment(1)" class="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button @click="fetchEquipment(pagination.current_page - 1)" :disabled="pagination.current_page <= 1" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Prev
          </button>
          <div class="flex items-center gap-1 px-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="page !== '...' && fetchEquipment(page)"
              :class="['w-8 h-8 rounded-lg text-xs font-semibold transition-all', page === pagination.current_page ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : page === '...' ? 'text-gray-400 cursor-default' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100']"
            >{{ page }}</button>
          </div>
          <button @click="fetchEquipment(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Next
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== VIEW MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="viewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="viewModal = false"></div>
          <div class="relative w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
            <!-- Header -->
            <div class="relative bg-gradient-to-r from-cyan-50 via-blue-50 to-white px-6 py-5 border-b border-gray-200">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-100/30 to-transparent"></div>
              <div class="relative flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200">
                    <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">Equipment Set Details</h2>
                    <p class="text-sm text-gray-500 mt-0.5">{{ selectedItem?.equipment_model?.name || 'Equipment Set' }}</p>
                  </div>
                </div>
                <button @click="viewModal = false" class="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <!-- Pool Information -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pool Information</h3>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div class="text-xs text-gray-500 mb-1">Pool</div>
                    <div class="text-sm font-semibold text-gray-900">{{ selectedItem?.pool?.name || '—' }}</div>
                  </div>
                  <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div class="text-xs text-gray-500 mb-1">Customer</div>
                    <div class="text-sm font-semibold text-gray-900">{{ selectedItem?.pool?.customer?.contact_name || '—' }}</div>
                  </div>
                </div>
              </div>

              <!-- Manufacturer & Model -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Equipment Details</h3>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div class="text-xs text-gray-500 mb-1">Manufacturer</div>
                    <div class="text-sm font-semibold text-gray-900">{{ selectedItem?.manufacturer?.name || '—' }}</div>
                  </div>
                  <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div class="text-xs text-gray-500 mb-1">Equipment Model</div>
                    <div class="text-sm font-semibold text-gray-900">{{ selectedItem?.equipment_model?.name || '—' }}</div>
                  </div>
                </div>
              </div>

              <!-- Components -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-1 h-4 rounded-full bg-gradient-to-b from-purple-400 to-pink-500"></div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Components ({{ selectedItem?.components?.length || 0 }})</h3>
                </div>
                <div class="space-y-3">
                  <div v-for="comp in (selectedItem?.components || [])" :key="comp.id" class="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-sm font-bold text-gray-900">{{ comp.component?.name || 'Component' }}</h4>
                      <span class="text-xs font-semibold text-gray-500">${{ comp.component?.price?.toLocaleString() || '0' }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span class="text-gray-500">Serial Number:</span>
                        <span class="ml-1 font-mono text-gray-700">{{ comp.serial_number || '—' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Install Date:</span>
                        <span class="ml-1 text-gray-700">{{ formatDate(comp.install_date) }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Warranty Expiry:</span>
                        <span class="ml-1 text-gray-700">{{ formatDate(comp.warranty_expiry) }}</span>
                      </div>
                      <div class="col-span-2">
                        <span class="text-gray-500">Notes:</span>
                        <span class="ml-1 text-gray-700">{{ comp.notes || '—' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
              <button @click="openEditModal(selectedItem); viewModal = false" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Edit Equipment Set
              </button>
              <button @click="viewModal = false" class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== ADD / EDIT MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="editModal = false"></div>
          <div class="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-gray-900">{{ isAdding ? 'Add Equipment Set' : 'Edit Equipment Set' }}</h2>
                  <p class="text-xs text-gray-500 mt-0.5">{{ isAdding ? 'Register new equipment to a pool' : 'Update equipment set details' }}</p>
                </div>
                <button @click="editModal = false" class="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="p-6 overflow-y-auto max-h-[70vh] space-y-5">
              <!-- Step 1: Select Pool -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pool <span class="text-rose-500">*</span></label>
                <select v-model="form.pool_id" @change="onPoolChange" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
                  <option value="">Select pool...</option>
                  <option v-for="pool in pools" :key="pool.id" :value="pool.id">{{ pool.name }} - {{ pool.customer?.contact_name }}</option>
                </select>
              </div>

              <!-- Step 2: Select Manufacturer -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Manufacturer <span class="text-rose-500">*</span></label>
                <select v-model="form.manufacturer_id" @change="onManufacturerChange" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
                  <option value="">Select manufacturer...</option>
                  <option v-for="m in manufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>

              <!-- Step 3: Select Equipment Model -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Equipment Model <span class="text-rose-500">*</span></label>
                <select v-model="form.equipment_model_id" @change="onModelChange" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all" :disabled="!form.manufacturer_id">
                  <option value="">Select model...</option>
                  <option v-for="m in models" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>

              <!-- Step 4: Component Checklist -->
              <div v-if="form.equipment_model_id && components.length > 0">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Components</h3>
                </div>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <label v-for="comp in components" :key="comp.id" class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer">
                    <input type="checkbox" :value="comp.id" v-model="form.selected_components" class="mt-1 w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-900">{{ comp.name }}</span>
                        <span class="text-xs font-semibold text-gray-600">${{ comp.price?.toLocaleString() || '0' }}</span>
                      </div>
                      <p class="text-xs text-gray-500 truncate">{{ comp.default_information || 'No additional info' }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Step 5: Pool Specific Information for Selected Components -->
              <div v-if="form.selected_components.length > 0" class="space-y-4">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Component Details</h3>
                </div>
                <div v-for="compId in form.selected_components" :key="compId" class="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 class="text-sm font-bold text-gray-900 mb-2">{{ getComponentName(compId) }}</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Serial Number <span class="text-rose-500">*</span></label>
                      <input v-model="componentDetails[compId].serial_number" type="text" placeholder="Enter serial number" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Install Date <span class="text-rose-500">*</span></label>
                      <input v-model="componentDetails[compId].install_date" type="date" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Warranty Expiry</label>
                      <input v-model="componentDetails[compId].warranty_expiry" type="date" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all">
                    </div>
                    <div class="col-span-2">
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                      <textarea v-model="componentDetails[compId].notes" rows="2" placeholder="Additional notes..." class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
              <button @click="saveEquipment" :disabled="saving || !isFormValid" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5">
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {{ saving ? 'Saving...' : (isAdding ? 'Add Equipment Set' : 'Save Changes') }}
              </button>
              <button @click="editModal = false" class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import api from '../../../../../services/api.js'

// ===== STATE =====
const equipment = ref([])
const pools = ref([])
const manufacturers = ref([])
const models = ref([])
const components = ref([])
const filterModels = ref([])

const loadingEquipment = ref(false)
const saving = ref(false)
const viewModal = ref(false)
const editModal = ref(false)
const isAdding = ref(false)
const selectedItem = ref(null)
const perPage = ref(10)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
})

const filters = reactive({ 
  search: '', 
  pool_id: '', 
  manufacturer_id: '',
  equipment_model_id: ''
})

const form = reactive({
  id: null,
  pool_id: '',
  manufacturer_id: '',
  equipment_model_id: '',
  selected_components: [],
})

const componentDetails = reactive({})

// ===== COMPUTED =====
const kpi = computed(() => {
  let totalPrice = 0
  let totalComponents = 0
  const poolIds = new Set()
  
  equipment.value.forEach(item => {
    if (item.components) {
      totalComponents += item.components.length
      item.components.forEach(comp => {
        totalPrice += comp.component?.price || 0
      })
    }
    if (item.pool_id) poolIds.add(item.pool_id)
  })
  
  return {
    total: equipment.value.length,
    totalPrice,
    totalComponents,
    avgComponents: poolIds.size > 0 ? Math.round(totalComponents / poolIds.size) : 0
  }
})

const activeFilterCount = computed(() =>
  [filters.search, filters.pool_id, filters.manufacturer_id, filters.equipment_model_id].filter(Boolean).length
)

const paginationStart = computed(() => (pagination.value.current_page - 1) * pagination.value.per_page + 1)
const paginationEnd = computed(() => Math.min(pagination.value.current_page * pagination.value.per_page, pagination.value.total))

const visiblePages = computed(() => {
  const total = pagination.value.last_page
  const current = pagination.value.current_page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

const isFormValid = computed(() => {
  if (!form.pool_id || !form.manufacturer_id || !form.equipment_model_id || form.selected_components.length === 0) {
    return false
  }
  return form.selected_components.every(compId => {
    const details = componentDetails[compId]
    return details && details.serial_number && details.install_date
  })
})

// ===== API =====
async function fetchEquipment(page = 1) {
  loadingEquipment.value = true
  try {
    const params = { page, per_page: perPage.value, with: 'pool.customer,manufacturer,equipment_model,components.component' }
    if (filters.search) params.search = filters.search
    if (filters.pool_id) params.pool_id = filters.pool_id
    if (filters.manufacturer_id) params.manufacturer_id = filters.manufacturer_id
    if (filters.equipment_model_id) params.equipment_model_id = filters.equipment_model_id

    const res = await api().get('/equipment-management/equipment-sets', { params })
    const data = res.data
    equipment.value = data.data ?? data
    if (data.meta || data.current_page) {
      const meta = data.meta ?? data
      pagination.value = {
        current_page: meta.current_page ?? 1,
        last_page: meta.last_page ?? 1,
        total: meta.total ?? equipment.value.length,
        per_page: meta.per_page ?? perPage.value,
      }
    }
  } catch (e) {
    console.error('Failed to load equipment sets', e)
  } finally {
    loadingEquipment.value = false
  }
}

async function fetchPools() {
  try {
    const res = await api().get('/pool-management/pools?with=customer')
    pools.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
  } catch (e) {
    console.error('Failed to load pools', e)
  }
}

async function fetchManufacturers() {
  try {
    const res = await api().get('/equipment-management/manufacturers')
    manufacturers.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
  } catch (e) {
    console.error('Failed to load manufacturers', e)
  }
}

async function fetchModels(manufacturerId) {
  if (!manufacturerId) {
    models.value = []
    return
  }
  try {
    const res = await api().get(`/equipment-management/manufacturers/${manufacturerId}/models`)
    models.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
  } catch (e) {
    console.error('Failed to load models', e)
  }
}

async function fetchComponents(modelId) {
  if (!modelId) {
    components.value = []
    return
  }
  try {
    const res = await api().get(`/equipment-management/models/${modelId}/components`)
    components.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
  } catch (e) {
    console.error('Failed to load components', e)
  }
}

async function fetchModelsForFilter() {
  if (!filters.manufacturer_id) {
    filterModels.value = []
    return
  }
  try {
    const res = await api().get(`/equipment-management/manufacturers/${filters.manufacturer_id}/models`)
    filterModels.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
  } catch (e) {
    console.error('Failed to load models for filter', e)
  }
}

async function fetchEquipmentSet(id) {
  try {
    const res = await api().get(`/equipment-management/equipment-sets/${id}?with=pool.customer,manufacturer,equipment_model,components.component`)
    return res.data
  } catch (e) {
    console.error('Failed to load equipment set', e)
    return null
  }
}

async function saveEquipment() {
  saving.value = true
  try {
    const payload = {
      pool_id: form.pool_id,
      manufacturer_id: form.manufacturer_id,
      equipment_model_id: form.equipment_model_id,
      components: form.selected_components.map(compId => ({
        component_id: compId,
        serial_number: componentDetails[compId]?.serial_number || '',
        install_date: componentDetails[compId]?.install_date || '',
        warranty_expiry: componentDetails[compId]?.warranty_expiry || null,
        notes: componentDetails[compId]?.notes || '',
      }))
    }

    if (isAdding.value) {
      await api().post('/equipment-management/equipment-sets', payload)
    } else {
      await api().post(`/equipment-management/equipment-sets/${form.id}`, { ...payload, _method: 'PUT' })
    }
    
    editModal.value = false
    await fetchEquipment(pagination.value.current_page)
    Swal.fire({
      icon: 'success',
      title: isAdding.value ? 'Equipment Set Added' : 'Equipment Set Updated',
      text: isAdding.value ? 'Equipment set registered successfully.' : 'Equipment set updated successfully.',
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#22d3ee',
      confirmButtonColor: '#0891b2',
      timer: 2500,
      showConfirmButton: false,
    })
  } catch (e) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: e?.response?.data?.message ?? 'Something went wrong.', 
      background: '#ffffff', 
      color: '#1f2937', 
      confirmButtonColor: '#0891b2' 
    })
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  const result = await Swal.fire({
    title: 'Delete Equipment Set?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    background: '#ffffff',
    color: '#1f2937',
    iconColor: '#f43f5e',
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#9ca3af',
  })
  if (!result.isConfirmed) return
  try {
    await api().delete(`/equipment-management/equipment-sets/${id}`)
    await fetchEquipment(pagination.value.current_page)
    Swal.fire({ 
      icon: 'success', 
      title: 'Deleted', 
      text: 'Equipment set deleted successfully.', 
      background: '#ffffff', 
      color: '#1f2937', 
      confirmButtonColor: '#0891b2', 
      timer: 2000, 
      showConfirmButton: false 
    })
  } catch (e) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Failed to delete equipment set.', 
      background: '#ffffff', 
      color: '#1f2937', 
      confirmButtonColor: '#0891b2' 
    })
  }
}

// ===== MODAL HELPERS =====
function openAddModal() {
  isAdding.value = true
  resetForm()
  editModal.value = true
}

async function openEditModal(item) {
  isAdding.value = false
  const data = await fetchEquipmentSet(item.id)
  if (!data) return
  
  resetForm()
  form.id = data.id
  form.pool_id = data.pool_id
  form.manufacturer_id = data.manufacturer_id
  form.equipment_model_id = data.equipment_model_id
  
  await fetchModels(data.manufacturer_id)
  await fetchComponents(data.equipment_model_id)
  
  data.components?.forEach(comp => {
    form.selected_components.push(comp.component_id)
    componentDetails[comp.component_id] = {
      serial_number: comp.serial_number || '',
      install_date: comp.install_date || '',
      warranty_expiry: comp.warranty_expiry || '',
      notes: comp.notes || '',
    }
  })
  
  editModal.value = true
}

function openViewModal(item) {
  selectedItem.value = item
  viewModal.value = true
}

// ===== FORM HELPERS =====
function resetForm() {
  form.id = null
  form.pool_id = ''
  form.manufacturer_id = ''
  form.equipment_model_id = ''
  form.selected_components = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])
  models.value = []
  components.value = []
}

function onPoolChange() {
  // Pool changed - reset dependent fields
  form.manufacturer_id = ''
  form.equipment_model_id = ''
  form.selected_components = []
  models.value = []
  components.value = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])
}

function onManufacturerChange() {
  form.equipment_model_id = ''
  form.selected_components = []
  components.value = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])
  fetchModels(form.manufacturer_id)
}

function onModelChange() {
  form.selected_components = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])
  fetchComponents(form.equipment_model_id)
}

function getComponentName(compId) {
  const comp = components.value.find(c => c.id === compId)
  return comp?.name || 'Component'
}

function calculateTotalPrice(components) {
  if (!components) return 0
  return components.reduce((sum, comp) => sum + (comp.component?.price || 0), 0)
}

// ===== FILTERS =====
function applyFilters() { 
  fetchEquipment(1) 
}

function resetFilters() {
  Object.assign(filters, { search: '', pool_id: '', manufacturer_id: '', equipment_model_id: '' })
  filterModels.value = []
  fetchEquipment(1)
}

// ===== EXPORT =====
function exportExcel() {
  const rows = equipment.value.map(e => ({
    'ID': e.id,
    'Pool': e.pool?.name || '—',
    'Customer': e.pool?.customer?.contact_name || '—',
    'Manufacturer': e.manufacturer?.name || '—',
    'Equipment Model': e.equipment_model?.name || '—',
    'Components': (e.components || []).map(c => c.component?.name).join(', '),
    'Component Count': (e.components || []).length,
    'Total Price': `$${calculateTotalPrice(e.components).toLocaleString()}`,
    'Created Date': formatDate(e.created_at),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Equipment Sets')
  XLSX.writeFile(wb, `equipment-register-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// ===== HELPERS =====
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTypeLabel(type) {
  return type || '—'
}

function getTypeIconBg(type) {
  return 'bg-gradient-to-br from-cyan-500 to-blue-600'
}

// ===== LIFECYCLE =====
onMounted(() => {
  fetchEquipment()
  fetchPools()
  fetchManufacturers()
})

// Watch for manufacturer filter change to load models
watch(() => filters.manufacturer_id, (newVal) => {
  if (newVal) {
    fetchModelsForFilter()
  } else {
    filterModels.value = []
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }
.modal-enter-active, .modal-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(8px); }
</style>