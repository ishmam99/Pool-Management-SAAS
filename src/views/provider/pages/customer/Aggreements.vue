<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <!-- Page Header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Service Agreements</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage customer contracts, recurring services, renewals, and cancellations.
        </p>
      </div>
      <div class="flex gap-3">
        <button @click="handleExport"
          class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Agreements
        </button>
        <button @click="handleCreateAgreement"
          class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Agreement
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <!-- KPI Skeleton -->
      <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div v-for="i in 6" :key="i" class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="animate-pulse space-y-3">
            <div class="h-4 w-24 rounded bg-gray-200"></div>
            <div class="h-8 w-16 rounded bg-gray-200"></div>
            <div class="h-3 w-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
      <!-- Tabs Skeleton -->
      <div class="flex gap-2">
        <div v-for="i in 5" :key="i" class="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
      </div>
      <!-- Table Skeleton -->
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-12 w-full rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredAgreements.length === 0" class="rounded-2xl bg-white p-12 text-center shadow-sm">
        <div class="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto">
        <button v-for="tab in dynamicTabs" :key="tab.value" @click="switchTab(tab.value)"
          class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200" :class="[
            currentTab === tab.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          ]">
          {{ tab.label }}
          <span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs"
            :class="currentTab === tab.value ? 'bg-gray-100' : ''">
            {{ tab.count }}
          </span>
        </button>
      </div>
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">{{ getEmptyStateMessage() }}</h3>
      <p class="mt-1 text-sm text-gray-500">Create a new agreement to get started.</p>
      <button @click="handleCreateAgreement"
        class="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Agreement
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- KPI Cards -->
      <div class="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Active Agreements</p>
              <p class="text-3xl font-bold text-gray-900">{{ summary.active || 0 }}</p>
            </div>
            <div class="rounded-full bg-green-100 p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-green-600">● Active</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Draft Agreements</p>
              <p class="text-3xl font-bold text-gray-900">{{ summary.draft || 0 }}</p>
            </div>
            <div class="rounded-full bg-yellow-100 p-3">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-yellow-600">● Draft</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Paused Agreements</p>
              <p class="text-3xl font-bold text-gray-900">{{ summary.paused || 0 }}</p>
            </div>
            <div class="rounded-full bg-orange-100 p-3">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-orange-600">● Paused</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Cancelled Agreements</p>
              <p class="text-3xl font-bold text-gray-900">{{ summary.cancelled || 0 }}</p>
            </div>
            <div class="rounded-full bg-red-100 p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-red-600">● Cancelled</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Average Revenue</p>
              <p class="text-3xl font-bold text-gray-900">${{ summary.averageAgreementPrice || 0 }}</p>
            </div>
            <div class="rounded-full bg-blue-100 p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-blue-600">Average Revenue per Agreement</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Monthly Revenue</p>
              <p class="text-3xl font-bold text-gray-900">${{ summary.totalMonthlyRevenue || 0 }}</p>
            </div>
            <div class="rounded-full bg-purple-100 p-3">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-purple-600">Total Monthly Recurring Revenue</div>
        </div>
      </div>

      <!-- Tabs (Frontend Filters Only) -->
      <div class="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto">
        <button v-for="tab in dynamicTabs" :key="tab.value" @click="switchTab(tab.value)"
          class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200" :class="[
            currentTab === tab.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          ]">
          {{ tab.label }}
          <span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs"
            :class="currentTab === tab.value ? 'bg-gray-100' : ''">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by customer, ID, email..."
              class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              @input="resetPagination" />
          </div>
        </div>

        <!-- Filters -->
        <select v-model="filters.technician"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          @change="resetPagination">
          <option v-for="tech in technicianOptions" :key="tech" :value="tech">{{ tech }}</option>
        </select>

        <select v-model="sortOption"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          @change="resetPagination">
          <option v-for="sort in sortOptions" :key="sort" :value="sort">{{ sort }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Agreement ID</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pools</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Frequency</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Billing</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Technician</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Start Date</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  End Date</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status</th>
                <th
                  class="sticky top-0 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="agreement in paginatedAgreements" :key="agreement.id"
                class="transition-colors hover:bg-gray-50">
                <td class="px-4 py-4">
                  <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    #{{ agreement.id }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                      {{ getInitials(agreement.customer?.contact_name || 'Unknown') }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ agreement.customer?.contact_name || 'Unknown' }}
                      </div>
                      <div class="text-xs text-gray-500">{{ agreement.customer?.email || 'No email' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="pool in agreement.pools" :key="pool.id"
                      class="rounded-full bg-cyan-100 text-cyan-700 px-2 py-1 text-xs">
                      {{ pool.label }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ formatFrequency(agreement.frequency) }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ agreement.billing_cycle || 'N/A' }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ agreement.assigned_technician?.name || 'Unassigned' }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(agreement.start_date) }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(agreement.end_date) }}</td>
                <td class="px-4 py-4">
                  <span class="text-sm font-medium text-green-600">${{ agreement.price }}/mo</span>
                </td>
                <td class="px-4 py-4">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="getStatusBadgeClass(agreement.status)">
                    {{ formatStatus(agreement.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="relative inline-block text-left">
                    <button @click="toggleDropdown(agreement.id)"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <div v-if="openDropdown === agreement.id"
                      class="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                      <div class="py-1">
                        <button v-for="action in getActions(agreement.status)" :key="action.label"
                          @click="handleAction(action, agreement)"
                          class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          :class="{ 'text-red-600': action.label === 'Cancel Agreement' || action.label === 'Delete Draft' }">
                          {{ action.label }}
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
        <div class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 px-4 py-3 gap-3">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize,
              filteredAgreements.length) }} of {{ filteredAgreements.length }} agreements
          </div>
          <div class="flex gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Agreement Details Modal -->
    <div v-if="showDetailsModal && selectedAgreement" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showDetailsModal = false"></div>
        <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
          <button @click="showDetailsModal = false" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="mb-4 text-xl font-bold text-gray-900">Agreement Details</h2>

          <div class="space-y-6">
            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-500">Customer Information</h3>
              <div class="rounded-lg bg-gray-50 p-4">
                <p class="font-medium text-gray-900">{{ selectedAgreement.customer?.contact_name || 'Unknown' }}</p>
                <p class="text-sm text-gray-600">{{ selectedAgreement.customer?.email || 'No email' }}</p>
                <p class="text-sm text-gray-600">{{ selectedAgreement.customer?.phone || 'No phone' }}</p>
                <p class="text-sm text-gray-600">{{ selectedAgreement.customer?.address || 'No address' }}</p>
              </div>
            </div>

            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-500">Agreement Information</h3>
              <div class="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p class="text-xs text-gray-500">Frequency</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatFrequency(selectedAgreement.frequency) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Billing Cycle</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedAgreement.billing_cycle || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Price</p>
                  <p class="text-sm font-medium text-green-600">${{ selectedAgreement.price }}/mo</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Start Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedAgreement.start_date) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">End Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedAgreement.end_date) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Technician</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedAgreement.assigned_technician?.name ||
                    'Unassigned' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="getStatusBadgeClass(selectedAgreement.status)">
                    {{ formatStatus(selectedAgreement.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Auto Renew</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedAgreement.auto_renew ? 'Yes' : 'No' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs text-gray-500">Pools</p>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span v-for="pool in selectedAgreement.pools" :key="pool.id"
                      class="rounded-full bg-cyan-100 text-cyan-700 px-2 py-1 text-xs">
                      {{ pool.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button @click="downloadAgreementPdf(selectedAgreement)"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Download PDF
            </button>
            <button @click="showDetailsModal = false"
              class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../../../services/api'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()

// State
const loading = ref(false)
const agreements = ref([])
const technicians = ref([])
const summary = ref({
  active: 0,
  draft: 0,
  paused: 0,
  cancelled: 0,
  totalMonthlyRevenue: 0,
  averageAgreementPrice: 0
})
const searchQuery = ref('')
const currentTab = ref('all')
const sortOption = ref('Newest')
const openDropdown = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedAgreement = ref(null)

// Modal states
const showDetailsModal = ref(false)

// Filter options
const technicianOptions = computed(() => {
  return ['All', ...technicians.value.map(t => t.name)]
})

const sortOptions = ['Newest', 'Oldest', 'Highest Value', 'Lowest Value']

// Filters
const filters = ref({
  technician: 'All'
})

// Dynamic tabs with counts from loaded agreements
const dynamicTabs = computed(() => [
  { label: 'All', value: 'all', count: agreements.value.length },
  { label: 'Draft', value: 'draft', count: agreements.value.filter(a => a.status === 'draft').length },
  { label: 'Active', value: 'active', count: agreements.value.filter(a => a.status === 'active').length },
  { label: 'Paused', value: 'paused', count: agreements.value.filter(a => a.status === 'paused').length },
  { label: 'Cancelled', value: 'cancelled', count: agreements.value.filter(a => a.status === 'cancelled').length }
])

// Computed
const filteredAgreements = computed(() => {
  let result = [...agreements.value]

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.id?.toString().includes(query) ||
      a.customer?.contact_name?.toLowerCase().includes(query) ||
      a.customer?.email?.toLowerCase().includes(query)
    )
  }

  // Status-based filtering
  if (currentTab.value !== 'all') {
    result = result.filter(a => a.status === currentTab.value)
  }

  // Technician filter
  if (filters.value.technician !== 'All') {
    result = result.filter(a => a.assigned_technician?.name === filters.value.technician)
  }

  // Sort
  switch (sortOption.value) {
    case 'Newest':
      result.sort((a, b) => new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date))
      break
    case 'Oldest':
      result.sort((a, b) => new Date(a.created_at || a.start_date) - new Date(b.created_at || b.start_date))
      break
    case 'Highest Value':
      result.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'Lowest Value':
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredAgreements.value.length / pageSize.value))

const paginatedAgreements = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAgreements.value.slice(start, end)
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const formatFrequency = (frequency) => {
  if (!frequency) return 'N/A'
  const map = {
    'weekly': 'Weekly',
    'biweekly': 'Biweekly',
    'monthly': 'Monthly'
  }
  return map[frequency.toLowerCase()] || frequency
}

const formatStatus = (status) => {
  if (!status) return 'N/A'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'draft': 'bg-yellow-100 text-yellow-800',
    'paused': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getEmptyStateMessage = () => {
  const messages = {
    'all': 'No agreements found',
    'draft': 'No draft agreements found',
    'active': 'No active agreements found',
    'paused': 'No paused agreements found',
    'cancelled': 'No cancelled agreements found'
  }
  return messages[currentTab.value] || 'No agreements found'
}

const getActions = (status) => {
  const actions = {
    'active': [
      { label: 'View Agreement', action: 'view' },
      { label: 'Edit Agreement', action: 'edit' },
      { label: 'Pause Agreement', action: 'pause' },
      { label: 'Cancel Agreement', action: 'cancel' },
      { label: 'Download PDF', action: 'pdf' }
    ],
    'draft': [
      { label: 'View Agreement', action: 'view' },
      { label: 'Edit Agreement', action: 'edit' },
      { label: 'Activate Agreement', action: 'activate' },
      { label: 'Delete Draft', action: 'delete' }
    ],
    'paused': [
      { label: 'View Agreement', action: 'view' },
      { label: 'Resume Agreement', action: 'resume' },
      { label: 'Edit Agreement', action: 'edit' },
      { label: 'Cancel Agreement', action: 'cancel' },
      { label: 'Download PDF', action: 'pdf' }
    ],
    'cancelled': [
      { label: 'View Agreement', action: 'view' },
      { label: 'Download PDF', action: 'pdf' }
    ]
  }
  return actions[status?.toLowerCase()] || []
}

// API Functions
const fetchAgreements = async () => {
  loading.value = true
  try {
    const response = await api().get('/service-agreement-management/agreements-advance', {
      params: {
        with: 'customer,assignedTechnician,pools'
      }
    })

    agreements.value = response.data.data || response.data || []
    
    // Update summary from agreements
    updateSummaryFromAgreements()
    
    // Reset pagination
    resetPagination()
  } catch (error) {
    console.error('Error fetching agreements:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Load Agreements',
      text: error.response?.data?.message || 'Something went wrong'
    })
    agreements.value = []
  } finally {
    loading.value = false
  }
}

const updateSummaryFromAgreements = () => {
  const active = agreements.value.filter(a => a.status === 'active')
  const draft = agreements.value.filter(a => a.status === 'draft')
  const paused = agreements.value.filter(a => a.status === 'paused')
  const cancelled = agreements.value.filter(a => a.status === 'cancelled')
  
  // Calculate total monthly revenue (sum of active agreements)
const totalMonthlyRevenue = agreements.value.reduce(
  (sum, a) => sum + Number(a.price || 0),
  0
)
  
  // Calculate average agreement price (across all agreements)
const totalPrice = agreements.value.reduce(
  (sum, a) => sum + Number(a.price ?? 0),
  0
)

const averageAgreementPrice =
  agreements.value.length > 0
    ? Math.round(totalPrice / agreements.value.length)
    : 0

  summary.value = {
    active: active.length,
    draft: draft.length,
    paused: paused.length,
    cancelled: cancelled.length,
    totalMonthlyRevenue,
    averageAgreementPrice
  }
}

const fetchTechnicians = async () => {
  try {
    const response = await api().get('/user-management/technicians')
    technicians.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching technicians:', error)
    technicians.value = []
  }
}

// Export Functions
const exportAgreementsExcel = () => {
  const rows = agreements.value.map(a => ({
    Agreement_ID: a.id,
    Customer: a.customer?.contact_name || 'Unknown',
    Email: a.customer?.email || 'No email',
    Frequency: formatFrequency(a.frequency),
    Billing_Cycle: a.billing_cycle || 'N/A',
    Price: a.price || 0,
    Technician: a.assigned_technician?.name || 'Unassigned',
    Start_Date: a.start_date || 'N/A',
    End_Date: a.end_date || 'N/A',
    Status: formatStatus(a.status),
    Pools: a.pools?.map(p => p.label).join(', ') || 'No pools'
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Agreements')
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buffer]), `agreements-${Date.now()}.xlsx`)
}

const downloadAgreementPdf = (agreement) => {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text(`Service Agreement #${agreement.id}`, 14, 20)

  autoTable(doc, {
    startY: 30,
    body: [
      ['Customer', agreement.customer?.contact_name || 'Unknown'],
      ['Email', agreement.customer?.email || 'No email'],
      ['Phone', agreement.customer?.phone || 'No phone'],
      ['Frequency', formatFrequency(agreement.frequency)],
      ['Billing Cycle', agreement.billing_cycle || 'N/A'],
      ['Price', `$${agreement.price || 0}`],
      ['Technician', agreement.assigned_technician?.name || 'Unassigned'],
      ['Start Date', agreement.start_date || 'N/A'],
      ['End Date', agreement.end_date || 'N/A'],
      ['Status', formatStatus(agreement.status)],
      ['Auto Renew', agreement.auto_renew ? 'Yes' : 'No'],
      ['Pools', agreement.pools?.map(p => p.label).join(', ') || 'No pools']
    ]
  })

  doc.save(`agreement-${agreement.id}.pdf`)
}

// Actions
const switchTab = (tabValue) => {
  if (currentTab.value === tabValue) return
  currentTab.value = tabValue
  currentPage.value = 1
}

const resetPagination = () => {
  currentPage.value = 1
}

const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const handleAction = (action, agreement) => {
  openDropdown.value = null

  switch (action.action) {
    case 'view':
      selectedAgreement.value = agreement
      showDetailsModal.value = true
      break
    case 'edit':
      router.push(`/provider/customers-agreements/${agreement.id}/edit`)
      break
    case 'pdf':
      downloadAgreementPdf(agreement)
      break
    case 'pause':
      handlePauseAgreement(agreement)
      break
    case 'resume':
      handleResumeAgreement(agreement)
      break
    case 'cancel':
      handleCancelAgreement(agreement)
      break
    case 'activate':
      handleActivateAgreement(agreement)
      break
    case 'delete':
      handleDeleteDraft(agreement)
      break
    default:
      console.log(`Unknown action: ${action.action}`)
  }
}

const updateAgreementStatus = async (id, status, additionalData = {}) => {
  try {
    await api().put(`/service-agreement-management/agreements/${id}`, {
      status,
      ...additionalData
    })

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Agreement ${status} successfully`
    })

    await fetchAgreements()
  } catch (error) {
    console.error('Error updating agreement:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Update Agreement',
      text: error.response?.data?.message || 'Something went wrong'
    })
  }
}

const handlePauseAgreement = async (agreement) => {
  const result = await Swal.fire({
    title: 'Pause Agreement?',
    text: `Are you sure you want to pause agreement #${agreement.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Pause',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    await updateAgreementStatus(agreement.id, 'paused')
  }
}

const handleResumeAgreement = async (agreement) => {
  const result = await Swal.fire({
    title: 'Resume Agreement?',
    text: `Are you sure you want to resume agreement #${agreement.id}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Resume',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    await updateAgreementStatus(agreement.id, 'active')
  }
}

const handleCancelAgreement = async (agreement) => {
  const result = await Swal.fire({
    title: 'Cancel Agreement?',
    text: `Are you sure you want to cancel agreement #${agreement.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Cancel',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626'
  })

  if (result.isConfirmed) {
    await updateAgreementStatus(agreement.id, 'cancelled')
  }
}

const handleActivateAgreement = async (agreement) => {
  const result = await Swal.fire({
    title: 'Activate Agreement?',
    text: `Are you sure you want to activate agreement #${agreement.id}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Activate',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    await updateAgreementStatus(agreement.id, 'active')
  }
}

const handleDeleteDraft = async (agreement) => {
  const result = await Swal.fire({
    title: 'Delete Draft?',
    text: `Are you sure you want to delete draft agreement #${agreement.id}? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626'
  })

  if (result.isConfirmed) {
    try {
      await api().delete(`/service-agreement-management/agreements/${agreement.id}`)

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Draft agreement deleted successfully'
      })

      await fetchAgreements()
    } catch (error) {
      console.error('Error deleting agreement:', error)
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete Agreement',
        text: error.response?.data?.message || 'Something went wrong'
      })
    }
  }
}

const handleCreateAgreement = () => {
  router.push('/provider/customers-agreements/create')
}

const handleExport = () => {
  exportAgreementsExcel()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchAgreements(),
    fetchTechnicians()
  ])
})
</script>

<style scoped>
/* Smooth transitions for tab switching */
.rounded-xl {
  transition: background-color 0.2s ease;
}

/* Table hover effect */
tbody tr {
  transition: background-color 0.15s ease;
}

/* Dropdown animation */
.absolute {
  transform-origin: top right;
  animation: dropdownAppear 0.15s ease;
}

@keyframes dropdownAppear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Modal backdrop blur */
.fixed.inset-0.bg-black {
  backdrop-filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* Scrollable tabs on mobile */
.overflow-x-auto {
  scrollbar-width: thin;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
</style>