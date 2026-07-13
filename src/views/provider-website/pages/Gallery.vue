<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
      <div class="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 class="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">Media</h1>
        <p class="mt-4 text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">Browse our collection of project photos, completed work, documents, and media.</p>
      </div>
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-12 md:h-16">
          <path d="M0 60V40C240 20 480 0 720 20C960 40 1200 30 1440 40V60H0Z" fill="currentColor" class="text-slate-50 dark:text-slate-900"/>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class=" px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Stats -->
     

      <!-- Search & Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by filename..."
              class="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-md transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            <svg class="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="filter in filters"
            :key="filter.key"
            @click="activeFilter = filter.key"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm"
            :class="activeFilter === filter.key
              ? 'bg-indigo-600 text-white shadow-indigo-500/30 dark:bg-indigo-500'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Media Grid -->
      <div v-if="!loading && !error && filteredItems.length" class="grid grid-cols-6 gap-6">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100 dark:border-slate-700"
        >
          <!-- Media Preview -->
          <div class="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
            <!-- Image -->
            <template v-if="isImage(item)">
              <img
                :src="item.thumbnail_url || item.url"
                :alt="item.alt_text || item.original_filename"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                @click="openLightbox(item)"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </template>

            <!-- Video -->
            <template v-else-if="isVideo(item)">
              <img
                :src="item.thumbnail_url || item.url"
                :alt="item.alt_text || item.original_filename"
                loading="lazy"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </template>

            <!-- PDF -->
            <template v-else-if="isPdf(item)">
              <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-4">
                <svg class="w-16 h-16 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                </svg>
                <p class="mt-2 text-sm font-medium text-red-700 dark:text-red-300 truncate max-w-full">{{ item.original_filename }}</p>
                <span class="mt-1 text-xs bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 px-2 py-0.5 rounded-full">PDF</span>
              </div>
            </template>

            <!-- Document -->
            <template v-else>
              <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4">
                <svg class="w-16 h-16 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <p class="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300 truncate max-w-full">{{ item.original_filename }}</p>
                <span class="mt-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full">{{ getFileExtension(item.original_filename) }}</span>
              </div>
            </template>
          </div>

          <!-- Card Footer -->
          <div class="p-4">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200 truncate" :title="item.original_filename">{{ item.original_filename }}</p>
            <div class="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{{ formatDate(item.created_at) }}</span>
              <span>{{ formatFileSize(item.file_size) }}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                v-if="isPdf(item)"
                @click="openFile(item.url)"
                class="flex-1 text-center text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Open PDF
              </button>
              <button
                v-if="isDocument(item) && !isPdf(item)"
                @click="openFile(item.url)"
                class="flex-1 text-center text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Open
              </button>
              <a
                :href="item.url"
                download
                class="flex-1 text-center text-xs px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div class="aspect-square bg-slate-200 dark:bg-slate-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div class="flex gap-2">
              <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex-1"></div>
              <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && !filteredItems.length" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <svg class="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200">No media has been uploaded yet</h3>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Upload your first file to get started.</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200">Failed to load media</h3>
        <p class="mt-2 text-slate-500 dark:text-slate-400">{{ error }}</p>
        <button
          @click="fetchMedia"
          class="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/30 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && filteredItems.length" class="mt-8 flex justify-center">
        <nav class="flex items-center gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!pagination.prev_page_url"
            class="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
          </span>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!pagination.next_page_url"
            class="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </nav>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          @click.self="closeLightbox"
        >
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <button
            v-if="lightboxIndex > 0"
            @click="navigateLightbox(-1)"
            class="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Previous"
          >
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <button
            v-if="lightboxIndex < imageItems.length - 1"
            @click="navigateLightbox(1)"
            class="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Next"
          >
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <img
            v-if="currentLightboxItem"
            :src="currentLightboxItem.url"
            :alt="currentLightboxItem.alt_text || currentLightboxItem.original_filename"
            class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../../services/api.js';

