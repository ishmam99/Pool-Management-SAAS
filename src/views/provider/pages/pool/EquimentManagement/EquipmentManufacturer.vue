<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Equipment Manufacturers</h1>
                <p class="text-sm text-gray-500 mt-1">Manage all equipment manufacturers available for your tenant.</p>
            </div>
            <button
                @click="openCreateModal"
                class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Manufacturer
            </button>
        </div>

        <!-- Search -->
        <div class="mb-6">
            <div class="relative">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search by manufacturer name..."
                    class="w-full sm:w-96 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Table -->
        <div v-else-if="filteredManufacturers.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="manufacturer in filteredManufacturers" :key="manufacturer.id" class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ manufacturer.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ manufacturer.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    :class="[
                                        'px-2 py-1 text-xs font-medium rounded-full',
                                        manufacturer.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    ]"
                                >
                                    {{ manufacturer.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(manufacturer.created_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(manufacturer.updated_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    @click="openEditModal(manufacturer)"
                                    class="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"
                                    :disabled="processing"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="confirmDelete(manufacturer)"
                                    class="text-red-600 hover:text-red-900 transition-colors duration-200"
                                    :disabled="processing"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No manufacturers found</h3>
            <p class="mt-2 text-sm text-gray-500">Click "Add Manufacturer" to create your first manufacturer.</p>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
                <div class="relative bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            {{ isEditing ? 'Edit Manufacturer' : 'Add Manufacturer' }}
                        </h3>
                        <form @submit.prevent="saveManufacturer">
                            <div class="mb-4">
                                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                                    Manufacturer Name <span class="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :class="{ 'border-red-500': errors.name }"
                                    required
                                />
                                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                            </div>
                            <div class="mb-6">
                                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="status"
                                    v-model="form.is_active"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                >
                                    <option :value="true">Active</option>
                                    <option :value="false">Inactive</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    @click="closeModal"
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                    :disabled="processing"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :disabled="processing"
                                >
                                    <span v-if="processing" class="inline-flex items-center">
                                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                    <span v-else>{{ isEditing ? 'Update Manufacturer' : 'Save Manufacturer' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <div v-if="showDeleteDialog" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDeleteDialog"></div>
                <div class="relative bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all">
                    <div class="p-6">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-lg font-medium text-gray-900">Delete Manufacturer</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">Are you sure you want to delete this manufacturer?</p>
                                    <p class="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-end space-x-3">
                            <button
                                @click="closeDeleteDialog"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                :disabled="processing"
                            >
                                Cancel
                            </button>
                            <button
                                @click="deleteManufacturer"
                                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="processing"
                            >
                                <span v-if="processing" class="inline-flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </span>
                                <span v-else>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../../../../services/api.js'

// ==================== State ====================
const manufacturers = ref([])
const searchQuery = ref('')
const loading = ref(false)
const processing = ref(false)
const showModal = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const selectedManufacturer = ref(null)
const form = ref({
    name: '',
    is_active: true
})
const errors = ref({})

// ==================== Computed ====================
const filteredManufacturers = computed(() => {
    if (!searchQuery.value.trim()) {
        return manufacturers.value
    }
    const query = searchQuery.value.toLowerCase().trim()
    return manufacturers.value.filter(m =>
        m.name.toLowerCase().includes(query)
    )
})

// ==================== Methods ====================
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const resetForm = () => {
    form.value = {
        name: '',
        is_active: true
    }
    errors.value = {}
}

const openCreateModal = () => {
    isEditing.value = false
    selectedManufacturer.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = (manufacturer) => {
    isEditing.value = true
    selectedManufacturer.value = manufacturer
    form.value = {
        name: manufacturer.name,
        is_active: manufacturer.is_active
    }
    errors.value = {}
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const confirmDelete = (manufacturer) => {
    selectedManufacturer.value = manufacturer
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    selectedManufacturer.value = null
}

// ==================== API Calls ====================
const fetchManufacturers = async () => {
    loading.value = true
    try {
        const response = await api().get('/tenant/equipment-manufacturers')
        manufacturers.value = response.data.data || []
    } catch (error) {
        console.error('Error fetching manufacturers:', error)
        showToast('Failed to load manufacturers.', 'error')
    } finally {
        loading.value = false
    }
}

const saveManufacturer = async () => {
    processing.value = true
    errors.value = {}

    try {
        if (isEditing.value) {
            // Update
            const payload = {
                _method: 'PUT',
                name: form.value.name,
                is_active: form.value.is_active
            }
            await api().post(`/tenant/equipment-manufacturers/${selectedManufacturer.value.id}`, payload)
            showToast('Manufacturer updated successfully!', 'success')
        } else {
            // Create
            const payload = {
                name: form.value.name,
                is_active: form.value.is_active
            }
            await api().post('/tenant/equipment-manufacturers', payload)
            showToast('Manufacturer created successfully!', 'success')
        }

        closeModal()
        await fetchManufacturers()
    } catch (error) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors
        } else {
            showToast(error.response?.data?.message || 'An error occurred. Please try again.', 'error')
        }
    } finally {
        processing.value = false
    }
}

const deleteManufacturer = async () => {
    if (!selectedManufacturer.value) return

    processing.value = true
    try {
        await api().delete(`/tenant/equipment-manufacturers/${selectedManufacturer.value.id}`)
        showToast('Manufacturer deleted successfully!', 'success')
        closeDeleteDialog()
        await fetchManufacturers()
    } catch (error) {
        showToast(error.response?.data?.message || 'Failed to delete manufacturer.', 'error')
    } finally {
        processing.value = false
    }
}

// ==================== Toast Notification ====================
const showToast = (message, type = 'success') => {
    // This is a placeholder - integrate with your actual toast system
    // Example: window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))
    console.log(`[${type.toUpperCase()}]`, message)
    alert(message) // Remove this and use your actual toast system
}

// ==================== Lifecycle Hooks ====================
onMounted(() => {
    fetchManufacturers()
})
</script>