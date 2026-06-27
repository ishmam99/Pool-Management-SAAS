<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
    <div class="max-w-3xl mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-question-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p class="text-gray-500">Quick answers and ways to reach your service provider.</p>
        </div>
      </header>

      <div class="space-y-4 mb-8">
        <details v-for="faq in faqs" :key="faq.q" class="bg-white rounded-2xl shadow-sm border border-gray-100 group">
          <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
            {{ faq.q }}
            <i class="ri-arrow-down-s-line text-gray-400 group-open:rotate-180 transition-transform"></i>
          </summary>
          <div class="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
            {{ faq.a }}
          </div>
        </details>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Need more help?</h2>
        <p class="text-gray-600 text-sm mb-6">Send a message to your service provider directly from the portal.</p>
        <router-link
          to="/customer/messages"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 transition"
        >
          <i class="ri-chat-3-line"></i>
          Go to Messages
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const faqs = [
  { q: 'How do I reschedule a visit?', a: 'Contact your service provider through Messages or call them directly. Visit changes are handled by your provider\'s scheduling team.' },
  { q: 'Where can I view my invoices?', a: 'Go to Billing in the sidebar to see all invoices. Click any invoice to view details or download a PDF.' },
  { q: 'How do I see my pool service history?', a: 'Open My Pool, select a pool, and click "View Service History" to see past visits and chemical readings.' },
  { q: 'How do I update my contact information?', a: 'Visit Profile & Settings to update your name, phone, email, billing address, and notification preferences.' },
]
</script>

<style scoped>
details summary::-webkit-details-marker {
  display: none;
}
</style>
