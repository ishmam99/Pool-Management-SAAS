<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center p-8">
      <div class="max-w-3xl w-full bg-white rounded-2xl p-12 shadow-2xl">
        <div class="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-3/4 mb-4" :style="shimmerStyle"></div>
        <div class="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 mb-8" :style="shimmerStyle"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full" :style="shimmerStyle"></div>
          <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full" :style="shimmerStyle"></div>
          <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/5" :style="shimmerStyle"></div>
          <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full" :style="shimmerStyle"></div>
          <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full" :style="shimmerStyle"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center p-8">
      <div class="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Unable to Load Page</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="fetchPage" 
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Page Not Found -->
    <div v-else-if="!pageData" class="min-h-screen flex items-center justify-center p-8">
      <div class="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
        <div class="text-6xl mb-4">📄</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p class="text-gray-600">The page you're looking for doesn't exist or hasn't been published yet.</p>
      </div>
    </div>

    <!-- Page Content -->
    <div v-else class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 px-8 shadow-lg">
        <div class="max-w-7xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            {{ pageData.title }}
          </h1>
          <p v-if="pageData.meta_description" class="text-xl text-white/90 mt-4 leading-relaxed">
            {{ pageData.meta_description }}
          </p>
        </div>
      </section>

      <!-- Content Section -->
      <section class="py-12 px-8">
        <div class="max-w-11/12 mx-auto">
          <div class="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <!-- Page content rendered with custom CSS styling -->
            <div class="page-content" v-html="sanitizedContent"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../../../services/api.js'

const route = useRoute()
const loading = ref(false)
const error = ref(null)
const pageData = ref(null)
const pages = ref([])

// Shimmer animation style
const shimmerStyle = {
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite'
}

// Computed property to safely decode and sanitize HTML content
const sanitizedContent = computed(() => {
  if (!pageData.value || !pageData.value.content) return ''

  let content = pageData.value.content

  content = content
    .replace(/\\\//g, '/')       // Unescape \/ -> /
    .replace(/\\r\\n/g, '\n')    // Replace \r\n with newline
    .replace(/\\r/g, '\n')       // Replace \r with newline
    .replace(/\\n/g, '\n')       // Replace \n with newline
    .replace(/&lt;/g, '<')       // Replace &lt; with 
    .replace(/&gt;/g, '>')       // Replace &gt; with >
    .replace(/&amp;/g, '&')      // Replace &amp; with &
    .replace(/&quot;/g, '"')     // Replace &quot; with "
    .replace(/&#39;/g, "'")      // Replace &#39; with '
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '')       // Remove empty paragraphs (incl. <p><br></p>)
    .replace(/<h[1-6]>\s*(<br\s*\/?>)?\s*<\/h[1-6]>/gi, '') // Remove empty headings (incl. <h3><br></h3>)

  return content
})

// Fetch page data
const fetchPage = async () => {
  const pageType = route.params.id

  if (!pageType) {
    error.value = 'Invalid page type'
    return
  }

  loading.value = true
  error.value = null
  pageData.value = null

  try {
    const response = await api().get(`/tenant/website/pages?page_type=${pageType}`)

    if (response.data?.success && Array.isArray(response.data.data.data)) {
      pages.value = response.data.data.data

      if (pages.value.length === 0) {
        pageData.value = null
      } else {
        // Find published page or fallback to first
        const publishedPage = pages.value.find(page => page.status == 'published')
        pageData.value = publishedPage || pages.value[0]

        // Log for debugging
        console.log('Page data loaded:', pageData.value)
        console.log('Raw content:', pageData.value?.content)
      }
    } else {
      error.value = 'Invalid response format'
    }
  } catch (err) {
    console.error('Error fetching page:', err)
    error.value = err.response?.data?.message || 'Failed to load page. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watch for route changes
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchPage()
    }
  }
)

// Fetch on mount
onMounted(() => {
  fetchPage()
})
</script>

<style scoped>
/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Page Content Styles - Modern Article Design */
.page-content {
  color: #1a202c;
  font-size: 1.125rem;
  line-height: 1.75;
  max-width: 100%;
}

/* Quill editor leftover markup - hide */
.page-content :deep(.ql-ui) {
  display: none;
}

