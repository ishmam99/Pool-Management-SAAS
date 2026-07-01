<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    <!-- Header -->
    <header
      class="relative bg-gradient-to-r from-blue-600/5 via-blue-500/5 to-purple-600/5 border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-30 backdrop-blur-xl bg-white/80">
      <div v-if="loading.customer" class="animate-pulse">
        <div class="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-48 mb-2"></div>
        <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-72"></div>
      </div>
      <div v-else class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-start lg:items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <span class="text-xl font-bold text-white">{{ getInitials(customer?.contact_name) }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl lg:text-3xl font-bold text-slate-800">{{ customer?.contact_name }} - Quotation Stage
              </h1>
              <span :class="customerStatusBadge(customer?.status)" class="shadow-sm">{{ formatStatus(customer?.status)
                }}</span>
              <span :class="customerTypeBadge(customer?.type)" class="shadow-sm">{{ formatStatus(customer?.type)
                }}</span>
            </div>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span class="flex items-center gap-2 text-slate-600">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a :href="`tel:${customer?.phone}`"
                  class="text-blue-600 hover:text-blue-800 transition-colors font-medium">{{ customer?.phone }}</a>
              </span>
              <span class="flex items-center gap-2 text-slate-600">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a :href="`mailto:${customer?.email}`"
                  class="text-blue-600 hover:text-blue-800 transition-colors font-medium">{{ customer?.email }}</a>
              </span>
              <span class="flex items-center gap-2 text-slate-600">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="text-slate-500">Prefers <span class="font-medium text-slate-700">{{
                  formatStatus(customer?.preferred_contact) }}</span></span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 shrink-0">
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

    <div class="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            class="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 p-5 hover:border-blue-200/60 hover:scale-[1.01] cursor-default">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{{
                  stat.value }}</p>
              </div>
              <div
                class="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center group-hover:bg-blue-100/50 transition-colors duration-300">
                <component :is="stat.icon" class="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div
              class="mt-3 h-1 w-12 bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-full group-hover:from-blue-500/40 group-hover:w-16 transition-all duration-300">
            </div>
          </div>
        </template>
      </div>

      <!-- Customer Information -->
      <div
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div
          class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
          <h2 class="text-base font-semibold text-slate-800 flex items-center gap-2"><svg class="w-5 h-5 text-blue-500"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg> A. Customer Information</h2>
          <span class="text-xs text-slate-400">#{{ customer?.id }}</span>
        </div>
        <div v-if="loading.customer" class="p-6 animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 10" :key="i">
            <div class="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24 mb-1.5"></div>
            <div class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-36"></div>
          </div>
        </div>
        <div v-else class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <div v-for="(field, key) in customerFields" :key="key" class="flex flex-col gap-0.5"><span
              class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ field.label }}</span><span
              class="text-sm text-slate-900 font-medium">{{ field.value }}</span></div>
        </div>
      </div>

      <!-- Pools -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2"><svg class="w-5 h-5 text-emerald-500"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg> B. Pools</h2>
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
            class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p class="text-base font-medium text-slate-700">No Pools Yet</p>
          <p class="text-sm text-slate-400 mt-1 max-w-xs">Create your first pool to start scheduling maintenance.</p>
          <button @click="addPool"
            class="inline-flex items-center justify-center px-5 py-2.5 mt-6 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35"><svg
              class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>Add Pool</button>
        </div>
        <div v-else class="space-y-6">
          <div v-for="pool in customer.pools" :key="pool.id"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.005]">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-slate-800">{{ pool.label }}</h3>
                  <div class="flex items-center gap-2 mt-0.5"><span :class="poolActiveBadge(pool.is_active)"
                      class="shadow-sm">{{ pool.is_active ? 'Active' : 'Inactive' }}</span></div>
                </div>
              </div>
              <div class="flex gap-2"><button @click="editPool(pool.id)"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">Edit
                  Pool</button></div>
            </div>
            <div class="p-6">
              <div class="mb-6">
                <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg> Service Information
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  <div class="flex flex-col gap-0.5"><span
                      class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</span><span
                      class="text-sm text-slate-900 font-medium">{{ pool.service_address || '—' }}</span></div>
                  <div class="flex flex-col gap-0.5"><span
                      class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Season</span><span
                      class="text-sm text-slate-900 font-medium">{{ formatStatus(pool.season) || '—' }}</span></div>
                  <div class="flex flex-col gap-0.5"><span
                      class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chemical Type</span><span
                      class="text-sm text-slate-900 font-medium">{{ formatStatus(pool.chemical_type) || '—' }}</span>
                  </div>
                </div>
              </div>
              <div class="border-t border-slate-200/60 my-6"></div>
              <div class="mb-6">
                <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg> Pool Details
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  <div class="flex flex-col gap-0.5"><span
                      class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume</span><span
                      class="text-sm text-slate-900 font-medium">{{ pool.volume_gallons ? pool.volume_gallons + ' gal' :
                        '—'
                      }}</span></div>
                  <div class="flex flex-col gap-0.5"><span
                      class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gate Code</span><span
                      class="text-sm text-slate-900 font-medium">{{ pool.gate_code || '—' }}</span></div>
                  <div class="flex flex-col gap-0.5"><span
                      class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Has Dog</span><span
                      class="text-sm text-slate-900 font-medium">{{ pool.has_dog ? 'Yes' : 'No' }}</span></div>
                </div>
              </div>
              <div v-if="pool.access_notes" class="bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
                <div class="flex items-start gap-2"><svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div><span class="text-xs font-semibold text-amber-700 uppercase tracking-wider">Access Notes</span>
                    <p class="text-sm text-amber-800 mt-0.5">{{ pool.access_notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SERVICE SECTION                                              -->
      <!-- ============================================================ -->
      <div
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div
          class="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
          <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 class="text-base font-semibold text-slate-800">C. Service Information</h2>
        </div>
        <div class="bg-gray-50 p-4 md:p-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center gap-3 mb-2">
              <span v-if="agreement"
                class="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Agreement
                #{{ agreement.id }}</span>
              <span v-else class="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">No Agreement</span>
            </div>
            <p class="text-sm text-gray-600 mb-4 ml-11">Select the services that are included in this agreement.</p>

            <!-- Services Loading -->
            <div v-if="loading.services" class="space-y-4">
              <div v-for="i in 4" :key="i" class="flex items-center gap-3 animate-pulse">
                <div class="h-4 w-4 bg-slate-200 rounded"></div>
                <div class="h-5 bg-slate-200 rounded w-32"></div>
                <div class="h-4 bg-slate-200 rounded w-16 ml-auto"></div>
              </div>
            </div>

            <!-- Services Error -->
            <div v-else-if="servicesError" class="text-center py-8">
              <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-600">{{ servicesError }}</p>
              <button @click="loadServices"
                class="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">Retry</button>
            </div>

            <!-- Services List -->
            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="service in services" :key="service.id"
                  class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input type="checkbox" :id="`service-${service.id}`" :value="service.id" v-model="selectedServiceIds"
                    class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <label :for="`service-${service.id}`" class="flex-1 cursor-pointer text-sm text-gray-700">
                    {{ service.title }}
                  </label>
                  <span class="text-sm font-medium text-gray-600">${{ service.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Selected Services Summary -->
            <div v-if="selectedServiceIds.length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-2">Selected Services ({{ selectedServiceIds.length }})</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="id in selectedServiceIds" :key="id"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                  {{ getServiceTitle(id) }}
                </span>
              </div>
            </div>

            <!-- Service Button -->
            <div class="py-4 flex items-center justify-end">
              <button @click="saveServices" :disabled="submitting || selectedServiceIds.length === 0"
                class="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg w-1/4 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition">
                <i v-if="submitting" class="ri-loader-4-line animate-spin"></i>
                {{ serviceButtonLabel }}
              </button>
            </div>
            <p v-if="!agreement" class="text-center text-sm text-amber-600 mt-2">
              <i class="ri-information-line mr-1"></i> Create a Price agreement first to enable service selection.
            </p>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- PRICING SECTION                                              -->
      <!-- ============================================================ -->
      <div
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div
          class="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200/60">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0-1V7m0 1v1m0 1h.01M12 12h.01M12 12v.01M12 11h.01m-.01 2h.01M9 6h6M9 6c-.552 0-1 .448-1 1v10c0 .552.448 1 1 1h6c.552 0 1-.448 1-1V7c0-.552-.448-1-1-1M9 6h6" />
          </svg>
          <h2 class="text-base font-semibold text-slate-800">D. Pricing</h2>
        </div>
        <div class="bg-gray-50 p-4">
          <div class=" rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3 mb-4">
              <span v-if="agreement"
                class="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Active
                Agreement</span>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-5">
              <!-- Empty State -->
              <div v-if="selectedServiceIds.length === 0" class="p-8 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-base font-medium text-slate-700">No services selected</p>
                <p class="text-sm text-slate-400 mt-1">Select one or more services to calculate the agreement price.</p>
              </div>

              <!-- Invoice Summary -->
              <div v-else class="p-6">
                <div class="space-y-2">
                  <div v-for="service in selectedServices" :key="service.id"
                    class="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                    <span class="text-sm text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ service.title }}
                    </span>
                    <span class="text-sm font-medium text-gray-700">${{ service.price.toFixed(2) }}</span>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <!-- Subtotal -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Subtotal</span>
                    <span class="text-sm font-medium text-gray-700">${{ subtotal.toFixed(2) }}</span>
                  </div>

                  <!-- Agreement Term -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Agreement Term</span>
                    <span class="text-sm font-medium text-gray-700">{{ formatAgreementTerm(agreementTerm) }}</span>
                  </div>

                  <!-- Discount -->
                  <div v-if="discountPercentage > 0" class="flex justify-between items-center text-emerald-600">
                    <span class="text-sm">Discount ({{ discountPercentage }}%)</span>
                    <span class="text-sm font-medium">-${{ discountAmount.toFixed(2) }}</span>
                  </div>
                  <div v-else class="flex justify-between items-center text-gray-400">
                    <span class="text-sm">Discount</span>
                    <span class="text-sm font-medium">$0.00</span>
                  </div>

                  <!-- Grand Total -->
                  <div class="mt-4 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                    <span class="text-lg font-semibold text-slate-800">Grand Total</span>
                    <span class="text-2xl font-bold text-blue-600 transition-all duration-300">${{ grandTotal.toFixed(2)
                      }}</span>
                  </div>
                </div>
              </div>
            </div>


            <!-- Pricing Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Agreement Term *</label>
                <select v-model="form.agreement_term"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <option value="6_months">6 Months</option>
                  <option value="1_year">1 Year</option>
                  <option value="2_years">2 Years</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" v-model="form.price" step="0.01" min="0.01"
                    class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00" />
                </div>
                <p v-if="validationErrors.price" class="mt-2 text-sm text-red-600">{{ validationErrors.price[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Technician</label>
                <select v-model="form.assigned_technician_id"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <option value="">-- Unassigned --</option>
                  <option v-for="tech in technicians" :key="tech.id" :value="tech.id">{{ tech.name }}</option>
                </select>
                <p class="mt-2 text-sm text-gray-500">Optional: Leave unassigned to assign later</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input type="date" v-model="form.start_date"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <p v-if="validationErrors.start_date" class="mt-2 text-sm text-red-600">{{
                  validationErrors.start_date[0] }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="date" v-model="form.end_date"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <p v-if="validationErrors.end_date" class="mt-2 text-sm text-red-600">{{ validationErrors.end_date[0] }}
                </p>
              </div>
            </div>

            <!-- Auto Renew -->


            <!-- Pricing Button -->
            <div class="py-4 flex items-center justify-end">
              <button @click="savePricing" :disabled="submitting"
                class="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-lg w-1/4 text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <i v-if="submitting" class="ri-loader-4-line animate-spin"></i>
                {{ pricingButtonLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TERMS SECTION                                                -->
      <!-- ============================================================ -->
      <div class="term-templates-select">
        <div v-if="termsLoading" class="text-sm text-gray-500 flex items-center gap-2 py-4 justify-center">
          <i class="ri-loader-4-line animate-spin text-blue-500"></i> Loading templates...
        </div>
        <div v-else-if="error" class="text-sm text-red-500 flex items-center gap-2 py-4 justify-center">
          <i class="ri-error-warning-line"></i> {{ error }}
          <button @click="fetchTemplates" class="text-blue-500 underline hover:text-blue-700">Retry</button>
        </div>
        <div v-else>
          <!-- Current Selected Template Display from Agreement -->
          <div v-if="agreement && agreement.term_template_id"
            class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Current Template:</span>
              <span class="text-sm font-semibold text-blue-700">{{ getAgreementTemplateName() }}</span>
            </div>
            <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <div v-else-if="agreement && !agreement.term_template_id"
            class="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-sm font-medium text-gray-500">No template selected</span>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center cursor-pointer gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50"
              :class="{ 'border-blue-500 bg-blue-50/50': selectedTemplateId === '' }">
              <input type="radio" id="template-none" name="template-select" :value="''"
                :checked="selectedTemplateId === ''" @change="onChange($event)"
                :disabled="!agreement || termsSubmitting" class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <label for="template-none" class="text-sm text-gray-500 cursor-pointer flex-1"
                :class="{ 'cursor-not-allowed opacity-60': !agreement || termsSubmitting }">None selected</label>
            </div>
            <div v-for="template in templates" :key="template.id"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50"
              :class="{ 'border-blue-500 bg-blue-50/50': selectedTemplateId === template.id }">
              <input type="radio" :id="'template-' + template.id" name="template-select" :value="template.id"
                :checked="selectedTemplateId === template.id" @change="onChange($event)"
                :disabled="!agreement || termsSubmitting" class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <label :for="'template-' + template.id" class="text-sm text-gray-700 cursor-pointer flex-1"
                :class="{ 'cursor-not-allowed opacity-60': !agreement || termsSubmitting }">{{ template.name }}</label>
              <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mr-2">{{ template.terms_count || 0
                }}
                terms</span>
              <button type="button" @click.stop="openTermsModal(template)"
                class="text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-50 p-1.5 rounded-lg transition"
                title="Read terms">
                <i class="ri-file-list-3-line text-lg"></i> View terms
              </button>
            </div>
            <div v-if="templates.length === 0" class="text-sm text-gray-400 text-center py-6">
              <i class="ri-inbox-line text-3xl block mb-2 text-gray-300"></i>No active templates available.
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- FINAL AGREEMENT BUTTON                                       -->
      <!-- ============================================================ -->
      <div
        class="bg-gradient-to-br from-blue-600/5 via-blue-500/5 to-purple-600/5 rounded-2xl border border-blue-200/50 shadow-sm overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800">Ready to Create Agreement</h3>
                <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Pricing
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Services
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Terms
                  </span>
                </div>
              </div>
            </div>

            <!-- Final Button Logic -->
            <button @click="activateAgreement"
              :disabled="!agreement || agreement.status === 'active' || submittingAgreement"
              class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[200px]">
              <svg v-if="submittingAgreement" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span v-else-if="agreement && agreement.status === 'active'">✓ Agreement Created</span>
              <span v-else>Create Agreement</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeModal">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] shadow-2xl overflow-hidden animate-fadeIn">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i class="ri-file-text-line text-blue-600"></i>
            {{ selectedTemplate?.name || 'Terms & Conditions' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div v-if="selectedTemplate?.content?.length" class="space-y-3">
            <div v-for="(term, idx) in selectedTemplate.content" :key="idx" class="flex gap-3">
              <span class="text-blue-600 font-medium text-sm">{{ idx + 1 }}.</span>
              <p class="text-gray-700 text-sm leading-relaxed">{{ term }}</p>
            </div>
          </div>
          <div v-else class="text-gray-400 text-center py-8">
            <i class="ri-file-line text-4xl block mb-2"></i>No terms defined for this template.
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button @click="closeModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../../../../services/api.js'
import Swal from 'sweetalert2'

// ─── Router ──────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()

// ─── Customer & Loading ────────────────────────────────────
const customer = ref(null)
const loading = ref({ customer: true, services: true })

// ─── Services ──────────────────────────────────────────────
const services = ref([])
const servicesError = ref(null)
const selectedServiceIds = ref([])

// ─── Agreement ─────────────────────────────────────────────
const agreement = computed(() => customer.value?.agreements?.[0] ?? null)

// ─── Icon Components ──────────────────────────────────────
const PoolIcon = {
  render() {
    return h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      })
    ])
  }
}

// ─── Helper Functions ─────────────────────────────────────
function getSelectedTemplateName() {
  if (!selectedTemplateId.value) return null
  const template = templates.value.find(t => t.id === selectedTemplateId.value)
  return template ? template.name : null
}

const AgreementIcon = {
  render() {
    return h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ])
  }
}

const InvoiceIcon = {
  render() {
    return h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2'
      })
    ])
  }
}

