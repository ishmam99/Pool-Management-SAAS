<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-sky-100/80 rounded-lg shadow p-4 border border-gray-100">
      <p class="text-sm text-gray-500">Total Invoices</p>
      <p class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</p>
    </div>
    <div class="bg-indigo-100/80 rounded-lg shadow p-4 border border-gray-100">
      <p class="text-sm text-gray-500">Sent</p>
      <p class="text-2xl font-bold text-yellow-600">{{ stats.sent || 0 }}</p>
    </div>
    <div class="bg-cyan-100/80 rounded-lg shadow p-4 border border-gray-100">
      <p class="text-sm text-gray-500">Paid</p>
      <p class="text-2xl font-bold text-green-600">{{ stats.paid || 0 }}</p>
    </div>
    <div class="bg-pink-100/80 rounded-lg shadow p-4 border border-gray-100">
      <p class="text-sm text-gray-500">Total Amount</p>
      <p class="text-2xl font-bold text-blue-600">${{ stats.totalAmount || '0.00' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      total: 0,
      sent: 0,
      paid: 0,
      totalAmount: '0.00'
    })
  }
})
</script>