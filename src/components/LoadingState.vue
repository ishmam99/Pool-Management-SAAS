<template>
  <div class="flex flex-col items-center justify-center py-16">
    <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p class="mt-4 text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>