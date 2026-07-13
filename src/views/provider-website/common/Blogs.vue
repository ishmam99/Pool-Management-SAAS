<template>
  <div class="min-h-screen bg-white">
    <!-- ============================================================ -->
    <!-- HERO SECTION                                                  -->
    <!-- ============================================================ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 py-20 lg:py-28">
      <!-- Decorative blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <!-- Hero image background -->
      <div class="absolute inset-0 opacity-20">
        <img
        src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1920&h=800&fit=crop&crop=center&auto=format"
        alt="Luxury swimming pool"
        class="w-full h-full object-cover"
        />
      </div>

      <div class="relative z-10 container mx-auto px-4 text-center">
        <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-5 border border-white/10">
          Pool Care Tips & Expert Advice
        </span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 max-w-4xl mx-auto">
          Pool Care Tips From <span class="text-sky-200">Aqua Clean Pools</span>
        </h1>
        <p class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Discover professional advice on pool cleaning, water chemistry, seasonal maintenance, equipment care, and everything you need to keep your swimming pool crystal clear all year long.
        </p>
       
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- FEATURED ARTICLE                                              -->
    <!-- ============================================================ -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-slate-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100">
          <!-- Featured Image -->
          <div class="relative h-72 lg:h-full min-h-[320px] overflow-hidden">
            <img
            src="../../../assets/provider/img7.jpg"
            alt="Crystal clear luxury backyard pool"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <span class="absolute top-4 left-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              Featured
            </span>
            <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              8 min read
            </div>
          </div>

          <!-- Featured Content -->
          <div class="p-6 md:p-8 lg:p-10 space-y-4">
            <span class="inline-block text-xs font-bold text-sky-600 uppercase tracking-wider">Featured Article</span>
            <h2 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              The Ultimate Guide To Keeping Your Pool Crystal Clear All Year
            </h2>
            <p class="text-slate-600 leading-relaxed">
              Learn the essential weekly, monthly, and seasonal maintenance tasks that protect your investment and keep your pool safe for family and guests.
            </p>
            <div class="flex items-center gap-4 pt-2">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">Aqua Clean Pools Team</p>
                <p class="text-xs text-slate-400">December 20, 2024</p>
              </div>
            </div>
            <a href="#" class="inline-flex items-center text-sky-600 font-semibold hover:text-blue-600 transition-colors group mt-2">
              Read Full Article
              <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- CATEGORIES                                                    -->
    <!-- ============================================================ -->
    <section class="py-10 bg-slate-50 border-y border-slate-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
          @click="selectedCategory = 'all'"
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="selectedCategory === 'all'
          ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30'
          : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'"
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
        : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'"
        >
        <i :class="category.icon" class="text-base"></i>
        {{ category.name }}
      </button>
    </div>
  </div>
</section>

