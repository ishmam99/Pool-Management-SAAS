```vue
<template>
    <div class="p-6">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Equipment Models</h1>
                <p class="text-sm text-gray-500">Manage equipment models under each manufacturer.</p>
            </div>
            <button
                @click="openCreateModal"
                class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
                + Add Equipment Model
            </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="w-full md:w-64">
                    <label for="manufacturer-filter" class="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <select
                        id="manufacturer-filter"
                        v-model="selectedManufacturerId"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">All Manufacturers</option>
                        <option v-for="manufacturer in manufacturers" :key="manufacturer.id" :value="manufacturer.id">
                            {{ manufacturer.name }}
                        </option>
                    </select>
                </div>
                <div class="w-full md:w-64">
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        id="search"
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search by model name..."
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-sm text-gray-500">Loading equipment models...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredModels.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No equipment models found</h3>
            <p class="mt-1 text-sm text-gray-500">Click "Add Equipment Model" to create one.</p>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="model in filteredModels" :key="model.id" class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ model.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ model.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ model.manufacturer?.name || 'N/A' }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ model.description || '—' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    :class="[
                                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                        model.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    ]"
                                >
                                    {{ model.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(model.created_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                    @click="openEditModal(model)"
                                    class="text-indigo-600 hover:text-indigo-900 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="openDeleteModal(model)"
                                    class="text-red-600 hover:text-red-900 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form @submit.prevent="saveModel">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        {{ isEditing ? 'Edit Equipment Model' : 'Add Equipment Model' }}
                                    </h3>
                                    <div class="mt-4 space-y-4">
                                        <div>
                                            <label for="manufacturer" class="block text-sm font-medium text-gray-700">Manufacturer *</label>
                                            <select
                                                id="manufacturer"
                                                v-model="form.manufacturer_id"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                required
                                            >
                                                <option value="">Select Manufacturer</option>
                                                <option v-for="manufacturer in manufacturers" :key="manufacturer.id" :value="manufacturer.id">
                                                    {{ manufacturer.name }}
                                                </option>
                                            </select>
                                            <p v-if="errors.manufacturer_id" class="mt-1 text-sm text-red-600">{{ errors.manufacturer_id }}</p>
                                        </div>

                                        <div>
                                            <label for="model-name" class="block text-sm font-medium text-gray-700">Model Name *</label>
                                            <input
                                                id="model-name"
                                                type="text"
                                                v-model="form.name"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                required
                                            />
                                            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                                        </div>

                                        <div>
                                            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                id="description"
                                                v-model="form.description"
                                                rows="3"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                id="status"
                                                v-model="form.is_active"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            >
                                                <option :value="true">Active</option>
                                                <option :value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                :disabled="saving"
                                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                {{ isEditing ? 'Update' : 'Save' }} Equipment Model
                            </button>
                            <button
                                type="button"
                                @click="closeModal"
                                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDeleteModal"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Equipment Model</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">Are you sure you want to delete this equipment model?</p>
                                    <p class="text-sm text-gray-500 font-medium mt-1">This action cannot be undone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            @click="deleteModel"
                            :disabled="deleting"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span v-if="deleting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Delete
                        </button>
                        <button
                            @click="closeDeleteModal"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../../../../../services/api.js'

// State
const manufacturers = ref([])
const models = ref([])
const selectedManufacturerId = ref('')
const searchQuery = ref('')
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const currentModelId = ref(null)
const modelToDelete = ref(null)
const errors = ref({})

// Form
const form = ref({
    manufacturer_id: '',
    name: '',
    description: '',
    is_active: true
})

// Computed
const filteredModels = computed(() => {
    let result = models.value

    // Local search filter
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        result = result.filter(model => 
            model.name.toLowerCase().includes(query)
        )
    }

    return result
})

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const loadManufacturers = async () => {
    try {
        const response = await api().get('/tenant/equipment-manufacturers')
        manufacturers.value = response.data || []
    } catch (error) {
        console.error('Failed to load manufacturers:', error)
        // Could show toast here
    }
}

const loadModels = async () => {
    loading.value = true
    try {
        const params = {}
        if (selectedManufacturerId.value) {
            params.manufacturer_id = selectedManufacturerId.value
        }
        const response = await api().get('/tenant/equipment-models', { params })
        models.value = response.data || []
    } catch (error) {
        console.error('Failed to load models:', error)
        // Could show toast here
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    form.value = {
        manufacturer_id: '',
        name: '',
        description: '',
        is_active: true
    }
    errors.value = {}
    isEditing.value = false
    currentModelId.value = null
}

const openCreateModal = () => {
    resetForm()
    isModalOpen.value = true
}

const openEditModal = (model) => {
    resetForm()
    isEditing.value = true
    currentModelId.value = model.id
    form.value = {
        manufacturer_id: model.manufacturer_id,
        name: model.name,
        description: model.description || '',
        is_active: model.is_active
    }
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    resetForm()
}

const openDeleteModal = (model) => {
    modelToDelete.value = model
    isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
    isDeleteModalOpen.value = false
    modelToDelete.value = null
}

const saveModel = async () => {
    saving.value = true
    errors.value = {}

    try {
        if (isEditing.value) {
            // Update - use POST with _method: PUT
            await api().post(`/tenant/equipment-models/${currentModelId.value}`, {
                _method: 'PUT',
                manufacturer_id: form.value.manufacturer_id,
                name: form.value.name,
                description: form.value.description,
                is_active: form.value.is_active
            })
            // Show success toast (implementation depends on your toast system)
            console.log('Equipment model updated successfully')
        } else {
            // Create
            await api().post('/tenant/equipment-models', {
                manufacturer_id: form.value.manufacturer_id,
                name: form.value.name,
                description: form.value.description,
                is_active: form.value.is_active
            })
            console.log('Equipment model created successfully')
        }

        closeModal()
        await loadModels()
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {}
        } else {
            console.error('Failed to save model:', error)
            // Show error toast
        }
    } finally {
        saving.value = false
    }
}

const deleteModel = async () => {
    if (!modelToDelete.value) return

    deleting.value = true
    try {
        await api().delete(`/tenant/equipment-models/${modelToDelete.value.id}`)
        console.log('Equipment model deleted successfully')
        closeDeleteModal()
        await loadModels()
    } catch (error) {
        console.error('Failed to delete model:', error)
        // Show error toast
    } finally {
        deleting.value = false
    }
}

// Watchers
watch(selectedManufacturerId, () => {
    loadModels()
})

// Lifecycle
onMounted(async () => {
    await loadManufacturers()
    await loadModels()
})
</script>
```