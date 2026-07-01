<script setup>
import Navbar from '../../../components/provider-layout/Navbar.vue'
import Footer from '../../../components/provider-layout/Footer.vue'
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