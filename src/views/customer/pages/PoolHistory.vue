<template>
  <div class="min-h-screen bg-gray-50 font-inter">

    <!-- ===== PAGE HEADER ===== -->
    <div class="relative overflow-hidden bg-white border-b border-gray-200">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl"></div>
      </div>
      <div class="flex justify-between items-center px-12 py-6">
        <div class="relative w-1/2 ">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">My Pool History</h1>
              <p class="text-sm text-gray-500 mt-0.5">Pool Name: {{ route.query.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
                   <button @click="$router.back()" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-cyan-600 text-white hover:bg-cyan-700 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow">
              <i class="ri-arrow-left-long-line"></i>
              Back
            </button>
      </div>
      </div>
    </div>


    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- ===== TABS ===== -->
      <div class=" border-gray-200">
        <nav class="-mb-px grid grid-cols-4 space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="py-2.5 px-1  text-base font-semibold transition-all duration-200"
            :class="[
              activeTab === tab.key
                ? `bg-${tabColors[tab.key].border} rounded-t-lg text-white`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.badge !== undefined"
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {{ tab.badge }}
            </span>
          </button>
        </nav>
      </div>

      <!-- ===== TAB PANELS ===== -->

      <!-- 1. EQUIPMENT -->
            <div
        v-if="activeTab === 'equipment'"
        class="p-4 border rounded-e-2xl rounded-b-2xl"
        :class="`border-2 border-cyan-500 min-h-screen`"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          <h2 class="text-lg font-bold text-gray-900">Installed Equipment</h2>
          <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
            {{ totalComponents }} items
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loadingInstalled" class="space-y-4">
          <div v-for="i in 2" :key="i" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm animate-pulse">
            <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <div class="h-5 bg-gray-200 rounded-lg w-48"></div>
            </div>
            <div class="divide-y divide-gray-100">
              <div v-for="j in 3" :key="j" class="px-5 py-4">
                <div class="flex items-center gap-4">
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div class="h-3 bg-gray-200 rounded-lg w-1/4"></div>
                  </div>
                  <div class="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loadingInstalled && installedEquipment.length === 0" class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div class="relative mb-6">
            <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
            <div class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
              <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>
            </div>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">No Equipment Installed</h3>
          <p class="text-sm text-gray-500 text-center max-w-xs">This pool has no equipment records.</p>
        </div>

        <!-- Installed Equipment List -->
        <div v-else-if="!loadingInstalled && installedEquipment.length > 0" class="space-y-4">
          <div v-for="group in installedGroups" :key="group.manufacturer_id" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <!-- Manufacturer Header -->
            <div class="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200">
                    <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <h3 class="text-base font-bold text-gray-900">{{ group.manufacturer_name }}</h3>
                  <span class="text-xs text-gray-500">({{ group.models.length }} model{{ group.models.length > 1 ? 's' : '' }})</span>
                </div>
                <span class="text-sm font-semibold text-gray-600">{{ group.total_components }} component{{ group.total_components > 1 ? 's' : '' }}</span>
              </div>
            </div>

            <!-- Models -->
            <div class="divide-y divide-gray-100">
              <div v-for="model in group.models" :key="model.model_id" class="px-5 py-3">
                <div class="flex items-center gap-2 mb-3">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  <h4 class="text-sm font-semibold text-gray-700">{{ model.model_name }}</h4>
                  <span class="text-xs text-gray-400">({{ model.components.length }} component{{ model.components.length > 1 ? 's' : '' }})</span>
                </div>

                <!-- Components -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                  <div v-for="comp in model.components" :key="comp.id" class="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-cyan-300 transition-all duration-200">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1 min-w-0">
                        <h5 class="text-sm font-semibold text-gray-900 truncate">{{ comp.component_name }}</h5>
                        <p class="text-xs text-gray-500 truncate">{{ comp.component_type }}</p>
                      </div>
                      <span :class="getStatusBadgeClass(comp.status)" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                        {{ formatStatus(comp.status) }}
                      </span>
                    </div>
                    <div class="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <span class="text-gray-500">Serial:</span>
                        <span class="ml-1 font-mono text-gray-700">{{ comp.serial_number || '—' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Price:</span>
                        <span class="ml-1 font-semibold text-gray-900">${{ comp.purchase_price?.toLocaleString() || '0' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Installed:</span>
                        <span class="ml-1 text-gray-700">{{ formatDate(comp.install_date) }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Warranty:</span>
                        <span class="ml-1 text-gray-700">{{ formatDate(comp.warranty_expiry) }}</span>
                      </div>
                      <div v-if="comp.notes" class="col-span-2">
                        <span class="text-gray-500">Notes:</span>
                        <span class="ml-1 text-gray-600 truncate block">{{ comp.notes }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. AGREEMENTS -->
            <div
        v-if="activeTab === 'agreements'"
        class="p-4 border rounded-2xl"
        :class="`border-emerald-500 border-2 min-h-screen`"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          <h2 class="text-lg font-bold text-gray-900">Service Agreements</h2>
          <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
            {{ agreements.length }}
          </span>
        </div>

        <div v-if="loadingInstalled" class="space-y-4">
          <div v-for="i in 2" :key="i" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm animate-pulse">
            <div class="h-12 bg-gray-200"></div>
          </div>
        </div>

        <div v-else-if="agreements.length === 0" class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <p class="text-sm text-gray-500">No agreements found for this pool.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table class="min-w-full divide-y divide-gray-200 table-zebra">
            <thead class="bg-emerald-100">
              <tr>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cycle</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Renew</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ag in agreements" :key="ag.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ ag.id }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(ag.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatStatus(ag.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ ag.frequency || '—' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">${{ ag.price || '0.00' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ ag.billing_cycle || '—' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ formatDate(ag.start_date) }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ formatDate(ag.end_date) }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">
                  <span :class="ag.auto_renew ? 'text-green-600' : 'text-red-600'">
                    {{ ag.auto_renew ? 'Yes' : 'No' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. SCHEDULED VISITS -->
            <div
        v-if="activeTab === 'visits'"
        class="p-4 border rounded-2xl"
        :class="`border-sky-500 border-2 min-h-screen`"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          <h2 class="text-lg font-bold text-gray-900">Scheduled Visits</h2>
          <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
            {{ scheduledVisits.length }}
          </span>
        </div>

        <div v-if="loadingInstalled" class="space-y-4">
          <div v-for="i in 2" :key="i" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm animate-pulse">
            <div class="h-12 bg-gray-200"></div>
          </div>
        </div>

        <div v-else-if="scheduledVisits.length === 0" class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <p class="text-sm text-gray-500">No scheduled visits for this pool.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-sky-100">
              <tr>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Window</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="visit in scheduledVisits" :key="visit.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ visit.id }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ formatDate(visit.scheduled_date) }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ visit.time_window_start }} – {{ visit.time_window_end }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ visit.technician_id || '—' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(visit.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatStatus(visit.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm capitalize text-gray-900">{{ visit.priority || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. SERVICE REPORTS (WORK ORDERS) -->
            <div
        v-if="activeTab === 'reports'"
        class="p-4 border rounded-s-2xl rounded-b-2xl"
        :class="`border-teal-500 border-2 min-h-screen`"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          <h2 class="text-lg font-bold text-gray-900">Service Reports</h2>
          <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
            {{ workOrders.length }}
          </span>
        </div>

        <div v-if="loadingInstalled" class="space-y-4">
          <div v-for="i in 2" :key="i" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm animate-pulse">
            <div class="h-12 bg-gray-200"></div>
          </div>
        </div>

        <div v-else-if="workOrders.length === 0" class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <p class="text-sm text-gray-500">No work orders for this pool.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-teal-100">
              <tr>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Visit ID</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th scope="col" class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="wo in workOrders" :key="wo.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ wo.id }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ wo.type || '—' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(wo.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatStatus(wo.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ wo.scheduled_visit_id || '—' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ formatDate(wo.created_at) }}</td>
                <td class="px-6 py-4 border-e border-slate-200 text-sm text-gray-900 max-w-xs truncate">{{ wo.notes || '—' }}</td>
                <td class="px-6 py-4 border-e border-slate-200 text-sm text-gray-900 max-w-xs truncate">
                  <router-link
                  :to="{ name: 'customer-service-reports-details', params: { id: wo.id } }"
                  class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </router-link>
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
import { useRoute } from 'vue-router'
import api from '../../../services/api.js'

// ===== STATE =====
const route = useRoute()
const poolId = ref(null)
const pool = ref(null)
const loadingInstalled = ref(false)

// ===== TABS =====
const activeTab = ref('equipment')
const tabs = [
  { key: 'equipment', label: 'Equipment' },
  { key: 'agreements', label: 'Agreements' },
  { key: 'visits', label: 'Scheduled Visits' },
  { key: 'reports', label: 'Service Reports' }
]

// ===== TAB COLORS =====
const tabColors = {
  equipment: { border: 'cyan-500', text: 'cyan-600' },
  agreements: { border: 'emerald-500', text: 'emerald-600' },
  'visits': { border: 'sky-500', text: 'sky-600' },
  'reports': { border: 'teal-500', text: 'indigo-600' }
}

// ===== COMPUTED =====
const installedEquipment = computed(() => pool.value?.equipment || [])
const agreements = computed(() => pool.value?.agreements || [])
const scheduledVisits = computed(() => pool.value?.scheduled_visits || [])
const workOrders = computed(() => pool.value?.work_orders || [])

const totalComponents = computed(() => installedEquipment.value.length)

const installedGroups = computed(() => {
  const groups = []
  const manufacturerMap = new Map()

  installedEquipment.value.forEach(item => {
    const manufacturerId = item.manufacturer?.id
    const modelId = item.equipment_model?.id

    if (!manufacturerMap.has(manufacturerId)) {
      manufacturerMap.set(manufacturerId, {
        manufacturer_id: manufacturerId,
        manufacturer_name: item.manufacturer?.name || 'Unknown Manufacturer',
        models: [],
        total_components: 0
      })
    }

    const manufacturerGroup = manufacturerMap.get(manufacturerId)
    let modelGroup = manufacturerGroup.models.find(m => m.model_id === modelId)

    if (!modelGroup) {
      modelGroup = {
        model_id: modelId,
        model_name: item.equipment_model?.name || 'Unknown Model',
        components: []
      }
      manufacturerGroup.models.push(modelGroup)
    }

    modelGroup.components.push({
      id: item.id,
      component_name: item.component?.name || 'Unknown Component',
      component_type: item.component?.type || '—',
      serial_number: item.serial_number,
      install_date: item.install_date,
      warranty_expiry: item.warranty_expiry,
      purchase_price: item.purchase_price,
      notes: item.notes,
      status: item.status || 'active'
    })
    manufacturerGroup.total_components += 1
  })

  for (const [, value] of manufacturerMap) {
    groups.push(value)
  }
  return groups
})

// ===== API =====
const fetchPoolDetails = async () => {
  if (!poolId.value) {
    pool.value = null
    return
  }
  loadingInstalled.value = true
  try {
    const response = await api().get(`/pool-management/pools/${poolId.value}`)
    pool.value = response.data
  } catch (error) {
    console.error('Failed to load pool details:', error)
    pool.value = null
  } finally {
    loadingInstalled.value = false
  }
}

// ===== HELPERS =====
function getStatusBadgeClass(status) {
  const map = {
    'active': 'bg-green-100 text-green-700 border-green-200',
    'under_warranty': 'bg-blue-100 text-blue-700 border-blue-200',
    'replaced': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'removed': 'bg-red-100 text-red-700 border-red-200',
    'scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
    'in_progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'completed': 'bg-green-100 text-green-700 border-green-200',
    'cancelled': 'bg-red-100 text-red-700 border-red-200',
    'created': 'bg-gray-100 text-gray-700 border-gray-200'
  }
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function formatStatus(status) {
  const map = {
    'active': 'Active',
    'under_warranty': 'Under Warranty',
    'replaced': 'Replaced',
    'removed': 'Removed',
    'scheduled': 'Scheduled',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'created': 'Created'
  }
  return map[status] || status || 'Active'
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ===== LIFECYCLE =====
onMounted(async () => {
  poolId.value = route.params.id
  if (poolId.value) {
    await fetchPoolDetails()
  } else {
    console.warn('No pool ID found in route params')
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }
</style>