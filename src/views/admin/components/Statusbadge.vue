```vue
<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClasses"
  >
    <span
      class="w-1.5 h-1.5 mr-1.5 rounded-full"
      :class="dotClasses"
    ></span>
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
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-50 text-yellow-700',
    dot: 'bg-yellow-400'
  },

  paid: {
    label: 'Paid',
    bg: 'bg-green-50 text-green-700',
    dot: 'bg-green-400'
  },

  overdue: {
    label: 'Overdue',
    bg: 'bg-red-50 text-red-700',
    dot: 'bg-red-400'
  },

  cancelled: {
    label: 'Cancelled',
    bg: 'bg-gray-50 text-gray-700',
    dot: 'bg-gray-400'
  }
}

const displayStatus = computed(() => {
  const status = (props.status || '').toLowerCase()
  return statusMap[status]?.label || props.status || 'Unknown'
})

const badgeClasses = computed(() => {
  const status = (props.status || '').toLowerCase()
  return statusMap[status]?.bg || 'bg-gray-50 text-gray-700'
})

const dotClasses = computed(() => {
  const status = (props.status || '').toLowerCase()
  return statusMap[status]?.dot || 'bg-gray-400'
})
</script>
```
