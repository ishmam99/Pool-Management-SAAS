<template>
    <div class="min-h-screen bg-slate-50 font-inter">
        <!-- ===== PAGE HEADER ===== -->
        <div
            class="relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 border-b border-slate-200">
            <!-- Background decorative elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"></div>
                <div class="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"></div>
                <div class="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl"></div>
            </div>

            <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <!-- Top row: title + actions -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                            </svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h1 class="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">Pool Operations
                                    Center</h1>

                            </div>
                            <p class="text-sm text-slate-500 mt-0.5">Manage your pool portfolio and service operations
                            </p>
                        </div>
                    </div>


                </div>


            </div>
        </div>

        <!-- ===== MAIN CONTENT ===== -->
        <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <!-- ===== FILTER BAR ===== -->
            <div class="sticky top-0 z-20 mb-5">
                <div
                    class="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-3 shadow-lg shadow-slate-200/50">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <!-- Search Input -->
                        <div class="relative flex-1">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input v-model="searchQuery" type="text" placeholder="Search pools, customers..."
                                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200" />
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Filter Chips -->
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <button v-for="chip in filterChips" :key="chip.value" @click="setFilter(chip.value)" :class="[
                                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
                                activeFilter === chip.value
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-slate-200'
                            ]">
                                <span v-if="chip.dot" :class="['w-1.5 h-1.5 rounded-full', chip.dot]"></span>
                                {{ chip.label }}
                            </button>

                            <div v-if="activeFilterCount > 0" class="flex items-center gap-2 pl-1.5">
                                <span class="w-px h-4 bg-slate-300"></span>
                                <span class="text-xs text-slate-500">{{ activeFilterCount }} active</span>
                                <button @click="clearFilters"
                                    class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== LOADING SKELETON ===== -->
            <div v-if="isLoading" class="space-y-3">
                <div v-for="i in 5" :key="i" class="rounded-2xl bg-white border border-slate-200 p-4 animate-pulse">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-200"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-slate-200 rounded-lg w-1/4"></div>
                            <div class="h-3 bg-slate-200 rounded-lg w-1/6"></div>
                        </div>
                        <div class="hidden md:flex gap-4">
                            <div class="h-4 bg-slate-200 rounded-lg w-24"></div>
                            <div class="h-4 bg-slate-200 rounded-lg w-16"></div>
                            <div class="h-6 bg-slate-200 rounded-full w-20"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== DESKTOP TABLE ===== -->
            <div v-else-if="filteredPools.length > 0" class="hidden md:block">
                <div class="rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-slate-200/50 bg-white">
                    <!-- Table Header -->
                    <div class="bg-slate-50 border-b border-slate-200 px-5 py-3">
                        <div
                            class="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <div class="col-span-3">Pool</div>
                            <div class="col-span-2">Customer</div>
                            <div class="col-span-2">Chemical Type</div>
                            <div class="col-span-1 text-right">Volume</div>
                            <div class="col-span-1 text-center">Equipment</div>
                            <div class="col-span-1 text-center">Status</div>
                            <div class="col-span-2 text-right">Actions</div>
                        </div>
                    </div>

                    <!-- Table Body -->
                    <div class="divide-y divide-slate-100">
                        <div v-for="pool in paginatedPools" :key="pool.id" class="relative">
                            <!-- Main Row -->
                            <div class="group grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-slate-50 transition-all duration-200 relative border-l-2 border-transparent hover:border-blue-500 cursor-pointer"
                                @click="toggleRow(pool.id)">
                                <!-- Pool -->
                                <div class="col-span-3 flex items-center gap-3">
                                    <div
                                        class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200 flex-shrink-0">
                                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-sm font-semibold text-slate-800 truncate">{{ pool.label ||
                                            pool.name }}</div>
                                        <div class="text-xs text-slate-400 font-mono">#{{ pool.id }}</div>
                                    </div>
                                </div>

                                <!-- Customer -->
                                <div class="col-span-2 flex items-center gap-2">
                                    <div
                                        :class="['flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white flex-shrink-0', getAvatarColor(pool.customer?.contact_name)]">
                                        {{ (pool.customer?.contact_name || 'U').charAt(0).toUpperCase() }}
                                    </div>
                                    <div class="text-sm text-slate-700 truncate">{{ pool.customer?.contact_name ||
                                        'Unknown' }}</div>
                                </div>

                                <!-- Chemical Type -->
                                <div class="col-span-2">
                                    <span
                                        :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border', getChemicalStyle(pool.chemical_type || pool.chemicalType)]">
                                        <span
                                            :class="['w-1.5 h-1.5 rounded-full', getChemicalDot(pool.chemical_type || pool.chemicalType)]"></span>
                                        {{ formatChemicalType(pool.chemical_type || pool.chemicalType) }}
                                    </span>
                                </div>

                                <!-- Volume -->
                                <div class="col-span-1 text-right">
                                    <span class="text-sm font-semibold text-slate-700">{{
                                        formatVolume(pool.volume_gallons || pool.volume)
                                        }}</span>
                                    <span class="text-xs text-slate-400 ml-0.5">gal</span>
                                </div>

                                <!-- Equipment -->
                                <div class="col-span-1 flex justify-center">
                                    <span
                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        </svg>
                                        {{ pool.equipment?.length || 0 }}
                                        <svg v-if="pool.equipment?.length"
                                            :class="['w-3 h-3 transition-transform duration-200', expandedRows.has(pool.id) ? 'rotate-180' : '']"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </div>

                                <!-- Status -->
                                <div class="col-span-1 flex justify-center">
                                    <span
                                        :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusStyle(pool.is_active)]">
                                        <span
                                            :class="['w-1.5 h-1.5 rounded-full', pool.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                                        {{ pool.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>

                                <!-- Actions -->
                                <div class="col-span-2 flex items-center justify-end gap-1.5 duration-200" @click.stop>
                                    <button @click="addRecommendations(pool.id)"
                                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Recommendation
                                    </button>
                                </div>
                            </div>

                            <!-- Expanded Equipment Details -->
                            <div v-if="expandedRows.has(pool.id) && pool.equipment?.length"
                                class="col-span-12 px-5 py-4 bg-slate-50/80 border-t border-slate-100">
                                <div class="flex items-center gap-2 mb-3">
                                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    </svg>
                                    <span
                                        class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment
                                        Details</span>
                                    <span class="text-xs text-slate-400">({{ pool.equipment.length }} items)</span>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                    <div v-for="eq in pool.equipment" :key="eq.id"
                                        class="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">

                                        <!-- Header: Brand, Model, Type, Status -->
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex items-center gap-2">
                                                <div
                                                    :class="['flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0', getEquipmentBgColor(eq.type || eq.component?.type)]">
                                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-sm font-semibold text-slate-800">{{
                                                            eq.manufacturer?.name ||
                                                            eq.component?.default_brand || 'N/A' }}</span>
                                                        <span class="text-xs text-slate-400">{{ eq.equipment_model?.name
                                                            ||
                                                            eq.component?.default_model || 'N/A' }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-2 mt-0.5">
                                                        <span
                                                            class="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize bg-violet-50 text-violet-600 border border-violet-200 whitespace-nowrap">
                                                            {{ eq.component?.name || eq.type || 'N/A' }}
                                                        </span>
                                                        <span :class="[
                                                            'text-[10px] font-medium px-2 py-0.5 rounded-full capitalize border whitespace-nowrap',
                                                            eq.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                eq.status === 'inactive' ? 'bg-red-50 text-red-600 border-red-200' :
                                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                                        ]">
                                                            {{ eq.status || 'N/A' }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="text-xs font-mono text-slate-400">#{{ eq.id }}</span>
                                        </div>

                                        <!-- Component Details -->
                                        <div v-if="eq.component"
                                            class="mb-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                            <div class="flex items-center justify-between text-xs">
                                                <div>
                                                    <span class="font-medium text-indigo-700">Component:</span>
                                                    <span class="text-indigo-900 ml-1 font-medium">{{ eq.component.name
                                                        }}</span>
                                                </div>
                                                <span v-if="eq.component.is_required"
                                                    class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                                    Required
                                                </span>
                                            </div>
                                            <div v-if="eq.component.description" class="text-xs text-indigo-600 mt-0.5">
                                                {{ eq.component.description }}
                                            </div>
                                            <div class="flex items-center gap-3 mt-1 text-[10px] text-indigo-500">
                                                <span v-if="eq.component.default_brand">Brand: {{
                                                    eq.component.default_brand }}</span>
                                                <span v-if="eq.component.default_model">Model: {{
                                                    eq.component.default_model }}</span>
                                                <span v-if="eq.component.default_price">Price: ${{
                                                    parseFloat(eq.component.default_price).toFixed(2) }}</span>
                                            </div>
                                        </div>

                                        <!-- Manufacturer Details -->
                                        <div v-if="eq.manufacturer" class="mb-2 p-2 bg-slate-50 rounded-lg">
                                            <div class="flex items-center gap-2 text-xs">
                                                <span class="font-medium text-slate-600">Manufacturer:</span>
                                                <span class="text-slate-800">{{ eq.manufacturer.name }}</span>

                                            </div>

                                        </div>

                                        <!-- Equipment Model Details -->
                                        <div v-if="eq.equipment_model" class="mb-2 text-xs">
                                            <div class="flex items-center gap-2">
                                                <span class="font-medium text-slate-600">Model #:</span>
                                                <span class="text-slate-800 font-mono">{{
                                                    eq.equipment_model.model_number || 'N/A' }}</span>
                                                <span v-if="eq.equipment_model.release_year" class="text-slate-400">•
                                                    Released: {{
                                                        eq.equipment_model.release_year }}</span>
                                            </div>
                                            <div v-if="eq.equipment_model.description" class="text-slate-500 mt-0.5">
                                                {{ eq.equipment_model.description }}
                                            </div>
                                        </div>

                                        <!-- Serial Number -->
                                        <div class="text-xs text-slate-600 mb-2">
                                            <span class="font-medium">Serial Number:</span>
                                            <span class="font-mono ml-1">{{ eq.serial_number || '—' }}</span>
                                        </div>

                                        <!-- Dates -->
                                        <div class="grid grid-cols-2 gap-2 mb-2 text-xs">
                                            <div>
                                                <span class="text-slate-500">Installed:</span>
                                                <span class="text-slate-700 font-medium ml-1">{{
                                                    formatDate(eq.install_date) }}</span>
                                            </div>
                                            <div>
                                                <span class="text-slate-500">Warranty:</span>
                                                <span class="text-slate-700 font-medium ml-1">{{
                                                    formatDate(eq.warranty_expiry) }}</span>
                                                <span v-if="eq.warranty_expiry && isExpired(eq.warranty_expiry)"
                                                    class="text-red-500 ml-1">⚠️</span>
                                            </div>
                                        </div>

                                        <!-- Purchase Price -->
                                        <div v-if="eq.purchase_price" class="text-xs mb-2">
                                            <span class="text-slate-500">Purchase Price:</span>
                                            <span class="text-slate-700 font-medium ml-1">${{
                                                parseFloat(eq.purchase_price).toFixed(2)
                                                }}</span>
                                        </div>

                                        <!-- Component ID -->
                                        <div v-if="eq.component_id" class="text-xs text-slate-400 mb-2">
                                            Component ID: {{ eq.component_id }}
                                        </div>

                                        <!-- Notes -->
                                        <div v-if="eq.notes"
                                            class="mt-1 p-2 bg-amber-50 rounded-lg border border-amber-100">
                                            <div class="text-xs text-amber-700">
                                                <span class="font-medium">📝 Notes:</span> {{ eq.notes }}
                                            </div>
                                        </div>

                                        <!-- Timestamps -->
                                        <div
                                            class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                            <span>Created: {{ formatDateTime(eq.created_at) }}</span>
                                            <span v-if="eq.updated_at !== eq.created_at">Updated: {{
                                                formatDateTime(eq.updated_at) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== MOBILE CARDS ===== -->
            <div v-else-if="filteredPools.length > 0" class="md:hidden space-y-3">
                <div v-for="pool in paginatedPools" :key="pool.id"
                    class="rounded-2xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition-all duration-200 shadow-sm"
                    @click="toggleRow(pool.id)">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                                </svg>
                            </div>
                            <div>
                                <div class="text-sm font-bold text-slate-800">{{ pool.label || pool.name }}</div>
                                <div class="text-xs text-slate-400 font-mono">#{{ pool.id }}</div>
                            </div>
                        </div>
                        <span
                            :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusStyle(pool.is_active)]">
                            <span
                                :class="['w-1.5 h-1.5 rounded-full', pool.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                            {{ pool.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div class="flex items-center gap-2 text-slate-500">
                            <div
                                :class="['flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white', getAvatarColor(pool.customer?.contact_name)]">
                                {{ (pool.customer?.contact_name || 'U').charAt(0).toUpperCase() }}
                            </div>
                            {{ pool.customer?.contact_name || 'Unknown' }}
                        </div>
                        <div class="flex items-center justify-end">
                            <span
                                :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border', getChemicalStyle(pool.chemical_type || pool.chemicalType)]">
                                {{ formatChemicalType(pool.chemical_type || pool.chemicalType) }}
                            </span>
                        </div>
                        <div class="text-slate-500">
                            <span class="font-semibold text-slate-700">{{ formatVolume(pool.volume_gallons ||
                                pool.volume) }}</span>
                            gal
                        </div>
                        <div class="flex items-center justify-end gap-1 text-violet-600">

                            <svg v-if="pool.equipment?.length"
                                :class="['w-3 h-3 transition-transform duration-200', expandedRows.has(pool.id) ? 'rotate-180' : '']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <!-- Mobile Expanded Equipment -->
                    <div v-if="expandedRows.has(pool.id) && pool.equipment?.length"
                        class="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <div v-for="eq in pool.equipment" :key="eq.id"
                            class="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                            <div
                                :class="['flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0', getEquipmentBgColor(eq.type)]">
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <span class="text-xs font-semibold text-slate-800 truncate">{{ eq.brand }}</span>
                                    <span class="text-[10px] text-slate-400 truncate">{{ eq.model }}</span>
                                    <span
                                        class="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded capitalize bg-violet-50 text-violet-600 border border-violet-200">{{
                                        eq.type }}</span>
                                </div>
                                <div class="text-[10px] text-slate-500 flex items-center gap-1">
                                    <span>SN: {{ eq.serial_number || '—' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-3 border-t border-slate-100" @click.stop>
                        <button @click="openViewModal(pool)"
                            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 transition-all">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                        </button>
                        <button @click="openEditModal(pool)"
                            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 border border-slate-200 hover:border-amber-300 transition-all">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button @click="confirmDelete(pool)"
                            class="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-300 transition-all">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ===== EMPTY STATE ===== -->
            <div v-else class="flex flex-col items-center justify-center py-20 px-4">
                <div class="relative mb-6">
                    <div class="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl scale-150"></div>
                    <div
                        class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200">
                        <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M3 7c0 0 2-2 5-2s5 2 8 2 5-2 5-2v10c0 0-2 2-5 2s-5-2-8-2-5 2-5 2V7z" />
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">
                    {{ searchQuery || activeFilter !== 'all' ? 'No pools found' : 'No pools yet' }}
                </h3>
                <p class="text-sm text-slate-500 text-center max-w-xs mb-6">
                    {{ searchQuery || activeFilter !== 'all'
                        ? 'Try adjusting your search or filters to find what you\'re looking for.'
                        : 'Add your first pool to start managing your service operations.'
                    }}
                </p>
                <div class="flex items-center gap-3">
                    <button v-if="searchQuery || activeFilter !== 'all'" @click="clearFilters"
                        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
                        Clear Filters
                    </button>
                    <button @click="addRecommendations"
                        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Pool
                    </button>
                </div>
            </div>

            <!-- ===== PAGINATION ===== -->
            <div v-if="filteredPools.length > 0"
                class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3 text-sm text-slate-500">
                    <span>Showing <span class="text-slate-700 font-medium">{{ paginationStart }}–{{ paginationEnd
                            }}</span> of
                        <span class="text-slate-700 font-medium">{{ filteredPools.length }}</span> pools</span>
                    <span class="w-px h-4 bg-slate-300"></span>
                    <div class="flex items-center gap-2">
                        <span>Per page:</span>
                        <select v-model="perPage"
                            class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                        class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                    </button>

                    <div class="flex items-center gap-1 px-2">
                        <button v-for="page in visiblePages" :key="page" @click="page !== '...' && (currentPage = page)"
                            :class="[
                                'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
                                page === currentPage
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : page === '...'
                                        ? 'text-slate-400 cursor-default'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                            ]">{{ page }}</button>
                    </div>

                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                        Next
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import api from "../../../../../services/api.js"
import { useRouter } from 'vue-router'

// ===== API INSTANCE =====
const apiClient = api()

// ===== STATE =====
const pools = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const isLoading = ref(false)
const isRefreshing = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const expandedRows = ref(new Set())

const viewModal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)
const selectedPool = ref(null)
const poolToDelete = ref(null)
const isAdding = ref(false)

const router = useRouter()

const props = defineProps({
    pool: {
        type: Object,
        required: true
    },
    expandedRows: {
        type: Set,
        required: true
    }
})



const formatDateTime = (date) => {
    if (!date) return '—'
    const d = new Date(date)
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const isExpired = (date) => {
    if (!date) return false
    return new Date(date) < new Date()
}



const editForm = reactive({
    id: null,
    label: '',
    customer: '',
    chemical_type: 'chlorine',
    volume_gallons: '',
    equipment: 0,
    is_active: true,
    service_address: '',
    access_notes: '',
    gate_code: '',
    has_dog: false,
    season: 'year_round'
})

// ===== FILTER CHIPS =====
const filterChips = [
    { label: 'All Pools', value: 'all' },
    { label: 'Active', value: 'active', dot: 'bg-emerald-500' },
    { label: 'Inactive', value: 'inactive', dot: 'bg-rose-500' },
    { label: 'Chlorine', value: 'chlorine' },
    { label: 'Salt', value: 'salt' },
    { label: 'Bromine', value: 'bromine' },
]

// ===== COMPUTED =====
const stats = computed(() => ({
    total: pools.value.length,
    active: pools.value.filter(p => p.is_active).length,
    inactive: pools.value.filter(p => !p.is_active).length,
    equipment: pools.value.reduce((sum, p) => sum + (p.equipment?.length || 0), 0),
}))

const filteredPools = computed(() => {
    let list = pools.value
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(p =>
            (p.label || p.name || '').toLowerCase().includes(q) ||
            (p.customer?.contact_name || '').toLowerCase().includes(q)
        )
    }
    if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'active') {
            list = list.filter(p => p.is_active === true)
        } else if (activeFilter.value === 'inactive') {
            list = list.filter(p => p.is_active === false)
        } else {
            list = list.filter(p => p.chemical_type === activeFilter.value)
        }
    }
    return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPools.value.length / perPage.value)))
