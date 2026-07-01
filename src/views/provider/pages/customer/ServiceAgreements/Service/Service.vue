<template>
  <div class="min-h-screen bg-white p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Service Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all services offered by your company.</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add Service
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search services by title..."
        class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800 placeholder-gray-400"
      />
    </div>

    <!-- Table / Empty State -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 4" :key="i" class="flex items-center gap-4">
          <div class="h-5 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-5 w-1/6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-5 w-1/6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-5 w-1/5 bg-gray-200 rounded animate-pulse ml-auto"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredServices.length === 0" class="py-16 text-center">
        <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700">No Services Found</h3>
        <p class="text-gray-500 mt-1">Create your first service.</p>
        <button
          @click="openCreateModal"
          class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Service
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 font-semibold">Title</th>
              <th class="px-6 py-4 font-semibold">Price</th>
              <th class="px-6 py-4 font-semibold">Created</th>
              <th class="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="service in filteredServices"
              :key="service.id"
              class="hover:bg-gray-50 transition-colors even:bg-gray-50/50"
            >
              <td class="px-6 py-4 font-medium text-gray-800">{{ service.title }}</td>
              <td class="px-6 py-4 text-gray-700">{{ formatCurrency(service.price) }}</td>
              <td class="px-6 py-4 text-gray-500">{{ formatDate(service.created_at) }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(service)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(service)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      @click.self="closeModal"
      @keydown.esc="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 transform transition-all">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">
            {{ editingService ? 'Edit Service' : 'Add Service' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveService" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g. Premium Pool Cleaning"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
              required
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ submitting ? 'Saving...' : editingService ? 'Update Service' : 'Save Service' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../../../../../services/api.js'

// ---------- state ----------
const services = ref([])
const loading = ref(true)
const search = ref('')
const showModal = ref(false)
const editingService = ref(null)
const submitting = ref(false)

const form = reactive({
  title: '',
  price: ''
})

// ---------- helpers ----------
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ---------- computed ----------
const filteredServices = computed(() => {
  if (!search.value.trim()) return services.value
  const q = search.value.toLowerCase().trim()
  return services.value.filter(s => s.title.toLowerCase().includes(q))
})

// ---------- API Methods ----------
const loadServices = async () => {
  loading.value = true
  try {
    const response = await api().get('/tenant-portal/services')
    // Handle different response structures
    services.value = response.data?.data || response.data || response || []
  } catch (error) {
    console.error('Failed to load services:', error)
    services.value = []
    
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Authentication failed. Please log in again.')
    } else if (error.response?.status === 403) {
      alert('You do not have permission to view services.')
    } else if (error.response?.status === 404) {
      alert('Service endpoint not found. Please check the API URL.')
    } else {
      alert('Failed to load services. Please try again.')
    }
  } finally {
    loading.value = false
  }
}

const saveService = async () => {
  // Validation
  if (!form.title.trim()) {
    alert('Title is required.')
    return
  }
  if (form.price === '' || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
    alert('Please enter a valid price.')
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: form.title.trim(),
      price: parseFloat(form.price),
      billing_type: "one_time",
      category: "cleaning"
    }

    let response
    if (editingService.value) {
      // Update existing service
      response = await api().post(`/tenant-portal/services/${editingService.value.id}`, {
        _method: 'PUT',
        ...payload
      })
      
      // Update the service in the local array
      const updatedData = response.data?.data || response.data || response
      const index = services.value.findIndex(s => s.id === editingService.value.id)
      if (index !== -1) {
        services.value[index] = updatedData
      }
      
      alert('Service updated successfully!')
    } else {
      // Create new service
      response = await api().post('/tenant-portal/services', payload)
      
      // Add new service to local array
      const newService = response.data?.data || response.data || response
      services.value.push(newService)
      
      alert('Service created successfully!')
    }

    closeModal()
  } catch (error) {
    console.error('Save error:', error)
    
    // Handle validation errors from API
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join('\n')
      alert(`Validation Error:\n${errorMessages}`)
    } else if (error.response?.status === 401) {
      alert('Authentication failed. Please log in again.')
    } else if (error.response?.status === 403) {
      alert('You do not have permission to perform this action.')
    } else if (error.response?.status === 422) {
      alert('Invalid data provided. Please check your input.')
    } else {
      alert('Something went wrong. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const deleteService = async (id) => {
  try {
    await api().delete(`/tenant-portal/services/${id}`)
    
    // Remove from local array
    services.value = services.value.filter(s => s.id !== id)
    alert('Service deleted successfully!')
  } catch (error) {
    console.error('Delete error:', error)
    
    if (error.response?.status === 401) {
      alert('Authentication failed. Please log in again.')
    } else if (error.response?.status === 403) {
      alert('You do not have permission to delete this service.')
    } else if (error.response?.status === 404) {
      alert('Service not found. It may have been already deleted.')
    } else {
      alert('Could not delete service. Please try again.')
    }
  }
}

// ---------- Modal Helpers ----------
const resetForm = () => {
  form.title = ''
  form.price = ''
  editingService.value = null
}

const openCreateModal = () => {
  resetForm()
  showModal.value = true
}

const openEditModal = (service) => {
  editingService.value = service
  form.title = service.title
  form.price = service.price.toString()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  submitting.value = false
}

const confirmDelete = async (service) => {
  if (!confirm(`Delete "${service.title}"? This action cannot be undone.`)) return
  await deleteService(service.id)
}

// ---------- Lifecycle ----------
onMounted(() => {
  loadServices()
})
</script>