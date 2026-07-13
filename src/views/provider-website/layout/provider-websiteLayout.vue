<script setup>
import { onMounted } from 'vue'
import { useWebsiteStore } from '../store/websiteStore.js'
import Navbar from '../../../components/provider-layout/Navbar.vue'
import Footer from '../../../components/provider-layout/Footer.vue'

const websiteStore = useWebsiteStore()

onMounted(() => {
  websiteStore.fetchWebsite()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
.prose-website h1, .prose-website h2, .prose-website h3 { font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; color: #0f172a; }
.prose-website p { margin-bottom: 1em; line-height: 1.75; color: #475569; }
.prose-website ul { list-style: disc; padding-left: 1.5em; margin-bottom: 1em; }
.prose-website a { color: #0284c7; }
</style>
