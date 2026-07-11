<template>
    <div class="min-h-screen bg-gray-50 font-inter">

        <!-- ===== PAGE HEADER ===== -->
        <div class="relative overflow-hidden bg-white border-b border-gray-200">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
                <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl"></div>
            </div>
            <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div class="flex items-center gap-3">
                    <button @click="goBack"
                        class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div
                        class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
                        <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Pool Equipment History
                        </h1>
                        <p class="text-sm text-gray-500 mt-0.5">View maintenance recommendations and complete service
                            history for this installed equipment.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            <!-- ===== EQUIPMENT INFORMATION CARD ===== -->
            <div v-if="loadingHistory"
                class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div class="h-5 bg-gray-200 rounded-lg w-56"></div>
                </div>
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="i in 6" :key="i" class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded w-20"></div>
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="equipment" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
               
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Component Name</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.component_name || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Component Type</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.component_type || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Manufacturer</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.manufacturer || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Equipment Model</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.equipment_model || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Serial Number</p>
                        <p class="text-sm font-mono font-semibold text-gray-900">{{ equipment?.serial_number || '—' }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pool Name</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.pool_name || '—' }}</p>
                    </div>
                    <div>
                                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Customer
                                </p>
                                <p class="text-sm font-bold text-gray-900">
                                    {{ recommendations[0]?.customer?.contact_name || '—' }}
                                </p>
                                <p class="text-sm font-semibold text-gray-600">
                                    {{ recommendations[0]?.customer?.email || '' }}
                                </p>
                            </div>

                  
                </div>
            </div>

            <!-- ===== CUSTOMER NAME ===== -->


            <!-- ===== TABS ===== -->
            <div class="flex items-center gap-3 border-b border-gray-200">
                <button @click="activeTab = 'recommendations'"
                    class="relative px-5 py-3 text-sm font-semibold transition-all"
                    :class="activeTab === 'recommendations' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'">
                    <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Maintenance Recommendations
                        <span
                            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">{{
                            recommendations.length }}</span>
                    </span>
                    <span v-if="activeTab === 'recommendations'"
                        class="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></span>
                </button>
                <button @click="activeTab = 'history'" class="relative px-5 py-3 text-sm font-semibold transition-all"
                    :class="activeTab === 'history' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'">
                    <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Service History
                        <span
                            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">{{
                            serviceHistory.length }}</span>
                    </span>
                    <span v-if="activeTab === 'history'"
                        class="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></span>
                </button>
            </div>

            <!-- ===== TAB 1: MAINTENANCE RECOMMENDATIONS ===== -->
            <div v-if="activeTab === 'recommendations'">

                <!-- Loading Skeleton -->
                <div v-if="loadingRecommendations"
                    class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
                    <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <div class="h-5 bg-gray-200 rounded-lg w-56"></div>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="i in 3" :key="i" class="px-5 py-4">
                            <div class="h-4 bg-gray-200 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="recommendations.length === 0"
                    class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="relative mb-6">
                        <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
                        <div
                            class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
                            <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">No Recommendations</h3>
                    <p class="text-sm text-gray-500 text-center max-w-xs">No maintenance recommendations found.</p>
                </div>

                <!-- Table -->
                <div v-else class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <!-- <div
                        class="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-base font-bold text-gray-900">Maintenance Recommendations</h3>
                        <span class="text-sm font-semibold text-gray-600">{{ recommendations.length }} item{{
                            recommendations.length !== 1 ? 's' : '' }}</span>
                    </div> -->
                        <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 table-zebra ">
          <thead class="bg-cyan-50 sticky top-0 ">
            <tr>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Title</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Customer</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Pool</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Priority</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Status</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Items</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Total</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Recommended By</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Created</th>
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="10" class="px-6 py-4">
                <div class="space-y-2">
                  <div v-for="n in 5" :key="n" class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-2 py-1">
                      <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                      <div class="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="paginatedData.length === 0">
              <td colspan="10" class="px-6 border-e border-slate-200 py-16 text-center">
                <div class="flex flex-col items-center">
                  <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-slate-600 font-medium">No recommendations found</p>
                  <p class="text-slate-400 text-sm mt-1">Try adjusting your filters or refresh the page</p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <template v-else>
              <tr
                v-for="recommendation in paginatedData"
                :key="recommendation.id"
                @click="toggleExpand(recommendation.id)"
                class="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td class="px-6 border-e border-slate-200 py-4">
                  <div class="font-medium text-slate-800">{{ recommendation.title }}</div>
                  <div class="text-sm text-slate-400 line-clamp-2">{{ recommendation.description }}</div>
                </td>
                <td class="px-6 border-e border-slate-200 py-4">
                  <div class="font-medium text-slate-800">{{ recommendation.customer?.contact_name || 'N/A' }}</div>
                  <div class="text-sm text-slate-400">{{ recommendation.customer?.email || '' }}</div>
                </td>
                <td class="px-6 border-e border-slate-200 py-4">
                  <div class="font-medium text-slate-800">{{ recommendation.pool?.label || 'N/A' }}</div>
                  <div class="text-sm text-slate-400">{{ recommendation.pool?.service_address || '' }}</div>
                </td>
                <td class="px-6 border-e border-slate-200 py-4 capitalize">
                  <span :class="getPriorityBadgeClass(recommendation.priority)">
                    {{ recommendation.priority }}
                  </span>
                </td>
                <td class="px-6 border-e border-slate-200 py-4 capitalize">
                  <span :class="getStatusBadgeClass(recommendation.status)">
                    {{ recommendation.status }}
                  </span>
                </td>
                <td class="px-6 border-e border-slate-200 py-4 text-center text-slate-700">{{ recommendation.items_count || 0 }}</td>
                <td class="px-6 border-e border-slate-200 py-4 font-semibold text-slate-800">{{ formatCurrency(recommendation.total_amount) }}</td>
                <td class="px-6 border-e border-slate-200 py-4 text-slate-600">{{ recommendation.recommended_by?.name || 'N/A' }}</td>
                <td class="px-6 border-e border-slate-200 py-4 text-sm text-slate-500">{{ formatDate(recommendation.created_at) }}</td>
                <td class="px-6 border-e border-slate-200 py-4">
                  <div class="flex items-center space-x-1" @click.stop>
                    <button
                      @click="openViewModal(recommendation)"
                      class="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                      title="View"
                    >
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="downloadPDF(recommendation)"
                      class="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
                      title="Download PDF"
                    >
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <!-- <button
                      @click="openEditModal(recommendation)"
                      class="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-all"
                      title="Edit"
                    >
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(recommendation)"
                      class="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                      title="Delete"
                    >
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button> -->
                  </div>
                </td>
              </tr>

              <!-- Expandable Row -->
              <tr v-for="recommendation in paginatedData" :key="'expand-' + recommendation.id">
                <td colspan="10" class="px-0 py-0">
                  <transition
                    enter-active-class="transition-all duration-300 ease-in-out"
                    leave-active-class="transition-all duration-300 ease-in-out"
                    enter-class="max-h-0 opacity-0"
                    enter-to-class="max-h-screen opacity-100"
                    leave-class="max-h-screen opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <div v-if="expandedRows.includes(recommendation.id)" class="bg-indigo-50/40 px-6 py-5 border-t border-indigo-100">
                      <div class="space-y-4">
                        <h4 class="font-semibold text-slate-700 flex items-center text-sm">
                          <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Recommendation Items
                        </h4>
                        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table class="min-w-full divide-y divide-slate-100">
                            <thead class="bg-slate-50">
                              <tr>
                                <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Item</th>
                                <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                                <th class="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase">Price</th>
                                <th class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase">Qty</th>
                                <th class="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                              <tr v-for="(item, index) in recommendation.items" :key="index" class="hover:bg-slate-50">
                                <td class="px-4 py-2.5 text-sm text-slate-700">{{ item.item_name }}</td>
                                <td class="px-4 py-2.5 text-sm text-slate-500">{{ item.item_type }}</td>
                                <td class="px-4 py-2.5 text-sm text-right text-slate-700">{{ formatCurrency(item.price) }}</td>
                                <td class="px-4 py-2.5 text-sm text-center text-slate-700">{{ item.quantity }}</td>
                                <td class="px-4 py-2.5 text-sm text-right font-semibold text-slate-800">{{ formatCurrency(item.total_price) }}</td>
                              </tr>
                            </tbody>
                            <tfoot class="bg-slate-50">
                              <tr>
                                <td colspan="4" class="px-4 py-2.5 text-right font-semibold text-slate-600">Grand Total</td>
                                <td class="px-4 py-2.5 text-right font-bold text-indigo-600">{{ formatCurrency(recommendation.total_amount) }}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </transition>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

 
    </div>

    <!-- Edit Modal — light glass backdrop, page stays visible -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-slate-900/10 backdrop-blur-sm transition-all duration-300" @click="closeEditModal"></div>

      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-slate-200 max-w-md w-full p-6 transform transition-all duration-300 scale-100 opacity-100">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold text-slate-800">Edit Recommendation</h3>
            <button
              @click="closeEditModal"
              class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateRecommendation">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  class="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  placeholder="Enter recommendation title"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  v-model="editForm.description"
                  rows="3"
                  required
                  class="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  placeholder="Enter description"
                ></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="editLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm shadow-indigo-200"
              >
                {{ editLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Modal — light glass backdrop, page stays visible -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-slate-900/10 backdrop-blur-sm transition-all duration-300" @click="closeViewModal"></div>

      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-slate-200 w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
          <!-- Sticky Header -->
          <div class="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-xl font-bold text-slate-800 flex items-center">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Maintenance Recommendation
            </h2>
            <div class="flex items-center space-x-2">
              <button
                @click="downloadPDF(viewRecommendation)"
                class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-sm shadow-indigo-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                @click="closeViewModal"
                class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px)">
            <div v-if="viewRecommendation" class="space-y-6">
              <!-- Two Column Layout -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Left Column -->
                <div class="space-y-3">
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</h3>
                    <p class="mt-1 text-base font-semibold text-slate-800">{{ viewRecommendation.title }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.customer?.contact_name || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.customer?.email || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.customer?.phone || 'N/A' }}</p>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-3">
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pool</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.pool?.label || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Address</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.pool?.service_address || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</h3>
                    <div class="mt-1 capitalize">
                      <span :class="getPriorityBadgeClass(viewRecommendation.priority)">
                        {{ viewRecommendation.priority }}
                      </span>
                    </div>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</h3>
                    <div class="mt-1 capitalize">
                      <span :class="getStatusBadgeClass(viewRecommendation.status)">
                        {{ viewRecommendation.status }}
                      </span>
                    </div>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended By</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.recommended_by?.name || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Date</h3>
                    <p class="mt-1 text-slate-800">{{ formatDate(viewRecommendation.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
                <h3 class="text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Description
                </h3>
                <p class="mt-1 text-slate-700 text-sm leading-relaxed">
                  {{ viewRecommendation.description || 'No description provided.' }}
                </p>
              </div>

              <!-- Items Table -->
              <div>
                <h3 class="text-base font-semibold text-slate-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Recommendation Items
                </h3>
                <div class="overflow-x-auto border border-slate-200 rounded-xl">
                  <table class="min-w-full divide-y divide-slate-100">
                    <thead class="bg-slate-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Price</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-100">
                      <tr v-for="(item, index) in viewRecommendation.items" :key="index" class="hover:bg-slate-50 transition-colors">
                        <td class="px-4 py-3 text-sm text-slate-800">{{ item.item_name }}</td>
                        <td class="px-4 py-3 text-sm text-slate-500">{{ item.item_type }}</td>
                        <td class="px-4 py-3 text-sm text-right text-slate-800">{{ item.quantity }}</td>
                        <td class="px-4 py-3 text-sm text-right text-slate-800">{{ formatCurrency(item.price) }}</td>
                        <td class="px-4 py-3 text-sm text-right font-semibold text-slate-800">{{ formatCurrency(item.total_price) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Summary -->
              <div class="flex justify-end">
                <div class="bg-indigo-50/70 rounded-2xl p-4 w-full md:w-1/3 border border-indigo-100">
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-500">Total Items</span>
                      <span class="text-sm font-medium text-slate-800">{{ viewRecommendation.items_count || 0 }}</span>
                    </div>
                    <div class="flex justify-between border-t border-indigo-200 pt-2">
                      <span class="text-base font-semibold text-slate-800">Grand Total</span>
                      <span class="text-lg font-bold text-indigo-600">{{ formatCurrency(viewRecommendation.total_amount) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="bg-amber-50/70 rounded-xl p-4 border border-amber-100">
                <h3 class="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recommendation Notes
                </h3>
                <p class="mt-1 text-sm text-slate-600">
                  This recommendation has been prepared after inspection of the pool equipment.
                  Prices shown are estimated costs and may change depending on the final repair or replacement requirements.
                </p>
              </div>

              <!-- Footer -->
              <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-50 rounded-xl p-4">
                <div>
                  <span class="text-sm text-slate-500">Prepared by:</span>
                  <span class="ml-2 text-sm font-medium text-slate-800">{{ viewRecommendation.recommended_by?.name || 'N/A' }}</span>
                </div>
                <button
                  @click="closeViewModal"
                  class="mt-4 md:mt-0 px-5 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
                </div>
            </div>

            <!-- ===== TAB 2: SERVICE HISTORY ===== -->
            <div v-if="activeTab === 'history'">

                <!-- Loading Skeleton -->
                <div v-if="loadingHistory"
                    class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
                    <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <div class="h-5 bg-gray-200 rounded-lg w-56"></div>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="i in 3" :key="i" class="px-5 py-4">
                            <div class="h-4 bg-gray-200 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="serviceHistory.length === 0"
                    class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="relative mb-6">
                        <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
                        <div
                            class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
                            <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">No History</h3>
                    <p class="text-sm text-gray-500 text-center max-w-xs">No service history available.</p>
                </div>

                <!-- Table -->
                <div v-else class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <div
                        class="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-base font-bold text-gray-900">Service History</h3>
                        <span class="text-sm font-semibold text-gray-600">{{ serviceHistory.length }} record{{
                            serviceHistory.length !== 1 ? 's' : '' }}</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-200">
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Work Order ID</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Service Type</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Issue Type</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Technician</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Status</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Visit Date & Time</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                                        Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(item, idx) in serviceHistory" :key="item?.work_order_id || idx"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                                    class="hover:bg-cyan-50/40 transition-colors">
                                    <td
                                        class="px-4 py-3 border-r border-gray-100 font-mono font-semibold text-gray-900 whitespace-nowrap">
                                        {{ item?.work_order_id || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        item?.type || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        item?.pivot?.issue_type || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        item?.technician || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                                        <span :class="getStatusBadgeClass(item?.pivot?.status)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ formatLabel(item?.pivot?.status) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">
                                        <div class="flex flex-col gap-0.5">
                                            <span>{{ formatDate(item?.scheduled_visit?.scheduled_date) }} </span>
                                            <span>{{ formatTimeWindow(item?.scheduled_visit?.time_window_start,
                                                item?.scheduled_visit?.time_window_end) }}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <button @click="handlePerformService(item?.work_order_id)"
                                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-sm shadow-cyan-500/20 transition-all hover:-translate-y-0.5">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
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

        <!-- ===== EDIT RECOMMENDATION MODAL ===== -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="editRecommendationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeEditRecommendationModal">
                    </div>
                    <div
                        class="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
                        <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h2 class="text-lg font-bold text-gray-900">Edit Recommendation</h2>
                                    <p class="text-xs text-gray-500 mt-0.5">{{ editRecForm?.title || 'Recommendation' }}
                                    </p>
                                </div>
                                <button @click="closeEditRecommendationModal"
                                    class="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Title <span
                                        class="text-rose-500">*</span></label>
                                <input v-model="editRecForm.title" type="text"
                                    class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    :disabled="updatingRec">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <textarea v-model="editRecForm.description" rows="3" placeholder="Description..."
                                    class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    :disabled="updatingRec"></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Recommendation Type <span
                                        class="text-rose-500">*</span></label>
                                <input v-model="editRecForm.recommendation_type" type="text"
                                    placeholder="e.g. Replacement, Repair, Inspection"
                                    class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    :disabled="updatingRec">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Priority <span
                                        class="text-rose-500">*</span></label>
                                <select v-model="editRecForm.priority"
                                    class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    :disabled="updatingRec">
                                    <option value="">Select priority...</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Estimated Cost</label>
                                <input v-model="editRecForm.estimated_cost" type="number" step="0.01" placeholder="0.00"
                                    class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    :disabled="updatingRec">
                            </div>
                            <div v-if="editRecFormError"
                                class="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
                                {{ editRecFormError }}
                            </div>
                        </div>
                        <div class="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
                            <button @click="updateRecommendation" :disabled="updatingRec"
                                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5">
                                <svg v-if="updatingRec" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                {{ updatingRec ? 'Saving...' : 'Save Changes' }}
                            </button>
                            <button @click="closeEditRecommendationModal"
                                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all"
                                :disabled="updatingRec">Cancel</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../services/api.js'
import jsPDF from 'jspdf'
import { useAuthStore } from '../../../store/AuthStore.js'

// ===== STATE =====
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const poolEquipmentId = ref(route.params.id)

const serviceHistory = ref([])
const equipment = ref(null)
const customer = ref(null)
const loadingRecommendations = ref(false)
const loadingHistory = ref(false)
const totalItems = ref(0)
const activeTab = ref('recommendations')

const deletingRecId = ref(null)
const updatingRec = ref(false)

// Edit Recommendation Modal
const editRecommendationModal = ref(false)
const editRecFormError = ref('')
const editRecForm = ref({
    id: null,
    title: '',
    description: '',
    recommendation_type: '',
    priority: '',
    estimated_cost: '',
})


// State
const recommendations = ref([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const expandedRows = ref([])
const showEditModal = ref(false)
const editLoading = ref(false)
const editForm = ref({ id: null, title: '', description: '' })
const showViewModal = ref(false)
const viewRecommendation = ref(null)

// Filters
const filters = ref({
  search: '',
  priority: 'all',
  status: 'all'
})

// ===== COMPUTED =====
const customerInitials = computed(() => {
    if (!customer.value) return '—'
    return customer.value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0]?.toUpperCase())
        .join('')
})

// ===== API =====

// Load recommendations
const loadRecommendations = async () => {
  loading.value = true
  try {
    const base  = '/tenant/equipment-recommendations'
    // const url
    const url = authStore.authType === 'provider' ? `${base}?customer_id=${authStore.customerId}` : base 
    const response = await api().get(url)
    const data = response.data.data.data.filter(e => e.status != 'pending') || []
    recommendations.value = Array.isArray(data) ? data : []
    totalItems.value = response.data.total || 0
  } catch (error) {
    console.error('Error loading recommendations:', error)
    recommendations.value = []
    totalItems.value = 0
    Swal.fire('Error', 'Failed to load recommendations', 'error')
  } finally {
    loading.value = false
  }
}

// Filtered data
const filteredRecommendations = computed(() => {
  let data = Array.isArray(recommendations.value) ? recommendations.value : []

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    data = data.filter(r =>
      r.title?.toLowerCase().includes(search) ||
      r.customer?.contact_name?.toLowerCase().includes(search) ||
      r.pool?.label?.toLowerCase().includes(search)
    )
  }

  if (filters.value.priority !== 'all') {
    data = data.filter(r => r.priority === filters.value.priority)
  }

  if (filters.value.status !== 'all') {
    data = data.filter(r => r.status === filters.value.status)
  }

  return data
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredRecommendations.value.length / perPage.value))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredRecommendations.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = filteredRecommendations.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
  const end = Math.min(currentPage.value * perPage.value, filteredRecommendations.value.length)
  return { start, end }
})

// Toggle expand
const toggleExpand = (id) => {
  const index = expandedRows.value.indexOf(id)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(id)
  }
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    priority: 'all',
    status: 'all'
  }
  currentPage.value = 1
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  expandedRows.value = []
}

// View
const openViewModal = (recommendation) => {
  viewRecommendation.value = recommendation
  showViewModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeViewModal = () => {
  showViewModal.value = false
  viewRecommendation.value = null
  document.body.style.overflow = 'auto'
}

// Edit
const openEditModal = (recommendation) => {
  editForm.value = {
    id: recommendation.id,
    title: recommendation.title || '',
    description: recommendation.description || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = { id: null, title: '', description: '' }
}

const updateRecommendation = async () => {
  editLoading.value = true
  try {
    await api().post(`/tenant/equipment-recommendations/${editForm.value.id}`, {
      _method: 'PUT',
      title: editForm.value.title,
      description: editForm.value.description
    })
    await loadRecommendations()
    closeEditModal()
    Swal.fire('Success', 'Recommendation updated successfully', 'success')
  } catch (error) {
    console.error('Error updating recommendation:', error)
    Swal.fire('Error', 'Failed to update recommendation', 'error')
  } finally {
    editLoading.value = false
  }
}

// Delete
const confirmDelete = async (recommendation) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#4f46e5',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      await api().delete(`/tenant/equipment-recommendations/${recommendation.id}`)
      await loadRecommendations()
      Swal.fire('Deleted!', 'Recommendation has been deleted.', 'success')
    } catch (error) {
      console.error('Error deleting recommendation:', error)
      Swal.fire('Error', 'Failed to delete recommendation', 'error')
    }
  }
}

// 2. Load service history
async function fetchServiceHistory() {
    if (!poolEquipmentId.value) return
    loadingHistory.value = true
    try {
        
        const response = await api().get(`/tenant/pool-equipments/${poolEquipmentId.value}/history`)
        // Fix: response.data.data contains the data
        const data = response.data?.data || {}
        serviceHistory.value = data?.service_history || []
        equipment.value = data?.equipment || {}
    } catch (error) {
        console.error('Failed to load service history:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to load service history',
            confirmButtonColor: '#0891b2'
        })
    } finally {
        loadingHistory.value = false
    }
}



// ===== NAVIGATION =====
function handlePerformService(workOrderId) {
    if (!workOrderId) return
    router.push(`/provider/services-perform-service/${workOrderId}`)
}

function goBack() {
    router.back()
}



// ===== HELPERS =====
const getPriorityBadgeClass = (priority) => {
  const classes = {
    'Low': 'px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600',
    'Medium': 'px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700',
    'High': 'px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700',
    'Urgent': 'px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700'
  }
  return classes[priority] || classes.Low
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Pending': 'px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700',
    'Approved': 'px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700',
    'Rejected': 'px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700',
    'Completed': 'px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700'
  }
  return classes[status] || classes.Pending
}

function formatLabel(value) {
    if (!value) return '—'
    return value
        .toString()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

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



function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === '') return '—'
    return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}



