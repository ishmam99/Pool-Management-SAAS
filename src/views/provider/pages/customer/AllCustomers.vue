<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="mt-1 text-sm text-gray-500">Manage all pool service customers and agreements.</p>
      </div>
      <div class="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0 md:mt-0">
        <router-link to="/provider/customer-create"
          class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl">
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </router-link>
      </div>
    </div>

    <!-- KPI Cards -->
    <div v-if="!loading" class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(kpi, index) in kpis" :key="index"
        class="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.count }}</p>
            <p class="text-sm text-gray-600">{{ kpi.label }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3">
            <component :is="kpi.icon" class="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span :class="kpi.trend > 0 ? 'text-emerald-600' : 'text-red-600'" class="font-medium">
            {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
          </span>
          <span class="ml-1 text-gray-500">vs last month</span>
        </div>
      </div>
    </div>

    <!-- KPI Skeleton Loading -->
    <div v-else class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="animate-pulse">
          <div class="mb-2 h-8 w-20 rounded bg-gray-200"></div>
          <div class="h-4 w-32 rounded bg-gray-200"></div>
          <div class="mt-3 h-4 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
        <!-- Search -->
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search by name, email, or phone..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>

        <!-- Status Filter -->
        <select v-model="statusFilter"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-40">
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Agreement Filter -->
        <select v-model="agreementFilter"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-40">
          <option v-for="status in agreementOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Sort By -->
        <select v-model="sortBy"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-44">
          <option v-for="option in sortOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table Section -->
    <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Customer</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Contact</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Address</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Pools</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Agreement</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Monthly Value</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status</th>
              <th
                class="sticky top-0 whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-8">
                <div class="space-y-3">
                  <div v-for="i in 5" :key="i" class="animate-pulse">
                    <div class="flex items-center space-x-4">
                      <div class="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 w-32 rounded bg-gray-200"></div>
                        <div class="h-3 w-48 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-4 w-24 rounded bg-gray-200"></div>
                      <div class="h-4 w-20 rounded bg-gray-200"></div>
                      <div class="h-6 w-16 rounded-full bg-gray-200"></div>
                      <div class="h-6 w-6 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="filteredCustomers.length === 0">
              <td colspan="8" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center">
                  <svg class="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900">No customers found</h3>
                  <p class="mt-1 text-sm text-gray-500">Create your first customer to get started.</p>
                  <button
                    @click="router.push('/provider/customer-create')"
                    class="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Customer
                  </button>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-else v-for="customer in paginatedCustomers" :key="customer.id"
              class="transition-colors hover:bg-gray-50">
              <!-- Customer -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-semibold text-blue-700">
                    {{ getAvatarInitial(customer) }}
                  </div>
                <router-link :to="`/provider/customer-details/${customer.id}`">
                    <p class="text-sm font-medium text-blue-900">{{ customer.contact_name }}</p>
                    <p class="text-xs text-gray-500">ID: {{ customer.id }}</p>
                  </router-link>
                </div>
              </td>
              <!-- Contact -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm text-gray-900">{{ customer.email || 'N/A' }}</div>
                <div class="text-xs text-gray-500">{{ customer.phone || 'N/A' }}</div>
              </td>
              <!-- Address -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm text-gray-900">{{ customer.billing_address || 'N/A' }}</div>
              </td>
              <!-- Pools -->
              <td class="px-4 py-3">
                <div class="flex flex-col space-y-1">
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                      {{ getPoolCount(customer) }}
                    </span>
                    <button
                      @click="openViewPoolsModal(customer)"
                      class="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                      View Pools
                    </button>
                  </div>
                  <!-- Pool Labels Preview -->
                  <div v-if="customer.pools && customer.pools.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="pool in customer.pools.slice(0, 2)" :key="pool.id"
                      class="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {{ pool.label }}
                    </span>
                    <span v-if="customer.pools.length > 2"
                      class="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      +{{ customer.pools.length - 2 }}
                    </span>
                  </div>
                </div>
              </td>
              <!-- Agreement -->
              <td class="px-4 py-3">
                <div class="flex flex-col space-y-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">
                      {{ getAgreementFrequency(customer) }}
                    </span>
                    <button
                      @click="openViewAgreementsModal(customer)"
                      class="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                      View
                    </button>
                  </div>
                  <span :class="getAgreementStatusClasses(customer)"
                    class="inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium">
                    {{ getAgreementStatus(customer) }}
                  </span>
                  <div v-if="customer.agreements && customer.agreements.length > 0" class="text-xs text-gray-500">
                    {{ customer.agreements[0].frequency }} · ${{ customer.agreements[0].price }}/{{ customer.agreements[0].billing_cycle }}
                  </div>
                </div>
              </td>
              <!-- Monthly Value -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="text-sm font-medium text-gray-900">${{ getMonthlyValue(customer) }}</div>
                <div class="text-xs text-gray-500">
                  {{ getAgreementFrequency(customer) }}
                </div>
              </td>
              <!-- Status -->
              <td class="whitespace-nowrap px-4 py-3">
                <span :class="getCustomerStatusClasses(customer.status)"
                  class="inline-block rounded-full px-3 py-1 text-xs font-medium">
                  {{ capitalizeFirstLetter(customer.status) }}
                </span>
              </td>
              <!-- Actions -->
              <td class="whitespace-nowrap px-4 py-3">
                <div class="relative" @click.stop>
                  <button @click="toggleDropdown(customer.id)"
                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <div v-if="activeDropdown === customer.id"
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button @click="openViewCustomerModal(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Customer
                    </button>
                    <button @click="editCustomer(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Customer
                    </button>
                    <button @click="openViewPoolsModal(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      View Pools ({{ getPoolCount(customer) }})
                    </button>
                    <button @click="openViewAgreementsModal(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Agreements ({{ getAgreementCount(customer) }})
                    </button>
                    <button @click="createAgreement(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Create Agreement
                    </button>
                    <div class="border-t border-gray-100"></div>
                    <button @click="deactivateCustomer(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50">
                      <svg class="mr-3 h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Deactivate Customer
                    </button>
                    <button @click="deleteCustomer(customer)"
                      class="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50">
                      <svg class="mr-3 h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Customer
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCustomers.length > 0"
        class="flex flex-col items-center justify-between border-t border-gray-200 px-4 py-4 sm:flex-row">
        <div class="mb-2 text-sm text-gray-600 sm:mb-0">
          Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredCustomers.length) }} of {{ filteredCustomers.length
          }} customers
        </div>
        <div class="flex space-x-2">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
            Previous
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- View Customer Modal -->
    <div v-if="showViewCustomerModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeViewCustomerModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
          <!-- Modal Header -->
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Customer Details</h3>
            <button @click="closeViewCustomerModal" class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Customer Details -->
          <div v-if="viewingCustomer" class="space-y-6">
            <div class="flex items-center space-x-4 border-b border-gray-200 pb-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-2xl font-semibold text-blue-700">
                {{ getAvatarInitial(viewingCustomer) }}
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">{{ viewingCustomer.contact_name }}</h4>
                <p class="text-sm text-gray-500">Customer ID: #{{ viewingCustomer.id }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Type</label>
                <p class="mt-1 text-sm text-gray-900">{{ capitalizeFirstLetter(viewingCustomer.type) || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Status</label>
                <p class="mt-1">
                  <span :class="getCustomerStatusClasses(viewingCustomer.status)"
                    class="inline-block rounded-full px-3 py-1 text-xs font-medium">
                    {{ capitalizeFirstLetter(viewingCustomer.status) }}
                  </span>
                </p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ viewingCustomer.email || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{{ viewingCustomer.phone || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Preferred Contact</label>
                <p class="mt-1 text-sm text-gray-900">{{ capitalizeFirstLetter(viewingCustomer.preferred_contact) || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Billing Address</label>
                <p class="mt-1 text-sm text-gray-900">{{ viewingCustomer.billing_address || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Company Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ viewingCustomer.company_name || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Created</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(viewingCustomer.created_at) }}</p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-lg bg-gray-50 p-4 text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ getPoolCount(viewingCustomer) }}</p>
                  <p class="text-xs text-gray-500">Total Pools</p>
                </div>
                <div class="rounded-lg bg-gray-50 p-4 text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ getAgreementCount(viewingCustomer) }}</p>
                  <p class="text-xs text-gray-500">Total Agreements</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="mt-6 flex space-x-3 border-t border-gray-200 pt-4">
            <button @click="closeViewCustomerModal"
              class="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
              Close
            </button>
            <button @click="openEditModal(viewingCustomer); closeViewCustomerModal()"
              class="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
              Edit Customer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Pools Modal -->
    <div v-if="showViewPoolsModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeViewPoolsModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
          <!-- Modal Header -->
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Pools for {{ viewingCustomer?.contact_name }}</h3>
              <p class="text-sm text-gray-500">{{ getPoolCount(viewingCustomer) }} pools found</p>
            </div>
            <button @click="closeViewPoolsModal" class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Pools List -->
          <div v-if="viewingCustomer?.pools?.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
            <div v-for="pool in viewingCustomer.pools" :key="pool.id"
              class="rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-semibold text-gray-900">{{ pool.label }}</h4>
                    <span :class="pool.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                      {{ pool.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-xs text-gray-500">Service Address</span>
                      <p class="text-gray-900">{{ pool.service_address || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Chemical Type</span>
                      <p class="text-gray-900">{{ capitalizeFirstLetter(pool.chemical_type) || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Volume (Gallons)</span>
                      <p class="text-gray-900">{{ pool.volume_gallons || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Season</span>
                      <p class="text-gray-900">{{ capitalizeFirstLetter(pool.season) || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Gate Code</span>
                      <p class="text-gray-900">{{ pool.gate_code || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Has Dog</span>
                      <p class="text-gray-900">{{ pool.has_dog ? 'Yes' : 'No' }}</p>
                    </div>
                  </div>
                  <div v-if="pool.access_notes" class="mt-2 rounded-lg bg-yellow-50 p-2 text-sm">
                    <span class="text-xs font-medium text-yellow-700">Access Notes:</span>
                    <p class="text-yellow-800">{{ pool.access_notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No pools found for this customer.</p>
          </div>

          <!-- Modal Actions -->
          <div class="mt-6 flex space-x-3 border-t border-gray-200 pt-4">
            <button @click="closeViewPoolsModal"
              class="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
              Close
            </button>
            <button @click="router.push(`/provider/customers/${viewingCustomer?.id}/pools`)"
              class="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
              Manage All Pools
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Agreements Modal -->
    <div v-if="showViewAgreementsModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeViewAgreementsModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
          <!-- Modal Header -->
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Agreements for {{ viewingCustomer?.contact_name }}</h3>
              <p class="text-sm text-gray-500">{{ getAgreementCount(viewingCustomer) }} agreements found</p>
            </div>
            <button @click="closeViewAgreementsModal" class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Agreements List -->
          <div v-if="viewingCustomer?.agreements?.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
            <div v-for="agreement in viewingCustomer.agreements" :key="agreement.id"
              class="rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h4 class="text-sm font-semibold text-gray-900">Agreement #{{ agreement.id }}</h4>
                    <span :class="getAgreementStatusClassesFromStatus(agreement.status)"
                      class="inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                      {{ capitalizeFirstLetter(agreement.status) }}
                    </span>
                  </div>
                  <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-xs text-gray-500">Frequency</span>
                      <p class="text-gray-900">{{ capitalizeFirstLetter(agreement.frequency) || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Billing Cycle</span>
                      <p class="text-gray-900">{{ capitalizeFirstLetter(agreement.billing_cycle) || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Price</span>
                      <p class="text-gray-900 font-medium">${{ parseFloat(agreement.price).toFixed(2) }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Assigned Technician</span>
                      <p class="text-gray-900">#{{ agreement.assigned_technician_id || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Start Date</span>
                      <p class="text-gray-900">{{ formatDate(agreement.start_date) }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">End Date</span>
                      <p class="text-gray-900">{{ formatDate(agreement.end_date) }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Auto Renew</span>
                      <p class="text-gray-900">{{ agreement.auto_renew ? 'Yes' : 'No' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No agreements found for this customer.</p>
          </div>

          <!-- Modal Actions -->
          <div class="mt-6 flex space-x-3 border-t border-gray-200 pt-4">
            <button @click="closeViewAgreementsModal"
              class="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
              Close
            </button>
            <button @click="router.push(`/provider/customers/${viewingCustomer?.id}/agreements`)"
              class="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
              Manage All Agreements
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Customer Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeEditModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
          <!-- Modal Header -->
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Edit Customer</h3>
            <button @click="closeEditModal" class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Edit Form -->
          <form @submit.prevent="updateCustomer" class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Type</label>
              <select v-model="editForm.type"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Contact Name</label>
              <input v-model="editForm.contact_name" type="text" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
              <input v-model="editForm.phone" type="tel" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <select v-model="editForm.status"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <!-- Form Actions -->
            <div class="mt-6 flex space-x-3">
              <button type="button" @click="closeEditModal"
                class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit"
                class="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70"
                :disabled="updating">
                <span v-if="updating">Updating...</span>
                <span v-else>Update Customer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'

const router = useRouter()

// State
const loading = ref(false)
const updating = ref(false)
const customers = ref([])
const searchQuery = ref('')
const statusFilter = ref('All')
const agreementFilter = ref('All')
const sortBy = ref('Newest')
const currentPage = ref(1)
const itemsPerPage = 5
const activeDropdown = ref(null)

// Modal States
const showViewCustomerModal = ref(false)
const showViewPoolsModal = ref(false)
const showViewAgreementsModal = ref(false)
const showEditModal = ref(false)
const viewingCustomer = ref(null)
const editForm = ref({
  type: 'residential',
  contact_name: '',
  phone: '',
  status: 'active'
})
const editingCustomerId = ref(null)

// Options
const statusOptions = computed(() => {
  const statuses = ['All']
  customers.value.forEach(customer => {
    if (customer.status && !statuses.includes(capitalizeFirstLetter(customer.status))) {
      statuses.push(capitalizeFirstLetter(customer.status))
    }
  })
  return statuses
})

const agreementOptions = ['All', 'Active', 'Pending', 'Expired', 'Cancelled']
const sortOptions = ['Newest', 'Oldest', 'Highest Revenue', 'Lowest Revenue']

// KPI Data
const kpis = computed(() => {
  const total = customers.value.length
  const active = customers.value.filter(c => c.status === 'active').length
  const totalPools = customers.value.reduce((sum, customer) => sum + (customer.pools?.length || 0), 0)
  const totalAgreements = customers.value.reduce((sum, customer) => sum + (customer.agreements?.length || 0), 0)

  return [
    {
      count: total,
      label: 'Total Customers',
      trend: 12,
      icon: 'UsersIcon'
    },
    {
      count: active,
      label: 'Active Customers',
      trend: 8,
      icon: 'UserCheckIcon'
    },
    {
      count: totalPools,
      label: 'Total Pools',
      trend: 5,
      icon: 'UserXIcon'
    },
    {
      count: totalAgreements,
      label: 'Active Agreements',
      trend: 3,
      icon: 'FileTextIcon'
    }
  ]
})

// Computed
const filteredCustomers = computed(() => {
  let result = [...customers.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.contact_name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.includes(query) ||
      c.company_name?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    const filterStatus = statusFilter.value.toLowerCase()
    result = result.filter(c => c.status?.toLowerCase() === filterStatus)
  }

  // Agreement filter
  if (agreementFilter.value !== 'All') {
    const filterAgreement = agreementFilter.value.toLowerCase()
    result = result.filter(c => {
      const agreement = c.agreements?.[0]
      return agreement?.status?.toLowerCase() === filterAgreement
    })
  }

  // Sorting
  switch (sortBy.value) {
    case 'Newest':
      result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'Oldest':
      result = [...result].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'Highest Revenue':
      result = [...result].sort((a, b) => parseFloat(b.agreements?.[0]?.price || 0) - parseFloat(a.agreements?.[0]?.price || 0))
      break
    case 'Lowest Revenue':
      result = [...result].sort((a, b) => parseFloat(a.agreements?.[0]?.price || 0) - parseFloat(b.agreements?.[0]?.price || 0))
      break
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage
})

const paginatedCustomers = computed(() => {
  return filteredCustomers.value.slice(startIndex.value, endIndex.value)
})

// Modal Methods
const openViewCustomerModal = (customer) => {
  activeDropdown.value = null
  viewingCustomer.value = customer
  showViewCustomerModal.value = true
}

const closeViewCustomerModal = () => {
  showViewCustomerModal.value = false
  viewingCustomer.value = null
}

const openViewPoolsModal = (customer) => {
  activeDropdown.value = null
  viewingCustomer.value = customer
  showViewPoolsModal.value = true
}

const closeViewPoolsModal = () => {
  showViewPoolsModal.value = false
  viewingCustomer.value = null
}

const openViewAgreementsModal = (customer) => {
  activeDropdown.value = null
  viewingCustomer.value = customer
  showViewAgreementsModal.value = true
}

const closeViewAgreementsModal = () => {
  showViewAgreementsModal.value = false
  viewingCustomer.value = null
}

// Other Methods
const fetchCustomers = async () => {
  loading.value = true

  try {
    const response = await api().get(
      'customer-management/customers-advance?with=pools,agreements'
    )

    customers.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching customers:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Load Customers',
      text: error.response?.data?.message || 'Something went wrong'
    })
  } finally {
    loading.value = false
  }
}

const getAvatarInitial = (customer) => {
  return customer?.contact_name?.charAt(0) || '?'
}

const getPoolCount = (customer) => {
  return customer?.pools?.length || 0
}

const getAgreementCount = (customer) => {
  return customer?.agreements?.length || 0
}

const getAgreementFrequency = (customer) => {
  const agreement = customer?.agreements?.[0]
  return agreement?.frequency ? capitalizeFirstLetter(agreement.frequency) : 'No Agreement'
}

const getAgreementStatus = (customer) => {
  const agreement = customer?.agreements?.[0]
  return agreement?.status ? capitalizeFirstLetter(agreement.status) : 'No Agreement'
}

const getAgreementStatusClasses = (customer) => {
  const agreement = customer?.agreements?.[0]
  const status = agreement?.status?.toLowerCase()

  const classes = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'expired': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  }

  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getAgreementStatusClassesFromStatus = (status) => {
  const statusLower = status?.toLowerCase()
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'expired': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-800'
}

const getMonthlyValue = (customer) => {
  const agreement = customer?.agreements?.[0]
  return agreement?.price ? parseFloat(agreement.price).toFixed(2) : '0.00'
}

const getCustomerStatusClasses = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'suspended': 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const editCustomer = (customer) => {
  activeDropdown.value = null
  openEditModal(customer)
}

const createAgreement = (customer) => {
  activeDropdown.value = null
  router.push(`/provider/agreements-create`)
}

const openEditModal = (customer) => {
  editingCustomerId.value = customer.id
  editForm.value = {
    type: customer.type || 'residential',
    contact_name: customer.contact_name || '',
    phone: customer.phone || '',
    status: customer.status || 'active'
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingCustomerId.value = null
  editForm.value = {
    type: 'residential',
    contact_name: '',
    phone: '',
    status: 'active'
  }
}

const updateCustomer = async () => {
  if (!editingCustomerId.value) return

  updating.value = true

  try {
    const payload = {
      type: editForm.value.type,
      contact_name: editForm.value.contact_name,
      phone: editForm.value.phone,
      status: editForm.value.status
    }

    const response = await api().put(
      `customer-management/customers/${editingCustomerId.value}`,
      payload
    )

    const index = customers.value.findIndex(c => c.id === editingCustomerId.value)
    if (index !== -1) {
      customers.value[index] = response.data.data || response.data
    }

    await Swal.fire({
      icon: 'success',
      title: 'Customer Updated',
      text: 'Customer details have been updated successfully.',
      timer: 2000,
      showConfirmButton: false
    })

    closeEditModal()
  } catch (error) {
    console.error('Error updating customer:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.response?.data?.message || 'Something went wrong'
    })
  } finally {
    updating.value = false
  }
}

const deactivateCustomer = async (customer) => {
  activeDropdown.value = null
  const result = await Swal.fire({
    title: 'Deactivate Customer?',
    text: `Are you sure you want to deactivate ${customer.contact_name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, deactivate'
  })

  if (result.isConfirmed) {
    try {
      // await api().put(`customer-management/customers/${customer.id}`, {
      //   status: 'inactive'
      // })

      const index = customers.value.findIndex(c => c.id === customer.id)
      if (index !== -1) {
        customers.value[index].status = 'inactive'
      }

      await Swal.fire({
        icon: 'success',
        title: 'Customer Deactivated',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error deactivating customer:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Deactivation Failed',
        text: error.response?.data?.message || 'Something went wrong'
      })
    }
  }
}

const deleteCustomer = async (customer) => {
  activeDropdown.value = null
  const result = await Swal.fire({
    title: 'Delete Customer?',
    text: `Are you sure you want to delete ${customer.contact_name}? This action cannot be undone.`,
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete'
  })

  if (result.isConfirmed) {
    try {
      // await api().delete(`customer-management/customers/${customer.id}`)

      const index = customers.value.findIndex(c => c.id === customer.id)
      if (index !== -1) {
        customers.value.splice(index, 1)
      }

      await Swal.fire({
        icon: 'success',
        title: 'Customer Deleted',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error deleting customer:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: error.response?.data?.message || 'Something went wrong'
      })
    }
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Close dropdown on outside click
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}

// Lifecycle
onMounted(() => {
  fetchCustomers()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* No additional styles needed - all styling is done with Tailwind */
</style>