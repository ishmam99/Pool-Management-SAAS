<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClasses"
  >
    <span class="w-1.5 h-1.5 mr-1.5 rounded-full" :class="dotClasses"></span>
    {{ displayStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusMap = {
  pending: { label: 'Pending', color: 'yellow', bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', dot: 'bg-yellow-400' },
  paid: { label: 'Paid', color: 'green', bg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', dot: 'bg-green-400' },
  overdue: { label: 'Overdue', color: 'red', bg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-400' },
  cancelled: { label: 'Cancelled', color: 'gray', bg: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-400' }
}

const displayStatus = computed(() => {
  const status = (props.status || '').toLowerCase()
  return statusMap[status]?.label || props.status || 'Unknown'
})

const badgeClasses = computed(() => {
  const status = (props.status || '').toLowerCase()
  return statusMap[status]?.bg || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
})

const dotClasses = computed(() => {
  const status = (props.status || '').toLowerCase()
  return statusMap[status]?.dot || 'bg-gray-400'
})
</script>