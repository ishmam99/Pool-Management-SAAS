<template>
    <div class="p-6 max-w-[1600px] mx-auto">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Equipment Components</h1>
                <p class="text-sm text-gray-500">Manage reusable equipment components for each model.</p>
            </div>
            <button
                @click="openCreateModal"
                class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
                + Add Component
            </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="w-full md:w-64">
                    <label for="model-filter" class="block text-sm font-medium text-gray-700 mb-1">Equipment Model</label>
                    <select
                        id="model-filter"
                        v-model="filters.model_id"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">All Models</option>
                        <option v-for="model in equipmentModels" :key="model.id" :value="model.id">
                            {{ model.name }}
                        </option>
                    </select>
                </div>

                <div class="w-full md:w-64">
                    <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">Component Type</label>
                    <select
                        id="type-filter"
                        v-model="filters.type"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">All Types</option>
                        <option v-for="t in componentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                    </select>
                </div>

                <div class="w-full md:w-64">
                    <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        id="status-filter"
                        v-model="filters.is_active"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">All</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-sm text-gray-500">Loading components...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="components.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No components found</h3>
            <p class="mt-1 text-sm text-gray-500">Click "Add Component" to create one.</p>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment Model</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Brand</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Model</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="component in components" :key="component.id" class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ component.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ component.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ component.equipment_model?.name || 'N/A' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatType(component.type) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ component.default_brand || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ component.default_model || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatPrice(component.default_price) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    :class="[
                                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                        component.is_required ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    ]"
                                >
                                    {{ component.is_required ? 'Required' : 'Optional' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    :class="[
                                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                        component.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    ]"
                                >
                                    {{ component.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ component.display_order ?? '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(component.created_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(component.updated_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button @click="openEditModal(component)" class="text-indigo-600 hover:text-indigo-900 transition">Edit</button>
                                <button @click="openDeleteModal(component)" class="text-red-600 hover:text-red-900 transition">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeModal"></div>

                <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                    <form @submit.prevent="saveComponent">
                        <div class="px-6 py-4 border-b">
                            <h3 class="text-lg font-medium text-gray-900">
                                {{ isEditing ? 'Edit Component' : 'Add Component' }}
                            </h3>
                        </div>

                        <div class="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Equipment Model *</label>
                                <select
                                    v-model="form.model_id"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    required
                                >
                                    <option value="">Select Equipment Model</option>
                                    <option v-for="model in equipmentModels" :key="model.id" :value="model.id">
                                        {{ model.name }} - {{ model.manufacturer?.name || 'N/A' }}
                                    </option>
                                </select>
                                <p v-if="errors.model_id" class="mt-1 text-sm text-red-600">{{ errors.model_id[0] }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Component Type *</label>
                                <select
                                    v-model="form.type"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option v-for="t in componentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                                </select>
                                <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type[0] }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Name *</label>
                                <input
                                    type="text"
                                    v-model="form.name"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    required
                                />
                                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    v-model="form.description"
                                    rows="2"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                ></textarea>
                                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Default Brand</label>
                                    <input
                                        type="text"
                                        v-model="form.default_brand"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    />
                                    <p v-if="errors.default_brand" class="mt-1 text-sm text-red-600">{{ errors.default_brand[0] }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Default Model</label>
                                    <input
                                        type="text"
                                        v-model="form.default_model"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    />
                                    <p v-if="errors.default_model" class="mt-1 text-sm text-red-600">{{ errors.default_model[0] }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Default Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        v-model="form.default_price"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    />
                                    <p v-if="errors.default_price" class="mt-1 text-sm text-red-600">{{ errors.default_price[0] }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Display Order</label>
                                    <input
                                        type="number"
                                        min="0"
                                        v-model="form.display_order"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    />
                                    <p v-if="errors.display_order" class="mt-1 text-sm text-red-600">{{ errors.display_order[0] }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Required</label>
                                    <select
                                        v-model="form.is_required"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    >
                                        <option :value="true">Required</option>
                                        <option :value="false">Optional</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        v-model="form.is_active"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                                    >
                                        <option :value="true">Active</option>
                                        <option :value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button
                                type="button"
                                @click="closeModal"
                                :disabled="saving"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                :disabled="saving"
                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                {{ isEditing ? 'Update' : 'Save' }}
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
                                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Component</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">Are you sure you want to delete this component?</p>
                                    <p class="text-sm text-gray-500 font-medium mt-1">This action cannot be undone.</p>
                                    <p v-if="deleteError" class="mt-2 text-sm text-red-600">{{ deleteError }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            @click="deleteComponent"
                            :disabled="deleting"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span v-if="deleting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Delete
                        </button>
                        <button
                            @click="closeDeleteModal"
                            :disabled="deleting"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
import { ref, onMounted, watch } from 'vue'
import api from '../../../../../services/api.js'
import { useAuthStore } from '../../../../../store/AuthStore.js'
const authStore = useAuthStore()
// Static reference data
const componentTypes = [
    { value: 'pump', label: 'Pump' },
    { value: 'filter', label: 'Filter' },
    { value: 'heater', label: 'Heater' },
    { value: 'salt_cell', label: 'Salt Cell' },
    { value: 'chlorinator', label: 'Chlorinator' },
    { value: 'controller', label: 'Controller' },
    { value: 'automation', label: 'Automation' },
    { value: 'light', label: 'Light' },
    { value: 'cleaner', label: 'Cleaner' },
    { value: 'blower', label: 'Blower' },
    { value: 'valve', label: 'Valve' },
    { value: 'sensor', label: 'Sensor' },
    { value: 'chemical_feeder', label: 'Chemical Feeder' },
    { value: 'parts', label: 'Parts' },
    { value: 'structure', label: 'Pool Structure' },
    { value: 'other', label: 'Other' }
]

// State
const equipmentModels = ref([])
const components = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const currentComponentId = ref(null)
const componentToDelete = ref(null)
const errors = ref({})
const deleteError = ref('')
let searchTimeout = null

const filters = ref({
    model_id: '',
    type: '',
    is_active: ''
})

const form = ref({
    model_id: '',
    type: '',
    name: '',
    description: '',
    default_brand: '',
    default_model: '',
    default_price: null,
    display_order: null,
    is_required: false,
    is_active: true
})

// Utilities
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return '-'
    return '$' + parseFloat(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const formatType = (type) => {
    const match = componentTypes.find(t => t.value === type)
    return match ? match.label : (type || '-')
}

const showToast = (message, type = 'success') => {
    // Integrate with your application's toast system
    // Example: this.$toast?.[type]?.(message)
}

// Data loading
const loadEquipmentModels = async () => {
    try {
        const base = '/tenant/equipment-models'
        const url = authStore.authType === 'admin' ? `${base}?tenant_id=${authStore.tenantId}` : base
        const response = await api().get(url)
        if (response.data?.success) {
            equipmentModels.value = response.data.data || []
        } else {
            equipmentModels.value = []
        }
    } catch (error) {
        showToast('Failed to load equipment models', 'error')
    }
}

const loadComponents = async () => {
    loading.value = true
    try {
        const params = {}
        if (filters.value.model_id) params.model_id = filters.value.model_id
        if (filters.value.type) params.type = filters.value.type
        if (filters.value.is_active !== '') params.is_active = filters.value.is_active
        params.with = 'equipmentModel.manufacturer' 
        const base = '/tenant/equipment-components'
        const url = authStore.authType === 'admin' ? `${base}?tenant_id=${authStore.tenantId}` : base
        // const response = await api().get(url)
        const response = await api().get(url, { params })
        if (response.data?.success) {
            components.value = response.data.data || []
        } else {
            components.value = []
            showToast(response.data?.message || 'Failed to load components', 'error')
        }
    } catch (error) {
        showToast(error.response?.data?.message || 'Failed to load components', 'error')
        components.value = []
    } finally {
        loading.value = false
    }
}

// Form handling
const resetForm = () => {
    form.value = {
        model_id: '',
        type: '',
        name: '',
        description: '',
        default_brand: '',
        default_model: '',
        default_price: null,
        display_order: null,
        is_required: false,
        is_active: true
    }
    errors.value = {}
    deleteError.value = ''
    isEditing.value = false
    currentComponentId.value = null
}

const openCreateModal = () => {
    resetForm()
    isModalOpen.value = true
}

const openEditModal = (component) => {
    resetForm()
    isEditing.value = true
    currentComponentId.value = component.id
    form.value = {
        model_id: component.model_id,
        type: component.type || '',
        name: component.name,
        description: component.description || '',
        default_brand: component.default_brand || '',
        default_model: component.default_model || '',
        default_price: component.default_price ?? null,
        display_order: component.display_order ?? null,
        is_required: !!component.is_required,
        is_active: !!component.is_active
    }
    isModalOpen.value = true
}

const closeModal = () => {
    if (saving.value) return
    isModalOpen.value = false
    resetForm()
}

const openDeleteModal = (component) => {
    componentToDelete.value = component
    deleteError.value = ''
    isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
    if (deleting.value) return
    isDeleteModalOpen.value = false
    componentToDelete.value = null
    deleteError.value = ''
}

// CRUD actions
const saveComponent = async () => {
    if (saving.value) return

    saving.value = true
    errors.value = {}

    try {
        const payload = {
            model_id: form.value.model_id,
            type: form.value.type,
            name: form.value.name,
            description: form.value.description,
            default_brand: form.value.default_brand,
            default_model: form.value.default_model,
            default_price: form.value.default_price,
            display_order: form.value.display_order,
            is_required: form.value.is_required ? 1 : 0,
            is_active: form.value.is_active ? 1 : 0
        }

        let response
        if (isEditing.value) {
            response = await api().put(`/tenant/equipment-components/${currentComponentId.value}`, payload)
        } else {
            response = await api().post('/tenant/equipment-components', payload)
        }

        if (response.data?.success) {
            showToast(response.data.message || (isEditing.value ? 'Component updated.' : 'Component created.'))
            closeModal()
            await loadComponents()
        } else {
            showToast(response.data?.message || 'Failed to save component', 'error')
        }
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {}
            showToast(error.response.data.message || 'Validation failed', 'error')
        } else if (error.response?.status === 404) {
            showToast(error.response.data?.message || 'Component not found', 'error')
        } else if (error.response?.status === 500) {
            showToast(error.response.data?.message || 'Server error. Please try again.', 'error')
        } else {
            showToast(error.response?.data?.message || 'Failed to save component. Please check your connection.', 'error')
        }
    } finally {
        saving.value = false
    }
}

const deleteComponent = async () => {
    if (deleting.value || !componentToDelete.value) return

    deleting.value = true
    deleteError.value = ''

    try {
        const response = await api().delete(`/tenant/equipment-components/${componentToDelete.value.id}`)

        if (response.data?.success) {
            showToast(response.data.message || 'Component deleted.')
            closeDeleteModal()
            await loadComponents()
        } else {
            deleteError.value = response.data?.message || 'Failed to delete component'
            showToast(deleteError.value, 'error')
        }
    } catch (error) {
        if (error.response?.status === 422) {
            deleteError.value = error.response.data?.message || 'Cannot delete component with installed equipment. Deactivate it instead.'
        } else if (error.response?.status === 404) {
            deleteError.value = error.response.data?.message || 'Component not found'
        } else {
            deleteError.value = error.response?.data?.message || 'Failed to delete component'
        }
        showToast(deleteError.value, 'error')
    } finally {
        deleting.value = false
    }
}

// Watchers — always reload from backend on filter change
watch(() => filters.value.model_id, () => {
    loadComponents()
})

watch(() => filters.value.type, () => {
    loadComponents()
})

watch(() => filters.value.is_active, () => {
    loadComponents()
})

watch(() => authStore.tenantId, () => {
  loadComponents();
  loadEquipmentModels();
})

// Lifecycle
onMounted(async () => {
    await loadEquipmentModels()
    await loadComponents()
})
</script>