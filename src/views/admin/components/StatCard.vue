<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div v-if="loading" class="space-y-3">
      <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      <div class="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </div>
    <template v-else>
      <p class="text-sm font-medium text-gray-600">{{ label }}</p>
      <p class="mt-2 text-2xl font-semibold text-gray-900">{{ value }}</p>
    </template>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>