const PaymentIcon = {
  render() {
    return h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
      })
    ])
  }
}

const MessageIcon = {
  render() {
    return h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      })
    ])
  }
}

// ─── KPI Stats ──────────────────────────────────────────────
const kpiStats = computed(() => [
  { label: 'Pools', value: customer.value?.pools?.length ?? 0, icon: PoolIcon },
  { label: 'Active Agreements', value: customer.value?.agreements?.filter(a => a.status === 'draft').length ?? 0, icon: AgreementIcon },
  { label: 'Total Invoices', value: customer.value?.invoices?.length ?? 0, icon: InvoiceIcon },
  { label: 'Payments', value: customer.value?.payments?.length ?? 0, icon: PaymentIcon },
  { label: 'Message Threads', value: customer.value?.message_threads?.length ?? 0, icon: MessageIcon },
])

// ─── Customer Fields ────────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name) { if (!name) return '?'; return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }
function formatDate(val) { if (!val) return '—'; return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
function formatStatus(val) { if (!val) return '—'; return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

function customerStatusBadge(status) {
  const map = {
    active: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    suspended: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    pending: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  }
  return map[status] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function customerTypeBadge(type) {
  const map = {
    residential: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    commercial: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    hoa: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  }
  return map[type] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function poolActiveBadge(active) {
  return active
    ? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    : 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function getDefaultStartDate() {
  const now = new Date()
  now.setDate(now.getDate() + 7)
  return now.toISOString().split('T')[0]
}

// ─── Service Helpers ───────────────────────────────────────
function getServiceTitle(id) {
  const service = services.value.find(s => s.id === id)
  return service ? service.title : 'Unknown Service'
}

// ─── Pricing Computed ──────────────────────────────────────
const selectedServices = computed(() => {
  return services.value.filter(s => selectedServiceIds.value.includes(s.id))
})

const subtotal = computed(() => {
  return selectedServices.value.reduce((sum, s) => sum + s.price, 0)
})

const agreementTerm = computed(() => {
  return form.agreement_term || '1_year'
})

const discountPercentage = computed(() => {
  const termMap = { '6_months': 0, '1_year': 0, '2_years': 10 }
  return termMap[agreementTerm.value] || 0
})

const discountAmount = computed(() => {
  return (subtotal.value * discountPercentage.value) / 100
})

const grandTotal = computed(() => {
  return subtotal.value - discountAmount.value
})

function formatAgreementTerm(term) {
  const map = {
    '6_months': '6 Months',
    '1_year': '1 Year',
    '2_years': '2 Years (10% off)'
  }
  return map[term] || term
}

function getAgreementTemplateName() {
  if (!agreement.value || !agreement.value.term_template_id) return null
  const template = templates.value.find(t => t.id == agreement.value.term_template_id)
  return template ? template.name : 'Unknown Template'
}

// ─── State ──────────────────────────────────────────────────
const submitting = ref(false)
const submittingAgreement = ref(false)
const termsSubmitting = ref(false)
const technicians = ref([])
const validationErrors = reactive({})

const form = reactive({
  customer_id: '',
  frequency: 'weekly',
  billing_cycle: 'monthly',
  agreement_term: '1_year',
  price: '',
  assigned_technician_id: '',
  start_date: '',
  end_date: '',
  auto_renew: true,
  pool_ids: []
})

// ─── Terms State ────────────────────────────────────────────
const templates = ref([])
const termsLoading = ref(false)
const error = ref(null)
const showModal = ref(false)
const selectedTemplate = ref(null)
const selectedTemplateId = ref('')

// ─── Computed Button Labels ────────────────────────────────
const serviceButtonLabel = computed(() => {
  if (!agreement.value) return 'Create Services'
  return 'Update Services'
})

const pricingButtonLabel = computed(() => {
  if (!agreement.value) return 'Create Pricing'
  return 'Update Pricing'
})

const termsButtonLabel = computed(() => {
  if (!agreement.value) return 'Add Terms & Conditions'
  return 'Update Terms & Conditions'
})

// ─── Load Functions ─────────────────────────────────────────
async function loadServices() {
  loading.value.services = true
  servicesError.value = null
  try {
    const response = await api().get('/tenant-portal/services')
    services.value = response.data?.data || []

    // After services load, if we have an agreement, populate services
    if (agreement.value) {
      populateServicesFromAgreement()
    }
  } catch (err) {
    console.error('Failed to load services:', err)
    servicesError.value = err?.response?.data?.message || 'Failed to load services. Please try again.'
  } finally {
    loading.value.services = false
  }
}

async function loadCustomer() {
  loading.value.customer = true
  try {
    const response = await api().get(`/customer-management/customers/${route.params.id}?with=pools,agreements,invoices,payments,message_threads`)
    customer.value = response.data?.data ?? response.data

    // Populate form from existing agreement (but NOT services yet)
    if (agreement.value) {
      populateFormFromAgreement()
      // Don't call populateServicesFromAgreement here - wait for services to load
    }
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to load customer',
      text: err?.response?.data?.message ?? 'An unexpected error occurred.'
    })
  } finally {
    loading.value.customer = false
  }
}

async function loadTechnicians() {
  try {
    const response = await api().get('/user-management/technicians')
    technicians.value = response.data || []
  } catch (error) {
    console.error('Failed to load technicians:', error)
  }
}

async function fetchTemplates() {
  termsLoading.value = true
  error.value = null
  try {
    const response = await api().get('/term-templates/templates')
    templates.value = response.data?.data || []
  } catch (err) {
    console.error('Failed to fetch templates:', err)
    error.value = err.response?.data?.message || 'Could not load templates.'
  } finally {
    termsLoading.value = false
  }
}



// ─── Populate Functions ─────────────────────────────────────
function populateFormFromAgreement() {
  const a = agreement.value
  if (!a) return

  form.frequency = a.frequency || 'weekly'
  form.billing_cycle = a.billing_cycle || 'monthly'
  form.agreement_term = a.agreement_term || '1_year'
  form.price = a.price || ''
  form.assigned_technician_id = a.assigned_technician_id || ''
  form.start_date = a.start_date?.split('T')[0] || getDefaultStartDate()
  form.end_date = a.end_date?.split('T')[0] || ''
  form.auto_renew = a.auto_renew == 1
  form.customer_id = customer.value?.id || ''
  form.pool_ids = customer.value?.pools?.map(p => p.id) || []

  // Populate term template
  selectedTemplateId.value = a.term_template_id || ''
}

function populateServicesFromAgreement() {
  const a = agreement.value
  if (!a) return

  // Don't try to populate if services haven't loaded yet
  if (loading.value.services || services.value.length === 0) {
    console.log('Services not loaded yet, skipping population')
    return
  }

  try {
    const serviceIncludes = a.service_includes
    if (serviceIncludes) {
      let parsed = typeof serviceIncludes === 'string' ? JSON.parse(serviceIncludes) : serviceIncludes
      if (Array.isArray(parsed)) {
        // Extract service titles and match with service IDs
        const titles = parsed.map(s => s.item)
        const matchedIds = services.value
          .filter(s => titles.includes(s.title))
          .map(s => s.id)
        selectedServiceIds.value = matchedIds
        console.log('Populated service IDs:', selectedServiceIds.value)
      }
    }
  } catch (e) {
    console.error('Failed to parse service_includes:', e)
    selectedServiceIds.value = []
  }
}

// ─── Save Functions ─────────────────────────────────────────
async function saveServices() {
  if (selectedServiceIds.value.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: 'No Services Selected',
      text: 'Please select at least one service.',
      confirmButtonColor: '#4f46e5'
    })
    return
  }

  submitting.value = true
  try {
    // Build service_includes JSON string
    const serviceIncludes = selectedServiceIds.value.map(id => {
      const service = services.value.find(s => s.id === id)
      return { item: service.title, isChecked: "false" }
    })

    const payload = {
      service_includes: JSON.stringify(serviceIncludes)
    }

    if (agreement.value) {
      // Update mode
      await api().post(`/service-agreement-management/agreements/${agreement.value.id}`, {
        ...payload,
        _method: 'PUT'
      })
      await Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Services updated successfully.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } else {
      // Create mode
      const createPayload = {
        customer_id: Number(customer.value.id),
        ...payload,
        frequency: 'weekly',
        billing_cycle: 'monthly',
        agreement_term: '1_year',
        price: 0,
        start_date: getDefaultStartDate(),
        end_date: '',
        auto_renew: true,
        pool_ids: customer.value?.pools?.map(p => p.id) || [],
        assigned_technician_id: null
      }
      await api().post('/service-agreement-management/agreements', createPayload)
      await Swal.fire({
        icon: 'success',
        title: 'Created',
        text: 'Services created successfully.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    }

    await loadCustomer()
  } catch (error) {
    console.error('Failed to save services:', error)
    let message = error.response?.data?.message || 'Something went wrong.'
    if (error.response?.data?.errors) {
      const errMsgs = Object.values(error.response.data.errors).flat()
      message = errMsgs.join(', ')
    }
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Save Services',
      text: message,
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    submitting.value = false
  }
}

async function savePricing() {
  // Validate
  if (!form.frequency) { validationErrors.frequency = ['Please select a frequency']; return }
  if (!form.price || form.price <= 0) { validationErrors.price = ['Price must be greater than 0']; return }
  if (!form.billing_cycle) { validationErrors.billing_cycle = ['Please select a billing cycle']; return }
  if (!form.start_date) { validationErrors.start_date = ['Please select a start date']; return }
  if (form.end_date && form.end_date <= form.start_date) {
    validationErrors.end_date = ['End date must be after start date'];
    return
  }

  submitting.value = true
  try {
    const payload = {
      frequency: form.frequency,
      billing_cycle: form.billing_cycle,
      agreement_term: form.agreement_term,
      price: Number(form.price),
      assigned_technician_id: form.assigned_technician_id || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      auto_renew: form.auto_renew ? 1 : 0
    }

    if (agreement.value) {
      // Update mode
      await api().post(`/service-agreement-management/agreements/${agreement.value.id}`, {
        ...payload,
        _method: 'PUT'
      })
      await Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Pricing updated successfully.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } else {
      // Create mode
      const createPayload = {
        customer_id: Number(customer.value.id),
        ...payload,
        service_includes: '[]',
        pool_ids: customer.value?.pools?.map(p => p.id) || []
      }
      await api().post('/service-agreement-management/agreements', createPayload)
      await Swal.fire({
        icon: 'success',
        title: 'Created',
        text: 'Pricing created successfully.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    }

    await loadCustomer()
  } catch (error) {
    console.error('Failed to save pricing:', error)
    if (error.response?.data?.errors) {
      Object.assign(validationErrors, error.response.data.errors)
      await Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check the form for errors',
        confirmButtonColor: '#4f46e5'
      })
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Failed to Save Pricing',
        text: error.response?.data?.message || 'Something went wrong.',
        confirmButtonColor: '#4f46e5'
      })
    }
  } finally {
    submitting.value = false
  }
}

async function saveTerms() {
  if (!agreement.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'No Agreement Found',
      text: 'Please create a Price agreement first.',
      confirmButtonColor: '#4f46e5'
    })
    return
  }

  termsSubmitting.value = true
  try {
    const payload = {
      term_template_id: selectedTemplateId.value || null,
      _method: 'PUT'
    }

    await api().post(`/service-agreement-management/agreements/${agreement.value.id}`, payload)
    await Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Terms & Conditions updated successfully.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })
    await loadCustomer()
  } catch (error) {
    console.error('Failed to save terms:', error)
    let message = error.response?.data?.message || 'Something went wrong.'
    if (error.response?.data?.errors) {
      const errMsgs = Object.values(error.response.data.errors).flat()
      message = errMsgs.join(', ')
    }
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Save Terms',
      text: message,
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    termsSubmitting.value = false
  }
}