<!-- ============================================================ -->
<!-- SEARCH & MAIN CONTENT + SIDEBAR                              -->
<!-- ============================================================ -->
<section class="py-12 bg-slate-50">
  <div class="container mx-auto px-4">
    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Main Content -->
      <div class="lg:w-2/3">
        <!-- Search Bar -->
        <div class="relative mb-8">
          <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
          <input
          v-model="searchQuery"
          type="text"
          placeholder="Search pool care articles..."
          class="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 shadow-sm text-slate-800"
          />
        </div>

        <!-- Results count -->
        <div class="text-sm text-slate-500 mb-6">
          Showing {{ filteredBlogs.length }} article{{ filteredBlogs.length !== 1 ? 's' : '' }}
        </div>

        <!-- Blog Grid -->
        <div v-if="filteredBlogs.length === 0" class="text-center py-16 bg-white rounded-3xl shadow-sm">
          <i class="ri-file-search-line text-6xl text-slate-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-slate-700">No articles found</h3>
          <p class="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div
          v-for="blog in filteredBlogs"
          :key="blog.id"
          class="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-slate-100"
          >
          <!-- Blog Image -->
          <router-link :to="`/provider-website/blogs/${blog.id}`">
          <div class="relative h-52 overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-50">
            <img
            :src="blog.image"
            :alt="blog.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span v-if="blog.category" class="absolute top-3 left-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
              {{ blog.category }}
            </span>
            <div class="absolute bottom-3 left-3 flex items-center gap-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ blog.readTime }} min read
            </div>
          </div>

          <!-- Blog Content -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
              {{ blog.title }}
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
              {{ blog.description }}
            </p>

            <!-- Author & Date -->
            <div class="flex items-center justify-between border-t border-slate-100 pt-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                  {{ (blog.author || 'A').charAt(0) }}
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-800">{{ blog.author || 'Admin' }}</p>
                  <p class="text-[10px] text-slate-400">{{ blog.date }}</p>
                </div>
              </div>
              <span class="text-sky-600 text-sm font-semibold group-hover:text-blue-600 flex items-center">
                Read More
                <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SIDEBAR                                                       -->
    <!-- ============================================================ -->
    <aside class="lg:w-1/3 space-y-8">
      <!-- Categories Widget -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <i class="ri-folder-3-line text-sky-600"></i>
          Categories
        </h3>
        <ul class="space-y-2.5">
          <li v-for="cat in categories" :key="cat.id"
          @click="selectedCategory = cat.id"
          class="flex items-center justify-between cursor-pointer text-sm text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-xl hover:bg-sky-50"
          :class="selectedCategory === cat.id ? 'text-sky-600 bg-sky-50 font-medium' : ''"
          >
          <span class="flex items-center gap-2.5">
            <i :class="cat.icon" class="text-base"></i>
            {{ cat.name }}
          </span>
          <span class="text-xs text-slate-400">{{ cat.count }}</span>
        </li>
      </ul>
    </div>

    <!-- Popular Posts -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <i class="ri-fire-line text-orange-500"></i>
        Popular Posts
      </h3>
      <ul class="space-y-4">
        <li v-for="post in popularPosts" :key="post.id" class="group cursor-pointer">
          <a href="#" class="flex gap-4 items-start">
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2">{{ post.title }}</h4>
              <p class="text-xs text-slate-400 mt-1">{{ post.date }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- Recent Posts -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <i class="ri-time-line text-sky-600"></i>
        Recent Posts
      </h3>
      <ul class="space-y-3">
        <li v-for="post in recentPosts" :key="post.id" class="group cursor-pointer">
          <a href="#" class="flex gap-3 items-center">
            <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <h4 class="text-sm font-medium text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2">{{ post.title }}</h4>
              <p class="text-[10px] text-slate-400 mt-0.5">{{ post.date }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- Service CTA Sidebar -->
    <div class="bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl p-6 text-white shadow-xl shadow-sky-500/20">
      <h3 class="text-xl font-bold mb-2">Need Professional Pool Service?</h3>
      <p class="text-sky-100 text-sm leading-relaxed mb-5">
        Book your free inspection today and enjoy a crystal clear pool all year.
      </p>
      <button class="w-full py-3 bg-white text-sky-700 font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        Book Free Inspection
      </button>
      <div class="mt-4 pt-4 border-t border-white/20 text-center">
        <p class="text-sm text-sky-100">Emergency Repairs</p>
        <p class="text-lg font-bold">(555) 123-4567</p>
      </div>
    </div>
  </aside>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- SEASONAL POOL MAINTENANCE                                     -->
<!-- ============================================================ -->
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <span class="text-sky-600 font-bold text-sm tracking-widest uppercase">Seasonal Care</span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Seasonal Pool Maintenance</h2>
      <p class="text-slate-600">Expert tips for every season to keep your pool in perfect condition year-round.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="season in seasonalTips" :key="season.title"
      class="group bg-slate-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
      <div class="relative h-44 overflow-hidden">
        <img :src="season.image" :alt="season.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
        <div class="absolute bottom-4 left-4 text-white">
          <span class="text-3xl">{{ season.icon }}</span>
        </div>
      </div>
      <div class="p-5">
        <h3 class="text-lg font-bold text-slate-900 mb-1.5">{{ season.title }}</h3>
        <p class="text-sm text-slate-600 leading-relaxed">{{ season.description }}</p>
        <a href="#" class="inline-flex items-center text-sky-600 font-semibold text-sm mt-3 hover:text-blue-600 transition-colors group/link">
          Learn More
          <svg class="w-4 h-4 ml-1.5 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>
</section>

<!-- ============================================================ -->
<!-- POPULAR SERVICES                                              -->
<!-- ============================================================ -->
<section class="py-16 bg-slate-50">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <span class="text-sky-600 font-bold text-sm tracking-widest uppercase">Our Services</span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Popular Pool Services</h2>
      <p class="text-slate-600">Explore the professional services we offer to keep your pool pristine.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="service in popularServices" :key="service.title"
      class="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 text-center">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        <span class="text-3xl">{{ service.icon }}</span>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-1.5">{{ service.title }}</h3>
      <p class="text-sm text-slate-600 leading-relaxed">{{ service.description }}</p>
      <button class="mt-4 text-sm font-semibold text-sky-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 group/btn">
        Learn More
        <svg class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </button>
    </div>
  </div>
</div>
</section>

<!-- ============================================================ -->
<!-- NEWSLETTER                                                    -->
<!-- ============================================================ -->
<section class="py-20 relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600">
  <!-- Wave pattern overlay -->
  <div class="absolute inset-0 opacity-10 pointer-events-none">
    <svg class="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
  </div>

  <div class="relative z-10 container mx-auto px-4 text-center max-w-3xl">
    <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
      Newsletter
    </span>
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
      Get Monthly Pool Care Tips
    </h2>
    <p class="text-lg text-white/90 mb-8 leading-relaxed">
      Join thousands of pool owners receiving seasonal maintenance reminders, expert advice, and exclusive service offers.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
      <input
      type="email"
      placeholder="Enter your email address"
      class="flex-1 px-5 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-white/50 placeholder:text-slate-400 text-slate-800 shadow-lg"
      />
      <button class="px-8 py-3.5 bg-white text-sky-700 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
        Subscribe
      </button>
    </div>
    <p class="text-sm text-white/60 mt-4">No spam. Unsubscribe anytime.</p>
  </div>
</section>

<!-- ============================================================ -->
<!-- BOTTOM CTA                                                    -->
<!-- ============================================================ -->
<section class="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
  <!-- Decorative waves -->
  <div class="absolute inset-0 opacity-5 pointer-events-none">
    <svg class="absolute top-0 left-0 w-full h-32" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
    <svg class="absolute bottom-0 left-0 w-full h-32 rotate-180" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
  </div>

  <div class="relative z-10 container mx-auto px-4 text-center max-w-3xl">
    <!-- Glass card -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
        Need Help Keeping Your Pool Perfect?
      </h2>
      <p class="text-slate-300 text-lg leading-relaxed mb-8">
        Let Aqua Clean Pools handle the cleaning, maintenance, repairs, and water balancing while you enjoy a clean, safe swimming pool.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="group px-10 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          Book Service
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
        <button class="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
          Free Quote
        </button>
      </div>
      <p class="text-sm text-slate-400 mt-6">
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Fully licensed & insured
        </span>
        <span class="mx-3 text-slate-600">|</span>
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          100% satisfaction guaranteed
        </span>
      </p>
    </div>
  </div>
</section>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import img7 from '../../../assets/provider/img7.jpg'
import { tenantWebsiteApi, normalizeList } from '../../../services/tenantWebsiteApi.js'
import { formatDate } from '../utils/formatters.js'

const loading = ref(true)

const mapPost = (post) => ({
  id: post.id,
  title: post.title,
  description: post.excerpt || '',
  category: post.categories?.[0]?.name || post.categories?.[0] || '',
  categoryId: post.categories?.[0]?.id || post.categories?.[0] || 'all',
  image: post.featured_image_url || img7,
  date: formatDate(post.published_at),
  author: post.author?.name || post.author || 'Admin',
  readTime: post.reading_time || 5,
})

// ─── Categories ──────────────────────────────────────────────────
const categories = ref([
  { id: 'cleaning', name: 'Pool Cleaning', icon: 'ri-water-flash-line', count: 12 },
  { id: 'chemistry', name: 'Water Chemistry', icon: 'ri-flask-line', count: 8 },
  { id: 'equipment', name: 'Equipment Care', icon: 'ri-tools-line', count: 6 },
  { id: 'seasonal', name: 'Seasonal Tips', icon: 'ri-calendar-2-line', count: 9 },
  { id: 'repairs', name: 'Repairs', icon: 'ri-wrench-screwdriver-line', count: 5 },
  { id: 'commercial', name: 'Commercial Pools', icon: 'ri-building-4-line', count: 4 },
  { id: 'safety', name: 'Safety', icon: 'ri-shield-check-line', count: 7 },
  { id: 'energy', name: 'Energy Savings', icon: 'ri-flashlight-line', count: 3 },
  { id: 'buying', name: 'Buying Guides', icon: 'ri-shopping-bag-3-line', count: 4 },
])

// ─── Blog Posts ──────────────────────────────────────────────────
const blogs = ref([])

const loadBlogs = async () => {
  loading.value = true
  try {
    const res = await tenantWebsiteApi.getBlog({ per_page: 50 })
    blogs.value = normalizeList(res).map(mapPost)
    if (blogs.value.length) {
      popularPosts.value = blogs.value.slice(0, 3).map((b) => ({ id: b.id, title: b.title, date: b.date, image: b.image }))
      recentPosts.value = blogs.value.slice(0, 3).map((b) => ({ id: b.id, title: b.title, date: b.date, image: b.image }))
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadBlogs)

// ─── Popular Posts ──────────────────────────────────────────────
const popularPosts = ref([])

// ─── Recent Posts ──────────────────────────────────────────────
const recentPosts = ref([])

// ─── Seasonal Tips ─────────────────────────────────────────────
const seasonalTips = ref([
  {
    icon: '🌸',
    title: 'Spring Pool Opening',
    description: 'Expert steps to safely open your pool and prepare for the swimming season.',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop&crop=center&auto=format',
  },
  {
    icon: '☀️',
    title: 'Summer Care Tips',
    description: 'Keep your pool cool, clean, and safe during the hottest months of the year.',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop&crop=center&auto=format',
  },
  {
    icon: '🍂',
    title: 'Fall Maintenance',
    description: 'Protect your pool from leaves and prepare for cooler weather with professional care.',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=300&fit=crop&crop=center&auto=format',
  },
  {
    icon: '❄️',
    title: 'Winter Pool Closing',
    description: 'Proper winterization steps to protect your pool investment during the off-season.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop&crop=center&auto=format',
  },
])

// ─── Popular Services ──────────────────────────────────────────
const popularServices = ref([
  {
    icon: '🧹',
    title: 'Weekly Pool Cleaning',
    description: 'Comprehensive cleaning including skimming, vacuuming, and brushing.',
  },
  {
    icon: '💧',
    title: 'Chemical Balancing',
    description: 'Precise water testing and chemical adjustments for safe swimming.',
  },
  {
    icon: '🔧',
    title: 'Equipment Repair',
    description: 'Expert repairs for pumps, filters, heaters, and automation systems.',
  },
  {
    icon: '🟢',
    title: 'Green Pool Recovery',
    description: 'Fast and effective treatment to restore clarity and safety.',
  },
  {
    icon: '📋',
    title: 'Pool Inspections',
    description: 'Detailed evaluations to identify issues before they become problems.',
  },
  {
    icon: '🏢',
    title: 'Commercial Pool Service',
    description: 'Specialized care for hotels, apartments, HOAs, and fitness centers.',
  },
])

// ─── Search & Filter ────────────────────────────────────────────
const searchQuery = ref('')
const selectedCategory = ref('all')

const filteredBlogs = computed(() => {
  let result = blogs.value

  if (selectedCategory.value !== 'all') {
    result = result.filter(blog => blog.categoryId === selectedCategory.value)
  }

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
/* Import Remix Icon CDN */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

/* Line clamp utilities */
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

.container {
  max-width: 1280px;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>