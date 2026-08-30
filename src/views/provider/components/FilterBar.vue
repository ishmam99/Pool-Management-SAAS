<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="filter in filters" :key="filter.key">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ filter.label }}</label>
                <select v-if="filter.type === 'select'" 
                        :value="modelValue[filter.key]"
                        @change="$emit('update:modelValue', { ...modelValue, [filter.key]: $event.target.value })"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <option v-for="option in filter.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
                <input v-else-if="filter.type === 'date'" 
                       type="date" 
                       :value="modelValue[filter.key]"
                       @input="$emit('update:modelValue', { ...modelValue, [filter.key]: $event.target.value })"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                <input v-else 
                       type="text" 
                       :value="modelValue[filter.key]"
                       @input="$emit('update:modelValue', { ...modelValue, [filter.key]: $event.target.value })"
                       :placeholder="filter.placeholder || 'Search...'"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            </div>
        </div>
        <div class="mt-4 flex justify-end">
            <button @click="$emit('reset')" 
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Clear Filters
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    filters: {
        type: Array,
        required: true
    },
    modelValue: {
        type: Object,
        required: true
    }
});

defineEmits(['update:modelValue', 'reset']);
</script>