async function activateAgreement() {
  if (!agreement.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'No Agreement Found',
      text: 'Please create a Price agreement first.',
      confirmButtonColor: '#4f46e5'
    })
    return
  }

  if (agreement.value.status === 'active') {
    return
  }

  submittingAgreement.value = true
  try {
    await api().post(`/service-agreement-management/agreements/${agreement.value.id}`, {
      status: 'active',
      _method: 'PUT'
    })
    await Swal.fire({
      icon: 'success',
      title: 'Activated',
      text: 'Agreement has been activated successfully.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })
    await loadCustomer()
  } catch (error) {
    console.error('Failed to activate agreement:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Activation Failed',
      text: error.response?.data?.message || 'Something went wrong.',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    submittingAgreement.value = false
  }
}

// ─── Terms Handlers ─────────────────────────────────────────
const onChange = (event) => {
  const value = event.target.value === '' ? '' : Number(event.target.value)
  selectedTemplateId.value = value
}

function openTermsModal(template) {
  selectedTemplate.value = template
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedTemplate.value = null
}

// ─── Navigation ─────────────────────────────────────────────
function createAgreement() { router.push(`/provider/customer-service-agreements-create`) }
function addPool() { router.push(`/provider/pools-create`) }
function editPool(id) { }

// ─── Watchers ──────────────────────────────────────────────────
// Watch for when services finish loading to populate agreement services
watch(() => loading.value.services, (newVal, oldVal) => {
  // When services loading completes and we have services data
  if (!newVal && services.value.length > 0 && agreement.value) {
    populateServicesFromAgreement()
  }
})

// Also watch for when customer loads and services are already loaded
watch(() => customer.value, (newVal, oldVal) => {
  if (newVal && agreement.value && !loading.value.services && services.value.length > 0) {
    populateServicesFromAgreement()
  }
})

// ─── Init ──────────────────────────────────────────────────
async function loadAllData() {
  // Load customer first
  await loadCustomer()
  // Then load services - this will trigger the watch and populate services
  await loadServices()
}

onMounted(() => {
  loadAllData()
  loadTechnicians()
  fetchTemplates()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>