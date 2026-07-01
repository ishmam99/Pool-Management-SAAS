<template>
  <div class="min-h-screen flex flex-col">
    <Navbar :class="isProviderWebsite ? 'hidden' : ''" />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer :class="isProviderWebsite ? 'hidden' : ''" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const isProviderWebsite = computed(() => route.path.includes('/provider-website'))
</script>