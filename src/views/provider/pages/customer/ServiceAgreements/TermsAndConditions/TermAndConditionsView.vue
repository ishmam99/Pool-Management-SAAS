<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import api from '../../../../../../services/api.js'
import { useAuthStore } from '../../../../../../store/AuthStore.js'

const authStore = useAuthStore()
const tenantId = authStore.user?.id

// ---------------- State ----------------
const templates = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const isEditMode = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  description: '',
  content: [''],
  is_active: true,
  is_default: false
})

const toast = ref({ show: false, type: 'success', message: '' })

// ---------------- Computed ----------------
const filteredTemplates = computed(() => {
  if (!searchQuery.value.trim()) return templates.value
  const q = searchQuery.value.toLowerCase()
  return templates.value.filter(t =>
    t.name?.toLowerCase().includes(q) ||
    t.description?.toLowerCase().includes(q)
  )
})

const validTerms = computed(() => {
  return form.value.content.filter(term => term.trim() !== '')
})

const termCount = computed(() => validTerms.value.length)

const isOnlyEmptyTerm = computed(() => {
  const nonEmpty = form.value.content.filter(term => term.trim() !== '')
  return nonEmpty.length === 0 && form.value.content.length === 1
})

// ---------------- Toast ----------------
function showToast(message, type = 'success') {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// ---------------- Form Helpers ----------------
function addTerm() {
  form.value.content.push('')
  nextTick(() => {
    const inputs = document.querySelectorAll('.term-input')
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus()
    }
  })
}

function removeTerm(index) {
  if (form.value.content.length <= 1) return
  form.value.content.splice(index, 1)
  // Clean up empty terms after removal
  cleanTerms()
}

function updateTerm(index, value) {
  form.value.content[index] = value
}

function cleanTerms() {
  const cleaned = form.value.content.filter(term => term.trim() !== '')
  if (cleaned.length === 0) {
    form.value.content = ['']
  } else {
    form.value.content = cleaned
  }
}

function resetForm() {
  isEditMode.value = false
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    content: [''],
    is_active: true,
    is_default: false
  }
}

function loadTemplate(template) {
  isEditMode.value = true
  editingId.value = template.id
  form.value = {
    name: template.name,
    description: template.description || '',
    content: Array.isArray(template.content) && template.content.length > 0 
      ? template.content 
      : [''],
    is_active: !!template.is_active,
    is_default: !!template.is_default
  }
}

// ---------------- Save/Update ----------------
async function saveTemplate() {
  const cleanedContent = form.value.content.filter(term => term.trim() !== '')
  
  if (!form.value.name.trim()) {
    showToast('Template name is required.', 'error')
    return
  }

  if (cleanedContent.length === 0) {
    showToast('Please add at least one term.', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      tenant_id: tenantId,
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      content: cleanedContent,
      is_active: form.value.is_active,
      is_default: form.value.is_default
    }

    await api().post('/terms-templates', payload)
    showToast('Template created successfully.')
    resetForm()
    await loadTemplates()
  } catch (err) {
    showToast('Failed to create template.', 'error')
  } finally {
    saving.value = false
  }
}

async function updateTemplate() {
  const cleanedContent = form.value.content.filter(term => term.trim() !== '')
  
  if (!form.value.name.trim()) {
    showToast('Template name is required.', 'error')
    return
  }

  if (cleanedContent.length === 0) {
    showToast('Please add at least one term.', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      id: editingId.value,
      tenant_id: tenantId,
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      content: cleanedContent,
      is_active: form.value.is_active,
      is_default: form.value.is_default
    }

    await api().post('/terms-templates/update', payload)
    showToast('Template updated successfully.')
    resetForm()
    await loadTemplates()
  } catch (err) {
    showToast('Failed to update template.', 'error')
  } finally {
    saving.value = false
  }
}

// ---------------- API Functions ----------------
async function loadTemplates() {
  loading.value = true
  try {
    const res = await api().get(`/tenants/${tenantId}/terms-templates`)
    templates.value = res.data?.data || res.data || []
  } catch (err) {
    showToast('Failed to load templates.', 'error')
  } finally {
    loading.value = false
  }
}

async function deleteTemplate(template) {
  const confirmed = window.confirm(`Are you sure you want to delete "${template.name}"?`)
  if (!confirmed) return

  try {
    await api().delete(`/terms-templates/${template.id}`)
    showToast('Template deleted successfully.')
    await loadTemplates()
  } catch (err) {
    showToast('Failed to delete template.', 'error')
  }
}

async function toggleStatus(template) {
  try {
    await api().post('/terms-templates/update', {
      id: template.id,
      tenant_id: tenantId,
      name: template.name,
      description: template.description,
      content: template.content,
      is_active: !template.is_active,
      is_default: template.is_default
    })
    showToast('Status updated successfully.')
    await loadTemplates()
  } catch (err) {
    showToast('Failed to update status.', 'error')
  }
}

function cancelEdit() {
  resetForm()
}

function handleKeydown(event, index) {
  if (event.key === 'Enter' && index === form.value.content.length - 1) {
    event.preventDefault()
    addTerm()
  }
}

// ---------------- Lifecycle ----------------
onMounted(() => {
  loadTemplates()
})
</script>

