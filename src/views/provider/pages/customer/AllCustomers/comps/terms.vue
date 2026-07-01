<template>
  <div class="bg-gray-50 p-1 rounded">
    <div class="bg-cyan-50/50 rounded-xl shadow-sm border border-gray-200 p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <!-- <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">5</span> -->
        <!-- <h2 class="text-lg font-semibold text-gray-900">Terms &amp; Condition</h2> -->
        <span v-if="hasAgreement" class="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
          Agreement #{{ existingAgreement?.id }}
        </span>
        <span v-else class="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          No Agreement
        </span>
      </div>

      <div class="term-templates-select">
        <!-- Loading -->
        <div v-if="loading" class="text-sm text-gray-500 flex items-center gap-2 py-4 justify-center">
          <i class="ri-loader-4-line animate-spin text-blue-500"></i> Loading templates...
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-sm text-red-500 flex items-center gap-2 py-4 justify-center">
          <i class="ri-error-warning-line"></i> {{ error }}
          <button @click="fetchTemplates" class="text-blue-500 underline hover:text-blue-700">Retry</button>
        </div>

        <!-- Simple Radio List -->
        <div v-else class="space-y-2">
          <!-- None option -->
          <div class="flex items-center cursor-pointer gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50">
            <input
              type="radio"
              id="template-none"
              name="template-select"
              :value="''"
              :checked="selectedTemplateId === ''"
              @change="onChange($event)"
              :disabled="!hasAgreement || submitting"
              class="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="template-none" class="text-sm text-gray-500 cursor-pointer flex-1" :class="{ 'cursor-not-allowed opacity-60': !hasAgreement || submitting }">
              None selected
            </label>
          </div>

          <!-- Template items -->
          <div
            v-for="template in templates"
            :key="template.id"
            class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50"
          >
            <input
              type="radio"
              :id="'template-' + template.id"
              name="template-select"
              :value="template.id"
              :checked="selectedTemplateId === template.id"
              @change="onChange($event)"
              :disabled="!hasAgreement || submitting"
              class="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label :for="'template-' + template.id" class="text-sm text-gray-700 cursor-pointer flex-1" :class="{ 'cursor-not-allowed opacity-60': !hasAgreement || submitting }">
              {{ template.name }}
            </label>
            <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mr-2">{{ template.terms_count || 0 }} terms</span>
            <!-- Read Terms Button -->
            <button
              type="button"
              @click.stop="openTermsModal(template)"
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-50 p-1.5 rounded-lg transition"
              title="Read terms"
            >
              <i class="ri-file-list-3-line text-lg"></i> View terms
            </button>
          </div>

          <div v-if="templates.length === 0" class="text-sm text-gray-400 text-center py-6">
            <i class="ri-inbox-line text-3xl block mb-2 text-gray-300"></i>
            No active templates available.
          </div>
        </div>
      </div>

      <!-- Footer Button -->
      <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end">
        <button
          @click="updateTerms"
          :disabled="!hasAgreement || submitting"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="submitting" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-add-line"></i>
          {{ buttonLabel }}
        </button>
      </div>
      <p v-if="!hasAgreement" class="text-center text-sm text-amber-600 mt-2">
        <i class="ri-information-line mr-1"></i> Create a Price agreement first to set terms.
      </p>
    </div>

    <!-- Terms Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] shadow-2xl overflow-hidden animate-fadeIn">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i class="ri-file-text-line text-blue-600"></i>
            {{ selectedTemplate?.name || 'Terms & Conditions' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div v-if="selectedTemplate?.content?.length" class="space-y-3">
            <div v-for="(term, idx) in selectedTemplate.content" :key="idx" class="flex gap-3">
              <span class="text-blue-600 font-medium text-sm">{{ idx + 1 }}.</span>
              <p class="text-gray-700 text-sm leading-relaxed">{{ term }}</p>
            </div>
          </div>
          <div v-else class="text-gray-400 text-center py-8">
            <i class="ri-file-line text-4xl block mb-2"></i>
            No terms defined for this template.
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button @click="closeModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../../../../../../services/api'
import Swal from 'sweetalert2'

// ─── Props & Emits ───────────────────────────────────────────
const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['refresh'])

// ─── State ──────────────────────────────────────────────────
const templates = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const selectedTemplate = ref(null)
const submitting = ref(false)

// The selected template ID (bound to radio)
const selectedTemplateId = ref('')

// ─── Computed ──────────────────────────────────────────────
const hasAgreement = computed(() => {
  return props.customer?.agreements?.length > 0
})

const existingAgreement = computed(() => {
  return hasAgreement.value ? props.customer.agreements[0] : null
})

const hasTemplateSelected = computed(() => {
  return selectedTemplateId.value !== '' && selectedTemplateId.value !== null
})

const buttonLabel = computed(() => {
  if (!hasAgreement.value) return 'Add Terms & Condition'
  return hasTemplateSelected.value ? 'Update Terms & Condition' : 'Add Terms & Condition'
})

// ─── Fetch Templates ──────────────────────────────────────
const fetchTemplates = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api().get('/term-templates/templates')
    templates.value = response.data?.data || []
  } catch (err) {
    console.error('Failed to fetch templates:', err)
    error.value = err.response?.data?.message || 'Could not load templates.'
  } finally {
    loading.value = false
  }
}

// ─── Watch Customer for pre‑selection ────────────────────
watch(() => props.customer, (newCustomer) => {
  if (!newCustomer) return
  if (hasAgreement.value) {
    const agreement = existingAgreement.value
    // Convert term_template_id to Number if exists, else empty string
    const templateId = agreement.term_template_id
    selectedTemplateId.value = templateId ? Number(templateId) : ''
  } else {
    // No agreement – reset
    selectedTemplateId.value = ''
  }
}, { immediate: true })

// ─── Radio Change ─────────────────────────────────────────
const onChange = (event) => {
  const value = event.target.value === '' ? '' : Number(event.target.value)
  selectedTemplateId.value = value
}

// ─── Submit ──────────────────────────────────────────────
const updateTerms = async () => {
  if (!hasAgreement.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'No Agreement Found',
      text: 'Please create a Price agreement first.',
      confirmButtonColor: '#4f46e5'
    })
    return
  }

  submitting.value = true
  try {
    const agreementId = existingAgreement.value.id
    const payload = {
      term_template_id: selectedTemplateId.value || null,
      _method: 'PUT'
    }

    await api().post(`/service-agreement-management/agreements/${agreementId}`, payload)

    await Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Terms & Conditions updated successfully.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })

    // Notify parent to refresh
    emit('refresh')

  } catch (error) {
    console.error('Failed to update terms:', error)
    let message = error.response?.data?.message || 'Something went wrong.'
    if (error.response?.data?.errors) {
      const errMsgs = Object.values(error.response.data.errors).flat()
      message = errMsgs.join(', ')
    }
    await Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: message,
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    submitting.value = false
  }
}

// ─── Modal helpers ──────────────────────────────────────
const openTermsModal = (template) => {
  selectedTemplate.value = template
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTemplate.value = null
}

// ─── Init ────────────────────────────────────────────────
onMounted(() => {
  fetchTemplates()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>