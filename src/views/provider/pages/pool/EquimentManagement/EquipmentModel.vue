<template>
    <div class="p-6 ">
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
                    <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        id="status-filter"
                        v-model="selectedStatus"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">All</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
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
        <div v-else-if="models.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Number</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Components</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="model in models" :key="model.id" class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100{{ model.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div class="flex flex-col">
                                    <span>{{ model.name }}</span>
                                    <span class="text-xs">Manufacturer: {{ model.manufacturer?.name || 'N/A' }}</span>
                                    <span class="text-xs">Manufacturer: {{ model.release_year || '-' }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ model.model_number || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {{ model.components_count || 0 }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ model.description || '—' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ model.order_index ?? '-' }}</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                    @click="openViewComponents(model)"
                                    class="text-blue-600 hover:text-blue-900 transition"
                                >
                                    View Components
                                </button>
                                <button
                                    @click="openEditModal(model.id)"
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
<Transition name="modal">
<div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all">
            <form @submit.prevent="saveModel">
                <!-- Header -->
                <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">
                            {{ isEditing ? 'Edit Equipment Model' : 'Add Equipment Model' }}
                        </h3>
                        <p class="text-xs text-gray-500 mt-0.5">
                            {{ isEditing ? 'Update the details below' : 'Fill in the details to create a new model' }}
                        </p>
                    </div>
                    <button
                        type="button"
                        @click="closeModal"
                        class="ml-auto flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Manufacturer <span class="text-red-500">*</span></label>
                        <select
                            v-model="form.manufacturer_id"
                            class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition"
                            required
                        >
                            <option value="">Select Manufacturer</option>
                            <option v-for="manufacturer in manufacturers" :key="manufacturer.id" :value="manufacturer.id">
                                {{ manufacturer.name }}
                            </option>
                        </select>
                        <p v-if="errors.manufacturer_id" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                            {{ errors.manufacturer_id[0] }}
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Model Name <span class="text-red-500">*</span></label>
                        <input
                            type="text"
                            v-model="form.name"
                            placeholder="e.g. X500 Turbo"
                            class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition"
                            required
                        />
                        <p v-if="errors.name" class="mt-1.5 text-xs text-red-600">{{ errors.name[0] }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            v-model="form.description"
                            rows="2"
                            placeholder="Optional short description..."
                            class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition resize-none"
                        ></textarea>
                        <p v-if="errors.description" class="mt-1.5 text-xs text-red-600">{{ errors.description[0] }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Model Number</label>
                            <input
                                type="text"
                                v-model="form.model_number"
                                class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition"
                            />
                            <p v-if="errors.model_number" class="mt-1.5 text-xs text-red-600">{{ errors.model_number[0] }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Release Year</label>
                            <input
                                type="number"
                                v-model="form.release_year"
                                class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition"
                                min="1900"
                                max="2099"
                            />
                            <p v-if="errors.release_year" class="mt-1.5 text-xs text-red-600">{{ errors.release_year[0] }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                            <input
                                type="number"
                                v-model="form.order_index"
                                class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition"
                                min="0"
                            />
                            <p v-if="errors.order_index" class="mt-1.5 text-xs text-red-600">{{ errors.order_index[0] }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                            <select
                                v-model="form.is_active"
                                class="block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition"
                            >
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <button
                        type="button"
                        @click="closeModal"
                        :disabled="saving"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                        <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        {{ isEditing ? 'Update Model' : 'Save Model' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</Transition>
<!-- Components Modal -->
<Transition name="modal">
<div v-if="isComponentsModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="closeComponentsModal"></div>

        <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all">
            <div class="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                        Components
                    </h3>
                    <p class="text-xs text-gray-500 mt-0.5">{{ currentModel?.name }}</p>
                </div>
                <button
                    @click="closeComponentsModal"
                    class="ml-auto flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="px-6 py-5">
                <div v-if="loadingComponents" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                    <p class="mt-3 text-sm text-gray-500">Loading components...</p>
                </div>

                <div v-else-if="components.length === 0" class="text-center py-12">
                    <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p class="mt-3 text-sm text-gray-500">No components found for this model.</p>
                </div>

                <div v-else class="overflow-x-auto rounded-xl border border-gray-100">
                    <table class="min-w-full divide-y divide-gray-100">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Default Brand</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Default Model</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Required</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="component in components" :key="component.id" class="hover:bg-gray-50 transition">
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ component.type || '-' }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ component.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{{ component.description || '-' }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ component.default_brand || '-' }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ component.default_model || '-' }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ component.default_price ? '$' + component.default_price : '-' }}</td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <span :class="[
                                        'inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
                                        component.is_required ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                                    ]">
                                        {{ component.is_required ? 'Required' : 'Optional' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <span :class="[
                                        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full',
                                        component.is_active ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                                    ]">
                                        <span :class="['w-1.5 h-1.5 rounded-full', component.is_active ? 'bg-green-500' : 'bg-red-500']"></span>
                                        {{ component.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ component.display_order ?? '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
                <button
                    @click="closeComponentsModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
</Transition>

        <<!-- Delete Confirmation Modal -->
<Transition name="modal">
<div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="closeDeleteModal"></div>

        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div class="px-6 pt-6 pb-2">
                <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 ring-8 ring-red-50/50">
                    <svg class="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 class="mt-4 text-lg font-semibold text-gray-900 text-center">Delete Equipment Model</h3>
                <div class="mt-2 text-center">
                    <p class="text-sm text-gray-500">Are you sure you want to delete this equipment model?</p>
                    <p class="text-sm text-gray-500 mt-1">This action <span class="font-medium text-gray-700">cannot be undone</span>.</p>
                    <div v-if="deleteError" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 flex items-start gap-2 text-left">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ deleteError }}
                    </div>
                </div>
            </div>
            <div class="px-6 py-5 flex gap-3">
                <button
                    @click="closeDeleteModal"
                    :disabled="deleting"
                    class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 transition"
                >
                    Cancel
                </button>
                <button
                    @click="deleteModel"
                    :disabled="deleting"
                    class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                    <span v-if="deleting" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Delete
                </button>
            </div>
        </div>
    </div>
</div>
</Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../../../../../services/api.js'

// State
const manufacturers = ref([])
const models = ref([])
const selectedManufacturerId = ref('')
const selectedStatus = ref('')
const searchQuery = ref('')
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const loadingComponents = ref(false)
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isComponentsModalOpen = ref(false)
const isEditing = ref(false)
const currentModelId = ref(null)
const currentModel = ref(null)
const modelToDelete = ref(null)
const errors = ref({})
const deleteError = ref('')
const components = ref([])
let searchTimeout = null

// Form
const form = ref({
    manufacturer_id: '',
    name: '',
    description: '',
    model_number: '',
    release_year: null,
    order_index: null,
    is_active: true
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

const showToast = (message, type = 'success') => {
    // Integrate with your application's toast system
    console.log(`[${type}]`, message)
    // Example: this.$toast?.[type]?.(message)
}

const loadManufacturers = async () => {
    try {
        const response = await api().get('/tenant/equipment-manufacturers')
        if (response.data?.success) {
            manufacturers.value = response.data.data || []
        } else {
            manufacturers.value = []
        }
    } catch (error) {
        console.error('Failed to load manufacturers:', error)
        showToast('Failed to load manufacturers', 'error')
    }
}

const loadModels = async () => {
    loading.value = true
    try {
        const params = {}
        if (selectedManufacturerId.value) {
            params.manufacturer_id = selectedManufacturerId.value
        }
        if (selectedStatus.value !== '') {
            params.is_active = selectedStatus.value
        }
        if (searchQuery.value.trim()) {
            params.search = searchQuery.value.trim()
        }

        const response = await api().get('/tenant/equipment-models', { params })
        if (response.data?.success) {
            models.value = response.data.data || []
        } else {
            models.value = []
        }
    } catch (error) {
        console.error('Failed to load models:', error)
        showToast('Failed to load equipment models', 'error')
        models.value = []
    } finally {
        loading.value = false
    }
}

const loadModelForEdit = async (id) => {
    try {
        const response = await api().get(`/tenant/equipment-models/${id}`)
        if (response.data?.success) {
            const data = response.data.data
            form.value = {
                manufacturer_id: data.manufacturer_id,
                name: data.name,
                description: data.description || '',
                model_number: data.model_number || '',
                release_year: data.release_year || null,
                order_index: data.order_index ?? null,
                is_active: data.is_active ?? true
            }
            return true
        }
        return false
    } catch (error) {
        console.error('Failed to load model:', error)
        showToast('Failed to load model data', 'error')
        return false
    }
}

const resetForm = () => {
    form.value = {
        manufacturer_id: '',
        name: '',
        description: '',
        model_number: '',
        release_year: null,
        order_index: null,
        is_active: true
    }
    errors.value = {}
    deleteError.value = ''
    isEditing.value = false
    currentModelId.value = null
}

const openCreateModal = () => {
    resetForm()
    isModalOpen.value = true
}

const openEditModal = async (id) => {
    resetForm()
    isEditing.value = true
    currentModelId.value = id
    
    const loaded = await loadModelForEdit(id)
    if (loaded) {
        isModalOpen.value = true
    }
}

const openViewComponents = async (model) => {
    currentModel.value = model
    isComponentsModalOpen.value = true
    loadingComponents.value = true
    components.value = []
    
    try {
        const response = await api().get(`/tenant/equipment-models/${model.id}/components`)
        if (response.data?.success) {
            components.value = response.data.data || []
        }
    } catch (error) {
        console.error('Failed to load components:', error)
        showToast('Failed to load components', 'error')
    } finally {
        loadingComponents.value = false
    }
}

const closeComponentsModal = () => {
    isComponentsModalOpen.value = false
    components.value = []
    currentModel.value = null
}

const closeModal = () => {
    if (saving.value) return
    isModalOpen.value = false
    resetForm()
}

const openDeleteModal = (model) => {
    modelToDelete.value = model
    deleteError.value = ''
    isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
    if (deleting.value) return
    isDeleteModalOpen.value = false
    modelToDelete.value = null
    deleteError.value = ''
}

const saveModel = async () => {
    if (saving.value) return
    
    saving.value = true
    errors.value = {}

    try {
        const payload = {
            manufacturer_id: form.value.manufacturer_id,
            name: form.value.name,
            description: form.value.description,
            model_number: form.value.model_number,
            release_year: form.value.release_year,
            order_index: form.value.order_index,
            is_active: form.value.is_active == true ? 1: 0
        }

        let response
        if (isEditing.value) {
            response = await api().put(`/tenant/equipment-models/${currentModelId.value}`, payload)
        } else {
            response = await api().post('/tenant/equipment-models', payload)
        }

        if (response.data?.success) {
            showToast(response.data.message || (isEditing.value ? 'Equipment model updated' : 'Equipment model created'))
            closeModal()
            await loadModels()
        } else {
            showToast(response.data?.message || 'Failed to save model', 'error')
        }
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {}
            const errorMessage = error.response.data.message || 'Validation failed'
            showToast(errorMessage, 'error')
        } else {
            const message = error.response?.data?.message || 'Failed to save model'
            showToast(message, 'error')
            console.error('Failed to save model:', error)
        }
    } finally {
        saving.value = false
        openCreateModal()
    }
}

const deleteModel = async () => {
    if (deleting.value || !modelToDelete.value) return

    deleting.value = true
    deleteError.value = ''

    try {
        const response = await api().delete(`/tenant/equipment-models/${modelToDelete.value.id}`)
        
        if (response.data?.success) {
            showToast(response.data.message || 'Equipment model deleted')
            closeDeleteModal()
            await loadModels()
        } else {
            showToast(response.data?.message || 'Failed to delete model', 'error')
        }
    } catch (error) {
        if (error.response?.status === 422) {
            const message = error.response.data?.message || 'Cannot delete model with installed equipment. Deactivate it instead.'
            deleteError.value = message
            showToast(message, 'error')
        } else {
            const message = error.response?.data?.message || 'Failed to delete model'
            deleteError.value = message
            showToast(message, 'error')
            console.error('Failed to delete model:', error)
        }
    } finally {
        deleting.value = false
    }
}

// Watchers
watch(selectedManufacturerId, () => {
    loadModels()
})

watch(selectedStatus, () => {
    loadModels()
})

watch(searchQuery, (newVal, oldVal) => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
        loadModels()
    }, 300)
})

// Lifecycle
onMounted(async () => {
    await loadManufacturers()
    await loadModels()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>