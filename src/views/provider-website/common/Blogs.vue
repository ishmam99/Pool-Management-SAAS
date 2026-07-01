<template>
  <main class="blog-page">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-sky-600 to-cyan-500 py-20 md:py-28 overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
        <span class="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full backdrop-blur-sm mb-4">
          Pool Management Insights
        </span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-4xl mx-auto">
          Learn Smarter Ways To Manage Pools & Grow Your Business
        </h1>
        <p class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Explore expert tips, maintenance guides, and industry insights to help pool professionals and owners manage their pools efficiently.
        </p>
      </div>
    </section>

    <!-- Featured Blog Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-slate-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <!-- Featured Image -->
          <div class="relative h-64 md:h-80 lg:h-full bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-black/10"></div>
            <i class="ri-water-flash-line text-7xl md:text-9xl text-white/80"></i>
            <span class="absolute top-4 left-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold uppercase px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
          
          <!-- Featured Content -->
          <div class="p-6 md:p-8 lg:p-10">
            <span class="inline-block text-xs font-semibold text-sky-600 uppercase tracking-wider mb-3">Featured Article</span>
            <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              How Technology Is Changing The Swimming Pool Management Industry
            </h2>
            <p class="text-slate-600 leading-relaxed mb-6">
              Discover how modern software solutions help pool businesses automate operations, improve customer service, and increase efficiency.
            </p>
            <a href="#" class="inline-flex items-center text-sky-600 font-semibold hover:text-blue-600 transition-colors group">
              Read Article
              <i class="ri-arrow-right-line ml-2 transition-transform group-hover:translate-x-1"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Categories Section -->
    <section class="py-12 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            @click="selectedCategory = 'all'"
            class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="selectedCategory === 'all' 
              ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30' 
              : 'bg-white text-slate-700 hover:bg-slate-100'"
          >
            All Categories
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
            :class="selectedCategory === category.id 
              ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30' 
              : 'bg-white text-slate-700 hover:bg-slate-100'"
          >
            <i :class="category.icon"></i>
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Search & Filter Area -->
    <section class="py-8 bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="relative w-full md:w-80">
            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search articles..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
          <div class="text-sm text-slate-500">
            Showing {{ filteredBlogs.length }} articles
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Articles Grid -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div v-if="filteredBlogs.length === 0" class="text-center py-16">
          <i class="ri-file-search-line text-6xl text-slate-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-slate-700">No articles found</h3>
          <p class="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="blog in filteredBlogs"
            :key="blog.id"
            class="group bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <!-- Blog Image -->
            <div class="relative h-48 overflow-hidden bg-gradient-to-br from-sky-400/30 to-cyan-300/30">
              <div class="absolute inset-0 flex items-center justify-center">
                <i :class="blog.icon" class="text-5xl text-sky-500/40"></i>
              </div>
              <span class="absolute top-3 left-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {{ blog.category }}
              </span>
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            
            <!-- Blog Content -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                {{ blog.title }}
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {{ blog.description }}
              </p>
              
              <!-- Author & Date -->
              <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                    {{ blog.author.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-xs font-medium text-slate-700">{{ blog.author }}</p>
                    <p class="text-xs text-slate-400">{{ blog.date }}</p>
                  </div>
                </div>
                <a href="#" class="text-sky-600 hover:text-blue-600 transition-colors text-sm font-medium group/read">
                  Read More
                  <i class="ri-arrow-right-line inline-block ml-1 transition-transform group-hover/read:translate-x-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto px-4 md:px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
          Stay Updated With Pool Industry Insights
        </h2>
        <p class="text-lg text-white/90 mb-8">
          Subscribe to receive the latest pool management tips, business strategies, and technology updates.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-5 py-3.5 rounded-full border-0 focus:ring-2 focus:ring-white/50 placeholder:text-slate-400"
          />
          <button class="px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

// Categories
const categories = [
  { id: 'maintenance', name: 'Pool Maintenance', icon: 'ri-water-flash-line' },
  { id: 'business', name: 'Pool Business Tips', icon: 'ri-building-line' },
  { id: 'technology', name: 'Technology', icon: 'ri-computer-line' },
  { id: 'water-quality', name: 'Water Quality', icon: 'ri-test-tube-line' },
  { id: 'customer-management', name: 'Customer Management', icon: 'ri-user-community-line' },
]

// Blog Data
const blogs = [
  {
    id: 1,
    title: '10 Essential Pool Maintenance Tips Every Owner Should Know',
    description: 'Learn the basic maintenance practices that keep swimming pools clean, safe, and long-lasting.',
    category: 'Pool Maintenance',
    categoryId: 'maintenance',
    icon: 'ri-water-flash-line',
    date: 'December 15, 2024',
    author: 'Sarah Johnson',
  },
  {
    id: 2,
    title: 'How Pool Service Companies Can Increase Their Revenue',
    description: 'Discover strategies that help pool businesses manage more customers and improve profitability.',
    category: 'Business Growth',
    categoryId: 'business',
    icon: 'ri-line-chart-line',
    date: 'December 12, 2024',
    author: 'Michael Chen',
  },
  {
    id: 3,
    title: 'Why Pool Management Software Is The Future',
    description: 'Understand how automation tools are transforming pool service operations.',
    category: 'Technology',
    categoryId: 'technology',
    icon: 'ri-cloud-line',
    date: 'December 10, 2024',
    author: 'Emily Rodriguez',
  },
  {
    id: 4,
    title: 'Maintaining Perfect Water Quality Throughout The Year',
    description: 'A complete guide to monitoring chemicals and keeping pools healthy.',
    category: 'Water Quality',
    categoryId: 'water-quality',
    icon: 'ri-flask-line',
    date: 'December 8, 2024',
    author: 'David Thompson',
  },
  {
    id: 5,
    title: 'Managing Multiple Swimming Pools Efficiently',
    description: 'How professional service providers organize hundreds of pools with modern tools.',
    category: 'Pool Business',
    categoryId: 'business',
    icon: 'ri-building-4-line',
    date: 'December 5, 2024',
    author: 'Lisa Park',
  },
  {
    id: 6,
    title: 'Building Better Relationships With Pool Customers',
    description: 'Improve customer satisfaction through communication and service tracking.',
    category: 'Customer Management',
    categoryId: 'customer-management',
    icon: 'ri-user-heart-line',
    date: 'December 3, 2024',
    author: 'James Wilson',
  },
  {
    id: 7,
    title: 'The Ultimate Guide To Pool Chemical Balance',
    description: 'Everything you need to know about maintaining proper chemical levels in swimming pools.',
    category: 'Water Quality',
    categoryId: 'water-quality',
    icon: 'ri-beaker-line',
    date: 'November 28, 2024',
    author: 'Maria Garcia',
  },
  {
    id: 8,
    title: '5 Ways Technology Is Simplifying Pool Maintenance',
    description: 'How smart sensors and automation are making pool care easier than ever.',
    category: 'Technology',
    categoryId: 'technology',
    icon: 'ri-smartphone-line',
    date: 'November 25, 2024',
    author: 'Alex Turner',
  },
  {
    id: 9,
    title: 'Scaling Your Pool Service Business: A Step-by-Step Guide',
    description: 'Practical strategies for growing your pool management company sustainably.',
    category: 'Pool Business',
    categoryId: 'business',
    icon: 'ri-rocket-line',
    date: 'November 20, 2024',
    author: 'Rachel Adams',
  },
]

// Search & Filter
const searchQuery = ref('')
const selectedCategory = ref('all')

// Computed filtered blogs
const filteredBlogs = computed(() => {
  let result = blogs
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(blog => blog.categoryId === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(blog => 
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query)
    )
  }
  
  return result
})
</script>

<style scoped>
/* Import Remix Icon CDN (if not already imported globally) */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

/* Line clamp utility for multiline truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>