<template>
  <div class="min-h-screen bg-slate-50 font-inter">
    <!-- ===== PAGE HEADER ===== -->
    <div class="relative overflow-hidden bg-white border-b border-slate-200 shadow-sm">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-400/5 blur-3xl"></div>
        <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-blue-400/5 blur-3xl"></div>
      </div>
      <div class="relative max-w-screen-2xl mx-auto px-6 lg:px-8 py-7">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Pool Maintenance Recommendations</h1>
              <p class="text-sm text-slate-500 mt-0.5">Create bulk maintenance recommendations for your pools.</p>
            </div>
          </div>
          <!-- ===== CREATE RECOMMENDATIONS BUTTON ===== -->
          <button @click="openRecommendationModal" :disabled="!hasSelectedEquipment || isSubmitting"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-sm shadow-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Recommendations
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8 space-y-8">
      <!-- ===== INSTALLED EQUIPMENT SECTION ===== -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <div class="w-1 h-7 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          <h2 class="text-xl font-bold text-slate-900">Installed Equipment</h2>
          <span
            class="ml-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {{ totalComponents }} items
          </span>
          <span v-if="hasSelectedEquipment"
            class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            {{ selectedEquipmentIds.length }} selected
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loadingInstalled" class="space-y-6">
          <div v-for="i in 2" :key="i"
            class="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm animate-pulse">
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <div class="h-5 bg-slate-200 rounded-lg w-48"></div>
            </div>
            <div class="divide-y divide-slate-100">
              <div v-for="j in 3" :key="j" class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-slate-200 rounded-lg w-1/3"></div>
                    <div class="h-3 bg-slate-200 rounded-lg w-1/4"></div>
                  </div>
                  <div class="h-6 bg-slate-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loadingInstalled && installedEquipment.length === 0"
          class="flex flex-col items-center justify-center py-20 px-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="relative mb-6">
            <div class="absolute inset-0 rounded-full bg-cyan-50 blur-2xl scale-150"></div>
            <div
              class="relative flex items-center justify-center w-20 h-20 rounded-xl bg-slate-50 border border-slate-200">
              <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">No Equipment Installed</h3>
          <p class="text-sm text-slate-500 text-center max-w-xs">Install equipment components to this pool to get
            started.</p>
        </div>

        <!-- Categorized Tables -->
        <div v-else-if="!loadingInstalled && installedEquipment.length > 0" class="space-y-8">
          <div v-for="category in categorizedSections" :key="category.key"
            class="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow transition-shadow duration-200">
            <!-- Section Header -->
            <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-200">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-slate-900">{{ category.title }}</h3>
              </div>
              <span class="text-sm font-semibold text-slate-500">{{ category.items.length }} item{{
                category.items.length !== 1 ? 's' : '' }}</span>
            </div>

            <div v-if="category.items.length === 0" class="flex flex-col items-center justify-center py-12 px-5">
              <div
                class="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 mb-3">
                <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-sm text-slate-400">No {{ category.title.toLowerCase() }} installed.</p>
            </div>

            <!-- Table -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-blue-50/80 border-b border-slate-200">
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200 w-12">
                      <input type="checkbox" :checked="isCategoryFullySelected(category.key)"
                        @change="toggleCategorySelection(category.key)"
                        class="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 focus:ring-2" />
                    </th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Manufacturer</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Model</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Component</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Serial Number</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Install Date</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Warranty</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Purchase Price</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Description</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Recommendation Type</th>
                    <th
                      class="text-left px-4 py-3.5 font-semibold text-slate-700 text-xs uppercase tracking-wider border border-slate-200">
                      Estimated Cost</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(item, index) in category.items" :key="item.id" :class="[
                    'hover:bg-cyan-50/40 transition-colors duration-150',
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  ]">
                    <td class="px-4 py-3.5 border border-slate-200 align-middle">
                      <input type="checkbox" v-model="selectedEquipmentIds" :value="item.id"
                        @change="onEquipmentSelectionChange(item.id)"
                        class="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 focus:ring-2" />
                    </td>
                    <td
                      class="px-4 py-3.5 border border-slate-200 font-medium text-slate-900 whitespace-nowrap align-middle">
                      {{ item.manufacturer?.name || '—' }}
                    </td>
                    <td class="px-4 py-3.5 border border-slate-200 text-slate-700 whitespace-nowrap align-middle">
                      {{ item.equipment_model?.name || '—' }}
                    </td>
                    <td class="px-4 py-3.5 border border-slate-200 align-middle">
                      <div class="font-medium text-slate-900">{{ item.component?.name || 'Unknown Component' }}</div>
                      <div class="text-xs text-slate-400">{{ item.component?.type || '—' }}</div>
                    </td>
                    <td
                      class="px-4 py-3.5 border border-slate-200 font-mono text-slate-700 whitespace-nowrap align-middle">
                      {{ item.serial_number || '—' }}
                    </td>
                    <td class="px-4 py-3.5 border border-slate-200 text-slate-700 whitespace-nowrap align-middle">
                      {{ formatDate(item.install_date) }}
                    </td>
                    <td class="px-4 py-3.5 border border-slate-200 text-slate-700 whitespace-nowrap align-middle">
                      {{ formatDate(item.warranty_expiry) }}
                    </td>
                    <td
                      class="px-4 py-3.5 border border-slate-200 font-semibold text-slate-900 whitespace-nowrap align-middle">
                      ${{ item.purchase_price?.toLocaleString() || '0' }}
                    </td>
                    <td class="px-4 py-3.5 border border-slate-200 align-middle min-w-[200px]">
                      <input type="text" v-model="recommendationData[item.id].description"
                        :disabled="!selectedEquipmentIds.includes(item.id)"
                        :placeholder="!selectedEquipmentIds.includes(item.id) ? 'Select equipment first...' : 'Enter equipment description...'"
                        :class="[
                          'w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150',
                          selectedEquipmentIds.includes(item.id)
                            ? 'border-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 bg-white hover:border-slate-400'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        ]" />
                    </td>
                    <td class="px-4 py-3.5 border border-slate-200 align-middle whitespace-nowrap">
                      <select v-model="recommendationData[item.id].type"
                        :disabled="!selectedEquipmentIds.includes(item.id)" :class="[
                          'w-32 px-3 py-2 border rounded-lg text-sm transition-all duration-150',
                          selectedEquipmentIds.includes(item.id)
                            ? 'border-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 bg-white hover:border-slate-400'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        ]">
                        <option value="repair">Repair</option>
                        <option value="replacement">Replacement</option>
                        <option value="upgrade">Upgrade</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>

                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" step="0.01" min="0" v-model="recommendationData[item.id].cost"
                          :disabled="!selectedEquipmentIds.includes(item.id)" :class="[
                            'w-28 pl-6 pr-2 py-1 border rounded-lg text-sm transition-all',
                            selectedEquipmentIds.includes(item.id)
                              ? 'border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 bg-white'
                              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          ]" placeholder="0.00" />
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

    <!-- ===== CREATE RECOMMENDATION MODAL ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-slate-50/80 px-6 py-5 border-b border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-bold text-slate-900">Create Recommendations</h2>
                  <p class="text-sm text-slate-500 mt-0.5">{{ selectedEquipmentIds.length }} equipment(s) selected</p>
                </div>
                <button @click="closeModal"
                  class="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Title <span
                    class="text-rose-500">*</span></label>
                <input v-model="modalForm.title" type="text" placeholder="e.g., Summer Equipment Maintenance"
                  class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all"
                  :disabled="isSubmitting" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Priority <span
                    class="text-rose-500">*</span></label>
                <select v-model="modalForm.priority"
                  class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all"
                  :disabled="isSubmitting">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea v-model="modalForm.description" rows="3"
                  placeholder="Provide additional details about these recommendations..."
                  class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all resize-none"
                  :disabled="isSubmitting"></textarea>
              </div>

              <!-- Summary of selected equipment -->
              <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p class="text-sm font-semibold text-slate-700 mb-2">Selected Equipment Summary</p>
                <div class="max-h-40 overflow-y-auto space-y-1.5">
                  <div v-for="id in selectedEquipmentIds" :key="id"
                    class="text-sm text-slate-600 flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                    <span class="font-medium">{{ getEquipmentName(id) }}</span>
                    <span class="text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                      {{ getRecommendationTypeLabel(recommendationData[id]?.type) }} - ${{ recommendationData[id]?.cost
                      || '0.00' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
              <button @click="closeModal"
                class="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 transition-all"
                :disabled="isSubmitting">
                Cancel
              </button>
              <button @click="submitRecommendations" :disabled="isSubmitting || !isModalFormValid"
                class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-sm shadow-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm transition-all hover:-translate-y-0.5">
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isSubmitting ? 'Creating...' : 'Create Recommendations' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../../services/api.js'

