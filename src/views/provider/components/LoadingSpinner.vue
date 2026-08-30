<template>
    <div class="flex flex-col items-center justify-center py-16">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-500">{{ message || 'Loading...' }}</p>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: 'Loading...'
    }
});
</script>