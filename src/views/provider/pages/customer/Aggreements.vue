```vue
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
        <button class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Agreements
        </button>
        <button class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="i in 3" :key="i" class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="animate-pulse space-y-3">
            <div class="h-4 w-24 rounded bg-gray-200"></div>
            <div class="h-8 w-16 rounded bg-gray-200"></div>
            <div class="h-3 w-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
      <!-- Tabs Skeleton -->
      <div class="flex gap-2">
        <div v-for="i in 3" :key="i" class="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
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
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No {{ currentTab.label.toLowerCase() }} agreements found</h3>
      <p class="mt-1 text-sm text-gray-500">All customer agreements are currently active.</p>
      <button class="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Agreement
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- KPI Cards -->
      <div class="mb-6 grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Active Agreements</p>
              <p class="text-3xl font-bold text-gray-900">174</p>
            </div>
            <div class="rounded-full bg-green-100 p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-green-600">● Active</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Expiring Soon</p>
              <p class="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div class="rounded-full bg-orange-100 p-3">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-orange-600">Expiring within 30 days</div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Cancelled Agreements</p>
              <p class="text-3xl font-bold text-gray-900">8</p>
            </div>
            <div class="rounded-full bg-red-100 p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-sm text-red-600">Cancelled</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        <button
          v-for="tab in tabs"
          :key="tab.label"
          @click="currentTab = tab"
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
          :class="[
            currentTab.label === tab.label
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
          <span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs" :class="currentTab.label === tab.label ? 'bg-gray-100' : ''">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by customer, ID, email..."
              class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Filters -->
        <select v-model="filters.plan" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option v-for="plan in planOptions" :key="plan" :value="plan">{{ plan }}</option>
        </select>

        <select v-model="filters.frequency" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option v-for="freq in frequencyOptions" :key="freq" :value="freq">{{ freq }}</option>
        </select>

        <select v-model="filters.technician" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option v-for="tech in technicianOptions" :key="tech" :value="tech">{{ tech }}</option>
        </select>

        <select v-model="sortOption" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option v-for="sort in sortOptions" :key="sort" :value="sort">{{ sort }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Agreement ID</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service Plan</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Frequency</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Technician</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Start Date</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">End Date</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Monthly Value</th>
                <th class="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th class="sticky top-0 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="agreement in paginatedAgreements" :key="agreement.id" class="transition-colors hover:bg-gray-50">
                <td class="px-4 py-4">
                  <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {{ agreement.id }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                      {{ agreement.customer.split(' ').map(n => n[0]).join('') }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ agreement.customer }}</div>
                      <div class="text-xs text-gray-500">{{ agreement.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ agreement.plan }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ agreement.frequency }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ agreement.technician }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(agreement.start_date) }}</td>
                <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(agreement.end_date) }}</td>
                <td class="px-4 py-4">
                  <span class="text-sm font-medium text-green-600">${{ agreement.monthly_value }}/mo</span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex flex-col gap-1">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': agreement.status === 'Active',
                        'bg-orange-100 text-orange-800': agreement.status === 'Expiring',
                        'bg-red-100 text-red-800': agreement.status === 'Cancelled'
                      }"
                    >
                      {{ agreement.status }}
                    </span>
                    <span v-if="agreement.status === 'Expiring'" class="flex items-center gap-1 text-xs text-orange-600">
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expires in 22 days
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleDropdown(agreement.id)"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <div v-if="openDropdown === agreement.id" class="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                      <div class="py-1">
                        <button
                          v-for="action in getActions(agreement.status)"
                          :key="action"
                          @click="handleAction(action, agreement)"
                          class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          :class="{ 'text-red-600': action === 'Delete Permanently' || action === 'Cancel Agreement' }"
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
        <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredAgreements.length) }} of {{ filteredAgreements.length }} agreements
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Agreement Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto">
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
                <p class="font-medium text-gray-900">John Smith</p>
                <p class="text-sm text-gray-600">john.smith@gmail.com</p>
                <p class="text-sm text-gray-600">+1 (555) 123-4567</p>
                <p class="text-sm text-gray-600">123 Main St, Anytown, USA</p>
              </div>
            </div>

            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-500">Agreement Information</h3>
              <div class="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p class="text-xs text-gray-500">Plan</p>
                  <p class="text-sm font-medium text-gray-900">Weekly Pool Care</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Frequency</p>
                  <p class="text-sm font-medium text-gray-900">Weekly</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Start Date</p>
                  <p class="text-sm font-medium text-gray-900">Jan 01, 2026</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">End Date</p>
                  <p class="text-sm font-medium text-gray-900">Dec 31, 2026</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Monthly Price</p>
                  <p class="text-sm font-medium text-green-600">$180/mo</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Assigned Technician</p>
                  <p class="text-sm font-medium text-gray-900">Mike Carter</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-500">Service History Preview</h3>
              <div class="rounded-lg bg-gray-50 p-4">
                <div class="flex justify-between">
                  <div>
                    <p class="text-xs text-gray-500">Last Service</p>
                    <p class="text-sm font-medium text-gray-900">June 20, 2026</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Next Service</p>
                    <p class="text-sm font-medium text-gray-900">June 27, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="showDetailsModal = false" class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Renew Modal -->
    <div v-if="showRenewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showRenewModal = false"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-xl font-bold text-gray-900">Renew Agreement</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">New End Date</label>
              <input type="date" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">New Monthly Price</label>
              <input type="number" placeholder="$180" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">New Service Plan</label>
              <select class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Weekly Pool Care</option>
                <option>Premium Pool Care</option>
                <option>Biweekly Service</option>
                <option>Monthly Inspection</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button @click="showRenewModal = false" class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Confirm Renewal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showCancelModal = false"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-xl font-bold text-gray-900">Cancel Agreement</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Cancellation Reason</label>
              <select class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Customer Request</option>
                <option>Payment Issue</option>
                <option>Moved Away</option>
                <option>Service Not Needed</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Effective Date</label>
              <input type="date" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea rows="3" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Add any additional notes..."></textarea>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button @click="showCancelModal = false" class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock Data
const agreements = ref([
  {
    id: "AGR-1001",
    customer: "John Smith",
    email: "john.smith@gmail.com",
    plan: "Weekly Pool Care",
    frequency: "Weekly",
    technician: "Mike Carter",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    monthly_value: 180,
    status: "Active"
  },
  {
    id: "AGR-1002",
    customer: "Sarah Johnson",
    email: "sarah.j@gmail.com",
    plan: "Premium Pool Care",
    frequency: "Weekly",
    technician: "Alex Green",
    start_date: "2025-08-01",
    end_date: "2026-07-15",
    monthly_value: 320,
    status: "Expiring"
  },
  {
    id: "AGR-1003",
    customer: "Michael Brown",
    email: "m.brown@gmail.com",
    plan: "Monthly Inspection",
    frequency: "Monthly",
    technician: "David Ross",
    start_date: "2025-04-01",
    end_date: "2026-04-01",
    monthly_value: 95,
    status: "Cancelled"
  },
  {
    id: "AGR-1004",
    customer: "Emily Davis",
    email: "emily.d@gmail.com",
    plan: "Biweekly Service",
    frequency: "Biweekly",
    technician: "Mike Carter",
    start_date: "2026-02-15",
    end_date: "2026-08-15",
    monthly_value: 150,
    status: "Active"
  },
  {
    id: "AGR-1005",
    customer: "Robert Wilson",
    email: "r.wilson@gmail.com",
    plan: "Weekly Pool Care",
    frequency: "Weekly",
    technician: "Alex Green",
    start_date: "2025-11-01",
    end_date: "2026-05-01",
    monthly_value: 200,
    status: "Expiring"
  },
  {
    id: "AGR-1006",
    customer: "Jennifer Lee",
    email: "j.lee@gmail.com",
    plan: "Premium Pool Care",
    frequency: "Weekly",
    technician: "David Ross",
    start_date: "2025-03-01",
    end_date: "2026-03-01",
    monthly_value: 350,
    status: "Cancelled"
  }
])

// State
const loading = ref(false)
const searchQuery = ref('')
const currentTab = ref({ label: 'Active', count: 174 })
const sortOption = ref('Newest')
const openDropdown = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

// Modal states
const showDetailsModal = ref(false)
const showRenewModal = ref(false)
const showCancelModal = ref(false)

// Tabs
const tabs = [
  { label: 'Active', count: 174 },
  { label: 'Expiring', count: 12 },
  { label: 'Cancelled', count: 8 }
]

// Filters
const filters = ref({
  plan: 'All',
  frequency: 'All',
  technician: 'All'
})

// Filter options
const planOptions = ['All', 'Weekly Pool Care', 'Premium Pool Care', 'Biweekly Service', 'Monthly Inspection']
const frequencyOptions = ['All', 'Weekly', 'Biweekly', 'Monthly']
const technicianOptions = ['All', 'Mike Carter', 'Alex Green', 'David Ross']
const sortOptions = ['Newest', 'Oldest', 'Highest Value', 'Lowest Value', 'Ending Soon']

// Computed
const filteredAgreements = computed(() => {
  let result = agreements.value.filter(a => a.status === currentTab.value.label)

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.customer.toLowerCase().includes(query) ||
      a.id.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query)
    )
  }

  // Filters
  if (filters.value.plan !== 'All') {
    result = result.filter(a => a.plan === filters.value.plan)
  }
  if (filters.value.frequency !== 'All') {
    result = result.filter(a => a.frequency === filters.value.frequency)
  }
  if (filters.value.technician !== 'All') {
    result = result.filter(a => a.technician === filters.value.technician)
  }

  // Sort
  switch(sortOption.value) {
    case 'Newest':
      result.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      break
    case 'Oldest':
      result.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      break
    case 'Highest Value':
      result.sort((a, b) => b.monthly_value - a.monthly_value)
      break
    case 'Lowest Value':
      result.sort((a, b) => a.monthly_value - b.monthly_value)
      break
    case 'Ending Soon':
      result.sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
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

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const getActions = (status) => {
  switch(status) {
    case 'Active':
      return ['View Agreement', 'Edit Agreement', 'Renew Agreement', 'Pause Agreement', 'Cancel Agreement']
    case 'Expiring':
      return ['View Agreement', 'Renew Agreement', 'Edit Agreement', 'Cancel Agreement']
    case 'Cancelled':
      return ['View Agreement', 'Restore Agreement', 'Delete Permanently']
    default:
      return []
  }
}

const handleAction = (action, agreement) => {
  openDropdown.value = null
  switch(action) {
    case 'View Agreement':
      showDetailsModal.value = true
      break
    case 'Renew Agreement':
      showRenewModal.value = true
      break
    case 'Cancel Agreement':
      showCancelModal.value = true
      break
    default:
      console.log(`${action} clicked for ${agreement.id}`)
  }
}

// API Integration (commented)
// import axios from '@/services/api'
// const fetchAgreements = async (status) => {
//   loading.value = true
//   try {
//     const response = await axios.get(`/service-agreements?status=${status}`)
//     agreements.value = response.data.data
//   } catch (error) {
//     console.error(error)
//   } finally {
//     loading.value = false
//   }
// }

onMounted(() => {
  // fetchAgreements('active')
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
</style>
```