<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Blog Posts</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Add New Post
      </button>
    </div>

    <!-- Global Messages -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input v-model="filters.search" type="text" placeholder="Search by title..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @input="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="filters.category_id" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tag</label>
          <select v-model="filters.tag_id" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Tags</option>
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-gray-500">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="posts.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No posts found. Click "Add New Post" to create one.</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(post, index) in posts" :key="post.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ post.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getCategoryName(post.category_id) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <span v-for="tagId in (post.tags || [])" :key="tagId" class="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs mr-1 mb-1">
                {{ getTagName(tagId) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 text-xs font-medium rounded-full capitalize">
                {{ post.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(post.updated_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openEditModal(post)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
              <button @click="confirmDelete(post.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-500">
          Showing {{ (meta.current_page - 1) * meta.per_page + 1 }} to {{ Math.min(meta.current_page * meta.per_page, meta.total) }} of {{ meta.total }} results
        </div>
        <div class="flex gap-2">
          <button @click="changePage(meta.current_page - 1)" :disabled="meta.current_page <= 1" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span class="px-3 py-1 border rounded bg-blue-50 text-blue-700">{{ meta.current_page }}</span>
          <button @click="changePage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== CREATE MODAL ==================== -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeCreateModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Create Blog Post</h2>
          <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="createError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ createError }}
        </div>

        <form @submit.prevent="createPost">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="createForm.title" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea v-model="createForm.excerpt" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea v-model="createForm.content" rows="6" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <input type="file" accept="image/*" @change="handleCreateImage" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="createForm.imagePreview" class="mt-2">
                <img :src="createForm.imagePreview" alt="Preview" class="h-24 w-auto object-cover rounded border" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="createForm.category_id" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-300">
    <label v-for="tag in tags" :key="tag.id" class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
      <input 
        type="checkbox" 
        :value="tag.id" 
        v-model="createForm.tag_ids" 
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span class="text-sm text-gray-700">{{ tag.name }}</span>
    </label>
  </div>
  <p class="text-xs text-gray-500 mt-1">Select one or more tags.</p>
</div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="createForm.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="createLoading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="createLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ createLoading ? 'Saving...' : 'Create' }}
            </button>
            <button type="button" @click="closeCreateModal" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== EDIT MODAL ==================== -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeEditModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Edit Blog Post</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="editError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ editError }}
        </div>
        <div v-if="editSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {{ editSuccess }}
        </div>

        <form @submit.prevent="updatePost">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="editForm.title" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea v-model="editForm.excerpt" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea v-model="editForm.content" rows="6" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <div v-if="editForm.existing_image" class="mb-2">
                <img :src="editForm.existing_image" alt="Current image" class="h-24 w-auto object-cover rounded border" />
                <p class="text-xs text-gray-500 mt-1">Current image</p>
              </div>
              <input type="file" accept="image/*" @change="handleEditImage" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="editForm.imagePreview" class="mt-2">
                <img :src="editForm.imagePreview" alt="Preview" class="h-24 w-auto object-cover rounded border" />
                <p class="text-xs text-gray-500 mt-1">New image preview</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="editForm.category_id" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-300">
    <label v-for="tag in tags" :key="tag.id" class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
      <input 
        type="checkbox" 
        :value="tag.id" 
        v-model="editForm.tag_ids" 
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span class="text-sm text-gray-700">{{ tag.name }}</span>
    </label>
  </div>
  <p class="text-xs text-gray-500 mt-1">Select one or more tags.</p>
</div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="editForm.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="editLoading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="editLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ editLoading ? 'Saving...' : 'Update' }}
            </button>
            <button type="button" @click="closeEditModal" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

// ---------------------- List State ----------------------
const posts = ref([]);
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
  category_id: '',
  tag_id: '',
});

// ---------------------- Categories & Tags (for dropdowns) ----------------------
const categories = ref([]);
const tags = ref([]);

// ---------------------- Create Modal State ----------------------
const showCreateModal = ref(false);
const createLoading = ref(false);
const createError = ref('');
const createForm = reactive({
  title: '',
  content: '',
  excerpt: '',
  category_id: '',
  tag_ids: [],
  status: 'draft',
  imageFile: null,
  imagePreview: '',
});

// ---------------------- Edit Modal State ----------------------
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  title: '',
  content: '',
  excerpt: '',
  category_id: '',
  tag_ids: [],
  status: 'draft',
  imageFile: null,
  imagePreview: '',
  existing_image: '',
});

// ---------------------- Helper: get names from IDs ----------------------
const getCategoryName = (id) => {
  if (!id) return '-';
  const found = categories.value.find(c => c.id === id);
  return found ? found.name : '-';
};
const getTagName = (id) => {
  const found = tags.value.find(t => t.id === id);
  return found ? found.name : id;
};

// ---------------------- Fetch Posts ----------------------
const fetchPosts = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const params = {
      page,
      per_page: 10,
      ...filters,
      with: 'tags,category', // Include related tags and category
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const response = await api().get('/tenant/website/blog', { params });
    const pagination = response.data.data || {};
    posts.value = pagination.data || [];
    meta.value = {
      current_page: pagination.current_page || 1,
      per_page: pagination.per_page || 10,
      total: pagination.total || 0,
      last_page: pagination.last_page || 1,
    };
  } catch (err) {
    error.value = 'Failed to load posts.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ---------------------- Fetch Categories & Tags ----------------------
const fetchCategoriesAndTags = async () => {
  try {
    const [catRes, tagRes] = await Promise.all([
      api().get('/tenant/website/blog-categories'),
      api().get('/tenant/website/blog-tags'),
    ]);
    categories.value = catRes.data.data || [];
    tags.value = tagRes.data.data || [];
  } catch (err) {
    console.error('Failed to load categories/tags:', err);
  }
};

// ---------------------- Filters & Pagination ----------------------
const applyFilters = () => fetchPosts(1);
const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.category_id = '';
  filters.tag_id = '';
  fetchPosts(1);
};
const changePage = (page) => {
  if (page >= 1 && page <= meta.value.last_page) {
    fetchPosts(page);
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
    minute: '2-digit',
  });
};

