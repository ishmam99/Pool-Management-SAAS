<template>
    <div class="p-6 max-w-[1600px] mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Equipment Manufacturers</h1>
                <p class="text-sm text-gray-500 mt-1">Manage all equipment manufacturers available for your tenant.</p>
            </div>
            <button
                @click="openCreateModal"
                class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                :disabled="processing"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Manufacturer
            </button>
        </div>

        <!-- Search and Filter -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1">
                <input
                    v-model="searchQuery"
                    @input="handleSearch"
                    type="text"
                    placeholder="Search by manufacturer name..."
                    class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div class="flex gap-2">
                <button
                    v-for="filter in statusFilters"
                    :key="filter.value"
                    @click="setStatusFilter(filter.value)"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                    :class="[
                        currentStatusFilter === filter.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    ]"
                >
                    {{ filter.label }}
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Table -->
        <div v-else-if="manufacturers.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 scroll-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support</th>
                            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Models</th> -->
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="manufacturer in manufacturers" :key="manufacturer.id" class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img 
                                    v-if="manufacturer.logo_url" 
                                    :src="manufacturer.logo_url" 
                                    :alt="manufacturer.name"
                                    class="h-10 w-10 object-contain rounded"
                                />
                                <div v-else class="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                    <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ manufacturer.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ manufacturer.name }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ manufacturer.description || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <a 
                                    v-if="manufacturer.website" 
                                    :href="manufacturer.website" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="text-blue-600 hover:text-blue-900"
                                >
                                    {{ truncateUrl(manufacturer.website) }}
                                </a>
                                <span v-else class="text-gray-400">-</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{{ manufacturer.support_email || '-' }}</div>
                                <div>{{ manufacturer.support_phone || '-' }}</div>
                            </td>
                            <!-- <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {{ manufacturer.models_count || 0 }}
                                </span>
                            </td> -->
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ manufacturer.order_index ?? '-' }}</td>
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
                                    @click="openEditModal(manufacturer.id)"
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
                <div class="fixed inset-0 bg-gray-500 bg-opacity-10 transition-opacity" @click="closeModal"></div>
                <div class="relative bg-white rounded-lg max-w-2xl w-full shadow-xl transform transition-all">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            {{ isEditing ? 'Edit Manufacturer' : 'Add Manufacturer' }}
                        </h3>
                        <form @submit.prevent="saveManufacturer" enctype="multipart/form-data">
                            <!-- Name -->
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
                                    :disabled="processing"
                                />
                                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
                            </div>

                            <!-- Description -->
                            <div class="mb-4">
                                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :class="{ 'border-red-500': errors.description }"
                                    :disabled="processing"
                                ></textarea>
                                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
                            </div>

                            <!-- Website -->
                            <div class="mb-4">
                                <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    id="website"
                                    v-model="form.website"
                                    type="url"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :class="{ 'border-red-500': errors.website }"
                                    :disabled="processing"
                                />
                                <p v-if="errors.website" class="mt-1 text-sm text-red-600">{{ errors.website[0] }}</p>
                            </div>

                            <!-- Support Phone -->
                            <div class="mb-4">
                                <label for="support_phone" class="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                                <input
                                    id="support_phone"
                                    v-model="form.support_phone"
                                    type="tel"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :class="{ 'border-red-500': errors.support_phone }"
                                    :disabled="processing"
                                />
                                <p v-if="errors.support_phone" class="mt-1 text-sm text-red-600">{{ errors.support_phone[0] }}</p>
                            </div>

                            <!-- Support Email -->
                            <div class="mb-4">
                                <label for="support_email" class="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                <input
                                    id="support_email"
                                    v-model="form.support_email"
                                    type="email"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :class="{ 'border-red-500': errors.support_email }"
                                    :disabled="processing"
                                />
                                <p v-if="errors.support_email" class="mt-1 text-sm text-red-600">{{ errors.support_email[0] }}</p>
                            </div>

                            <!-- Logo Upload -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                                <div class="flex items-center space-x-4">
                                    <div v-if="form.logoPreview" class="relative">
                                        <img :src="form.logoPreview" alt="Logo preview" class="h-20 w-20 object-contain rounded border border-gray-200" />
                                        <button
                                            type="button"
                                            @click="removeLogo"
                                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            :disabled="processing"
                                        >
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        @change="handleLogoUpload"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        :disabled="processing"
                                    />
                                </div>
                                <p v-if="errors.logo" class="mt-1 text-sm text-red-600">{{ errors.logo[0] }}</p>
                            </div>

                            <!-- Display Order -->
                            <div class="mb-4">
                                <label for="order_index" class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input
                                    id="order_index"
                                    v-model.number="form.order_index"
                                    type="number"
                                    min="0"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :class="{ 'border-red-500': errors.order_index }"
                                    :disabled="processing"
                                />
                                <p v-if="errors.order_index" class="mt-1 text-sm text-red-600">{{ errors.order_index[0] }}</p>
                            </div>

                            <!-- Status -->
                            <div class="mb-6">
                                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="status"
                                    v-model="form.is_active"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    :disabled="processing"
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
                                    <p v-if="deleteError" class="text-sm text-red-600 mt-2">{{ deleteError }}</p>
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
import { ref, onMounted, watch } from 'vue'
import api from '../../../../../services/api.js'

