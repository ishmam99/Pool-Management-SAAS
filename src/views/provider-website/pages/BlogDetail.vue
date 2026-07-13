<template>
  <div class="py-12 lg:py-16 bg-white min-h-[60vh]">
    <div v-if="loading" class="max-w-3xl mx-auto px-4 text-center text-slate-500">Loading…</div>
    <article v-else-if="post" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <router-link to="/provider-website/blogs" class="text-sm font-medium mb-6 inline-block text-sky-600 hover:text-blue-600">
        ← Back to Blog
      </router-link>
      <img v-if="post.featured_image_url" :src="post.featured_image_url" :alt="post.title" class="w-full rounded-2xl mb-8 max-h-96 object-cover" />
      <h1 class="text-4xl font-bold text-slate-900 mb-4">{{ post.title }}</h1>
      <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-6">
        <span v-if="post.reading_time">{{ post.reading_time }} min read</span>
        <span v-if="post.published_at">{{ formatDate(post.published_at) }}</span>
      </div>
      <div v-if="post.categories?.length || post.tags?.length" class="flex flex-wrap gap-2 mb-8">
        <span v-for="cat in post.categories || []" :key="cat.id || cat" class="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600">{{ cat.name || cat }}</span>
        <span v-for="tag in post.tags || []" :key="tag.id || tag" class="px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-500">#{{ tag.name || tag }}</span>
      </div>
      <div class="prose-website" v-html="post.content" />
    </article>
    <div v-else class="max-w-3xl mx-auto px-4 text-center text-slate-500">
      Post not found.
      <router-link to="/provider-website/blogs" class="block mt-4 text-sky-600">Back to Blog</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tenantWebsiteApi } from '../../../services/tenantWebsiteApi.js'
import { formatDate } from '../utils/formatters.js'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

const load = async () => {
  loading.value = true
  post.value = null
  try {
    post.value = await tenantWebsiteApi.getBlogPost(route.params.id)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, load, { immediate: true })
</script>
