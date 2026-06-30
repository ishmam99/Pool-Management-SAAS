<template>
  <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
    <p class="text-xs font-semibold uppercase tracking-wide" :class="labelClass">{{ label }}</p>
    <p class="text-2xl font-bold mt-2" :class="valueClass">{{ value }}</p>
    <p v-if="hint" class="text-xs text-slate-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: 0 },
  hint: { type: String, default: '' },
  labelClass: { type: String, default: 'text-slate-500' },
  valueClass: { type: String, default: 'text-slate-900' },
})
</script>
