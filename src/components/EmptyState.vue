<template>
  <div class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
    <div class="text-5xl mb-4">
      <slot name="icon">📄</slot>
    </div>
    <h3 class="text-lg font-semibold text-gray-800">
      <slot name="title">No items found</slot>
    </h3>
    <p class="text-gray-500">
      <slot name="message">No records available.</slot>
    </p>
  </div>
</template>