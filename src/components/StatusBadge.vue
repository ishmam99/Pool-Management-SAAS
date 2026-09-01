<template>
  <span :class="badgeClass" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
    {{ displayText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  customMap: {
    type: Object,
    default: () => ({})
  }
})

const statusMap = {
  // Invoice statuses
  'paid': 'bg-green-100 text-green-800',
  'sent': 'bg-yellow-100 text-yellow-800',
  'draft': 'bg-gray-100 text-gray-800',
  'overdue': 'bg-red-100 text-red-800',
  'void': 'bg-gray-100 text-gray-500',
  'cancelled': 'bg-gray-100 text-gray-500',
  'refunded': 'bg-gray-100 text-gray-600',
  
  // Payment statuses
  'completed': 'bg-emerald-100 text-emerald-700',
  'pending': 'bg-amber-100 text-amber-700',
  'failed': 'bg-red-100 text-red-700',
}

const badgeClass = computed(() => {
  return props.customMap[props.status] || statusMap[props.status] || 'bg-gray-100 text-gray-700'
})

const displayText = computed(() => {
  if (!props.status) return '—'
  return props.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
})
</script>