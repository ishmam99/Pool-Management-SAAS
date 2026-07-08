<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ isEdit ? 'Edit Page' : 'Create New Page' }}</h1>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <form @submit.prevent="submitForm" class="bg-white rounded-xl shadow p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input v-model="form.title" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Page Type *</label>
        <select v-model="form.page_type" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="custom">Custom</option>
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="services">Services</option>
          <option value="pricing">Pricing</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea v-model="form.content" rows="8" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Page content..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
        <input v-model="form.meta_title" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
        <textarea v-model="form.meta_description" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select v-model="form.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="submit" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
        </button>
        <router-link to="/provider/pages" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../../services/api.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const error = ref('');
const success = ref('');

const pageId = computed(() => route.params.id);
const isEdit = computed(() => !!pageId.value);

const form = reactive({
  title: '',
  content: '',
  page_type: 'custom',
  meta_title: '',
  meta_description: '',
  status: 'draft',
});

const loadPage = async () => {
  if (!isEdit.value) return;
  try {
    const response = await api().get(`/tenant/website/pages/${pageId.value}`);
    const data = response.data.data;
    Object.keys(form).forEach(key => {
      if (key in data) {
        form[key] = data[key];
      }
    });
  } catch (err) {
    error.value = 'Failed to load page data.';
    console.error(err);
  }
};

const submitForm = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const payload = { ...form };
    if (isEdit.value) {
      // Use POST with _method: 'PUT'
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });
      formData.append('_method', 'PUT');
      await api().post(`/tenant/website/pages/${pageId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      success.value = 'Page updated successfully!';
    } else {
      await api().post('/tenant/website/pages', payload);
      success.value = 'Page created successfully!';
    }
    // Redirect after short delay
    // setTimeout(() => {
    //   router.push('/provider/pages');
    // }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(' ');
    } else {
      error.value = err.response?.data?.message || 'Failed to save page.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPage();
});
</script>