<template>
  <div class="p-4 md:p-6">
    <!-- Toast -->
    <div
      v-if="toast.show"
      class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Form -->
      <div class="lg:col-span-4">
        <div id="template-form" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <i class="ri-file-text-line text-blue-600"></i>
            {{ isEditMode ? 'Edit Terms & Conditions Template' : 'Create Terms & Conditions Template' }}
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Create reusable Terms & Conditions that can be selected while creating quotations and agreements.
          </p>

          <form @submit.prevent="isEditMode ? updateTemplate() : saveTemplate()" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Template Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="e.g. Standard Service Agreement"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="form.description"
                rows="2"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Optional short description"
              ></textarea>
            </div>

            <!-- Terms List Builder -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">
                  Terms & Conditions <span class="text-red-500">*</span>
                </label>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {{ termCount }} term{{ termCount !== 1 ? 's' : '' }}
                </span>
              </div>

              <div class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                <div
                  v-for="(term, index) in form.content"
                  :key="index"
                  class="flex items-center gap-2 group bg-gray-50 rounded-lg p-2 border border-gray-200 hover:border-blue-300 transition-all"
                  :class="{ 'border-red-300': term.trim() === '' && form.content.length === 1 }"
                >
                  <!-- Drag handle -->
                  <div class="text-gray-400 cursor-move text-sm">
                    <i class="ri-drag-move-2-line"></i>
                  </div>

                  <!-- Term number -->
                  <span class="text-xs font-medium text-gray-500 min-w-[20px]">
                    {{ index + 1 }}.
                  </span>

                  <!-- Term input -->
                  <input
                    :ref="`term-input-${index}`"
                    v-model="form.content[index]"
                    type="text"
                    class="term-input flex-1 bg-transparent border-0 px-1 py-1 text-sm focus:outline-none focus:ring-0 placeholder-gray-400"
                    :placeholder="`Term ${index + 1}`"
                    @input="updateTerm(index, $event.target.value)"
                    @keydown="handleKeydown($event, index)"
                  />

                  <!-- Delete button -->
                  <button
                    type="button"
                    @click="removeTerm(index)"
                    :disabled="isOnlyEmptyTerm"
                    class="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    :title="isOnlyEmptyTerm ? 'Cannot delete last empty term' : 'Delete term'"
                  >
                    <i class="ri-delete-bin-line text-sm"></i>
                  </button>
                </div>
              </div>

              <!-- Add New Term Button -->
              <button
                type="button"
                @click="addTerm"
                class="mt-3 w-full text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 py-2 px-3 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg transition-all hover:bg-blue-50"
              >
                <i class="ri-add-line"></i>
                Add New Term
              </button>
            </div>

            <!-- Active Toggle -->
            <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span class="text-sm font-medium text-gray-700">Active Status</span>
              <button
                type="button"
                @click="form.is_active = !form.is_active"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                :class="form.is_active ? 'bg-blue-600' : 'bg-gray-300'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                  :class="form.is_active ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
              <span class="text-sm ml-2" :class="form.is_active ? 'text-blue-600' : 'text-gray-500'">
                {{ form.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <!-- Default Template Checkbox -->
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="form.is_default"
                id="default-checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="default-checkbox" class="text-sm font-medium text-gray-700 cursor-pointer">
                Set as Default Template
              </label>
            </div>

            <!-- Preview Section -->
            <div v-if="validTerms.length > 0" class="border-t border-gray-200 pt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
                <div v-for="(term, idx) in validTerms" :key="idx">
                  {{ idx + 1 }}. {{ term }}
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-2 pt-2">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <i v-if="saving" class="ri-loader-4-line animate-spin"></i>
                <i v-else :class="isEditMode ? 'ri-refresh-line' : 'ri-save-line'"></i>
                {{ isEditMode ? 'Update Template' : 'Save Template' }}
              </button>

              <button
                v-if="isEditMode"
                type="button"
                :disabled="saving"
                @click="cancelEdit"
                class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right: List -->
      <div class="lg:col-span-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i class="ri-money-dollar-circle-line text-blue-600"></i>
              Terms & Conditions Templates
            </h2>

            <div class="relative w-full sm:w-72">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                :value="searchQuery"
                @input="searchQuery = $event.target.value"
                type="text"
                placeholder="Search by name or description..."
                class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-2">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="filteredTemplates.length === 0"
            class="flex flex-col items-center justify-center py-16 text-center"
          >
            <i class="ri-file-list-3-line text-5xl text-gray-300 mb-3"></i>
            <p class="text-gray-600 font-medium">No templates found.</p>
            <p class="text-gray-400 text-sm">Create your first Terms & Conditions template.</p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="border-b border-gray-200 text-gray-500 uppercase text-xs">
                  <th class="px-3 py-2">Name</th>
                  <th class="px-3 py-2">Terms</th>
                  <th class="px-3 py-2">Default</th>
                  <th class="px-3 py-2">Status</th>
                  <th class="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(template, index) in filteredTemplates"
                  :key="template.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td class="px-3 py-3">
                    <div class="font-medium text-gray-800">{{ template.name }}</div>
                    <div class="text-xs text-gray-400 truncate max-w-[200px]">
                      {{ template.description || 'No description' }}
                    </div>
                  </td>
                  <td class="px-3 py-3">
                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {{ Array.isArray(template.content) ? template.content.length : 0 }} Terms
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    <span v-if="template.is_default" class="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </span>
                    <span v-else class="text-gray-400 text-xs">—</span>
                  </td>
                  <td class="px-3 py-3">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="template.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                    >
                      {{ template.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        @click="toggleStatus(template)"
                        title="Toggle Status"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                      >
                        <i class="ri-refresh-line"></i>
                      </button>
                      <button
                        @click="loadTemplate(template)"
                        title="Edit"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <i class="ri-edit-line"></i>
                      </button>
                      <button
                        @click="deleteTemplate(template)"
                        title="Delete"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <i class="ri-delete-bin-line"></i>
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
</template>