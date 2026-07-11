<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">My Maintenance Recommendations</h1>
        <p class="text-sm text-slate-500 mt-1">
          View, manage and review my maintenance recommendations.
        </p>
      </div>
      <div class="mt-4 md:mt-0">
        <button
          @click="loadRecommendations"
          class="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200 hover:shadow-md"
          :disabled="loading"
        >
          <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Recommendations"
        :value="statistics.total"
        icon="📋"
        color="indigo"
      />
      <StatCard
        title="Pending"
        :value="statistics.pending"
        icon="⏳"
        color="amber"
      />
      <StatCard
        title="Approved"
        :value="statistics.approved"
        icon="✅"
        color="emerald"
      />
      <StatCard
        title="Rejected"
        :value="statistics.rejected"
        icon="❌"
        color="rose"
      />
      <StatCard
        title="Total Estimated Cost"
        :value="formatCurrency(statistics.totalAmount)"
        icon="💰"
        color="violet"
      />
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Search</label>
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by title, customer, pool..."
              class="w-full pl-9 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
          <select
            v-model="filters.priority"
            class="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
          >
            <option value="all">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
          <select
            v-model="filters.status"
            class="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

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
              <th class="px-6 border-e border-slate-200 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase ">Update Status</th>
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
                  </div>
                </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                                <button v-if="recommendation.status?.toLowerCase() === 'approved'"
                                    @click="acceptRecommendation(recommendation)"
                                    :disabled="loadingAccept"
                                    class="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                                    {{ loadingAccept && currentAcceptId === recommendation.id ? 'Accepting...' : 'Accept' }}
                                </button>
                                <span v-else-if="recommendation.status?.toLowerCase() === 'accepted'"
                                    class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Accepted
                                </span>
                                <span v-else
                                     :class="getStatusBadgeClass(recommendation.status)">
                                    {{ (recommendation.status) }}
                                </span>
                            </td>
              </tr>

              <!-- Expandable Row -->
               <!-- Expandable Row -->
              <tr v-for="recommendation in paginatedData" :key="'expand-' + recommendation.id">
                <td colspan="10" class="p-0 border border-slate-200">
                  <transition
                    enter-active-class="transition-all duration-300 ease-in-out"
                    leave-active-class="transition-all duration-300 ease-in-out"
                    enter-class="max-h-0 opacity-0"
                    enter-to-class="max-h-[1000px] opacity-100"
                    leave-class="max-h-[1000px] opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <div v-if="expandedRows.includes(recommendation.id)" class="bg-slate-50 px-6 py-5 border-t border-slate-200">
                      <div class="space-y-4">
                        <h4 class="font-semibold text-slate-800 flex items-center text-sm">
                          <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Recommendation Items
                        </h4>
                        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table class="w-full">
                            <thead class="bg-cyan-50 border-b border-slate-200">
                              <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Item</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Description</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Type</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Price</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Qty</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item, index) in recommendation.items" :key="index" class="hover:bg-slate-50/60 transition-colors" :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'">
                                <td class="px-4 py-3 text-sm text-slate-700 border-r border-slate-200">{{ item.item_name }}</td>
                                <td class="px-4 py-3 text-sm text-slate-700 border-r border-slate-200">{{ item.description }}</td>
                                <td class="px-4 py-3 text-sm text-slate-500 border-r border-slate-200">{{ item.item_type }}</td>
                                <td class="px-4 py-3 text-sm text-right text-slate-700 border-r border-slate-200">{{ formatCurrency(item.price) }}</td>
                                <td class="px-4 py-3 text-sm text-center text-slate-700 border-r border-slate-200">{{ item.quantity }}</td>
                                <td class="px-4 py-3 text-sm text-right font-semibold text-slate-800">{{ formatCurrency(item.total_price) }}</td>
                              </tr>
                            </tbody>
                            <tfoot class="bg-slate-50 border-t border-slate-200">
                              <tr>
                                <td colspan="4" class="px-4 py-3 text-right font-semibold text-slate-600 border-r border-slate-200">Grand Total</td>
                                <td class="px-4 py-3 text-right font-bold text-indigo-600">{{ formatCurrency(recommendation.total_amount) }}</td>
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

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="text-sm text-slate-500">
          Showing <span class="font-medium text-slate-700">{{ paginationInfo.start }}</span> to <span class="font-medium text-slate-700">{{ paginationInfo.end }}</span> of {{ totalItems }} results
        </div>
        <div class="flex items-center space-x-1.5">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
          >
            Previous
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm transition-all font-medium',
              currentPage === page
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-all duration-300" @click="closeViewModal"></div>

      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <div class="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
          <!-- Sticky Header -->
          <div class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-xl font-bold text-slate-900 flex items-center">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-3 border border-indigo-100">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Maintenance Recommendation
            </h2>
            <div class="flex items-center gap-2">
              <button
                @click="downloadPDF(viewRecommendation)"
                class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-sm hover:shadow-md active:scale-[0.98]"
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
                <div class="space-y-3">
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</h3>
                    <p class="mt-1 text-base font-semibold text-slate-900">{{ viewRecommendation.title }}</p>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.customer?.contact_name || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.customer?.email || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.customer?.phone || 'N/A' }}</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pool</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.pool?.label || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Address</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.pool?.service_address || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</h3>
                    <div class="mt-1">
                      <span :class="getPriorityBadgeClass(viewRecommendation.priority)">
                        {{ viewRecommendation.priority }}
                      </span>
                    </div>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</h3>
                    <div class="mt-1">
                      <span :class="getStatusBadgeClass(viewRecommendation.status)">
                        {{ viewRecommendation.status }}
                      </span>
                    </div>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended By</h3>
                    <p class="mt-1 text-slate-800">{{ viewRecommendation.recommended_by?.name || 'N/A' }}</p>
                  </div>
                  <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Date</h3>
                    <p class="mt-1 text-slate-800">{{ formatDate(viewRecommendation.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="bg-indigo-50/40 rounded-xl p-4 border border-indigo-100/60">
                <h3 class="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Recommendation Items
                </h3>
                <div class="overflow-x-auto border border-slate-200/60 rounded-xl">
                  <table class="w-full">
                    <thead class="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Item</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Description</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Type</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Quantity</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200">Unit Price</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in viewRecommendation.items" :key="index" class="hover:bg-slate-50/60 transition-colors" :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'">
                        <td class="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">{{ item.item_name }}</td>
                        <td class="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">{{ item.description }}</td>
                        <td class="px-4 py-3 text-sm text-slate-500 border-r border-slate-200">{{ item.item_type }}</td>
                        <td class="px-4 py-3 text-sm text-right text-slate-800 border-r border-slate-200">{{ item.quantity }}</td>
                        <td class="px-4 py-3 text-sm text-right text-slate-800 border-r border-slate-200">{{ formatCurrency(item.price) }}</td>
                        <td class="px-4 py-3 text-sm text-right font-semibold text-slate-800">{{ formatCurrency(item.total_price) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Summary -->
              <div class="flex justify-end">
                <div class="bg-indigo-50/40 rounded-2xl p-5 w-full md:w-1/3 border border-indigo-100/60">
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-500">Total Items</span>
                      <span class="text-sm font-medium text-slate-800">{{ viewRecommendation.items_count || 0 }}</span>
                    </div>
                    <div class="flex justify-between pt-3 border-t border-indigo-200/60">
                      <span class="text-base font-semibold text-slate-800">Grand Total</span>
                      <span class="text-xl font-bold text-indigo-600">{{ formatCurrency(viewRecommendation.total_amount) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="bg-amber-50/40 rounded-xl p-4 border border-amber-100/60">
                <h3 class="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
                <div>
                  <span class="text-sm text-slate-500">Prepared by:</span>
                  <span class="ml-2 text-sm font-medium text-slate-800">{{ viewRecommendation.recommended_by?.name || 'N/A' }}</span>
                </div>
                <button
                  @click="closeViewModal"
                  class="mt-4 md:mt-0 px-5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../../../../services/api.js'
import jsPDF from 'jspdf'
import Swal from 'sweetalert2'
import { useAuthStore } from '../../../../store/AuthStore.js'

// State
const authStore = useAuthStore()
const recommendations = ref([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const totalItems = ref(0)
const expandedRows = ref([])
const showViewModal = ref(false)
const viewRecommendation = ref(null)

// Filters
const filters = ref({
  search: '',
  priority: 'all',
  status: 'all'
})

// Statistics
const statistics = computed(() => {
  const all = Array.isArray(recommendations.value) ? recommendations.value : []
  const pending = all.filter(r => r.status === 'Pending')
  const approved = all.filter(r => r.status === 'Approved')
  const rejected = all.filter(r => r.status === 'Rejected')
  const totalAmount = all.reduce((sum, r) => sum + (r.total_amount || 0), 0)

  return {
    total: all.length,
    pending: pending.length,
    approved: approved.length,
    rejected: rejected.length,
    totalAmount: totalAmount
  }
})

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

// Helper Functions
const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'N/A'
  }
}

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
const loadingAccept = ref(false)
const currentAcceptId = ref(null)
// Accept recommendation
const acceptRecommendation = async (recommendation) => {
  const result = await Swal.fire({
    title: 'Accept Recommendation?',
    text: 'This recommendation will be marked as accepted.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Accept',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
  });

  if (!result.isConfirmed) return;

  loadingAccept.value = true;
  currentAcceptId.value = recommendation.id;

  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('status', 'accepted');

    await api().post(`/tenant/equipment-recommendations/${recommendation.id}`, formData);

    await Swal.fire({
      title: 'Accepted!',
      text: 'The recommendation has been successfully accepted.',
      icon: 'success',
      confirmButtonColor: '#2563eb',
      timer: 3000,
      timerProgressBar: true,
    });

    // Reload – no argument needed
    await loadRecommendations();
  } catch (error) {
    console.error('Error accepting recommendation:', error);
    await Swal.fire({
      title: 'Error!',
      text: 'Failed to accept the recommendation. Please try again.',
      icon: 'error',
      confirmButtonColor: '#2563eb',
    });
  } finally {
    loadingAccept.value = false;
    currentAcceptId.value = null;
  }
};

// PDF Generation
const generateRecommendationPDF = (recommendation) => {
    if (!recommendation) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const maxWidth = pageWidth - (margin * 2)
    const bottomLimit = pageHeight - 25
    let y = 0

    // ---- Color Palette ----
    const colors = {
        headerDark: [15, 42, 67],      // deep navy-blue
        headerAccent: [14, 165, 233],  // sky-500 (cyan accent bar)
        primary: [14, 116, 144],       // cyan-700
        primaryLight: [224, 242, 254], // sky-100
        sectionBg: [248, 250, 252],    // slate-50
        labelColor: [71, 85, 105],     // slate-600
        valueColor: [30, 41, 59],      // slate-800
        border: [203, 213, 225],       // slate-300
        tableHeaderBg: [13, 92, 122],  // cyan-800
        zebraBg: [240, 249, 255],      // sky-50
        badgeBg: [219, 234, 254],      // blue-100
        badgeText: [30, 64, 175],      // blue-800
        greenAccent: [5, 150, 105],    // emerald-600
        greenLight: [209, 250, 229],   // emerald-100
        notesBg: [255, 251, 235],      // amber-50
        notesBorder: [253, 230, 138],  // amber-200
        notesText: [146, 111, 5],      // amber-800
        muted: [148, 163, 184],        // slate-400
        white: [255, 255, 255]
    }

    const setFill = (c) => doc.setFillColor(c[0], c[1], c[2])
    const setText = (c) => doc.setTextColor(c[0], c[1], c[2])
    const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2])

    // ============ HEADER ============
    const headerHeight = 36
    setFill(colors.headerDark)
    doc.rect(0, 0, pageWidth, headerHeight, 'F')
    setFill(colors.headerAccent)
    doc.rect(0, headerHeight, pageWidth, 2.5, 'F')

    setText(colors.white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('Maintenance Recommendation', margin, 17)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(203, 224, 240)
    doc.text('Pool Equipment Service Proposal', margin, 25)

    // Right-aligned recommendation number & date
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    setText(colors.white)
    doc.text(`Recommendation #${recommendation.id || 'N/A'}`, pageWidth - margin, 16, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(203, 224, 240)
    doc.text(`Date: ${formatDate(recommendation.created_at)}`, pageWidth - margin, 23, { align: 'right' })

    y = headerHeight + 8

    // ============ INFO SECTION ============
    const infoBoxStartY = y
    const colGap = 8
    const colWidth = (maxWidth - colGap) / 2
    const leftX = margin
    const rightX = margin + colWidth + colGap

    const measureGroup = (rows) => rows.length * 7 + 10

    const recInfoRows = [
        ['Title', recommendation.title || 'N/A'],
        ['Priority', recommendation.priority || 'N/A'],
        ['Status', recommendation.status || 'N/A'],
        ['Recommended By', recommendation.recommended_by?.name || 'N/A']
    ]
    const customerInfoRows = [
        ['Customer', recommendation.customer?.contact_name || 'N/A'],
        ['Email', recommendation.customer?.email || 'N/A'],
        ['Phone', recommendation.customer?.phone || 'N/A']
    ]
    const poolInfoRows = [
        ['Pool', recommendation.pool?.label || 'N/A'],
        ['Service Address', recommendation.pool?.service_address || 'N/A']
    ]

    const leftHeight = measureGroup(recInfoRows) + 10
    const rightHeight = measureGroup(customerInfoRows) + measureGroup(poolInfoRows) + 8
    const infoBoxHeight = Math.max(leftHeight, rightHeight) + 8

    setFill(colors.sectionBg)
    setDraw(colors.border)
    doc.roundedRect(margin, infoBoxStartY, maxWidth, infoBoxHeight, 3, 3, 'FD')

    const drawGroupHeader = (label, x, yy) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9.5)
        setText(colors.primary)
        const upperLabel = label.toUpperCase()
        doc.text(upperLabel, x, yy)

        // Underline only as wide as the text (plus a small padding)
        const textWidth = doc.getTextWidth(upperLabel)
        setDraw(colors.primary)
        doc.setLineWidth(0.5)
        doc.line(x, yy + 1.5, x + textWidth + 2, yy + 1.5)
        doc.setLineWidth(0.2)

        return yy + 8
    }

    const drawKeyValueRow = (label, value, x, yy) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        setText(colors.labelColor)
        doc.text(`${label}:`, x, yy)
        doc.setFont('helvetica', 'normal')
        setText(colors.valueColor)
        const wrapped = doc.splitTextToSize(String(value), colWidth - 32)
        doc.text(wrapped, x + 32, yy)
        return yy + Math.max(6, wrapped.length * 5) + 1.5
    }

    // Left column: Recommendation Information
    let leftY = infoBoxStartY + 10
    leftY = drawGroupHeader('Recommendation Information', leftX + 4, leftY)
    recInfoRows.forEach(([label, value]) => {
        leftY = drawKeyValueRow(label, value, leftX + 4, leftY)
    })

    // Right column: Customer + Pool Information
    let rightY = infoBoxStartY + 10
    rightY = drawGroupHeader('Customer Information', rightX + 4, rightY)
    customerInfoRows.forEach(([label, value]) => {
        rightY = drawKeyValueRow(label, value, rightX + 4, rightY)
    })
    rightY += 3
    rightY = drawGroupHeader('Pool Information', rightX + 4, rightY)
    poolInfoRows.forEach(([label, value]) => {
        rightY = drawKeyValueRow(label, value, rightX + 4, rightY)
    })

    y = infoBoxStartY + infoBoxHeight + 5

    // ============ DESCRIPTION BOX ============
    const descText = recommendation.description || 'No description provided.'
    const wrappedDesc = doc.splitTextToSize(descText, maxWidth - 10)
    const descBoxHeight = wrappedDesc.length * 5 + 16

    setFill(colors.primaryLight)
    setDraw(colors.primary)
    doc.roundedRect(margin, y, maxWidth, descBoxHeight, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setText(colors.primary)
    doc.text('DESCRIPTION', margin + 5, y + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    setText(colors.valueColor)
    doc.text(wrappedDesc, margin + 5, y + 14)

    y += descBoxHeight + 6

    // ============ ITEMS TABLE ============
    const columns = [
        { key: 'idx', label: '#', width: 10, align: 'center' },
        { key: 'item_name', label: 'Item Name', width: 35, align: 'left', bold: true },
        { key: 'description', label: 'Description', width: 50, align: 'left' },
        { key: 'item_type', label: 'Type', width: 25, align: 'center', badge: true },
        { key: 'price', label: 'Unit Price', width: 30, align: 'right' },
        { key: 'total_price', label: 'Total', width: 30, align: 'right', bold: true, accent: true }
    ]
    const tableHeaderHeight = 11

    const drawTableSectionTitle = (yy) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        setText(colors.headerDark)
        doc.text('Recommendation Items', margin, yy)
        return yy + 8
    }

    const drawTableHeader = (yy) => {
        setFill(colors.tableHeaderBg)
        setDraw(colors.tableHeaderBg)
        let x = margin
        columns.forEach(col => {
            doc.rect(x, yy, col.width, tableHeaderHeight, 'FD')
            x += col.width
        })
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        setText(colors.white)
        x = margin
        columns.forEach(col => {
            const textY = yy + tableHeaderHeight / 2 + 1.5
            const align = col.align === 'left' ? undefined : col.align
            const tx = col.align === 'left' ? x + 3
                : col.align === 'right' ? x + col.width - 3
                    : x + col.width / 2
            doc.text(col.label, tx, textY, align ? { align } : undefined)
            x += col.width
        })
        return yy + tableHeaderHeight
    }

    y = drawTableSectionTitle(y)
    y = drawTableHeader(y)

    const items = Array.isArray(recommendation.items) ? recommendation.items : []
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)

    items.forEach((item, index) => {
        const descriptionVal = item.description || item.item_name || 'N/A'
        const wrappedItemDesc = doc.splitTextToSize(String(descriptionVal), columns[2].width - 6)
        const rowHeight = Math.max(10, wrappedItemDesc.length * 4.5 + 6)

        // Page break check — redraw section title + table header on new page
        if (y + rowHeight > bottomLimit) {
            doc.addPage()
            y = 20
            y = drawTableSectionTitle(y)
            y = drawTableHeader(y)
        }

        const isZebra = index % 2 === 1
        setFill(isZebra ? colors.zebraBg : colors.white)
        setDraw(colors.border)

        let x = margin
        columns.forEach(col => {
            doc.rect(x, y, col.width, rowHeight, 'FD')
            x += col.width
        })

        const centerY = y + rowHeight / 2 + 1.5
        x = margin

        // # column
        doc.setFont('helvetica', 'normal')
        setText(colors.valueColor)
        doc.text(String(index + 1), x + columns[0].width / 2, centerY, { align: 'center' })
        x += columns[0].width

        // Item Name (bold)
        doc.setFont('helvetica', 'bold')
        setText(colors.valueColor)
        const nameWrapped = doc.splitTextToSize(item.item_name || 'N/A', columns[1].width - 6)
        doc.text(nameWrapped, x + 3, centerY - ((nameWrapped.length - 1) * 2))
        x += columns[1].width

        // Description
        doc.setFont('helvetica', 'normal')
        setText(colors.labelColor)
        const descStartY = y + 6
        doc.text(wrappedItemDesc, x + 3, descStartY)
        x += columns[2].width

        // Type (badge)
        const typeLabel = item.item_type || 'N/A'
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        const typeTextWidth = doc.getTextWidth(typeLabel)
        const badgeWidth = Math.min(columns[3].width - 6, typeTextWidth + 8)
        const badgeX = x + (columns[3].width - badgeWidth) / 2
        setFill(colors.badgeBg)
        doc.roundedRect(badgeX, centerY - 4.5, badgeWidth, 6.5, 2, 2, 'F')
        setText(colors.badgeText)
        doc.text(typeLabel, x + columns[3].width / 2, centerY, { align: 'center' })
        doc.setFontSize(9)
        x += columns[3].width

        // Unit Price
        doc.setFont('helvetica', 'normal')
        setText(colors.valueColor)
        doc.text(formatCurrency(item.price), x + columns[4].width - 3, centerY, { align: 'right' })
        x += columns[4].width

        // Total (accent, bold)
        doc.setFont('helvetica', 'bold')
        setText(colors.greenAccent)
        doc.text(formatCurrency(item.total_price), x + columns[5].width - 3, centerY, { align: 'right' })

        y += rowHeight
    })

    y += 6

    // ============ SUMMARY BOX ============
    const summaryWidth = 85
    const summaryHeight = 28
    const summaryX = pageWidth - margin - summaryWidth

    if (y + summaryHeight > bottomLimit) {
        doc.addPage()
        y = 20
    }

    setFill(colors.greenLight)
    setDraw(colors.greenAccent)
    doc.roundedRect(summaryX, y, summaryWidth, summaryHeight, 3, 3, 'FD')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    setText(colors.labelColor)
    doc.text('Total Items', summaryX + 6, y + 9)
    setText(colors.valueColor)
    doc.setFont('helvetica', 'bold')
    doc.text(String(recommendation.items_count || 0), summaryX + summaryWidth - 6, y + 9, { align: 'right' })

    setDraw(colors.greenAccent)
    doc.setLineWidth(0.3)
    doc.line(summaryX + 6, y + 13, summaryX + summaryWidth - 6, y + 13)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    setText(colors.valueColor)
    doc.text('Grand Total', summaryX + 6, y + 22)
    doc.setFontSize(15)
    setText(colors.greenAccent)
    doc.text(formatCurrency(recommendation.total_amount), summaryX + summaryWidth - 6, y + 22, { align: 'right' })

    y += summaryHeight + 6

    // ============ NOTES ============
    // ============ NOTES ============
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5) // set font BEFORE measuring wrap width

    const notesText = `This recommendation has been prepared after inspection of the pool equipment. Prices are estimated and may vary depending on actual repair or replacement requirements.`
    const wrappedNotes = doc.splitTextToSize(notesText, maxWidth - 10)
    const notesHeight = wrappedNotes.length * 4.5 + 12

    if (y + notesHeight > bottomLimit) {
        doc.addPage()
        y = 20
    }

    setFill(colors.notesBg)
    setDraw(colors.notesBorder)
    doc.roundedRect(margin, y, maxWidth, notesHeight, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    setText(colors.notesText)
    doc.text('NOTES', margin + 5, y + 7)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    setText([120, 92, 30])
    doc.text(wrappedNotes, margin + 5, y + 13)

    y += notesHeight + 6

    // ============ FOOTER ============
    if (y + 15 > bottomLimit) {
        doc.addPage()
        y = pageHeight - 25
    }
    setDraw(colors.border)
    doc.setLineWidth(0.2)
    doc.line(margin, y, pageWidth - margin, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    setText(colors.muted)
    doc.text('Generated by Pool Management System', pageWidth / 2, y, { align: 'center' })
    y += 4.5
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
})

// Lifecycle
onMounted(() => {
  loadRecommendations()
})

// Stat Card Component
const StatCard = {
  props: ['title', 'value', 'icon', 'color'],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500">{{ title }}</p>
          <p class="text-2xl font-bold text-slate-800 mt-0.5">{{ value }}</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">{{ icon }}</div>
      </div>
    </div>
  `
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>