<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Pages</h1>
        <p class="text-gray-600 mt-1">Manage your website pages and content</p>
      </div>
      <router-link to="/provider/website/pages/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Page
      </router-link>
    </div>

    <!-- Alerts -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-red-700">{{ error }}</span>
    </div>
    <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-green-700">{{ success }}</span>
    </div>


    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="pages.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No pages found</h3>
      <p class="text-gray-600 mb-4">Get started by creating your first page</p>
      <router-link to="/provider/website/pages/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
        Create Page
      </router-link>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="">
        <table class="">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Page Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Meta Title</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Meta Description</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated At</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(page, index) in pages" :key="page.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">{{ page.page_type }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ page.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ page.slug }}</code>
              </td>
              <td class="px-6 py-4 max-w-xs truncate text-gray-600">{{ page.meta_title || '-' }}</td>
              <td class="px-6 py-4 max-w-xs truncate text-gray-600">{{ page.meta_description || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 text-xs font-medium rounded-full capitalize">
                  {{ page.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(page.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(page.updated_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  
                  <button @click="openEditModal(page)" class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(page.id)" class="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 bg-gray-50">
        <div class="text-sm text-gray-600">
          Showing {{ (meta.current_page - 1) * meta.per_page + 1 }} to 
          {{ Math.min(meta.current_page * meta.per_page, meta.total) }} 
          of {{ meta.total }} results
        </div>
        <div class="flex gap-2">
          <button 
            @click="changePage(meta.current_page - 1)" 
            :disabled="meta.current_page <= 1" 
            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button class="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded-lg">{{ meta.current_page }}</button>
          <button 
            @click="changePage(meta.current_page + 1)" 
            :disabled="meta.current_page >= meta.last_page" 
            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 class="text-xl font-bold text-gray-900">Edit Page</h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <div v-if="editError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-red-700">{{ editError }}</span>
          </div>
          <div v-if="editSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-green-700">{{ editSuccess }}</span>
          </div>

          <form @submit.prevent="updatePage">
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Title <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="editForm.title" 
                    type="text" 
                    required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter page title"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Page Type <span class="text-red-500">*</span>
                  </label>
                  <select v-model="editForm.page_type" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white">
                    <option value="about">About Us</option>
                    <option value="services">Services</option>
                    <option value="pricing">Pricing</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select v-model="editForm.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input 
                    v-model="editForm.meta_title" 
                    type="text" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="SEO meta title"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea 
                    v-model="editForm.meta_description" 
                    rows="3" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="SEO meta description"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Content Section - Full Width -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div ref="quillEditor" class="bg-white rounded-lg border border-gray-300"></div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
              <button 
                type="submit" 
                :disabled="editLoading" 
                class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="editLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ editLoading ? 'Saving...' : 'Update Page' }}
              </button>
              <button type="button" @click="closeModal" class="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// List state
const pages = ref([]);
const meta = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
});
const loading = ref(false);
const error = ref('');
const success = ref('');

const filters = reactive({
  search: '',
  status: '',
  page_type: '',
});

// Edit modal state
const showModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  title: '',
  content: '',
  page_type: 'custom',
  meta_title: '',
  meta_description: '',
  status: 'draft',
});

// Quill instance
let quill = null;
const quillEditor = ref(null);

// Initialize Quill
const initQuill = () => {
  if (!quillEditor.value) return;
  
  // Clean up existing instance if any
  if (quill) {
    try {
      // Remove all event listeners
      quill.off();
      // Get the root element
      const root = quill.root;
      if (root) {
        // Remove the editor content
        root.innerHTML = '';
      }
    } catch (e) {
      console.warn('Error cleaning up Quill instance:', e);
    }
    quill = null;
  }

  // Create new Quill instance
  quill = new Quill(quillEditor.value, {
    theme: 'snow',
    placeholder: 'Write your page content here...',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  });

  // Set initial content
  if (editForm.content) {
    quill.root.innerHTML = editForm.content;
  }

  // Listen for content changes
  quill.on('text-change', () => {
    editForm.content = quill.root.innerHTML;
  });
};

// Destroy Quill instance
const destroyQuill = () => {
  if (quill) {
    try {
      // Remove event listeners
      quill.off();
      // Clear content
      if (quill.root) {
        quill.root.innerHTML = '';
      }
    } catch (e) {
      console.warn('Error destroying Quill instance:', e);
    }
    quill = null;
  }
};

// Fetch pages
const fetchPages = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const params = {
      page,
      per_page: 10,
      ...filters,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const response = await api().get('/tenant/website/pages', { params });
    const pagination = response.data.data || {};
    pages.value = pagination.data || [];
    meta.value = {
      current_page: pagination.current_page || 1,
      per_page: pagination.per_page || 10,
      total: pagination.total || 0,
      last_page: pagination.last_page || 1,
    };
  } catch (err) {
    error.value = 'Failed to load pages.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => fetchPages(1);
const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.page_type = '';
  fetchPages(1);
};
const changePage = (page) => {
  if (page >= 1 && page <= meta.value.last_page) {
    fetchPages(page);
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Delete
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This page will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/pages/${id}`);
        Swal.fire('Deleted!', 'Page has been deleted.', 'success');
        fetchPages(meta.value.current_page);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete page.', 'error');
        console.error(err);
      }
    }
  });
};

// Open edit modal
const openEditModal = async (page) => {
  editError.value = '';
  editSuccess.value = '';
  editForm.id = page.id;
  editForm.title = page.title;
  editForm.content = page.content || '';
  editForm.page_type = page.page_type;
  editForm.meta_title = page.meta_title || '';
  editForm.meta_description = page.meta_description || '';
  editForm.status = page.status;

  showModal.value = true;

  // Fetch fresh data
  try {
    const response = await api().get(`/tenant/website/pages/${page.id}`);
    const data = response.data.data;
    Object.assign(editForm, {
      id: data.id,
      title: data.title,
      content: data.content || '',
      page_type: data.page_type,
      meta_title: data.meta_title || '',
      meta_description: data.meta_description || '',
      status: data.status,
    });
    
    // Initialize Quill after DOM update
    await nextTick();
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      initQuill();
    }, 50);
  } catch (err) {
    editError.value = 'Could not fetch latest data, but you can still edit.';
    console.error(err);
  }
};

const closeModal = () => {
  showModal.value = false;
  editLoading.value = false;
  editError.value = '';
  editSuccess.value = '';
  // Clean up Quill instance
  destroyQuill();
};

// Update page
const updatePage = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;

  try {
    const formData = new FormData();
    const fields = ['title', 'content', 'page_type', 'meta_title', 'meta_description', 'status'];
    fields.forEach(field => {
      formData.append(field, editForm[field] || '');
    });
    formData.append('_method', 'PUT');

    await api().post(`/tenant/website/pages/${editForm.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    editSuccess.value = 'Page updated successfully!';
    await fetchPages(meta.value.current_page);
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update page.';
    }
    console.error(err);
  } finally {
    editLoading.value = false;
  }
};

// Watch for modal close
watch(showModal, (newVal) => {
  if (!newVal) {
    destroyQuill();
  }
});

// Watch for editForm.content changes to update Quill
watch(() => editForm.content, (newContent) => {
  if (quill && newContent !== quill.root.innerHTML) {
    quill.root.innerHTML = newContent;
  }
});

onMounted(() => {
  fetchPages(1);
});

onBeforeUnmount(() => {
  destroyQuill();
});
</script>

<style scoped>
/* Quill editor custom styling */
:deep(.ql-toolbar) {
  border-radius: 0.5rem 0.5rem 0 0;
  border-color: #e2e8f0;
  background-color: #f8fafc;
}

:deep(.ql-container) {
  border-radius: 0 0 0.5rem 0.5rem;
  border-color: #e2e8f0;
  min-height: 250px;
}

:deep(.ql-editor) {
  min-height: 250px;
  font-size: 16px;
  line-height: 1.6;
}

:deep(.ql-editor p) {
  margin-bottom: 0.75rem;
}

:deep(.ql-editor h1) {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.ql-editor h2) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.ql-editor h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

:deep(.ql-editor h4) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.ql-editor blockquote) {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #4a5568;
}

:deep(.ql-editor ul),
:deep(.ql-editor ol) {
  padding-left: 2rem;
  margin: 0.75rem 0;
}

:deep(.ql-editor a) {
  color: #3b82f6;
  text-decoration: underline;
}

:deep(.ql-editor code) {
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
}

:deep(.ql-editor pre) {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 0.75rem 0;
}

:deep(.ql-editor table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

:deep(.ql-editor table td),
:deep(.ql-editor table th) {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
}

:deep(.ql-snow .ql-tooltip) {
  z-index: 60;
}

/* Custom scrollbar for modal */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>