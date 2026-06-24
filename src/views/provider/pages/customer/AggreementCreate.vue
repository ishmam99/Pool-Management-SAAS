```vue
<template>
  <div class="min-h-screen bg-slate-50/50 p-4 md:p-8">
    <!-- Page Header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Create Service Agreement</h1>
        <p class="mt-1 text-sm text-slate-500">
          Create a recurring service contract for a customer and schedule future pool maintenance visits.
        </p>
      </div>
      <div class="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
        <button
          @click="handleCancel"
          class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
        >
          Cancel
        </button>
        <button
          @click="handleSaveDraft"
          class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
        >
          Save Draft
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading || !isFormValid"
          class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg v-if="loading" class="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Create Agreement
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Form Column -->
      <div class="lg:col-span-2">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Customer Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Customer Information</h2>
            </div>
            <div class="p-6">
              <div class="relative">
                <label class="mb-1.5 block text-sm font-medium text-slate-700">Search Customer</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    v-model="customerSearch"
                    type="text"
                    placeholder="Type customer name or email..."
                    class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    @focus="showCustomerDropdown = true"
                    @blur="setTimeout(() => showCustomerDropdown = false, 200)"
                  />
                </div>
                <div
                  v-if="showCustomerDropdown && filteredCustomers.length > 0"
                  class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <button
                    v-for="customer in filteredCustomers"
                    :key="customer.id"
                    type="button"
                    class="flex w-full flex-col items-start px-4 py-2.5 text-left hover:bg-slate-50"
                    @click="selectCustomer(customer)"
                  >
                    <span class="font-medium text-slate-900">{{ customer.name }}</span>
                    <span class="text-sm text-slate-500">{{ customer.email }}</span>
                  </button>
                </div>
              </div>

              <!-- Selected Customer Card -->
              <div v-if="form.customer_id" class="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div class="flex items-start gap-3">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <span class="font-medium">{{ getCustomerInitials(form.customer_name) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-slate-900">{{ form.customer_name }}</p>
                    <p class="text-sm text-slate-500">{{ form.email }}</p>
                    <p class="text-sm text-slate-500">{{ form.phone }}</p>
                  </div>
                  <button
                    type="button"
                    @click="clearCustomer"
                    class="text-slate-400 hover:text-slate-600"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p v-if="errors.customer_id" class="mt-2 text-sm text-red-600">{{ errors.customer_id }}</p>
            </div>
          </div>

          <!-- Pool Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Pool Information</h2>
            </div>
            <div class="p-6">
              <div v-if="!form.customer_id" class="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                Please select a customer first to view their pools.
              </div>
              <div v-else>
                <div class="grid grid-cols-1 gap-3">
                  <button
                    v-for="pool in availablePools"
                    :key="pool.id"
                    type="button"
                    @click="selectPool(pool)"
                    class="flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all"
                    :class="form.pool_id === pool.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'"
                  >
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                      🏊
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-slate-900">{{ pool.name }}</p>
                      <p class="text-sm text-slate-500">{{ pool.type }}</p>
                      <p class="text-sm text-slate-500">{{ pool.volume }}</p>
                    </div>
                    <svg v-if="form.pool_id === pool.id" class="h-5 w-5 flex-shrink-0 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>
                </div>
                <p v-if="errors.pool_id" class="mt-3 text-sm text-red-600">{{ errors.pool_id }}</p>
              </div>
            </div>
          </div>

          <!-- Service Plan Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Service Plan</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  v-for="plan in servicePlans"
                  :key="plan"
                  type="button"
                  @click="form.service_plan = plan"
                  class="rounded-xl border-2 p-4 text-center transition-all"
                  :class="form.service_plan === plan ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'"
                >
                  <span class="text-sm font-medium text-slate-700">{{ plan }}</span>
                </button>
              </div>
              <p v-if="errors.service_plan" class="mt-3 text-sm text-red-600">{{ errors.service_plan }}</p>

              <!-- Plan Details -->
              <div v-if="form.service_plan" class="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <h4 class="font-medium text-slate-900">{{ form.service_plan }}</h4>
                <ul class="mt-2 space-y-1 text-sm text-slate-600">
                  <li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Weekly cleaning
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Chemical balancing
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Equipment inspection
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Service report
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Schedule Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Schedule Settings</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Frequency</label>
                  <select
                    v-model="form.frequency"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select frequency</option>
                    <option v-for="freq in frequencies" :key="freq" :value="freq">{{ freq }}</option>
                  </select>
                  <p v-if="errors.frequency" class="mt-1.5 text-sm text-red-600">{{ errors.frequency }}</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Preferred Day</label>
                  <select
                    v-model="form.preferred_day"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select day</option>
                    <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Preferred Time</label>
                  <select
                    v-model="form.preferred_time"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select time</option>
                    <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
                  <input
                    v-model="form.start_date"
                    type="date"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                  <p v-if="errors.start_date" class="mt-1.5 text-sm text-red-600">{{ errors.start_date }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Technician Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Technician Assignment</h2>
            </div>
            <div class="p-6">
              <select
                v-model="form.technician"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Select technician</option>
                <option v-for="tech in technicians" :key="tech" :value="tech">{{ tech }}</option>
              </select>
              <p v-if="errors.technician" class="mt-2 text-sm text-red-600">{{ errors.technician }}</p>

              <!-- Technician Card -->
              <div v-if="form.technician" class="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <span class="font-medium">{{ getTechnicianInitials(form.technician) }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-slate-900">{{ form.technician }}</p>
                    <p class="text-sm text-slate-500">12 Active Routes</p>
                  </div>
                  <div class="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1">
                    <svg class="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-sm font-medium text-emerald-700">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Pricing & Billing</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Monthly Price ($)</label>
                  <input
                    v-model="form.monthly_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                  <p v-if="errors.monthly_price" class="mt-1.5 text-sm text-red-600">{{ errors.monthly_price }}</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Setup Fee ($)</label>
                  <input
                    v-model="form.setup_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Billing Cycle</label>
                  <select
                    v-model="form.billing_cycle"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select cycle</option>
                    <option v-for="cycle in billingCycles" :key="cycle" :value="cycle">{{ cycle }}</option>
                  </select>
                </div>
              </div>
              <div v-if="form.monthly_price" class="mt-4 rounded-xl bg-indigo-50/50 p-4">
                <p class="text-sm text-slate-600">Monthly Service Fee</p>
                <p class="text-2xl font-bold text-slate-900">${{ parseFloat(form.monthly_price).toFixed(2) }} <span class="text-base font-normal text-slate-500">/ month</span></p>
              </div>
            </div>
          </div>

          <!-- Agreement Terms -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Agreement Terms</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
                  <input
                    v-model="form.term_start_date"
                    type="date"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
                  <input
                    v-model="form.term_end_date"
                    type="date"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div class="mt-4 flex items-center gap-3">
                <input
                  v-model="form.auto_renew"
                  type="checkbox"
                  id="auto_renew"
                  class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="auto_renew" class="text-sm font-medium text-slate-700">Automatically renew agreement</label>
              </div>
              <div class="mt-4">
                <label class="mb-1.5 block text-sm font-medium text-slate-700">Cancellation Notice</label>
                <select
                  v-model="form.cancellation_notice"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Select notice period</option>
                  <option v-for="notice in cancellationNotices" :key="notice" :value="notice">{{ notice }}</option>
                </select>
              </div>
              <div class="mt-4">
                <label class="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Add any additional notes..."
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
              <h2 class="text-sm font-semibold text-slate-700">Notifications</h2>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <label class="flex items-center gap-3">
                  <input
                    v-model="form.send_welcome_email"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-slate-700">Send welcome email</span>
                </label>
                <label class="flex items-center gap-3">
                  <input
                    v-model="form.send_agreement_pdf"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-slate-700">Send agreement PDF</span>
                </label>
                <label class="flex items-center gap-3">
                  <input
                    v-model="form.notify_schedule"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-slate-700">Notify customer about schedule</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Summary Panel -->
      <div class="lg:col-span-1">
        <div class="sticky top-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div class="border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
            <h2 class="text-sm font-semibold text-slate-700">Agreement Summary</h2>
          </div>
          <div class="p-6">
            <div class="space-y-5">
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Customer</p>
                <p class="mt-1 font-medium text-slate-900">{{ form.customer_name || 'Not selected' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Pool</p>
                <p class="mt-1 font-medium text-slate-900">{{ selectedPoolName || 'Not selected' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Plan</p>
                <p class="mt-1 font-medium text-slate-900">{{ form.service_plan || 'Not selected' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Schedule</p>
                <p class="mt-1 font-medium text-slate-900">{{ scheduleSummary || 'Not configured' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Technician</p>
                <p class="mt-1 font-medium text-slate-900">{{ form.technician || 'Not assigned' }}</p>
              </div>
              <div class="border-t border-slate-200 pt-4">
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Monthly Revenue</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">
                  {{ form.monthly_price ? `$${parseFloat(form.monthly_price).toFixed(2)}` : '$0.00' }}
                  <span class="text-sm font-normal text-slate-500">/month</span>
                </p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Annual Revenue</p>
                <p class="mt-1 text-xl font-bold text-emerald-600">
                  {{ annualRevenue }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="p-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg class="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Agreement Created Successfully</h3>
          <p class="mt-2 text-sm text-slate-500">The service agreement has been created and scheduled.</p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              @click="handleViewAgreement"
              class="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              View Agreement
            </button>
            <button
              @click="handleCreateAnother"
              class="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ---------- MOCK DATA ----------
const customers = [
  { id: 1, name: 'John Smith', email: 'john.smith@gmail.com', phone: '(305) 555-1234' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@gmail.com', phone: '(305) 555-8899' },
  { id: 3, name: 'Michael Brown', email: 'm.brown@gmail.com', phone: '(786) 555-4321' },
]

const pools = [
  { id: 1, customer_id: 1, name: 'Backyard Pool', type: 'Residential', volume: '18,000 Gallons' },
  { id: 2, customer_id: 2, name: 'Villa Main Pool', type: 'Salt Water', volume: '24,000 Gallons' },
]

const servicePlans = ['Weekly Pool Care', 'Premium Pool Care', 'Biweekly Service', 'Monthly Inspection', 'Custom Plan']

const frequencies = ['Weekly', 'Biweekly', 'Monthly', 'Custom']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = ['Morning', 'Afternoon', 'Evening']
const technicians = ['Mike Carter', 'Alex Green', 'David Ross']
const billingCycles = ['Monthly', 'Quarterly', 'Yearly']
const cancellationNotices = ['7 Days', '15 Days', '30 Days']

// ---------- STATE ----------
const loading = ref(false)
const showCustomerDropdown = ref(false)
const customerSearch = ref('')
const showSuccessModal = ref(false)

const form = reactive({
  customer_id: '',
  customer_name: '',
  email: '',
  phone: '',
  pool_id: '',
  pool_name: '',
  pool_type: '',
  pool_volume: '',
  service_plan: '',
  frequency: '',
  preferred_day: '',
  preferred_time: '',
  start_date: '',
  technician: '',
  monthly_price: '',
  setup_fee: '',
  billing_cycle: '',
  term_start_date: '',
  term_end_date: '',
  auto_renew: false,
  cancellation_notice: '',
  notes: '',
  send_welcome_email: true,
  send_agreement_pdf: true,
  notify_schedule: true,
})

const errors = reactive({
  customer_id: '',
  pool_id: '',
  service_plan: '',
  frequency: '',
  start_date: '',
  technician: '',
  monthly_price: '',
})

// ---------- COMPUTED ----------
const filteredCustomers = computed(() => {
  if (!customerSearch.value) return customers
  const search = customerSearch.value.toLowerCase()
  return customers.filter(c =>
    c.name.toLowerCase().includes(search) ||
    c.email.toLowerCase().includes(search)
  )
})

const availablePools = computed(() => {
  if (!form.customer_id) return []
  return pools.filter(p => p.customer_id === form.customer_id)
})

const selectedPoolName = computed(() => {
  const pool = pools.find(p => p.id === form.pool_id)
  return pool ? pool.name : ''
})

const scheduleSummary = computed(() => {
  if (!form.frequency || !form.preferred_day) return 'Not configured'
  return `Every ${form.preferred_day}`
})

const annualRevenue = computed(() => {
  const monthly = parseFloat(form.monthly_price) || 0
  return `$${(monthly * 12).toFixed(2)}/year`
})

const isFormValid = computed(() => {
  return !!(
    form.customer_id &&
    form.pool_id &&
    form.service_plan &&
    form.frequency &&
    form.start_date &&
    form.technician &&
    form.monthly_price &&
    parseFloat(form.monthly_price) > 0
  )
})

// ---------- METHODS ----------
const getCustomerInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getTechnicianInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const selectCustomer = (customer) => {
  form.customer_id = customer.id
  form.customer_name = customer.name
  form.email = customer.email
  form.phone = customer.phone
  form.pool_id = ''
  form.pool_name = ''
  form.pool_type = ''
  form.pool_volume = ''
  customerSearch.value = customer.name
  showCustomerDropdown.value = false
  errors.customer_id = ''
}

const clearCustomer = () => {
  form.customer_id = ''
  form.customer_name = ''
  form.email = ''
  form.phone = ''
  form.pool_id = ''
  form.pool_name = ''
  form.pool_type = ''
  form.pool_volume = ''
  customerSearch.value = ''
}

const selectPool = (pool) => {
  form.pool_id = pool.id
  form.pool_name = pool.name
  form.pool_type = pool.type
  form.pool_volume = pool.volume
  errors.pool_id = ''
}

const validateForm = () => {
  let isValid = true
  errors.customer_id = !form.customer_id ? 'Customer is required' : ''
  errors.pool_id = !form.pool_id ? 'Pool is required' : ''
  errors.service_plan = !form.service_plan ? 'Service plan is required' : ''
  errors.frequency = !form.frequency ? 'Frequency is required' : ''
  errors.start_date = !form.start_date ? 'Start date is required' : ''
  errors.technician = !form.technician ? 'Technician is required' : ''
  errors.monthly_price = !form.monthly_price || parseFloat(form.monthly_price) <= 0 ? 'Valid monthly price is required' : ''

  for (const key in errors) {
    if (errors[key]) isValid = false
  }
  return isValid
}

// ---------- ACTIONS ----------
const handleSubmit = () => {
  if (!validateForm()) return

  loading.value = true

  // Simulate API call
  setTimeout(() => {
    loading.value = false
    showSuccessModal.value = true
  }, 1200)

  // API INTEGRATION (commented)
  /*
  import axios from '@/services/api'

  const createAgreement = async () => {
    loading.value = true
    try {
      const payload = { ...form }
      const response = await axios.post('/service-agreements', payload)
      console.log(response.data)
      showSuccessModal.value = true
    } catch(error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  */
}

const handleSaveDraft = () => {
  console.log('Draft saved:', form)
  // Show toast notification
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    // Reset form or navigate away
    console.log('Cancelled')
  }
}

const handleViewAgreement = () => {
  showSuccessModal.value = false
  console.log('View agreement')
}

const handleCreateAnother = () => {
  showSuccessModal.value = false
  // Reset form
  Object.assign(form, {
    customer_id: '',
    customer_name: '',
    email: '',
    phone: '',
    pool_id: '',
    pool_name: '',
    pool_type: '',
    pool_volume: '',
    service_plan: '',
    frequency: '',
    preferred_day: '',
    preferred_time: '',
    start_date: '',
    technician: '',
    monthly_price: '',
    setup_fee: '',
    billing_cycle: '',
    term_start_date: '',
    term_end_date: '',
    auto_renew: false,
    cancellation_notice: '',
    notes: '',
    send_welcome_email: true,
    send_agreement_pdf: true,
    notify_schedule: true,
  })
  customerSearch.value = ''
  Object.assign(errors, {
    customer_id: '',
    pool_id: '',
    service_plan: '',
    frequency: '',
    start_date: '',
    technician: '',
    monthly_price: '',
  })
}
</script>

<style scoped>
/* Smooth transitions for form elements */
input, select, textarea, button {
  transition: all 0.15s ease;
}

/* Custom scrollbar for dropdown */
.max-h-56::-webkit-scrollbar {
  width: 6px;
}
.max-h-56::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-56::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 8px;
}
.max-h-56::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
```