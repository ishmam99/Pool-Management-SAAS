<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Page Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Customer</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new customer profile for pool service management.</p>
      </div>
      <div class="mt-4 flex space-x-3 md:mt-0">
        <button 
          @click="handleCancel" 
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit" 
          :disabled="isSubmitting"
          class="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="isSubmitting" class="ri-loader-4-line animate-spin mr-2"></i>
          {{ isSubmitting ? 'Creating Customer...' : 'Create Customer' }}
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- Main Form -->
      <div class="flex-1">
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Customer Information</h2>
          
          <div class="mt-4 space-y-4">
            <!-- Customer Type - Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Customer Type *</label>
              <select 
                v-model="form.type" 
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.type }"
              >
                <option value="" disabled>Select customer type</option>
                <option v-for="type in customerTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <p v-if="errors.type" class="mt-1 text-xs text-red-500">{{ errors.type }}</p>
            </div>

            <!-- Contact Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact Name *</label>
              <input 
                v-model="form.contact_name" 
                type="text" 
                placeholder="Patricia Brown"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                :class="{ 'border-red-500': errors.contact_name }" 
              />
              <p v-if="errors.contact_name" class="mt-1 text-xs text-red-500">{{ errors.contact_name }}</p>
            </div>

            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Billing Address *</label>
              <textarea 
                v-model="form.address" 
                rows="3"
                placeholder="573 Main St, Houston"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                :class="{ 'border-red-500': errors.address }"
              ></textarea>
              <p v-if="errors.address" class="mt-1 text-xs text-red-500">{{ errors.address }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input 
                v-model="form.phone" 
                type="tel" 
                placeholder="+1-555-878-1410"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                :class="{ 'border-red-500': errors.phone }" 
              />
              <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address *</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="patricia.brown23@example.com"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                :class="{ 'border-red-500': errors.email }" 
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Preferred Contact - Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Preferred Contact *</label>
              <select 
                v-model="form.preferred_contact" 
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.preferred_contact }"
              >
                <option value="" disabled>Select preferred contact method</option>
                <option v-for="option in preferredContactOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors.preferred_contact" class="mt-1 text-xs text-red-500">{{ errors.preferred_contact }}</p>
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
              <p class="text-xs text-gray-500">Contact Name</p>
              <p class="font-medium text-gray-900">{{ form.contact_name || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Customer Type</p>
              <p class="font-medium text-gray-900">{{ getCustomerTypeLabel(form.type) || 'Not selected' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Preferred Contact</p>
              <p class="font-medium text-gray-900">{{ getPreferredContactLabel(form.preferred_contact) || 'Not selected' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Phone Number</p>
              <p class="font-medium text-gray-900">{{ form.phone || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Email Address</p>
              <p class="font-medium text-gray-900">{{ form.email || 'Not provided' }}</p>
            </div>
          </div>

          <button 
            @click="handleSubmit" 
            :disabled="isSubmitting"
            class="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Creating...' : 'Create Customer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../services/api.js'

// Router
const router = useRouter()

// Form Data
const form = reactive({
  type: '', // Will be set to 'residential' or 'commercial'
  contact_name: '',
  address: '',
  phone: '',
  email: '',
  preferred_contact: '' // Will be set to 'phone' or 'email'
})

// Errors
const errors = reactive({})

// UI State
const isSubmitting = ref(false)

// Options
const customerTypes = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' }
]

const preferredContactOptions = [
  { label: 'Phone', value: 'phone' },
  { label: 'Email', value: 'email' }
]

// Helper Functions
const getCustomerTypeLabel = (value) => {
  const found = customerTypes.find(type => type.value === value)
  return found ? found.label : value
}

const getPreferredContactLabel = (value) => {
  const found = preferredContactOptions.find(option => option.value === value)
  return found ? found.label : value
}

// Validation
const validate = () => {
  const newErrors = {}
  
  if (!form.type) newErrors.type = 'Customer type is required'
  if (!form.contact_name) newErrors.contact_name = 'Contact name is required'
  if (!form.address) newErrors.address = 'Billing address is required'
  if (!form.phone) newErrors.phone = 'Phone number is required'
  if (!form.email) {
    newErrors.email = 'Email address is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    newErrors.email = 'Please enter a valid email address'
  }
  if (!form.preferred_contact) newErrors.preferred_contact = 'Preferred contact method is required'
  
  // Clear existing errors and set new ones
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, newErrors)
  
  return Object.keys(newErrors).length === 0
}

// Handle Cancel
const handleCancel = () => {
  router.push('/provider/customers')
}

// Handle Submit
const handleSubmit = async () => {
  if (!validate()) {
    // Scroll to first error
    const firstError = document.querySelector('.border-red-500')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      type: form.type,
      contact_name: form.contact_name,
      billing_address: form.address,
      phone: form.phone,
      email: form.email,
      preferred_contact: form.preferred_contact
    }

    const response = await api().post('/customer-management/customers', payload)

    await Swal.fire({
      icon: 'success',
      title: 'Customer Created',
      text: response.data.message || 'Customer created successfully',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    })

    router.push('/provider/customers/prospective')
  } catch (error) {
    // Handle validation errors from Laravel
    if (error.response?.data?.errors) {
      // Clear existing errors
      Object.keys(errors).forEach(key => delete errors[key])
      
      // Map Laravel validation errors to form fields
      const laravelErrors = error.response.data.errors
      Object.keys(laravelErrors).forEach(key => {
        // Map Laravel field names to form field names
        const fieldMap = {
          'contact_name': 'contact_name',
          'address': 'address',
          'phone': 'phone',
          'email': 'email',
          'type': 'type',
          'preferred_contact': 'preferred_contact'
        }
        
        const formField = fieldMap[key] || key
        errors[formField] = laravelErrors[key][0]
      })
      
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      // Show general error
      await Swal.fire({
        icon: 'error',
        title: 'Failed to Create Customer',
        text: error.response?.data?.message || 'Something went wrong. Please try again.'
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
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
</style>