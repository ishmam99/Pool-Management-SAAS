<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto w-full">
      <router-link :to="isEdit ? `/admin/tenants/${route.params.id}` : '/admin/tenants'" class="inline-flex items-center gap-2 text-teal-600 text-sm font-medium mb-4"><i class="ri-arrow-left-line"></i> Back</router-link>
      <h1 class="text-3xl font-bold text-slate-900 mb-6">{{ isEdit ? 'Edit Tenant' : 'Create Tenant' }}</h1>

      <form class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4 w-full" @submit.prevent="submit" enctype="multipart/form-data">
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
          <input v-model="form.company_name" type="text" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/40" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Legal Name</label>
          <input v-model="form.legal_name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">EIN</label>
          <input v-model="form.ein" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input v-model="form.phone" type="tel" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="+1 (555) 000-0000" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Website</label>
          <input v-model="form.website" type="url" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="https://example.com" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Logo</label>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <input 
                ref="logoInput"
                type="file" 
                accept="image/*"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                @change="handleLogoUpload"
              />
            </div>
            <div v-if="form.logoPreview" class="flex-shrink-0">
              <img :src="form.logoPreview" alt="Logo preview" class="w-16 h-16 rounded-xl object-cover border border-slate-200" />
            </div>
            <div v-else-if="form.existingLogo" class="flex-shrink-0">
              <img :src="form.existingLogo" alt="Current logo" class="w-16 h-16 rounded-xl object-cover border border-slate-200" />
            </div>
          </div>
          <p v-if="form.logoFile" class="mt-1 text-xs text-slate-500">Selected: {{ form.logoFile.name }}</p>
          <button 
            v-if="form.logoFile || form.existingLogo" 
            type="button" 
            class="mt-1 text-xs text-red-600 hover:text-red-800"
            @click="removeLogo"
          >
            Remove logo
          </button>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
          <div class="flex items-center gap-3">
            <input v-model="form.brand_color" type="color" class="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer" />
            <input v-model="form.brand_color" type="text" class="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="#000000" />
          </div>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option value="trial">Trial</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-1">Domain Mode</label>
          <select v-model="form.domain_mode" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
            <option value="subdomain">Subdomain</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="w-full">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input v-model="form.marketplace_opt_in" :true-value="1" :false-value="0" type="checkbox" class="rounded" />
            Marketplace Opt-in
          </label>
        </div>
        <div class="flex gap-3 pt-2 w-full">
          <button type="submit" :disabled="submitting" class="flex-1 rounded-xl bg-teal-600 text-white py-3 text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">{{ submitting ? 'Saving...' : (isEdit ? 'Update Tenant' : 'Create Tenant') }}</button>
          <button type="button" class="px-6 rounded-xl border border-slate-200 text-slate-600 py-3 text-sm" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, getApiErrorMessage } from '../../../../services/adminApi.js'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const logoInput = ref(null)
const isEdit = computed(() => !!route.params.id && route.path.includes('/edit'))

const defaultForm = () => ({
  company_name: '',
  legal_name: '',
  ein: '',
  email: '',
  phone: '',
  website: '',
  logo: null, // Will store the File object
  logoPreview: null, // For preview
  existingLogo: null, // For existing logo URL when editing
  brand_color: '#000000',
  status: 'trial',
  domain_mode: 'subdomain',
  marketplace_opt_in: 0,
})
const form = reactive(defaultForm())
const resetForm = () => {
  Object.assign(form, defaultForm())
  if (logoInput.value) logoInput.value.value = ''
}

const buildImageUrl = (path) => {
  if (!path) return ''
  return `${import.meta.env.VITE_BASE_URL}/storage/${path}`
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'File too large',
      text: 'Logo image must be less than 5MB'
    })
    event.target.value = ''
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid file type',
      text: 'Please upload an image file'
    })
    event.target.value = ''
    return
  }
  
  form.logoFile = file
  form.logoPreview = URL.createObjectURL(file)
  form.existingLogo = null // Clear existing logo when new one is uploaded
}

const removeLogo = () => {
  form.logoFile = null
  if (form.logoPreview) {
    URL.revokeObjectURL(form.logoPreview)
    form.logoPreview = null
  }
  form.existingLogo = null
  if (logoInput.value) logoInput.value.value = ''
}

const loadTenant = async () => {
  if (!isEdit.value) return
  try {
    const tenant = await adminApi.getTenant(route.params.id)
    Object.assign(form, {
      company_name: tenant.company_name || tenant.name || '',
      legal_name: tenant.legal_name || '',
      ein: tenant.ein || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      website: tenant.website || '',
      existingLogo: buildImageUrl(tenant.logo_path) || null, 
      brand_color: tenant.brand_color || '#000000',
      status: tenant.status || 'trial',
      domain_mode: tenant.domain_mode || 'subdomain',
      marketplace_opt_in: tenant.marketplace_opt_in ? 1 : 0,
    })
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Load Failed', text: getApiErrorMessage(e) })
  }
}

const submit = async () => {
  submitting.value = true
  try {
    const formData = new FormData()
    
    // Add all text fields
    formData.append('company_name', form.company_name)
    formData.append('legal_name', form.legal_name || '')
    formData.append('ein', form.ein || '')
    formData.append('email', form.email || '')
    formData.append('phone', form.phone || '')
    formData.append('website', form.website || '')
    formData.append('brand_color', form.brand_color || '#000000')
    formData.append('status', form.status)
    formData.append('domain_mode', form.domain_mode)
    formData.append('marketplace_opt_in', String(Number(form.marketplace_opt_in)))
    
    // Add logo file if present - sent as logo_path
    if (form.logoFile) {
      formData.append('logo_path', form.logoFile)
    }
    
    // If editing and logo was removed, send a flag to remove it
    if (isEdit.value && form.existingLogo === null && !form.logoFile) {
      formData.append('remove_logo', 'true')
    }
    
    let response
    if (isEdit.value) {
      response = await adminApi.updateTenant(route.params.id, formData)
    } else {
      response = await adminApi.createTenant(formData)
    }
    
    await Swal.fire({ 
      icon: 'success', 
      title: isEdit.value ? 'Tenant Updated' : 'Tenant Created', 
      timer: 2000, 
      showConfirmButton: false 
    })
    router.push('/admin/tenants')
  } catch (e) {
    await Swal.fire({ 
      icon: 'error', 
      title: 'Save Failed', 
      text: getApiErrorMessage(e) 
    })
  } finally {
    submitting.value = false
  }
}

onMounted(loadTenant)
</script>