// ==================== State ====================
const manufacturers = ref([])
const searchQuery = ref('')
const searchDebounceTimer = ref(null)
const currentStatusFilter = ref(null)
const loading = ref(false)
const processing = ref(false)
const showModal = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const selectedManufacturerId = ref(null)
const deleteError = ref('')
const form = ref({
    name: '',
    description: '',
    website: '',
    support_phone: '',
    support_email: '',
    logo: null,
    logoPreview: null,
    order_index: 0,
    is_active: true,
    remove_logo: false
})
const errors = ref({})

const statusFilters = [
    { label: 'All', value: null },
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
]

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

const truncateUrl = (url) => {
    if (!url) return '-'
    const maxLength = 30
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
}

const resetForm = () => {
    form.value = {
        name: '',
        description: '',
        website: '',
        support_phone: '',
        support_email: '',
        logo: null,
        logoPreview: null,
        order_index: 0,
        is_active: true,
        remove_logo: false
    }
    errors.value = {}
    deleteError.value = ''
}

const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        form.value.logo = file
        const reader = new FileReader()
        reader.onload = (e) => {
            form.value.logoPreview = e.target.result
        }
        reader.readAsDataURL(file)
        form.value.remove_logo = false
    }
}

const removeLogo = () => {
    form.value.logo = null
    form.value.logoPreview = null
    form.value.remove_logo = true
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
}

const openCreateModal = () => {
    isEditing.value = false
    selectedManufacturerId.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = async (id) => {
    try {
        processing.value = true
        const response = await api().get(`/tenant/equipment-manufacturers/${id}`)
        const manufacturer = response.data.data
        
        isEditing.value = true
        selectedManufacturerId.value = id
        form.value = {
            name: manufacturer.name || '',
            description: manufacturer.description || '',
            website: manufacturer.website || '',
            support_phone: manufacturer.support_phone || '',
            support_email: manufacturer.support_email || '',
            logo: null,
            logoPreview: manufacturer.logo_url || null,
            order_index: manufacturer.order_index ?? 0,
            is_active: manufacturer.is_active ?? true,
            remove_logo: false
        }
        errors.value = {}
        showModal.value = true
    } catch (error) {
        showToast(error.response?.data?.message || 'Failed to load manufacturer data.', 'error')
    } finally {
        processing.value = false
    }
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const confirmDelete = (manufacturer) => {
    selectedManufacturerId.value = manufacturer.id
    deleteError.value = ''
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    selectedManufacturerId.value = null
    deleteError.value = ''
}

// ==================== API Calls ====================
const fetchManufacturers = async () => {
    loading.value = true
    try {
        const params = {}
        if (searchQuery.value) {
            params.search = searchQuery.value
        }
        if (currentStatusFilter.value !== null) {
            params.is_active = currentStatusFilter.value
        }
        
        const response = await api().get('/tenant/equipment-manufacturers', { params })
        manufacturers.value = response.data.data || []
    } catch (error) {
        console.error('Error fetching manufacturers:', error)
        showToast('Failed to load manufacturers.', 'error')
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    clearTimeout(searchDebounceTimer.value)
    searchDebounceTimer.value = setTimeout(() => {
        fetchManufacturers()
    }, 400)
}

const setStatusFilter = (value) => {
    currentStatusFilter.value = value
    fetchManufacturers()
}

const saveManufacturer = async () => {
    processing.value = true
    errors.value = {}

    try {
        const formData = new FormData()
        
        // Add all form fields
        if (form.value.name) formData.append('name', form.value.name)
        if (form.value.description) formData.append('description', form.value.description)
        if (form.value.website) formData.append('website', form.value.website)
        if (form.value.support_phone) formData.append('support_phone', form.value.support_phone)
        if (form.value.support_email) formData.append('support_email', form.value.support_email)
        if (form.value.order_index !== undefined && form.value.order_index !== null) {
            formData.append('order_index', form.value.order_index)
        }
        formData.append('is_active', form.value.is_active ? '1' : '0')
        
        // Handle logo
        if (form.value.logo) {
            formData.append('logo', form.value.logo)
        }
        if (form.value.remove_logo && isEditing.value) {
            formData.append('remove_logo', 'true')
        }

        if (isEditing.value) {
            formData.append('_method', 'PUT')
            await api().post(`/tenant/equipment-manufacturers/${selectedManufacturerId.value}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            showToast('Manufacturer updated successfully.', 'success')
        } else {
            await api().post('/tenant/equipment-manufacturers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            showToast('Manufacturer created successfully.', 'success')
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
    if (!selectedManufacturerId.value) return

    processing.value = true
    deleteError.value = ''
    
    try {
        await api().delete(`/tenant/equipment-manufacturers/${selectedManufacturerId.value}`)
        showToast('Manufacturer deleted successfully.', 'success')
        closeDeleteDialog()
        await fetchManufacturers()
    } catch (error) {
        if (error.response?.status === 422) {
            deleteError.value = error.response.data.message
        } else {
            deleteError.value = error.response?.data?.message || 'Failed to delete manufacturer.'
        }
        showToast(deleteError.value, 'error')
    } finally {
        processing.value = false
    }
}

// ==================== Toast Notification ====================
const showToast = (message, type = 'success') => {
    // Replace with your actual toast system
    console.log(`[${type.toUpperCase()}]`, message)
    // Example: window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))
}

// ==================== Lifecycle Hooks ====================
onMounted(() => {
    fetchManufacturers()
})
</script>