<template>
  <div v-if="pagination && pagination.last_page > 1" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
    <div class="text-sm text-gray-500">
      Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
    </div>
    <div class="flex gap-1">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="!pagination.prev_page_url"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      <button
        v-for="page in pagination.links"
        :key="page.label"
        @click="changePage(page.page)"
        v-if="page.page"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
        :class="page.active ? 'bg-blue-50 border-blue-500 text-blue-600' : ''"
      >
        {{ page.label }}
      </button>
      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="!pagination.next_page_url"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pagination: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const changePage = (page) => {
  if (page && page >= 1 && page <= props.pagination.last_page) {
    emit('page-change', page)
  }
}
</script>