const paginationStart = computed(() => (currentPage.value - 1) * perPage.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * perPage.value, filteredPools.value.length))
const paginatedPools = computed(() => filteredPools.value.slice(paginationStart.value - 1, paginationEnd.value))

const activeFilterCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (activeFilter.value !== 'all') count++
    return count
})

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 3) return [1, 2, 3, 4, '...', total]
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
    return [1, '...', current - 1, current, current + 1, '...', total]
})

// ===== TOGGLE ROW =====
function toggleRow(id) {
    if (expandedRows.value.has(id)) {
        expandedRows.value.delete(id)
    } else {
        expandedRows.value.add(id)
    }
}



// ===== API METHODS =====

// Get all pools
async function fetchPools() {
    try {
        const response = await apiClient.get('/pool-management/pools-advance?with=equipment.manufacturer,equipment.component,equipment.equipmentModel,customer')
        return response.data.data || response
    } catch (error) {
        console.error('Error fetching pools:', error)
        throw error
    }
}

// Create new pool
async function createPool(data) {
    try {
        const response = await apiClient.post('/pool-management/pools', data)
        return response.data || response
    } catch (error) {
        console.error('Error creating pool:', error)
        throw error
    }
}

// Update pool
async function updatePool(id, data) {
    try {
        const response = await apiClient.post(`/pool-management/pools/${id}`, data)
        return response.data || response
    } catch (error) {
        console.error('Error updating pool:', error)
        throw error
    }
}