/* Headings */
.page-content :deep(h1),
.page-content :deep(h2),
.page-content :deep(h3),
.page-content :deep(h4),
.page-content :deep(h5),
.page-content :deep(h6) {
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  scroll-margin-top: 2rem;
}

.page-content :deep(h1) {
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.page-content :deep(h2) {
  font-size: 2rem;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.page-content :deep(h3) {
  font-size: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.page-content :deep(h4) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.page-content :deep(h5) {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.page-content :deep(h6) {
  font-size: 1.125rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Paragraphs */
.page-content :deep(p) {
  margin-bottom: 1.5rem;
  color: #2d3748;
  line-height: 1.8;
}

.page-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* Strong / Bold */
.page-content :deep(strong) {
  font-weight: 600;
  color: #1a202c;
}

/* Emphasis / Italic */
.page-content :deep(em) {
  font-style: italic;
  color: #2d3748;
}

/* Links */
.page-content :deep(a) {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.page-content :deep(a::after) {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4f46e5;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.page-content :deep(a:hover) {
  color: #4338ca;
}

.page-content :deep(a:hover::after) {
  transform: scaleX(1);
}

/* Lists */
.page-content :deep(ul),
.page-content :deep(ol) {
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  color: #2d3748;
}

.page-content :deep(ul) {
  list-style-type: disc;
}

.page-content :deep(ol) {
  list-style-type: decimal;
}

.page-content :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.page-content :deep(li:last-child) {
  margin-bottom: 0;
}

.page-content :deep(ul ul),
.page-content :deep(ol ol),
.page-content :deep(ul ol),
.page-content :deep(ol ul) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Blockquotes */
.page-content :deep(blockquote) {
  border-left: 4px solid #4f46e5;
  background-color: #eef2ff;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  font-style: normal;
  font-weight: 500;
  color: #2d3748;
  transition: background-color 0.2s ease;
}

.page-content :deep(blockquote:hover) {
  background-color: #e0e7ff;
}

.page-content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

/* Tables */
.page-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.page-content :deep(thead) {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
}

.page-content :deep(th) {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
}

.page-content :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.page-content :deep(tbody tr:nth-child(even)) {
  background-color: #f8fafc;
}

.page-content :deep(tbody tr:hover) {
  background-color: #f1f5f9;
  transition: background-color 0.2s ease;
}

.page-content :deep(tbody tr:last-child td) {
  border-bottom: none;
}

/* Images */
.page-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
  transition: transform 0.3s ease-in-out;
}

.page-content :deep(img:hover) {
  transform: scale(1.01);
}

/* Code (inline) */
.page-content :deep(code) {
  background-color: #f1f5f9;
  color: #1e293b;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Andale Mono', monospace;
  font-feature-settings: "ss02" on;
}

/* Code blocks */
.page-content :deep(pre) {
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Andale Mono', monospace;
  font-feature-settings: "ss02" on;
}

.page-content :deep(pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
}

/* Horizontal Rule */
.page-content :deep(hr) {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 3rem 0;
  background: none;
}

/* Ensure proper spacing between all elements */
.page-content :deep(* + *) {
  margin-top: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-content {
    font-size: 1rem;
  }

  .page-content :deep(h1) {
    font-size: 2rem;
  }

  .page-content :deep(h2) {
    font-size: 1.75rem;
  }

  .page-content :deep(h3) {
    font-size: 1.5rem;
  }

  .page-content :deep(h4) {
    font-size: 1.25rem;
  }

  .page-content :deep(table) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .page-content :deep(blockquote) {
    padding: 0.75rem 1rem;
  }

  .page-content :deep(pre) {
    padding: 1rem;
    font-size: 0.8125rem;
  }

  .page-content :deep(img) {
    border-radius: 0.5rem;
  }
}

@media (min-width: 768px) {
  .page-content :deep(h1) {
    font-size: 3rem;
  }

  .page-content :deep(h2) {
    font-size: 2.5rem;
  }

  .page-content :deep(h3) {
    font-size: 2rem;
  }

  .page-content :deep(h4) {
    font-size: 1.75rem;
  }
}

/* Fix for last child margin */
.page-content > :deep(*:last-child) {
  margin-bottom: 0;
}
</style>