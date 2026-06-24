<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Page Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Customer</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new customer, register pools, and set up service agreements.</p>
      </div>
      <div class="mt-4 flex space-x-3 md:mt-0">
        <button class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Cancel
        </button>
        <button class="rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Save Draft
        </button>
        <button @click="handleSubmit" class="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create Customer
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- Main Form -->
      <div class="flex-1 space-y-6">
        <!-- Section 1: Customer Information -->
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Customer Information</h2>
          
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name *</label>
              <input v-model="form.first_name" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.first_name }" />
              <p v-if="errors.first_name" class="mt-1 text-xs text-red-500">{{ errors.first_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name *</label>
              <input v-model="form.last_name" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.last_name }" />
              <p v-if="errors.last_name" class="mt-1 text-xs text-red-500">{{ errors.last_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Company Name</label>
              <input v-model="form.company_name" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email *</label>
              <input v-model="form.email" type="email" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.email }" />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone *</label>
              <input v-model="form.phone" type="tel" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.phone }" />
              <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Alternate Phone</label>
              <input v-model="form.alternate_phone" type="tel" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          <!-- Customer Type -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700">Customer Type *</label>
            <div class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-2">
              <div v-for="type in customerTypes" :key="type" @click="form.customer_type = type" class="cursor-pointer rounded-lg border-2 p-4 text-center transition-all" :class="form.customer_type === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'">
                <div class="text-sm font-medium" :class="form.customer_type === type ? 'text-blue-700' : 'text-gray-700'">{{ type }}</div>
              </div>
            </div>
            <p v-if="errors.customer_type" class="mt-1 text-xs text-red-500">{{ errors.customer_type }}</p>
          </div>
        </div>

        <!-- Section 2: Property Information -->
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Property Information</h2>
          
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Service Address *</label>
              <input v-model="form.service_address" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.service_address }" />
              <p v-if="errors.service_address" class="mt-1 text-xs text-red-500">{{ errors.service_address }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">City *</label>
              <input v-model="form.city" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.city }" />
              <p v-if="errors.city" class="mt-1 text-xs text-red-500">{{ errors.city }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">State *</label>
              <input v-model="form.state" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.state }" />
              <p v-if="errors.state" class="mt-1 text-xs text-red-500">{{ errors.state }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">ZIP Code *</label>
              <input v-model="form.zip_code" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" :class="{ 'border-red-500': errors.zip_code }" />
              <p v-if="errors.zip_code" class="mt-1 text-xs text-red-500">{{ errors.zip_code }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gate Code</label>
              <input v-model="form.gate_code" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Access Notes</label>
              <textarea v-model="form.access_notes" rows="2" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
            </div>
          </div>

          <!-- Map Preview -->
          <div class="mt-4 rounded-lg bg-gray-100 p-4 text-center">
            <div class="flex items-center justify-center space-x-2 text-gray-500">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-sm">Map Preview</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Pool Information -->
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Pool Information</h2>
            <button @click="addPool" class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
              <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Another Pool
            </button>
          </div>

          <div v-for="(pool, index) in form.pools" :key="index" class="mt-4 rounded-lg border border-gray-200 p-4">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="font-medium text-gray-700">Pool #{{ index + 1 }}</h3>
              <button v-if="form.pools.length > 1" @click="removePool(index)" class="text-sm text-red-600 hover:text-red-700">Remove</button>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Pool Name</label>
                <input v-model="pool.pool_name" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Pool Type</label>
                <select v-model="pool.pool_type" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="type in poolTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Shape</label>
                <select v-model="pool.shape" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="shape in shapes" :key="shape" :value="shape">{{ shape }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Volume (Gallons)</label>
                <input v-model="pool.volume_gallons" type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Water Type</label>
                <select v-model="pool.water_type" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="type in waterTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Construction</label>
                <select v-model="pool.construction_type" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="type in constructionTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <p v-if="errors.pools" class="mt-2 text-xs text-red-500">{{ errors.pools }}</p>
        </div>

        <!-- Section 4: Equipment Information -->
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Equipment Register</h2>
            <button @click="addEquipment" class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
              <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Equipment
            </button>
          </div>

          <div v-for="(equipment, index) in form.equipment" :key="index" class="mt-4 rounded-lg border border-gray-200 p-4">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="font-medium text-gray-700">Equipment #{{ index + 1 }}</h3>
              <button @click="removeEquipment(index)" class="text-sm text-red-600 hover:text-red-700">Remove</button>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Equipment Type</label>
                <select v-model="equipment.equipment_type" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="type in equipmentTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Brand</label>
                <input v-model="equipment.brand" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Model</label>
                <input v-model="equipment.model" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Serial Number</label>
                <input v-model="equipment.serial_number" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Install Date</label>
                <input v-model="equipment.install_date" type="date" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <!-- Equipment Table -->
          <div v-if="form.equipment.length > 0" class="mt-6 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Brand</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Model</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Serial #</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(equipment, index) in form.equipment" :key="index">
                  <td class="px-4 py-2 text-sm">{{ equipment.equipment_type }}</td>
                  <td class="px-4 py-2 text-sm">{{ equipment.brand || '-' }}</td>
                  <td class="px-4 py-2 text-sm">{{ equipment.model || '-' }}</td>
                  <td class="px-4 py-2 text-sm">{{ equipment.serial_number || '-' }}</td>
                  <td class="px-4 py-2 text-sm">
                    <button @click="removeEquipment(index)" class="text-red-600 hover:text-red-700">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 5: Service Agreement -->
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Service Agreement</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Create Service Agreement</span>
              <button @click="form.create_agreement = !form.create_agreement" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" :class="form.create_agreement ? 'bg-blue-600' : 'bg-gray-300'">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="form.create_agreement ? 'translate-x-6' : 'translate-x-1'"></span>
              </button>
            </div>
          </div>

          <div v-if="form.create_agreement" class="mt-4 space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Service Plan</label>
                <select v-model="form.agreement.service_plan" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="plan in servicePlans" :key="plan" :value="plan">{{ plan }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Frequency</label>
                <select v-model="form.agreement.frequency" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="freq in frequencies" :key="freq" :value="freq">{{ freq }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Preferred Service Day</label>
                <select v-model="form.agreement.preferred_day" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="day in weekDays" :key="day" :value="day">{{ day }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input v-model="form.agreement.start_date" type="date" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Monthly Price ($)</label>
                <input v-model="form.agreement.monthly_price" type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Assigned Technician</label>
                <select v-model="form.agreement.assigned_technician" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option v-for="tech in technicians" :key="tech" :value="tech">{{ tech }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 6: Notes & Attachments -->
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Notes & Attachments</h2>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea v-model="form.internal_notes" rows="4" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Special instructions, gate access, customer preferences..."></textarea>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Attachments</label>
            <div class="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <div class="mt-4 flex text-sm text-gray-600">
                  <label class="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload files</span>
                    <input type="file" class="sr-only" multiple accept=".pdf,.jpg,.png" />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="lg:w-80">
        <div class="sticky top-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 class="text-sm font-medium uppercase tracking-wider text-gray-500">Customer Summary</h3>
          
          <div class="mt-4 space-y-3">
            <div>
              <p class="text-xs text-gray-500">Customer Name</p>
              <p class="font-medium text-gray-900">{{ fullName || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Customer Type</p>
              <p class="font-medium text-gray-900">{{ form.customer_type || 'Not selected' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Pool Count</p>
              <p class="font-medium text-gray-900">{{ form.pools.length }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Equipment Count</p>
              <p class="font-medium text-gray-900">{{ form.equipment.length }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Agreement Status</p>
              <p class="font-medium text-gray-900">{{ form.create_agreement ? 'Active' : 'Not Created' }}</p>
            </div>
          </div>

          <hr class="my-4" />

          <div>
            <p class="text-xs text-gray-500">Estimated Monthly Revenue</p>
            <p class="text-2xl font-bold text-emerald-600">${{ form.agreement.monthly_price || '0' }}/mo</p>
          </div>

          <button @click="handleSubmit" class="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Create Customer
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg class="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-semibold text-gray-900">Customer Created Successfully</h3>
        <p class="mt-2 text-sm text-gray-500">Customer profile has been created and is ready for scheduling.</p>
        <div class="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <button @click="showSuccessModal = false" class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">View Customer</button>
          <button @click="resetForm" class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Add Another Customer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Form Data
const form = reactive({
  first_name: '',
  last_name: '',
  company_name: '',
  email: '',
  phone: '',
  alternate_phone: '',
  customer_type: 'Residential',
  service_address: '',
  city: '',
  state: '',
  zip_code: '',
  gate_code: '',
  access_notes: '',
  pools: [{
    pool_name: '',
    pool_type: 'Residential Pool',
    shape: 'Rectangle',
    volume_gallons: '',
    water_type: 'Chlorine',
    construction_type: 'Concrete'
  }],
  equipment: [],
  create_agreement: false,
  agreement: {
    service_plan: 'Weekly Pool Care',
    frequency: 'Weekly',
    preferred_day: 'Monday',
    start_date: '',
    monthly_price: '',
    assigned_technician: ''
  },
  internal_notes: ''
})

// Errors
const errors = reactive({})

// UI State
const showSuccessModal = ref(false)
const isSubmitting = ref(false)

// Options
const customerTypes = ['Residential', 'Commercial']
const poolTypes = ['Residential Pool', 'Commercial Pool', 'Spa', 'Hot Tub']
const shapes = ['Rectangle', 'Oval', 'Freeform', 'Kidney', 'Custom']
const waterTypes = ['Chlorine', 'Salt Water']
const constructionTypes = ['Concrete', 'Fiberglass', 'Vinyl']
const equipmentTypes = ['Pump', 'Filter', 'Heater', 'Salt System', 'Automation System', 'Cleaner']
const servicePlans = ['Weekly Pool Care', 'Premium Pool Care', 'Biweekly Service', 'Monthly Inspection']
const frequencies = ['Weekly', 'Biweekly', 'Monthly']
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const technicians = ['Mike Carter', 'Alex Green', 'David Ross']

// Computed
const fullName = computed(() => {
  return `${form.first_name} ${form.last_name}`.trim()
})

// Methods
const addPool = () => {
  form.pools.push({
    pool_name: '',
    pool_type: 'Residential Pool',
    shape: 'Rectangle',
    volume_gallons: '',
    water_type: 'Chlorine',
    construction_type: 'Concrete'
  })
}

const removePool = (index) => {
  form.pools.splice(index, 1)
}

const addEquipment = () => {
  form.equipment.push({
    equipment_type: 'Pump',
    brand: '',
    model: '',
    serial_number: '',
    install_date: ''
  })
}

const removeEquipment = (index) => {
  form.equipment.splice(index, 1)
}

const validate = () => {
  const newErrors = {}
  
  if (!form.first_name) newErrors.first_name = 'First name is required'
  if (!form.last_name) newErrors.last_name = 'Last name is required'
  if (!form.email) newErrors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid'
  if (!form.phone) newErrors.phone = 'Phone is required'
  if (!form.customer_type) newErrors.customer_type = 'Customer type is required'
  if (!form.service_address) newErrors.service_address = 'Service address is required'
  if (!form.city) newErrors.city = 'City is required'
  if (!form.state) newErrors.state = 'State is required'
  if (!form.zip_code) newErrors.zip_code = 'ZIP code is required'
  if (form.pools.length === 0) newErrors.pools = 'At least one pool is required'
  
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (!validate()) {
    // Scroll to first error
    const firstError = document.querySelector('.border-red-500')
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  isSubmitting.value = true
  
  // Simulate API call
  setTimeout(() => {
    // API integration (commented)
    // const createCustomer = async () => {
    //   try {
    //     const payload = form
    //     const response = await axios.post('/customers', payload)
    //     console.log(response.data)
    //   } catch(error) {
    //     console.error(error)
    //   }
    // }
    
    isSubmitting.value = false
    showSuccessModal.value = true
  }, 1000)
}

const resetForm = () => {
  Object.assign(form, {
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    customer_type: 'Residential',
    service_address: '',
    city: '',
    state: '',
    zip_code: '',
    gate_code: '',
    access_notes: '',
    pools: [{
      pool_name: '',
      pool_type: 'Residential Pool',
      shape: 'Rectangle',
      volume_gallons: '',
      water_type: 'Chlorine',
      construction_type: 'Concrete'
    }],
    equipment: [],
    create_agreement: false,
    agreement: {
      service_plan: 'Weekly Pool Care',
      frequency: 'Weekly',
      preferred_day: 'Monday',
      start_date: '',
      monthly_price: '',
      assigned_technician: ''
    },
    internal_notes: ''
  })
  Object.keys(errors).forEach(key => delete errors[key])
  showSuccessModal.value = false
}
</script>

<style scoped>
* {
  transition: all 0.2s ease;
}
</style>