// ===== STATE =====
const route = useRoute()
const poolId = ref(null)
const pool = ref(null)
const installedEquipment = ref([])
const loadingInstalled = ref(false)
const isSubmitting = ref(false)

// Selection and recommendation data
const selectedEquipmentIds = ref([])
const recommendationData = reactive({})

// Modal state
const showModal = ref(false)
const modalForm = reactive({
  title: '',
  description: '',
  priority: 'medium'
})

// ===== CATEGORY MAPPING =====
const CATEGORY_TYPE_MAP = {
  pump: 'equipments',
  filter: 'equipments',
  heater: 'equipments',
  salt_cell: 'equipments',
  chlorinator: 'equipments',
  blower: 'equipments',
  chemical_feeder: 'equipments',
  controller: 'electronics',
  automation: 'electronics',
  light: 'electronics',
  cleaner: 'electronics',
  sensor: 'electronics',
  valve: 'parts',
  parts: 'parts',
  structure: 'structure',
  other: 'others',
}

function getCategoryKey(type) {
  return CATEGORY_TYPE_MAP[type] || 'others'
}

// ===== COMPUTED =====
const totalComponents = computed(() => installedEquipment.value.length)

const hasSelectedEquipment = computed(() => selectedEquipmentIds.value.length > 0)

const isModalFormValid = computed(() => {
  return modalForm.title.trim() !== '' &&
    modalForm.priority !== ''
})

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