// Delete pool
async function deletePoolApi(id) {
    try {
        const response = await apiClient.delete(`/pool-management/pools/${id}`)
        return response.data || response
    } catch (error) {
        console.error('Error deleting pool:', error)
        throw error
    }
}

// ===== LOAD DATA =====
async function loadPools() {
    try {
        isLoading.value = true
        const data = await fetchPools()
        pools.value = Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Failed to load pools from API:', error)
        pools.value = []
    } finally {
        isLoading.value = false
    }
}

// ===== UI METHODS =====

function setFilter(val) {
    activeFilter.value = val
    currentPage.value = 1
}

function clearFilters() {
    searchQuery.value = ''
    activeFilter.value = 'all'
    currentPage.value = 1
}

async function handleRefresh() {
    isRefreshing.value = true
    await loadPools()
    isRefreshing.value = false
}

function openViewModal(pool) {
    selectedPool.value = pool
    viewModal.value = true
}

function openEditModal(pool) {
    isAdding.value = false
    if (pool) {
        Object.assign(editForm, {
            ...pool,
            label: pool.label || pool.name || '',
            customer: pool.customer?.contact_name || '',
            chemical_type: pool.chemical_type || pool.chemicalType || 'chlorine',
            volume_gallons: pool.volume_gallons || pool.volume || '',
            equipment: pool.equipment?.length || 0,
            is_active: pool.is_active !== undefined ? pool.is_active : true,
            service_address: pool.service_address || pool.address || '',
            access_notes: pool.access_notes || pool.notes || '',
            gate_code: pool.gate_code || '',
            has_dog: pool.has_dog || false,
            season: pool.season || 'year_round'
        })
    }
    editModal.value = true
}

