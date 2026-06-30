<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '../../../../../../services/api.js'
import { useAuthStore } from '../../../../../../store/AuthStore.js'

const authStore = useAuthStore()
const tenantId = authStore.user?.id

// ---------------- State ----------------
const templates = ref([])
const loading = ref(false)
const saving = ref(false)
const togglingActive = ref(null)
const settingDefault = ref(null)
const loadingDetails = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all')
const isEditMode = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  description: '',
  content: [''],
  is_active: 1,  // Changed from true to 1
  is_default: 0  // Changed from false to 0
})

const formErrors = ref({})
const toast = ref({ show: false, type: 'success', message: '' })
let searchTimeout = null

// ---------------- Computed ----------------
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
    is_active: 1,
    is_default: 0
  }
  formErrors.value = {}
}

function handleKeydown(event, index) {
  if (event.key === 'Enter' && index === form.value.content.length - 1) {
    event.preventDefault()
    addTerm()
  }
}

// ---------------- API Functions ----------------
async function loadTemplates() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }
    if (activeFilter.value === 'active') {
      params.append('is_active', '1')  // Changed from 'true' to '1'
    } else if (activeFilter.value === 'inactive') {
      params.append('is_active', '0')  // Changed from 'false' to '0'
    }

    const url = `/term-templates/templates${params.toString() ? '?' + params.toString() : ''}`
    const response = await api().get(url)
    templates.value = response.data?.data || response.data || []
  } catch (err) {
    console.error('Failed to load templates:', err)
    showToast('Failed to load templates.', 'error')
  } finally {
    loading.value = false
  }
}

async function loadTemplateDetails(id) {
  loadingDetails.value = true
  try {
    const response = await api().get(`/term-templates/templates/${id}`)
    const data = response.data?.data || response.data

    isEditMode.value = true
    editingId.value = id
    form.value = {
      name: data.name || '',
      description: data.description || '',
      content: Array.isArray(data.content) && data.content.length > 0
        ? data.content
        : [''],
      is_active: data.is_active,  // Keep as is (should be 0 or 1)
      is_default: data.is_default // Keep as is (should be 0 or 1)
    }
    formErrors.value = {}
  } catch (err) {
    console.error('Failed to load template details:', err)
    showToast('Failed to load template details.', 'error')
  } finally {
    loadingDetails.value = false
  }
}

async function createTemplate() {
  const cleanedContent = cleanTermsForSubmit()

  if (!validateForm(cleanedContent)) return

  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      content: cleanedContent,
      is_active: form.value.is_active == true ? 1 : 0,  // Already 0 or 1
      is_default: form.value.is_default == true ? 1 : 0// Already 0 or 1
    }

    await api().post('/term-templates/templates', payload)
    showToast('Template created successfully.')
    resetForm()
    await loadTemplates()
  } catch (err) {
    handleApiError(err)
  } finally {
    saving.value = false
  }
}

async function updateTemplate() {
  const cleanedContent = cleanTermsForSubmit()

  if (!validateForm(cleanedContent)) return

  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      content: cleanedContent,
      is_active: form.value.is_active == true ? 1 : 0,  // Already 0 or 1
      is_default: form.value.is_default == true ? 1 : 0 // Already 0 or 1
    }

    await api().put(`/term-templates/templates/${editingId.value}`, payload)
    showToast('Template updated successfully.')
    resetForm()
    await loadTemplates()
  } catch (err) {
    handleApiError(err)
  } finally {
    saving.value = false
  }
}

async function deleteTemplate(template) {
  const confirmed = window.confirm(`Are you sure you want to delete "${template.name}"?`)
  if (!confirmed) return

  try {
    await api().delete(`/term-templates/templates/${template.id}`)
    showToast('Template deleted successfully.')
    await loadTemplates()
    if (editingId.value === template.id) {
      resetForm()
    }
  } catch (err) {
    console.error('Failed to delete template:', err)
    showToast('Failed to delete template.', 'error')
  }
}

