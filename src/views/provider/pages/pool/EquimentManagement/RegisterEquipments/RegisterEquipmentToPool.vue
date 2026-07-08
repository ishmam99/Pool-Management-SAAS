<template>
  <div class="min-h-screen bg-gray-50 font-inter">

    <!-- ===== PAGE HEADER ===== -->
    <div class="relative overflow-hidden bg-white border-b border-gray-200">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl"></div>
      </div>
      <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Pool Equipment Installation</h1>
              <p class="text-sm text-gray-500 mt-0.5">Install and manage equipment for your pools.</p>
            </div>
          </div>
          <button v-if="!showInstallForm" @click="showInstallForm = true"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Install Equipment
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- ===== INSTALLATION FORM (Expandable) ===== -->
      <div v-if="showInstallForm"
        class="rounded-2xl border border-cyan-200 overflow-hidden bg-white shadow-lg shadow-cyan-500/5">
        <div class="bg-gradient-to-r from-cyan-50 via-blue-50 to-white px-6 py-4 border-b border-cyan-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
                <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Install New Equipment</h2>
                <p class="text-sm text-gray-500">Select and install equipment components for your pool</p>
              </div>
            </div>
            <button @click="cancelInstallation"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>

        <div class="p-6 space-y-5">
          <!-- Step 1: Select Manufacturer -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Manufacturer <span
                class="text-rose-500">*</span></label>
            <select v-model="installForm.manufacturer_id" @change="onManufacturerChange"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              :disabled="loadingManufacturers || installing">
              <option value="">Select manufacturer...</option>
              <option v-for="m in manufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>

          <!-- Step 2: Select Equipment Model -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Equipment Model <span
                class="text-rose-500">*</span></label>
            <select v-model="installForm.equipment_model_id" @change="onModelChange"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              :disabled="!installForm.manufacturer_id || loadingModels || installing">
              <option value="">Select model...</option>
              <option v-for="m in models" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>

          <!-- Step 3: Component Selection -->
          <div v-if="installForm.equipment_model_id && catalogComponents.length > 0">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Components</h3>
              <span class="ml-auto text-xs text-gray-500">{{ catalogComponents.length }} components</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              <div v-for="comp in catalogComponents" :key="comp.id" @click="toggleComponent(comp.id)"
                class="p-4 rounded-xl border-2 transition-all cursor-pointer"
                :class="[selectedComponentIds.includes(comp.id) ? 'border-cyan-500 bg-cyan-50/50' : 'border-gray-200 bg-gray-50 hover:border-gray-300']">
                <div class="flex items-start gap-3">
                  <input type="checkbox" :checked="selectedComponentIds.includes(comp.id)"
                    class="mt-1 w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 pointer-events-none">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-sm font-semibold text-gray-900 truncate">{{ comp.name }}</span>
                      <span
                        :class="[comp.is_required ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200', 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0']">
                        {{ comp.is_required ? 'Required' : 'Optional' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">{{ comp.description || 'No description' }}</p>
                    <div class="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                      <span>Brand: {{ comp.default_brand || '—' }}</span>
                      <span>|</span>
                      <span>Model: {{ comp.default_model || '—' }}</span>
                      <span>|</span>
                      <span class="font-semibold text-gray-700">${{ comp.default_price?.toLocaleString() || '0'
                        }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedComponentIds.length === 0"
              class="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <span class="font-semibold">⚠️</span> Please select at least one component to install.
            </div>
          </div>

          <!-- Component Details Form -->
          <div v-if="selectedComponentIds.length > 0" class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500"></div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Installation Details</h3>
              <span class="ml-auto text-xs text-gray-500">{{ selectedComponentIds.length }} component{{
                selectedComponentIds.length > 1 ? 's' : '' }} selected</span>
            </div>
            <div v-for="compId in selectedComponentIds" :key="compId"
              class="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 class="text-sm font-bold text-gray-900 mb-3">{{ getComponentName(compId) }}</h4>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Serial Number</label>
                  <input v-model="componentDetails[compId].serial_number" type="text" placeholder="Enter serial number"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    :disabled="installing">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Install Date</label>
                  <input v-model="componentDetails[compId].install_date" type="date"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    :disabled="installing">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Warranty Expiry</label>
                  <input v-model="componentDetails[compId].warranty_expiry" type="date"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    :disabled="installing">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Purchase Price</label>
                  <input v-model="componentDetails[compId].purchase_price" type="number" step="0.01"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    :disabled="installing">
                </div>
                <div class="col-span-2">
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                  <textarea v-model="componentDetails[compId].notes" rows="2" placeholder="Additional notes..."
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    :disabled="installing"></textarea>
                </div>
              </div>
            </div>

            <!-- Summary Card -->
            <div class="p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Summary</p>
                  <p class="text-sm text-gray-700 mt-1">
                    <span class="font-bold">{{ installForm.manufacturer_name || '—' }}</span>
                    <span class="mx-1">•</span>
                    <span class="font-bold">{{ installForm.model_name || '—' }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ selectedComponentIds.length }} components</span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Estimated Total</p>
                  <p class="text-xl font-bold text-gray-900">${{ estimatedTotal.toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3 pt-2">
              <button @click="saveInstallation" :disabled="installing || !isInstallFormValid"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5">
                <svg v-if="installing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ installing ? 'Installing...' : 'Install Equipment' }}
              </button>
              <button @click="cancelInstallation"
                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all"
                :disabled="installing">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== INSTALLED EQUIPMENT SECTION (REFACTORED - CATEGORIZED TABLES) ===== -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          <h2 class="text-lg font-bold text-gray-900">Installed Equipment</h2>
          <span
            class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
            {{ totalComponents }} items
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loadingInstalled" class="space-y-4">
          <div v-for="i in 2" :key="i"
            class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm animate-pulse">
            <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <div class="h-5 bg-gray-200 rounded-lg w-48"></div>
            </div>
            <div class="divide-y divide-gray-100">
              <div v-for="j in 3" :key="j" class="px-5 py-4">
                <div class="flex items-center gap-4">
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div class="h-3 bg-gray-200 rounded-lg w-1/4"></div>
                  </div>
                  <div class="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State - Only show when API request completed successfully and data is empty -->
        <div v-else-if="!loadingInstalled && installedEquipment.length === 0"
          class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div class="relative mb-6">
            <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
            <div
              class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
              <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">No Equipment Installed</h3>
          <p class="text-sm text-gray-500 text-center max-w-xs mb-6">Install equipment components to this pool to get
            started.</p>
          <button v-if="!showInstallForm" @click="showInstallForm = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Install Equipment
          </button>
        </div>

        <!-- Categorized Tables -->
        <div v-else-if="!loadingInstalled && installedEquipment.length > 0" class="space-y-6">

          <div v-for="category in categorizedSections" :key="category.key"
            class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <!-- Section Header -->
            <div
              class="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200">
                  <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-gray-900">{{ category.title }}</h3>
              </div>
              <span class="text-sm font-semibold text-gray-600">{{ category.items.length }} item{{ category.items.length
                !== 1 ? 's' : '' }}</span>
            </div>

            <!-- Empty state for this category -->
            <div v-if="category.items.length === 0" class="flex flex-col items-center justify-center py-10 px-5">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 mb-3">
                <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-sm text-gray-400">No {{ category.title.toLowerCase() }} installed.</p>
            </div>

            <!-- TableZ Style Table -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Manufacturer</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Model</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Component</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Serial Number</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Install Date</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Warranty</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Purchase Price</th>
                    <th
                      class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                      Status</th>
                    <th class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="item in category.items" :key="item.id" class="hover:bg-cyan-50/30 transition-colors">
                    <td class="px-4 py-3 border-r border-gray-100 font-medium text-gray-900 whitespace-nowrap">
                      {{ item.manufacturer?.name || '—' }}
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">
                      {{ item.equipment_model?.name || '—' }}
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100">
                      <div class="font-medium text-gray-900">{{ item.component?.name || 'Unknown Component' }}</div>
                      <div class="text-xs text-gray-400">{{ item.component?.type || '—' }}</div>
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100 font-mono text-gray-700 whitespace-nowrap">
                      {{ item.serial_number || '—' }}
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">
                      {{ formatDate(item.install_date) }}
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">
                      {{ formatDate(item.warranty_expiry) }}
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100 font-semibold text-gray-900 whitespace-nowrap">
                      ${{ item.purchase_price?.toLocaleString() || '0' }}
                    </td>
                    <td class="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                      <span :class="getStatusBadgeClass(item.status)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {{ formatStatus(item.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="flex items-center gap-1">
                        <button @click="openEditComponentModal(item)" :disabled="updatingId === item.id"
                          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          <svg v-if="updatingId === item.id" class="w-3 h-3 animate-spin" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button @click="handleDeleteComponent(item.id)" :disabled="deletingId === item.id"
                          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          <svg v-if="deletingId === item.id" class="w-3 h-3 animate-spin" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                        <button @click="handleViewHistory(item.id)"
                          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View History
                        </button>
                        <button @click="openRecommendationModal(item)"
                          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Add Recommendation
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ===== EDIT COMPONENT MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editComponentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeEditComponentModal"></div>
          <div class="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-gray-900">Edit Component</h2>
                  <p class="text-xs text-gray-500 mt-0.5">{{ editingComponent?.component?.name ||
                    editingComponent?.component_name || 'Component' }}</p>
                </div>
                <button @click="closeEditComponentModal"
                  class="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Serial Number</label>
                <input v-model="editForm.serial_number" type="text"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  :disabled="updating">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Install Date</label>
                <input v-model="editForm.install_date" type="date"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  :disabled="updating">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Warranty Expiry</label>
                <input v-model="editForm.warranty_expiry" type="date"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  :disabled="updating">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Purchase Price</label>
                <input v-model="editForm.purchase_price" type="number" step="0.01"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  :disabled="updating">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select v-model="editForm.status"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  :disabled="updating">
                  <option value="active">Active</option>
                  <option value="under_warranty">Under Warranty</option>
                  <option value="replaced">Replaced</option>
                  <option value="removed">Removed</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea v-model="editForm.notes" rows="3" placeholder="Additional notes..."
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  :disabled="updating"></textarea>
              </div>
            </div>
            <div class="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
              <button @click="updateComponent" :disabled="updating || !editForm.serial_number"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5">
                <svg v-if="updating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ updating ? 'Updating...' : 'Update Component' }}
              </button>
              <button @click="closeEditComponentModal"
                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all"
                :disabled="updating">Cancel</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== RECOMMENDATION MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="recommendationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeRecommendationModal"></div>
          <div class="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b border-amber-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-gray-900">Add Recommendation</h2>
                  <p class="text-xs text-gray-500 mt-0.5">Create a recommendation for this equipment</p>
                </div>
                <button @click="closeRecommendationModal"
                  class="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Equipment Information (Read Only) -->
            <div class="px-6 pt-4 pb-3 bg-gray-50 border-b border-gray-100">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Component Name</p>
                  <p class="text-sm font-medium text-gray-900 mt-0.5">{{ selectedEquipment?.component?.name || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manufacturer</p>
                  <p class="text-sm font-medium text-gray-900 mt-0.5">{{ selectedEquipment?.manufacturer?.name || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Equipment Model</p>
                  <p class="text-sm font-medium text-gray-900 mt-0.5">{{ selectedEquipment?.equipment_model?.name || '—'
                    }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pool Name</p>
                  <p class="text-sm font-medium text-gray-900 mt-0.5">{{ pool?.name || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</p>
                  <p class="text-sm font-medium text-gray-900 mt-0.5">{{ pool?.customer?.name || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Recommendation Form -->
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Title <span
                    class="text-rose-500">*</span></label>
                <input v-model="recommendationForm.title" type="text" placeholder="e.g., Replace pool pump motor"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  :disabled="submittingRecommendation" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea v-model="recommendationForm.description" rows="3"
                  placeholder="e.g., Pump is making loud noises and should be replaced before summer."
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  :disabled="submittingRecommendation"></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Recommendation Type <span
                    class="text-rose-500">*</span></label>
                <select v-model="recommendationForm.recommendation_type"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  :disabled="submittingRecommendation">
                  <option value="repair">Repair</option>
                  <option value="replacement">Replacement</option>
                  <option value="upgrade">Upgrade</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inspection">Inspection</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="safety">Safety</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Priority <span
                    class="text-rose-500">*</span></label>
                <select v-model="recommendationForm.priority"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  :disabled="submittingRecommendation">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Estimated Cost</label>
                <input v-model="recommendationForm.estimated_cost" type="number" step="0.01" placeholder="0.00"
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  :disabled="submittingRecommendation" />
              </div>
            </div>

            <div class="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
              <button @click="submitRecommendation" :disabled="submittingRecommendation || !isRecommendationFormValid"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5">
                <svg v-if="submittingRecommendation" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ submittingRecommendation ? 'Submitting...' : 'Submit Recommendation' }}
              </button>
              <button @click="closeRecommendationModal"
                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all"
                :disabled="submittingRecommendation">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../../../services/api.js'

// ===== STATE =====
const route = useRoute()
const router = useRouter()
const poolId = ref(null)
const pool = ref(null)

const manufacturers = ref([])
const models = ref([])
const catalogComponents = ref([])
const installedEquipment = ref([])

const loadingInstalled = ref(false)
const loadingManufacturers = ref(false)
const loadingModels = ref(false)
const installing = ref(false)
const updating = ref(false)
const updatingId = ref(null)
const deletingId = ref(null)

// UI State
const showInstallForm = ref(false)

// Edit Modal
const editComponentModal = ref(false)

// Recommendation Modal
const recommendationModal = ref(false)
const submittingRecommendation = ref(false)
const selectedEquipment = ref(null)

const recommendationForm = reactive({
  title: '',
  description: '',
  recommendation_type: 'repair',
  priority: 'medium',
  estimated_cost: ''
})

// Install Form
const installForm = reactive({
  pool_id: '',
  manufacturer_id: '',
  equipment_model_id: '',
  manufacturer_name: '',
  model_name: '',
})
const selectedComponentIds = ref([])
const componentDetails = reactive({})

// Edit Form
const editForm = reactive({
  id: null,
  serial_number: '',
  install_date: '',
  warranty_expiry: '',
  purchase_price: '',
  status: 'active',
  notes: '',
})
const editingComponent = ref(null)

// ===== CATEGORY MAPPING =====
// Maps component.type -> category key
const CATEGORY_TYPE_MAP = {
  // Equipments
  pump: 'equipments',
  filter: 'equipments',
  heater: 'equipments',
  salt_cell: 'equipments',
  chlorinator: 'equipments',
  blower: 'equipments',
  chemical_feeder: 'equipments',
  // Electronics
  controller: 'electronics',
  automation: 'electronics',
  light: 'electronics',
  cleaner: 'electronics',
  sensor: 'electronics',
  // Parts
  valve: 'parts',
  parts: 'parts',
  // Pool Structure
  structure: 'structure',
  // Others
  other: 'others',
}

function getCategoryKey(type) {
  return CATEGORY_TYPE_MAP[type] || 'others'
}

// ===== COMPUTED =====
const estimatedTotal = computed(() => {
  let total = 0
  selectedComponentIds.value.forEach(id => {
    const comp = catalogComponents.value.find(c => c.id === id)
    if (comp) {
      total += parseFloat(componentDetails[id]?.purchase_price || comp.default_price || 0)
    }
  })
  return total
})

const isInstallFormValid = computed(() => {
  if (!installForm.manufacturer_id || !installForm.equipment_model_id || selectedComponentIds.value.length === 0) {
    return false
  }
  return true
})

const isRecommendationFormValid = computed(() => {
  return recommendationForm.title.trim() !== '' &&
    recommendationForm.recommendation_type !== '' &&
    recommendationForm.priority !== ''
})

const totalComponents = computed(() => {
  return installedEquipment.value.length
})

// ----- Categorized computed collections -----
const equipmentItems = computed(() =>
  installedEquipment.value.filter(item => getCategoryKey(item.component?.type) === 'equipments')
)

const electronicItems = computed(() =>
  installedEquipment.value.filter(item => getCategoryKey(item.component?.type) === 'electronics')
)

const partItems = computed(() =>
  installedEquipment.value.filter(item => getCategoryKey(item.component?.type) === 'parts')
)

const structureItems = computed(() =>
  installedEquipment.value.filter(item => getCategoryKey(item.component?.type) === 'structure')
)

const otherItems = computed(() =>
  installedEquipment.value.filter(item => getCategoryKey(item.component?.type) === 'others')
)

// Convenience array used by the template to render the 5 sections in order
const categorizedSections = computed(() => [
  { key: 'equipments', title: 'Equipments', items: equipmentItems.value },
  { key: 'electronics', title: 'Electronics', items: electronicItems.value },
  { key: 'parts', title: 'Parts', items: partItems.value },
  { key: 'structure', title: 'Pool Structure', items: structureItems.value },
  { key: 'others', title: 'Others', items: otherItems.value },
])

// ===== API =====

// 1. Load manufacturers from /tenant/equipment-manufacturers
async function fetchManufacturers() {
  loadingManufacturers.value = true
  try {
    const response = await api().get('/tenant/equipment-manufacturers')
    const data = response.data
    manufacturers.value = data?.data || []
  } catch (error) {
    console.error('Failed to load manufacturers:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to load manufacturers',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    loadingManufacturers.value = false
  }
}

// 2. Load models for selected manufacturer
async function fetchModels(manufacturerId) {
  if (!manufacturerId) {
    models.value = []
    return
  }
  loadingModels.value = true
  try {
    const response = await api().get('/tenant/equipment-models', {
      params: { manufacturer_id: manufacturerId }
    })
    const data = response.data
    models.value = data?.data || []
  } catch (error) {
    console.error('Failed to load models:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to load equipment models',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    loadingModels.value = false
  }
}

// 3. Load catalog components for selected model
async function fetchCatalogComponents(modelId) {
  if (!modelId) {
    catalogComponents.value = []
    return
  }
  try {
    const response = await api().get(`/tenant/equipment-models/${modelId}/components`)
    const data = response.data
    catalogComponents.value = data?.data || []
  } catch (error) {
    console.error('Failed to load components:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to load catalog components',
      confirmButtonColor: '#0891b2'
    })
  }
}

// 4. Load pool details with equipment
async function fetchPoolDetails() {
  if (!poolId.value) {
    installedEquipment.value = []
    return
  }
  loadingInstalled.value = true
  try {
    const response = await api().get(`/pool-management/pools/${poolId.value}`, {

    })
    const data = response.data
    pool.value = data

    // Extract equipment from pool response
    installedEquipment.value = pool.value?.equipment || []
  } catch (error) {
    console.error('Failed to load pool details:', error)
    installedEquipment.value = []
  } finally {
    loadingInstalled.value = false
  }
}

// 5. Save installation via POST /tenant/pools/{pool_id}/equipments
async function saveInstallation() {
  if (!isInstallFormValid.value) return

  installing.value = true
  try {
    const components = selectedComponentIds.value.map(id => ({
      component_id: id,
      serial_number: componentDetails[id]?.serial_number || '',
      install_date: componentDetails[id]?.install_date || '',
      warranty_expiry: componentDetails[id]?.warranty_expiry || '',
      purchase_price: parseFloat(componentDetails[id]?.purchase_price) || 0,
      notes: componentDetails[id]?.notes || ''
    }))

    const payload = {
      manufacturer_id: installForm.manufacturer_id,
      equipment_model_id: installForm.equipment_model_id,
      components: components
    }

    const response = await api().post(`/tenant/pools/${poolId.value}/equipments`, payload)
    const data = response.data

    // Show backend success message
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message || 'Equipment installed successfully',
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#22d3ee',
      confirmButtonColor: '#0891b2',
      timer: 3000,
      showConfirmButton: false
    })

    // Hide form and reload pool details
    showInstallForm.value = false
    await fetchPoolDetails()

  } catch (error) {
    console.error('Failed to install equipment:', error)
    const errorMessage = error.response?.data?.message || 'Failed to install equipment'
    Swal.fire({
      icon: 'error',
      title: 'Installation Failed',
      text: errorMessage,
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    installing.value = false
  }
}

// 6. Update component via PUT /tenant/pool-equipments/{id}
async function updateComponent() {
  if (!editForm.id || updating.value) return

  updating.value = true
  updatingId.value = editForm.id
  try {
    const payload = {
      serial_number: editForm.serial_number,
      install_date: editForm.install_date,
      warranty_expiry: editForm.warranty_expiry,
      purchase_price: parseFloat(editForm.purchase_price) || 0,
      notes: editForm.notes,
      status: editForm.status
    }

    const response = await api().put(`/tenant/pool-equipments/${editForm.id}`, payload)
    const data = response.data

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: data.message || 'Component updated successfully',
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#22d3ee',
      confirmButtonColor: '#0891b2',
      timer: 2000,
      showConfirmButton: false
    })

    closeEditComponentModal()
    await fetchPoolDetails()

  } catch (error) {
    console.error('Failed to update component:', error)
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.response?.data?.message || 'Failed to update component',
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    updating.value = false
    updatingId.value = null
  }
}

// 7. Delete component via DELETE /tenant/pool-equipments/{id}
async function handleDeleteComponent(id) {
  const result = await Swal.fire({
    title: 'Delete Component?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    background: '#ffffff',
    color: '#1f2937',
    iconColor: '#f43f5e',
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#9ca3af',
  })

  if (!result.isConfirmed) return

  deletingId.value = id
  try {
    const response = await api().delete(`/tenant/pool-equipments/${id}`)
    const data = response.data

    Swal.fire({
      icon: 'success',
      title: 'Deleted',
      text: data.message || 'Component removed successfully',
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#22d3ee',
      confirmButtonColor: '#0891b2',
      timer: 2000,
      showConfirmButton: false
    })

    await fetchPoolDetails()

  } catch (error) {
    console.error('Failed to delete component:', error)
    Swal.fire({
      icon: 'error',
      title: 'Delete Failed',
      text: error.response?.data?.message || 'Failed to delete component',
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    deletingId.value = null
  }
}

// 8. Submit Recommendation via POST /tenant/equipment-recommendations
async function submitRecommendation() {
  if (!isRecommendationFormValid.value || !selectedEquipment.value) return

  submittingRecommendation.value = true
  try {
    const payload = {
      customer_id: pool.value?.customer_id || pool.value?.customer?.id,
      pool_id: poolId.value,
      pool_equipment_id: selectedEquipment.value.id,
      title: recommendationForm.title.trim(),
      description: recommendationForm.description.trim() || '',
      recommendation_type: recommendationForm.recommendation_type,
      priority: recommendationForm.priority,
      estimated_cost: recommendationForm.estimated_cost ? parseFloat(recommendationForm.estimated_cost) : null
    }

    const response = await api().post('/tenant/equipment-recommendations', payload)
    const data = response.data

    // Show backend success message
    Swal.fire({
      icon: 'success',
      title: 'Recommendation Submitted',
      text: data.message || 'Recommendation created successfully',
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#f59e0b',
      confirmButtonColor: '#f59e0b',
      timer: 3000,
      showConfirmButton: false
    })

    closeRecommendationModal()

  } catch (error) {
    console.error('Failed to submit recommendation:', error)
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error.response?.data?.message || 'Failed to submit recommendation',
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#f59e0b'
    })
  } finally {
    submittingRecommendation.value = false
  }
}

// 9. View History - navigation handler (route TBD)
function handleViewHistory(installedEquipmentId) {

  router.push(
    `/provider/equipment-history/${installedEquipmentId}`
  )
}

// ===== HELPERS =====
function getComponentName(id) {
  const comp = catalogComponents.value.find(c => c.id === id)
  return comp?.name || 'Component'
}

function toggleComponent(id) {
  const index = selectedComponentIds.value.indexOf(id)
  if (index > -1) {
    selectedComponentIds.value.splice(index, 1)
    delete componentDetails[id]
  } else {
    const comp = catalogComponents.value.find(c => c.id === id)
    selectedComponentIds.value.push(id)
    componentDetails[id] = {
      serial_number: '',
      install_date: '',
      warranty_expiry: '',
      purchase_price: comp?.default_price || '',
      notes: ''
    }
  }
}

function getStatusBadgeClass(status) {
  const map = {
    'active': 'bg-green-100 text-green-700 border-green-200',
    'under_warranty': 'bg-blue-100 text-blue-700 border-blue-200',
    'replaced': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'removed': 'bg-red-100 text-red-700 border-red-200'
  }
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function formatStatus(status) {
  const map = {
    'active': 'Active',
    'under_warranty': 'Under Warranty',
    'replaced': 'Replaced',
    'removed': 'Removed'
  }
  return map[status] || status || 'Active'
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ===== FORM FUNCTIONS =====
function cancelInstallation() {
  if (installing.value) return
  showInstallForm.value = false
  resetInstallForm()
}

function resetInstallForm() {
  installForm.manufacturer_id = ''
  installForm.equipment_model_id = ''
  installForm.manufacturer_name = ''
  installForm.model_name = ''
  selectedComponentIds.value = []
  models.value = []
  catalogComponents.value = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])
}

function onManufacturerChange() {
  installForm.equipment_model_id = ''
  installForm.model_name = ''
  selectedComponentIds.value = []
  catalogComponents.value = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])

  const manufacturer = manufacturers.value.find(m => m.id === installForm.manufacturer_id)
  installForm.manufacturer_name = manufacturer?.name || ''

  fetchModels(installForm.manufacturer_id)
}

function onModelChange() {
  selectedComponentIds.value = []
  catalogComponents.value = []
  Object.keys(componentDetails).forEach(key => delete componentDetails[key])

  const model = models.value.find(m => m.id === installForm.equipment_model_id)
  installForm.model_name = model?.name || ''

  fetchCatalogComponents(installForm.equipment_model_id)
}

function openEditComponentModal(component) {
  editingComponent.value = component
  editForm.id = component.id
  editForm.serial_number = component.serial_number || ''
  editForm.install_date = component.install_date || ''
  editForm.warranty_expiry = component.warranty_expiry || ''
  editForm.purchase_price = component.purchase_price || ''
  editForm.status = component.status || 'active'
  editForm.notes = component.notes || ''
  editComponentModal.value = true
}

function closeEditComponentModal() {
  if (updating.value) return
  editComponentModal.value = false
  editingComponent.value = null
  editForm.id = null
}

// ===== RECOMMENDATION MODAL FUNCTIONS =====
function openRecommendationModal(item) {
  selectedEquipment.value = item
  // Reset form
  recommendationForm.title = ''
  recommendationForm.description = ''
  recommendationForm.recommendation_type = 'repair'
  recommendationForm.priority = 'medium'
  recommendationForm.estimated_cost = ''
  recommendationModal.value = true
}

function closeRecommendationModal() {
  if (submittingRecommendation.value) return
  recommendationModal.value = false
  selectedEquipment.value = null
}

// ===== LIFECYCLE =====
onMounted(async () => {
  // Get pool ID from route params
  poolId.value = route.params.id

  // Set initial pool ID in form
  if (poolId.value) {
    installForm.pool_id = poolId.value
  }

  await Promise.all([
    fetchManufacturers()
  ])

  // Load pool details if pool ID is available
  if (poolId.value) {
    await fetchPoolDetails()
  } else {
    console.warn('No pool ID found in route params')
  }
})

// ===== WATCHERS =====
// Watch for manufacturer changes in filter
watch(() => installForm.manufacturer_id, (newVal) => {
  if (newVal) {
    fetchModels(newVal)
  } else {
    models.value = []
  }
})

// Watch for model changes in filter
watch(() => installForm.equipment_model_id, (newVal) => {
  if (newVal) {
    fetchCatalogComponents(newVal)
  } else {
    catalogComponents.value = []
  }
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