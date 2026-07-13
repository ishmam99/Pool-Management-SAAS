<template>
  <section v-if="posts.length" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-10">Latest from Our Blog</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <article v-for="post in posts" :key="post.id" class="rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <router-link :to="`/provider-website/blog/${post.id}`">
            <img
              v-if="post.featured_image_url"
              :src="post.featured_image_url"
              :alt="post.title"
              class="w-full h-48 object-cover"
            />
            <div v-else class="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">No image</div>
            <div class="p-5">
              <h3 class="font-semibold text-slate-900 mb-2 line-clamp-2">{{ post.title }}</h3>
              <p class="text-sm text-slate-600 line-clamp-3 mb-3">{{ post.excerpt }}</p>
              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span v-if="post.reading_time">{{ post.reading_time }} min read</span>
                <span v-if="post.published_at">{{ formatDate(post.published_at) }}</span>
              </div>
            </div>
          </router-link>
        </article>
      </div>
      <div class="text-center mt-8">
        <router-link
          to="/provider-website/blog"
          class="inline-block px-6 py-3 rounded-lg text-white font-semibold"
          :style="{ background: `linear-gradient(to right, var(--pw-primary), var(--pw-secondary))` }"
        >
          View All Posts
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tenantWebsiteApi, normalizeList } from '../../../../../services/tenantWebsiteApi.js'
import { formatDate } from '../../../utils/formatters.js'

const posts = ref([])

onMounted(async () => {
  try {
    const res = await tenantWebsiteApi.getBlog({ per_page: 3 })
    posts.value = normalizeList(res).slice(0, 3)
  } catch (e) {
    console.error(e)
  }
})
</script>