// ---------------------- Image Handlers ----------------------
const handleCreateImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    createForm.imageFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => { createForm.imagePreview = ev.target.result; };
    reader.readAsDataURL(file);
  }
};
const handleEditImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    editForm.imageFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => { editForm.imagePreview = ev.target.result; };
    reader.readAsDataURL(file);
  }
};

// ---------------------- Create ----------------------
const openCreateModal = () => {
  createForm.title = '';
  createForm.content = '';
  createForm.excerpt = '';
  createForm.category_id = '';
  createForm.tag_ids = [];
  createForm.status = 'draft';
  createForm.imageFile = null;
  createForm.imagePreview = '';
  createError.value = '';
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createLoading.value = false;
  createError.value = '';
};

const createPost = async () => {
  createError.value = '';
  createLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', createForm.title);
    formData.append('content', createForm.content || '');
    formData.append('excerpt', createForm.excerpt || '');
    formData.append('category_id', createForm.category_id || '');
    formData.append('status', createForm.status);
    // Append tags as JSON array (or as comma-separated)
    if (createForm.tag_ids.length) {
  createForm.tag_ids.forEach(id => {
    formData.append('tags[]', id);
  });
}
    if (createForm.imageFile) {
      formData.append('featured_image', createForm.imageFile);
    }

    await api().post('/tenant/website/blog', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchPosts(1);
    success.value = 'Post created successfully!';
    closeCreateModal();
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      createError.value = Object.values(errors).flat().join(' ');
    } else {
      createError.value = err.response?.data?.message || 'Failed to create post.';
    }
    console.error(err);
  } finally {
    createLoading.value = false;
  }
};

// ---------------------- Edit ----------------------
const openEditModal = async (post) => {
  // Fetch full post details to ensure we have all fields including tags
  try {
    const response = await api().get(`/tenant/website/blog/${post.id}`);
    const data = response.data.data;
    editForm.id = data.id;
    editForm.title = data.title;
    editForm.content = data.content || '';
    editForm.excerpt = data.excerpt || '';
    editForm.category_id = data.category_id || '';
    editForm.tag_ids = data.tags ? data.tags.map(t => t.id) : [];
    editForm.status = data.status;
    editForm.existing_image = data.featured_image || '';
    editForm.imageFile = null;
    editForm.imagePreview = '';
    editError.value = '';
    editSuccess.value = '';
    showEditModal.value = true;
  } catch (err) {
    error.value = 'Could not load post details.';
    console.error(err);
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  editLoading.value = false;
  editError.value = '';
  editSuccess.value = '';
};

const updatePost = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('content', editForm.content || '');
    formData.append('excerpt', editForm.excerpt || '');
    formData.append('category_id', editForm.category_id || '');
    formData.append('status', editForm.status);
    if (editForm.tag_ids.length) {
  editForm.tag_ids.forEach(id => {
    formData.append('tags[]', id);
  });
}
    if (editForm.imageFile) {
      formData.append('featured_image', editForm.imageFile);
    }
    formData.append('_method', 'PUT'); // override

    await api().post(`/tenant/website/blog/${editForm.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchPosts(meta.value.current_page);
    editSuccess.value = 'Post updated successfully!';
    setTimeout(() => {
      closeEditModal();
      success.value = 'Post updated successfully!';
      setTimeout(() => { success.value = ''; }, 3000);
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update post.';
    }
    console.error(err);
  } finally {
    editLoading.value = false;
  }
};

// ---------------------- Delete ----------------------
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This post will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/blog/${id}`);
        Swal.fire('Deleted!', 'Post has been deleted.', 'success');
        await fetchPosts(meta.value.current_page);
        success.value = 'Post deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete post.', 'error');
        console.error(err);
      }
    }
  });
};

// ---------------------- Lifecycle ----------------------
onMounted(async () => {
  await fetchCategoriesAndTags();
  await fetchPosts(1);
});
</script>