const categorizedSections = computed(() => [
  { key: 'equipments', title: 'Equipments', items: equipmentItems.value },
  { key: 'electronics', title: 'Electronics', items: electronicItems.value },
  { key: 'parts', title: 'Parts', items: partItems.value },
  { key: 'structure', title: 'Pool Structure', items: structureItems.value },
  { key: 'others', title: 'Others', items: otherItems.value },
])

// ===== API =====
async function fetchPoolDetails() {
  if (!poolId.value) {
    installedEquipment.value = []
    return
  }
  loadingInstalled.value = true
  try {
    const response = await api().get(`/pool-management/pools/${poolId.value}`)
    pool.value = response.data
    installedEquipment.value = pool.value?.equipment || []

    // Initialize recommendation data for all equipment
    installedEquipment.value.forEach(item => {
      if (!recommendationData[item.id]) {
        recommendationData[item.id] = {
          type: 'repair',
          cost: '',
          description: ''
        }
      }
    })
  } catch (error) {
    console.error('Failed to load pool details:', error)
    installedEquipment.value = []
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load pool details',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    loadingInstalled.value = false
  }
}

async function submitRecommendations() {
  // Validate modal form
  if (!modalForm.title.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Title',
      text: 'Please provide a title for these recommendations.',
      confirmButtonColor: '#0891b2'
    })
    return
  }

  // Validate all selected equipments have type, cost, and description
  const invalidItems = selectedEquipmentIds.value.filter(id => {
    const data = recommendationData[id]
    return !data ||
      !data.type ||
      data.type.trim() === '' ||
      data.cost === '' ||
      data.cost === null ||
      data.cost === undefined ||
      parseFloat(data.cost) < 0
  })

  if (invalidItems.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Data',
      text: 'Please ensure all selected equipment have a recommendation type and a valid estimated cost (0 or greater).',
      confirmButtonColor: '#0891b2'
    })
    return
  }

  // Prepare payload according to API specification
  const items = selectedEquipmentIds.value.map(id => {
    const equipment = installedEquipment.value.find(e => e.id === id)
    return {
      pool_equipment_id: id,
      item_name: equipment?.component?.name || 'Unknown Equipment',
      item_type: recommendationData[id].type,
      description: recommendationData[id].description || '',
      price: parseFloat(recommendationData[id].cost),
      quantity: 1
    }
  })

  const payload = {
    customer_id: pool.value?.customer_id || pool.value?.customer?.id,
    pool_id: poolId.value,
    title: modalForm.title.trim(),
    description: modalForm.description.trim() || '',
    priority: modalForm.priority,
    recommendation_type: "repair",
    items: items
  }

  // Submit
  isSubmitting.value = true
  try {
    const response = await api().post('/tenant/equipment-recommendations', payload)
    const data = response.data

    Swal.fire({
      icon: 'success',
      title: 'Recommendations Created',
      text: data.message || `Successfully created ${items.length} recommendation(s)`,
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#22d3ee',
      confirmButtonColor: '#0891b2',
      timer: 3000,
      showConfirmButton: false
    })

    // Close modal and reset everything
    closeModal()
    resetAllData()

  } catch (error) {
    console.error('Failed to create recommendations:', error)
    Swal.fire({
      icon: 'error',
      title: 'Creation Failed',
      text: error.response?.data?.message || 'Failed to create recommendations',
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#0891b2'
    })
  } finally {
    isSubmitting.value = false
  }
}

