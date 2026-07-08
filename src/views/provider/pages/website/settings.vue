<template>
  <div class="p-6 bg-slate-50 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Website Settings</h1>
      <button
        @click="saveSettings"
        :disabled="loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      Settings updated successfully!
    </div>

    <form @submit.prevent="saveSettings" class="space-y-8">
      <!-- Company Information -->
      <section class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Company Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input v-model="form.site_name" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input v-model="form.tagline" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input v-model="form.phone" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="example@domain.com" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea v-model="form.address" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>
      </section>

      <!-- Branding -->
      <section class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Branding</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Logo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <div class="flex items-center gap-4">
              <div v-if="form.logo_url" class="w-20 h-20 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                <img :src="form.logo_url" alt="Logo" class="w-full h-full object-contain" />
              </div>
              <div v-else class="w-20 h-20 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">No logo</div>
              <div class="flex-1">
                <input type="file" accept="image/*" @change="handleLogoUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div v-if="form.logo_url" class="mt-1">
                  <label class="inline-flex items-center text-sm text-red-600 cursor-pointer">
                    <input type="checkbox" v-model="removeLogo" class="mr-1" />
                    Remove existing logo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Favicon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
            <div class="flex items-center gap-4">
              <div v-if="form.favicon_url" class="w-12 h-12 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                <img :src="form.favicon_url" alt="Favicon" class="w-full h-full object-contain" />
              </div>
              <div v-else class="w-12 h-12 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">None</div>
              <div class="flex-1">
                <input type="file" accept="image/*" @change="handleFaviconUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div v-if="form.favicon_url" class="mt-1">
                  <label class="inline-flex items-center text-sm text-red-600 cursor-pointer">
                    <input type="checkbox" v-model="removeFavicon" class="mr-1" />
                    Remove existing favicon
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Colors -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div class="flex items-center gap-3">
              <input v-model="form.primary_color" type="color" class="w-10 h-10 p-0 border-0 cursor-pointer" />
              <input v-model="form.primary_color" type="text" class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="#000000" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
            <div class="flex items-center gap-3">
              <input v-model="form.secondary_color" type="color" class="w-10 h-10 p-0 border-0 cursor-pointer" />
              <input v-model="form.secondary_color" type="text" class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="#000000" />
            </div>
          </div>
        </div>
      </section>

      <!-- Domains -->
      <section class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Domains</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
            <input v-model="form.subdomain" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your-company" pattern="[a-zA-Z0-9_-]+" title="Only letters, numbers, dashes, and underscores" />
            <p class="text-xs text-gray-500 mt-1">Only letters, numbers, dashes, and underscores allowed.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Custom Domain</label>
            <input v-model="form.custom_domain" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="example.com" />
          </div>
        </div>
      </section>

      <!-- Social Media -->
      <section class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Social Media</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input v-model="form.facebook_url" type="url" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input v-model="form.instagram_url" type="url" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <input v-model="form.twitter_url" type="url" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://twitter.com/..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
            <input v-model="form.youtube_url" type="url" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://youtube.com/..." />
          </div>
        </div>
      </section>

      <!-- SEO -->
      <section class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">SEO</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea v-model="form.meta_description" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brief description for search engines"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
            <input v-model="form.google_analytics_id" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="UA-XXXXX-Y or G-XXXXXXX" />
          </div>
        </div>
      </section>

      <!-- Feature Visibility -->
      <section class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Feature Visibility</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <label v-for="(_, key) in featureToggles" :key="key" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <span class="capitalize text-gray-700">{{ key.replace('show_', '') }}</span>
            <input type="checkbox" v-model="form[key]" class="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded" />
          </label>
        </div>
      </section>

      <!-- Hidden submit to allow form submission via button -->
      <button type="submit" class="hidden">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../../../../services/api.js'; // Adjust path to your API instance

// State
const loading = ref(false);
const error = ref('');
const success = ref(false);

// Form data
const form = reactive({
  site_name: '',
  tagline: '',
  phone: '',
  email: '',
  address: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  subdomain: '',
  custom_domain: '',
  primary_color: '#000000',
  secondary_color: '#000000',
  meta_description: '',
  google_analytics_id: '',
  show_about: false,
  show_services: false,
  show_pricing: false,
  show_gallery: false,
  show_testimonials: false,
  show_blog: false,
  show_contact: false,
  show_faq: false,
  show_portal_login: false,
  logo_url: '',
  favicon_url: '',
});

// File uploads
const logoFile = ref(null);
const faviconFile = ref(null);
const removeLogo = ref(false);
const removeFavicon = ref(false);

// Feature toggles (computed to iterate)
const featureToggles = computed(() => {
  const toggles = {};
  for (const key in form) {
    if (key.startsWith('show_')) {
      toggles[key] = form[key];
    }
  }
  return toggles;
});

// Load settings
const loadSettings = async () => {
  try {
    const response = await api().get('/tenant/website');
    const data = response.data.data; // assuming the response structure is as shown
    // Populate form with data
    Object.keys(form).forEach(key => {
      if (key in data) {
        form[key] = data[key];
      }
    });
    // Ensure boolean toggles are strictly boolean
    for (const key of Object.keys(featureToggles.value)) {
      form[key] = !!form[key];
    }
    // Set image URLs (they may be null)
    form.logo_url = data.logo_url || '';
    form.favicon_url = data.favicon_url || '';
  } catch (err) {
    error.value = 'Failed to load settings. Please refresh.';
    console.error(err);
  }
};

// File handlers
const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    logoFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      form.logo_url = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleFaviconUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    faviconFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      form.favicon_url = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Save settings
const saveSettings = async () => {
  error.value = '';
  success.value = false;
  loading.value = true;

  try {
    const formData = new FormData();

    // Text fields
    const textFields = [
      'site_name', 'tagline', 'phone', 'email', 'address',
      'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url',
      'subdomain', 'custom_domain',
      'primary_color', 'secondary_color',
      'meta_description', 'google_analytics_id'
    ];
    textFields.forEach(field => {
      if (form[field] !== undefined && form[field] !== null) {
        formData.append(field, form[field]);
      }
    });

    // Toggle fields – send as '0' or '1'
    Object.keys(featureToggles.value).forEach(key => {
      formData.append(key, form[key] ? '1' : '0');
    });

    // Files
    if (logoFile.value) {
      formData.append('logo', logoFile.value);
    }
    if (faviconFile.value) {
      formData.append('favicon', faviconFile.value);
    }

    // Removal flags
    if (removeLogo.value) {
      formData.append('remove_logo', '1');
    }
    if (removeFavicon.value) {
      formData.append('remove_favicon', '1');
    }

    // Method override for PUT
    formData.append('_method', 'PUT');

    const response = await api().post('/tenant/website', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    success.value = true;
    // Reload settings to get updated URLs
    await loadSettings();
    // Reset file inputs and flags
    logoFile.value = null;
    faviconFile.value = null;
    removeLogo.value = false;
    removeFavicon.value = false;
    // Clear file inputs
    document.querySelector('input[type="file"][accept="image/*"]:first-of-type').value = '';
    document.querySelectorAll('input[type="file"][accept="image/*"]')[1].value = '';
  } catch (err) {
    // Display validation errors if any
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(' ');
    } else {
      error.value = err.response?.data?.message || 'Failed to save settings.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
/* Custom styles if needed */
</style>