// State
const mediaItems = ref([]);
const pagination = ref(null);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const activeFilter = ref('all');
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

// Filters
const filters = [
  { key: 'all', label: 'All' },
  { key: 'images', label: 'Images' },
  { key: 'videos', label: 'Videos' },
  { key: 'pdfs', label: 'PDFs' },
  { key: 'documents', label: 'Documents' }
];

// Helper functions
const isImage = (item) => item.mime_type?.startsWith('image/') || false;
const isVideo = (item) => item.mime_type?.startsWith('video/') || false;
const isPdf = (item) => item.mime_type === 'application/pdf';
const isDocument = (item) => {
  if (!item.mime_type) return false;
  return !isImage(item) && !isVideo(item) && !isPdf(item);
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = (bytes / Math.pow(k, i)).toFixed(1);
  return `${size} ${units[i]}`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getFileExtension = (filename) => {
  if (!filename) return '';
  const ext = filename.split('.').pop();
  return ext.toUpperCase();
};

// Computed
const filteredItems = computed(() => {
  let items = mediaItems.value;

  // Apply search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    items = items.filter(item =>
      item.original_filename?.toLowerCase().includes(query) ||
      item.filename?.toLowerCase().includes(query)
    );
  }

  // Apply filter
  if (activeFilter.value === 'images') {
    items = items.filter(isImage);
  } else if (activeFilter.value === 'videos') {
    items = items.filter(isVideo);
  } else if (activeFilter.value === 'pdfs') {
    items = items.filter(isPdf);
  } else if (activeFilter.value === 'documents') {
    items = items.filter(item => isDocument(item) || isPdf(item));
  }

  return items;
});

const imageItems = computed(() => mediaItems.value.filter(isImage));

const currentLightboxItem = computed(() => {
  if (lightboxIndex.value >= 0 && lightboxIndex.value < imageItems.value.length) {
    return imageItems.value[lightboxIndex.value];
  }
  return null;
});

const stats = computed(() => {
  const total = mediaItems.value.length;
  const images = mediaItems.value.filter(isImage).length;
  const videos = mediaItems.value.filter(isVideo).length;
  const documents = mediaItems.value.filter(item => isDocument(item) || isPdf(item)).length;
  return { total, images, videos, documents };
});

// Methods
const fetchMedia = async (url = null) => {
  loading.value = true;
  error.value = null;

  try {
    const endpoint = url || '/tenant/website/media';
    const response = await api().get(endpoint);

    if (response.data?.data?.data) {
      mediaItems.value = response.data.data.data;
      pagination.value = response.data.data;
    } else {
      mediaItems.value = [];
      pagination.value = null;
    }
  } catch (err) {
    error.value = err.message || 'Failed to load media. Please try again.';
    mediaItems.value = [];
    pagination.value = null;
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (!pagination.value) return;
  const url = page > 0 && page <= pagination.value.last_page
    ? `/tenant/website/media?page=${page}`
    : null;
  if (url) {
    fetchMedia(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const openLightbox = (item) => {
  const index = imageItems.value.findIndex(i => i.id === item.id);
  if (index !== -1) {
    lightboxIndex.value = index;
    lightboxOpen.value = true;
  }
};

const closeLightbox = () => {
  lightboxOpen.value = false;
};

const navigateLightbox = (direction) => {
  const newIndex = lightboxIndex.value + direction;
  if (newIndex >= 0 && newIndex < imageItems.value.length) {
    lightboxIndex.value = newIndex;
  }
};

const openFile = (url) => {
  window.open(url, '_blank');
};

// Keyboard events
const handleKeydown = (e) => {
  if (lightboxOpen.value) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  }
};

// Lifecycle
onMounted(() => {
  fetchMedia();
  document.addEventListener('keydown', handleKeydown);
});

// Cleanup
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom grid breakpoints */
@media (min-width: 480px) {
  .xs\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>