<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Upload Media</h1>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <form @submit.prevent="uploadFiles" class="bg-white rounded-xl shadow p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Choose Files *</label>
        <input type="file" multiple @change="handleFileSelect" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <div v-if="selectedFiles.length > 0" class="mt-2 text-sm text-gray-600">
          {{ selectedFiles.length }} file(s) selected.
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Folder (optional)</label>
        <input v-model="folder" type="text" placeholder="/folder/subfolder" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-xs text-gray-500 mt-1">Leave empty to store in root.</p>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="submit" :disabled="uploading || selectedFiles.length === 0" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <span v-if="uploading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
        <router-link to="/provider/media" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</router-link>
      </div>

      <!-- Upload Progress / Status -->
      <div v-if="uploading && uploadProgress.length > 0" class="mt-4">
        <div v-for="(item, index) in uploadProgress" :key="index" class="flex items-center gap-3 text-sm">
          <span class="truncate flex-1">{{ item.name }}</span>
          <span class="text-gray-500">{{ item.status }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../services/api.js';

const router = useRouter();
const selectedFiles = ref([]);
const folder = ref('');
const uploading = ref(false);
const error = ref('');
const success = ref('');
const uploadProgress = ref([]);

const handleFileSelect = (e) => {
  const files = e.target.files;
  selectedFiles.value = Array.from(files);
  uploadProgress.value = selectedFiles.value.map(f => ({ name: f.name, status: 'Pending' }));
};

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    error.value = 'Please select at least one file.';
    return;
  }

  error.value = '';
  success.value = '';
  uploading.value = true;

  try {
    const formData = new FormData();
    selectedFiles.value.forEach(file => {
      formData.append('files[]', file);
    });
    if (folder.value) {
      formData.append('folder', folder.value);
    }

    // Track upload progress (optional)
    const response = await api().post('/tenant/website/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        // You can update progress per file if needed
      },
    });

    success.value = `Successfully uploaded ${selectedFiles.value.length} file(s).`;
    selectedFiles.value = [];
    uploadProgress.value = [];
    folder.value = '';
    // Reset file input
    document.querySelector('input[type="file"]').value = '';

    // Redirect after short delay
    // setTimeout(() => {
    //   router.push('/provider/media');
    // }, 2000);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(' ');
    } else {
      error.value = err.response?.data?.message || 'Upload failed.';
    }
    console.error(err);
  } finally {
    uploading.value = false;
  }
};
</script>