// PDF Generation
const generateRecommendationPDF = (recommendation) => {
  if (!recommendation) return

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(24)
  doc.setTextColor(44, 62, 80)
  doc.text('Maintenance Recommendation', pageWidth / 2, y, { align: 'center' })
  y += 15

  doc.setDrawColor(200, 200, 200)
  doc.line(20, y, pageWidth - 20, y)
  y += 10

  // Recommendation Details
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)

  const details = [
    ['Title:', recommendation.title || 'N/A'],
    ['Description:', recommendation.description || 'N/A'],
    ['Customer:', recommendation.customer?.contact_name || 'N/A'],
    ['Email:', recommendation.customer?.email || 'N/A'],
    ['Phone:', recommendation.customer?.phone || 'N/A'],
    ['Pool:', recommendation.pool?.label || 'N/A'],
    ['Service Address:', recommendation.pool?.service_address || 'N/A'],
    ['Priority:', recommendation.priority || 'N/A'],
    ['Status:', recommendation.status || 'N/A'],
    ['Recommended By:', recommendation.recommended_by?.name || 'N/A'],
    ['Created:', formatDate(recommendation.created_at)]
  ]

  doc.setFont('helvetica', 'bold')
  details.forEach(([label, value]) => {
    doc.text(label, 20, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, 70, y)
    y += 8
    doc.setFont('helvetica', 'bold')
  })

  y += 5
  doc.line(20, y, pageWidth - 20, y)
  y += 10

  // Items Table
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Recommendation Items', 20, y)
  y += 8

  doc.setFontSize(10)
  doc.setFillColor(240, 240, 240)
  doc.rect(20, y, pageWidth - 40, 8, 'F')

  const headers = ['#', 'Item', 'Type', 'Qty', 'Unit Price', 'Total']
  const colWidths = [10, 50, 40, 20, 30, 30]
  let x = 20

  doc.setFont('helvetica', 'bold')
  headers.forEach((header, i) => {
    doc.text(header, x + 2, y + 6)
    x += colWidths[i]
  })
  y += 10

  doc.setFont('helvetica', 'normal')
  const items = Array.isArray(recommendation.items) ? recommendation.items : []
  items.forEach((item, index) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    const rowData = [
      (index + 1).toString(),
      item.item_name || 'N/A',
      item.item_type || 'N/A',
      item.quantity?.toString() || '0',
      formatCurrency(item.price),
      formatCurrency(item.total_price)
    ]

    x = 20
    rowData.forEach((value, i) => {
      doc.text(value, x + 2, y + 5)
      x += colWidths[i]
    })
    y += 8
  })

  // Summary
  y += 5
  doc.line(20, y, pageWidth - 20, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.text(`Total Items: ${recommendation.items_count || 0}`, 20, y)
  y += 8
  doc.setFontSize(14)
  doc.setTextColor(44, 62, 80)
  doc.text(`Grand Total: ${formatCurrency(recommendation.total_amount)}`, 20, y)
  y += 15

  // Notes
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'italic')
  const notes = `This recommendation has been prepared after inspection of the pool equipment. 
Prices are estimated and may vary depending on actual repair or replacement requirements.`
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 40)
  doc.text(splitNotes, 20, y)
  y += splitNotes.length * 5 + 10

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.setFont('helvetica', 'normal')
  doc.text('Generated by Pool Management System', pageWidth / 2, y, { align: 'center' })
  y += 5
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' })

  // Save PDF
  doc.save(`Recommendation-${recommendation.id}.pdf`)
}

const downloadPDF = (recommendation) => {
  try {
    generateRecommendationPDF(recommendation)
  } catch (error) {
    console.error('Error generating PDF:', error)
    Swal.fire('Error', 'Failed to generate PDF', 'error')
  }
}

watch(() => authStore.customerId, () => {
  loadRecommendations();
  fetchServiceHistory();
})

// ===== LIFECYCLE =====
onMounted(async () => {
    if (!poolEquipmentId.value) {
        console.warn('No pool_equipment_id found in route params')
        return
    }

    await Promise.all([
        fetchServiceHistory(),
        loadRecommendations()
    ])
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
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