async function toggleActive(id) {
  togglingActive.value = id
  try {
    await api().patch(`/term-templates/templates/${id}/toggle-active`)
    showToast('Status updated successfully.')
    await loadTemplates()
    if (editingId.value === id) {
      const template = templates.value.find(t => t.id === id)
      if (template) {
        form.value.is_active = template.is_active
      }
    }
  } catch (err) {
    console.error('Failed to toggle status:', err)
    showToast('Failed to update status.', 'error')
  } finally {
    togglingActive.value = null
  }
}

async function setDefaultTemplate(id) {
  const template = templates.value.find(t => t.id === id)
  if (!template || template.is_default) return

  const confirmed = window.confirm(
    `Are you sure you want to set "${template.name}" as the default template?`
  )
  if (!confirmed) return

  settingDefault.value = id
  try {
    await api().patch(`/term-templates/templates/${id}/set-default`)
    showToast('Default template updated successfully.')
    await loadTemplates()
    // Update form if the edited template was set as default
    if (editingId.value === id) {
      form.value.is_default = 1
    } else if (editingId.value && templates.value.find(t => t.id === editingId.value)?.is_default === 0) {
      // If the edited template is no longer default
      form.value.is_default = 0
    }
  } catch (err) {
    console.error('Failed to set default template:', err)
    showToast('Failed to set default template.', 'error')
  } finally {
    settingDefault.value = null
  }
}

// ---------------- Helper Functions ----------------
function cleanTermsForSubmit() {
  return form.value.content
    .map(term => term.trim())
    .filter(term => term !== '')
}

function validateForm(cleanedContent) {
  formErrors.value = {}
  let isValid = true

  if (!form.value.name.trim()) {
    formErrors.value.name = ['The name field is required.']
    isValid = false
  }

  if (cleanedContent.length === 0) {
    formErrors.value.content = ['The content field must have at least 1 item.']
    isValid = false
  }

  return isValid
}

function handleApiError(err) {
  if (err.response?.data?.errors) {
    formErrors.value = err.response.data.errors
    showToast('Please fix the validation errors.', 'error')
  } else {
    const message = err.response?.data?.message || 'An error occurred.'
    showToast(message, 'error')
  }
}

function editTemplate(template) {
  loadTemplateDetails(template.id)
}

function cancelEdit() {
  resetForm()
}

// ---------------- Watchers ----------------
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTemplates()
  }, 300)
})

watch(activeFilter, () => {
  loadTemplates()
})

// ---------------- Lifecycle ----------------
onMounted(() => {
  loadTemplates()
})
</script>