function addRecommendations(id) {
    router.push(`/provider/create-maintenance-recommendations/${id}`)
}

function confirmDelete(pool) {
    poolToDelete.value = pool
    deleteModal.value = true
}

async function deletePool() {
    try {
        isLoading.value = true
        await deletePoolApi(poolToDelete.value.id)
        pools.value = pools.value.filter(p => p.id !== poolToDelete.value.id)
        deleteModal.value = false
        poolToDelete.value = null
    } catch (error) {
        console.error('Error deleting pool:', error)
        alert('Failed to delete pool. Please try again.')
    } finally {
        isLoading.value = false
    }
}

// ===== STYLE HELPERS =====
function getStatusStyle(isActive) {
    return isActive !== undefined && isActive
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-rose-50 text-rose-700 border-rose-200'
}

function getChemicalStyle(type) {
    const map = {
        chlorine: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        salt: 'bg-blue-50 text-blue-700 border-blue-200',
        bromine: 'bg-amber-50 text-amber-700 border-amber-200',
    }
    return map[type] || 'bg-slate-50 text-slate-700 border-slate-200'
}

function getChemicalDot(type) {
    const map = { chlorine: 'bg-cyan-500', salt: 'bg-blue-500', bromine: 'bg-amber-500' }
    return map[type] || 'bg-slate-500'
}

function getAvatarColor(name) {
    const colors = ['bg-violet-600', 'bg-blue-600', 'bg-cyan-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-pink-600', 'bg-indigo-600']
    return colors[(name?.charCodeAt(0) || 0) % colors.length]
}

function getEquipmentBgColor(type) {
    const map = {
        pump: 'bg-blue-500',
        filter: 'bg-emerald-500',
        heater: 'bg-amber-500',
        other: 'bg-violet-500'
    }
    return map[type] || 'bg-slate-500'
}

function formatVolume(v) {
    return v ? Number(v).toLocaleString() : '—'
}

function formatChemicalType(type) {
    if (!type) return 'Unknown'
    return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatSeason(season) {
    if (!season) return 'Unknown'
    const map = {
        year_round: 'Year Round',
        summer: 'Summer Only',
        winter: 'Winter Only'
    }
    return map[season] || season.charAt(0).toUpperCase() + season.slice(1)
}

function formatDate(date) {
    if (!date) return '—'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ===== LIFECYCLE =====
onMounted(() => {
    loadPools()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
    font-family: 'Inter', sans-serif;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.95) translateY(8px);
}
</style>