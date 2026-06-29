<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/40 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-image-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Service Photos</h1>
          <p class="text-gray-500">Photos from your pool service visits.</p>
        </div>
      </header>

      <div class="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <div class="text-5xl mb-4">📷</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
        <p class="text-gray-500 max-w-md mx-auto">
          Service photos from your technician visits will be available here. Check your pool service history for visit details in the meantime.
        </p>
        <router-link
          to="/customer/pools"
          class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
        >
          <i class="ri-drop-line"></i>
          View My Pools
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