<template>
  <div class="p-4 md:p-6">
    <!-- Toast -->
    <div v-if="toast.show"
      class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'">
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

          <form @submit.prevent="isEditMode ? updateTemplate() : createTemplate()" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Template Name <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                :class="{ 'border-red-500': formErrors.name }" placeholder="e.g. Standard Service Agreement"
                :disabled="loadingDetails" />
              <p v-if="formErrors.name" class="mt-1 text-xs text-red-600">
                {{ formErrors.name[0] }}
              </p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="form.description" rows="2"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Optional short description" :disabled="loadingDetails"></textarea>
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
                <div v-for="(term, index) in form.content" :key="index"
                  class="flex items-center gap-2 group bg-gray-50 rounded-lg p-2 border border-gray-200 hover:border-blue-300 transition-all"
                  :class="{ 'border-red-300': term.trim() === '' && form.content.length === 1 }">
                  <!-- Drag handle -->
                  <div class="text-gray-400 cursor-move text-sm">
                    <i class="ri-drag-move-2-line"></i>
                  </div>

                  <!-- Term number -->
                  <span class="text-xs font-medium text-gray-500 min-w-[20px]">
                    {{ index + 1 }}.
                  </span>

                  <!-- Term input -->
                  <input :ref="`term-input-${index}`" v-model="form.content[index]" type="text"
                    class="term-input flex-1 bg-transparent border-0 px-1 py-1 text-sm focus:outline-none focus:ring-0 placeholder-gray-400"
                    :placeholder="`Term ${index + 1}`" @input="updateTerm(index, $event.target.value)"
                    @keydown="handleKeydown($event, index)" :disabled="loadingDetails" />

                  <!-- Delete button -->
                  <button type="button" @click="removeTerm(index)" :disabled="isOnlyEmptyTerm || loadingDetails"
                    class="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    :title="isOnlyEmptyTerm ? 'Cannot delete last empty term' : 'Delete term'">
                    <i class="ri-delete-bin-line text-sm"></i>
                  </button>
                </div>
              </div>

              <p v-if="formErrors.content" class="mt-1 text-xs text-red-600">
                {{ formErrors.content[0] }}
              </p>

              <!-- Add New Term Button -->
              <button type="button" @click="addTerm" :disabled="loadingDetails"
                class="mt-3 w-full text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 py-2 px-3 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg transition-all hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="ri-add-line"></i>
                Add New Term
              </button>
            </div>

            <!-- Active Toggle -->
            <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span class="text-sm font-medium text-gray-700">Active Status</span>
              <button type="button" @click="form.is_active = form.is_active === 1 ? 0 : 1" :disabled="loadingDetails"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                :class="form.is_active === 1 ? 'bg-blue-600' : 'bg-gray-300'">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                  :class="form.is_active === 1 ? 'translate-x-6' : 'translate-x-1'"></span>
              </button>
              <span class="text-sm ml-2" :class="form.is_active === 1 ? 'text-blue-600' : 'text-gray-500'">
                {{ form.is_active === 1 ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <!-- Default Template Checkbox -->
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="form.is_default === 1"
                @change="form.is_default = form.is_default === 1 ? 0 : 1" id="default-checkbox"
                :disabled="loadingDetails"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50" />
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
              <button type="submit" :disabled="saving || loadingDetails"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <i v-if="saving" class="ri-loader-4-line animate-spin"></i>
                <i v-else :class="isEditMode ? 'ri-refresh-line' : 'ri-save-line'"></i>
                {{ isEditMode ? 'Update Template' : 'Save Template' }}
              </button>

              <button v-if="isEditMode" type="button" :disabled="saving || loadingDetails" @click="cancelEdit"
                class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
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

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:w-48">
                <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search..."
                  class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" />
              </div>

              <select v-model="activeFilter"
                class="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-2">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>

          <!-- Empty state -->
          <div v-else-if="templates.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <i class="ri-file-list-3-line text-5xl text-gray-300 mb-3"></i>
            <p class="text-gray-600 font-medium">No Terms Templates Found</p>
            <p class="text-gray-400 text-sm">Create your first reusable Terms & Conditions template.</p>
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
                <tr v-for="(template, index) in templates" :key="template.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                  <td class="px-3 py-3">
                    <div class="font-medium text-gray-800">{{ template.name }}</div>
                    <div v-if="template.description" class="text-xs text-gray-400 truncate max-w-[200px]">
                      {{ template.description }}
                    </div>
                  </td>
                  <td class="px-3 py-3">
                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {{ template.terms_count || 0 }} Terms
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    <span v-if="template.is_default == 1"
                      class="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      ★ Default
                    </span>
                    <span v-else class="text-gray-400 text-xs">—</span>
                  </td>
                  <td class="px-3 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="template.is_active == 1 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                      {{ template.is_active == 1 ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    <div class="flex items-center justify-end gap-1">
                      <button @click="toggleActive(template.id)" :disabled="togglingActive === template.id"
                        title="Toggle Status"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-amber-100 hover:text-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i v-if="togglingActive === template.id" class="ri-loader-4-line animate-spin"></i>
                        <i v-else class="ri-refresh-line"></i>
                      </button>
                      <button v-if="template.is_default !== 1" @click="setDefaultTemplate(template.id)"
                        :disabled="settingDefault === template.id" title="Set Default"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i v-if="settingDefault === template.id" class="ri-loader-4-line animate-spin"></i>
                        <i v-else class="ri-star-line"></i>
                      </button>
                      <button @click="editTemplate(template)" title="Edit"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                        <i class="ri-edit-line"></i>
                      </button>
                      <button @click="deleteTemplate(template)" title="Delete"
                        class="p-1.5 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors">
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