// ===== MODAL FUNCTIONS =====
function openRecommendationModal() {
  // Validate that at least one equipment is selected
  if (selectedEquipmentIds.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'No Equipment Selected',
      text: 'Please select at least one equipment to create recommendations.',
      confirmButtonColor: '#0891b2'
    })
    return
  }

  // Reset modal form
  modalForm.title = ''
  modalForm.description = ''
  modalForm.priority = 'medium'

  showModal.value = true
}

function closeModal() {
  if (isSubmitting.value) return
  showModal.value = false
}

function resetAllData() {
  // Clear selection
  selectedEquipmentIds.value = []

  // Reset recommendation data for all equipment
  installedEquipment.value.forEach(item => {
    if (recommendationData[item.id]) {
      recommendationData[item.id].type = 'repair'
      recommendationData[item.id].cost = ''
      recommendationData[item.id].description = ''
    }
  })

  // Reset modal form
  modalForm.title = ''
  modalForm.description = ''
  modalForm.priority = 'medium'

  // Refresh data
  fetchPoolDetails()
}

// ===== HELPERS =====
function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function onEquipmentSelectionChange(equipmentId) {
  // When unchecking, reset the data
  if (!selectedEquipmentIds.value.includes(equipmentId)) {
    if (recommendationData[equipmentId]) {
      recommendationData[equipmentId].type = 'repair'
      recommendationData[equipmentId].cost = ''
      recommendationData[equipmentId].description = ''
    }
  }
}

function getEquipmentName(id) {
  const equipment = installedEquipment.value.find(item => item.id === id)
  if (!equipment) return 'Unknown Equipment'
  return equipment.component?.name || 'Unknown Component'
}

function getRecommendationTypeLabel(type) {
  const labels = {
    'repair': 'Repair',
    'replacement': 'Replacement',
    'upgrade': 'Upgrade',
    'maintenance': 'Maintenance'
  }
  return labels[type] || type || 'Repair'
}

// ===== CATEGORY SELECTION HELPERS =====
function isCategoryFullySelected(categoryKey) {
  const category = categorizedSections.value.find(c => c.key === categoryKey)
  if (!category || category.items.length === 0) return false
  return category.items.every(item => selectedEquipmentIds.value.includes(item.id))
}

function toggleCategorySelection(categoryKey) {
  const category = categorizedSections.value.find(c => c.key === categoryKey)
  if (!category) return

  const isFullySelected = isCategoryFullySelected(categoryKey)

  category.items.forEach(item => {
    const index = selectedEquipmentIds.value.indexOf(item.id)
    if (isFullySelected) {
      // Deselect all
      if (index > -1) {
        selectedEquipmentIds.value.splice(index, 1)
        if (recommendationData[item.id]) {
          recommendationData[item.id].type = 'repair'
          recommendationData[item.id].cost = ''
          recommendationData[item.id].description = ''
        }
      }
    } else {
      // Select all
      if (index === -1) {
        selectedEquipmentIds.value.push(item.id)
        if (!recommendationData[item.id]) {
          recommendationData[item.id] = {
            type: 'repair',
            cost: '',
            description: ''
          }
        }
      }
    }
  })
}

// ===== LIFECYCLE =====
onMounted(async () => {
  poolId.value = route.params.id
  if (poolId.value) {
    await fetchPoolDetails()
  } else {
    console.warn('No pool ID found in route params')
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