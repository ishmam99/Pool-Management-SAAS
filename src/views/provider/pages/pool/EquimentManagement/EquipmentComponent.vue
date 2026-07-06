<template>
    <div class="p-6 ">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Pool Equipment</h1>
            <p class="text-gray-600 mt-1">Assign equipment components to this pool.</p>
        </div>

        <!-- Loading State -->
        <div v-if="pageLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else>
            <!-- Selection Section -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Manufacturer Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Manufacturer
                            <span class="text-red-500">*</span>
                        </label>
                        <select
                            v-model="selectedManufacturerId"
                            :disabled="loading.manufacturers"
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Manufacturer</option>
                            <option
                                v-for="manufacturer in manufacturers"
                                :key="manufacturer.id"
                                :value="manufacturer.id"
                            >
                                {{ manufacturer.name }}
                            </option>
                        </select>
                        <div v-if="loading.manufacturers" class="mt-2">
                            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                    </div>

                    <!-- Equipment Model Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Equipment Model
                            <span class="text-red-500">*</span>
                        </label>
                        <select
                            v-model="selectedModelId"
                            :disabled="!selectedManufacturerId || loading.models"
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Equipment Model</option>
                            <option
                                v-for="model in equipmentModels"
                                :key="model.id"
                                :value="model.id"
                            >
                                {{ model.name }}
                            </option>
                        </select>
                        <div v-if="loading.models" class="mt-2">
                            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Previous Setup Card -->
            <div v-if="previousSetup && showPreviousSetup" class="mb-8">
                <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-blue-900 mb-2">
                                Previous equipment setup found
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span class="text-blue-700 font-medium">Customer</span>
                                    <p class="text-blue-900">{{ previousSetup.customer_name || 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="text-blue-700 font-medium">Pool</span>
                                    <p class="text-blue-900">{{ previousSetup.pool_name || 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="text-blue-700 font-medium">Installed Components</span>
                                    <p class="text-blue-900">{{ previousSetup.components?.length || 0 }}</p>
                                </div>
                            </div>
                            <div v-if="previousSetup.components?.length" class="mt-3">
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="comp in previousSetup.components"
                                        :key="comp.id"
                                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {{ comp.name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            @click="copyPreviousSetup"
                            class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                        >
                            Copy Previous Setup
                        </button>
                    </div>
                </div>
            </div>

            <!-- Components Grid -->
            <div v-if="selectedModelId && components.length > 0" class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Components</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="component in components"
                        :key="component.id"
                        class="bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-md"
                        :class="[
                            isComponentSelected(component.id) ? 'border-green-500 shadow-md' : 'border-gray-200',
                            loading.components ? 'opacity-50 pointer-events-none' : ''
                        ]"
                    >
                        <div class="p-5">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 text-lg">{{ component.name }}</h3>
                                    <p class="text-sm text-gray-600 mt-1">{{ component.type || 'Standard Component' }}</p>
                                </div>
                                <div v-if="isComponentSelected(component.id)" class="ml-3">
                                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            
                            <div class="mt-3 space-y-1 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Default Brand:</span>
                                    <span class="font-medium text-gray-900">{{ component.default_brand || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Default Model:</span>
                                    <span class="font-medium text-gray-900">{{ component.default_model || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Default Price:</span>
                                    <span class="font-medium text-gray-900">${{ formatPrice(component.default_price) }}</span>
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-gray-100">
                                <label class="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        :checked="isComponentSelected(component.id)"
                                        @change="toggleComponent(component)"
                                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span class="ml-2 text-sm font-medium text-gray-700">Install this component</span>
                                </label>
                            </div>
                        </div>

                        <!-- Expanded Form -->
                        <div
                            v-if="isComponentSelected(component.id)"
                            class="px-5 pb-5 pt-0 border-t border-gray-100 animate-slideDown"
                        >
                            <div class="space-y-4 mt-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Serial Number <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="selectedComponents[component.id].serial_number"
                                        type="text"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter serial number"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Install Date <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="selectedComponents[component.id].install_date"
                                        type="date"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Purchase Price
                                    </label>
                                    <input
                                        v-model="selectedComponents[component.id].purchase_price"
                                        type="number"
                                        step="0.01"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter purchase price"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        v-model="selectedComponents[component.id].notes"
                                        rows="2"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Any additional notes"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State for Components -->
            <div v-else-if="selectedModelId && components.length === 0 && !loading.components" class="mb-8">
                <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No components available</h3>
                    <p class="mt-1 text-sm text-gray-500">This equipment model doesn't have any components configured.</p>
                </div>
            </div>

            <!-- Summary and Save Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <!-- Summary Card -->
                <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Equipment Summary</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span class="text-gray-600">Manufacturer</span>
                            <span class="font-medium text-gray-900">{{ selectedManufacturerName || 'Not selected' }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span class="text-gray-600">Equipment Model</span>
                            <span class="font-medium text-gray-900">{{ selectedModelName || 'Not selected' }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span class="text-gray-600">Selected Components</span>
                            <span class="font-medium text-gray-900">{{ selectedComponentsCount }}</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span class="text-gray-600 font-semibold">Estimated Total Price</span>
                            <span class="text-xl font-bold text-blue-600">${{ formatPrice(totalPrice) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="lg:col-span-1 flex items-end">
                    <button
                        @click="saveEquipment"
                        :disabled="!canSave || saving"
                        class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span v-if="saving">Saving...</span>
                        <span v-else>Save Equipment</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div
            v-if="toast.show"
            class="fixed top-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slideIn"
            :class="toast.type === 'success' ? 'border-green-500' : 'border-red-500'"
        >
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg v-if="toast.type === 'success'" class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <svg v-else class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ toast.message }}</p>
                </div>
                <button @click="closeToast" class="ml-4 flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../../../../../services/api.js'

// State
const manufacturers = ref([])
const equipmentModels = ref([])
const components = ref([])
const previousSetup = ref(null)
const showPreviousSetup = ref(true)

const selectedManufacturerId = ref('')
const selectedModelId = ref('')
const selectedComponents = ref({})

const saving = ref(false)
const pageLoading = ref(true)

const loading = ref({
    manufacturers: false,
    models: false,
    components: false,
    previousSetup: false
})

const toast = ref({
    show: false,
    type: 'success',
    message: ''
})

// Computed
const selectedManufacturerName = computed(() => {
    const manufacturer = manufacturers.value.find(m => m.id === selectedManufacturerId.value)
    return manufacturer ? manufacturer.name : ''
})

const selectedModelName = computed(() => {
    const model = equipmentModels.value.find(m => m.id === selectedModelId.value)
    return model ? model.name : ''
})

const selectedComponentsCount = computed(() => {
    return Object.keys(selectedComponents.value).length
})

const totalPrice = computed(() => {
    let total = 0
    Object.values(selectedComponents.value).forEach(comp => {
        total += parseFloat(comp.purchase_price) || 0
    })
    return total
})

const canSave = computed(() => {
    if (!selectedManufacturerId.value || !selectedModelId.value) return false
    if (selectedComponentsCount.value === 0) return false
    
    // Check if all selected components have required fields
    for (const comp of Object.values(selectedComponents.value)) {
        if (!comp.serial_number || !comp.install_date) return false
    }
    return true
})

// Watchers
watch(selectedManufacturerId, async (newVal) => {
    selectedModelId.value = ''
    selectedComponents.value = {}
    previousSetup.value = null
    showPreviousSetup.value = true
    components.value = []
    
    if (newVal) {
        await loadEquipmentModels(newVal)
    }
})

watch(selectedModelId, async (newVal) => {
    selectedComponents.value = {}
    previousSetup.value = null
    showPreviousSetup.value = true
    components.value = []
    
    if (newVal && selectedManufacturerId.value) {
        await Promise.all([
            loadComponents(newVal),
            checkPreviousSetup(selectedManufacturerId.value, newVal)
        ])
    }
})

// API Methods
const loadManufacturers = async () => {
    loading.value.manufacturers = true
    try {
        const response = await api().get('/tenant/equipment-manufacturers')
        manufacturers.value = response.data.data || []
    } catch (error) {
        console.error('Failed to load manufacturers:', error)
        showToast('Failed to load manufacturers', 'error')
    } finally {
        loading.value.manufacturers = false
    }
}

const loadEquipmentModels = async (manufacturerId) => {
    loading.value.models = true
    try {
        const response = await api().get('/tenant/equipment-models', {
            params: { manufacturer_id: manufacturerId }
        })
        equipmentModels.value = response.data.data || []
    } catch (error) {
        console.error('Failed to load equipment models:', error)
        showToast('Failed to load equipment models', 'error')
    } finally {
        loading.value.models = false
    }
}

const loadComponents = async (modelId) => {
    loading.value.components = true
    try {
        const response = await api().get(`/tenant/equipment-models/${modelId}/components`)
        components.value = response.data.data || []
    } catch (error) {
        console.error('Failed to load components:', error)
        showToast('Failed to load components', 'error')
    } finally {
        loading.value.components = false
    }
}

const checkPreviousSetup = async (manufacturerId, modelId) => {
    loading.value.previousSetup = true
    try {
        const response = await api().get('/tenant/pools/equipment-template', {
            params: {
                manufacturer_id: manufacturerId,
                equipment_model_id: modelId
            }
        })
        previousSetup.value = response.data.data || null
        showPreviousSetup.value = true
    } catch (error) {
        if (error.response?.status === 404) {
            previousSetup.value = null
        } else {
            console.error('Failed to check previous setup:', error)
        }
    } finally {
        loading.value.previousSetup = false
    }
}

const saveEquipment = async () => {
    if (!canSave.value) return
    
    saving.value = true
    try {
        const payload = {
            manufacturer_id: selectedManufacturerId.value,
            equipment_model_id: selectedModelId.value,
            components: Object.entries(selectedComponents.value).map(([componentId, data]) => ({
                component_id: parseInt(componentId),
                serial_number: data.serial_number,
                install_date: data.install_date,
                purchase_price: parseFloat(data.purchase_price) || 0,
                notes: data.notes || ''
            }))
        }
        
        // Replace with actual pool_id from route or props
        const poolId = 1 // This should come from route params or props
        await api().post(`/tenant/pools/${poolId}/equipments`, payload)
        
        showToast('Equipment saved successfully!', 'success')
        resetForm()
    } catch (error) {
        console.error('Failed to save equipment:', error)
        showToast('Failed to save equipment. Please try again.', 'error')
    } finally {
        saving.value = false
    }
}

// CRUD Methods
const toggleComponent = (component) => {
    if (selectedComponents.value[component.id]) {
        delete selectedComponents.value[component.id]
    } else {
        selectedComponents.value[component.id] = {
            component_id: component.id,
            serial_number: '',
            install_date: new Date().toISOString().split('T')[0],
            purchase_price: component.default_price || 0,
            notes: ''
        }
    }
}

const isComponentSelected = (componentId) => {
    return !!selectedComponents.value[componentId]
}

const copyPreviousSetup = () => {
    if (!previousSetup.value?.components) return
    
    previousSetup.value.components.forEach(comp => {
        if (components.value.some(c => c.id === comp.id)) {
            selectedComponents.value[comp.id] = {
                component_id: comp.id,
                serial_number: comp.serial_number || '',
                install_date: comp.install_date || new Date().toISOString().split('T')[0],
                purchase_price: comp.purchase_price || comp.default_price || 0,
                notes: comp.notes || ''
            }
        }
    })
    showPreviousSetup.value = false
    showToast('Previous setup copied successfully!', 'success')
}

const resetForm = () => {
    selectedManufacturerId.value = ''
    selectedModelId.value = ''
    selectedComponents.value = {}
    components.value = []
    previousSetup.value = null
    showPreviousSetup.value = true
}

// Utility Methods
const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2)
}

const showToast = (message, type = 'success') => {
    toast.value.message = message
    toast.value.type = type
    toast.value.show = true
    setTimeout(() => {
        closeToast()
    }, 5000)
}

const closeToast = () => {
    toast.value.show = false
}

// Lifecycle Hooks
onMounted(async () => {
    pageLoading.value = true
    await loadManufacturers()
    pageLoading.value = false
})
</script>

<style scoped>
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-slideDown {
    animation: slideDown 0.3s ease-out;
}

.animate-slideIn {
    animation: slideIn 0.3s ease-out;
}

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>