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
          <option value="about">About Us</option>
          <option value="pricing">Pricing</option>
          <option value="services">Services</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <div class="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <div ref="editorContainer" class="quill-editor"></div>
        </div>
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
import { ref, reactive, onMounted, computed, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import api from '../../../../services/api.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const error = ref('');
const success = ref('');
const editorContainer = ref(null);
let quillEditor = null;

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

// Initialize Quill editor
const initEditor = () => {
  if (!editorContainer.value) return;
  
  // Check if editor already exists
  if (quillEditor) {
    // quillEditor.destroy();
    quillEditor = null;
  }

  // Quill toolbar configuration
  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean']
  ];

  quillEditor = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      clipboard: {
        matchVisual: true // Preserve formatting when pasting
      }
    },
    placeholder: 'Write your page content here...',
    readOnly: false,
  });

  // Set initial content
  if (form.content) {
    quillEditor.root.innerHTML = form.content;
  }

  // Update form.content when editor content changes
  quillEditor.on('text-change', () => {
    if (quillEditor) {
      // Get HTML content and store in form
      const content = quillEditor.root.innerHTML;
      form.content = content === '<p><br></p>' ? '' : content;
    }
  });
};

// Watch for content changes from API
watch(() => form.content, (newContent) => {
  if (quillEditor && newContent !== undefined && newContent !== null) {
    const currentContent = quillEditor.root.innerHTML;
    // Only update if different to avoid loops
    if (currentContent !== newContent) {
      quillEditor.root.innerHTML = newContent;
    }
  }
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
    
    // Update editor content after form is populated
    await nextTick();
    if (quillEditor && form.content) {
      quillEditor.root.innerHTML = form.content;
    }
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
    // Ensure editor content is synced to form.content before submit
    if (quillEditor) {
      const content = quillEditor.root.innerHTML;
      form.content = content === '<p><br></p>' ? '' : content;
    }
    
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
    setTimeout(() => {
      router.push('/provider/website/pages/view');
    }, 1500);
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

onMounted(async () => {
  await loadPage();
  await nextTick();
  initEditor();
});

onBeforeUnmount(() => {
  // Clean up editor on component unmount
  if (quillEditor) {
    // quillEditor.destroy();
    quillEditor = null;
  }
});
</script>

<style scoped>
/* Quill editor custom styles */
:deep(.quill-editor) {
  min-height: 300px;
}

:deep(.ql-container) {
  min-height: 300px;
  border: none !important;
  border-radius: 0 !important;
  font-size: 16px;
}

:deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 0 !important;
  background-color: #f9fafb;
}

:deep(.ql-editor) {
  min-height: 300px;
  padding: 1rem;
  font-size: 16px;
  line-height: 1.6;
}

:deep(.ql-editor p) {
  margin-bottom: 0.75rem;
}

:deep(.ql-editor h1) {
  font-size: 2rem;
  font-weight: bold;
  margin: 1.5rem 0 1rem 0;
}

:deep(.ql-editor h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1.25rem 0 0.75rem 0;
}

:deep(.ql-editor h3) {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
}

:deep(.ql-editor ul) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.ql-editor ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.ql-editor a) {
  color: #2563eb;
  text-decoration: underline;
}

:deep(.ql-editor blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
}

:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.ql-toolbar) {
    flex-wrap: wrap;
  }
  
  :deep(.ql-toolbar .ql-formats) {
    margin-right: 0.5rem;
  }
}
</style>