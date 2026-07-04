<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/40 p-4 md:p-8">
    <div class=" mx-auto">
      <header class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xl shadow-lg">
            <i class="ri-chat-3-line"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Messages</h1>
            <p class="text-gray-500">Send and view messages with your service provider.</p>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-md hover:shadow-lg transition"
          @click="showCompose = !showCompose"
        >
          <i class="ri-add-line"></i>
          New Message
        </button>
      </header>

      <!-- Compose -->
      <div v-if="showCompose" class="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Compose Message</h2>
        <form class="space-y-4" @submit.prevent="sendMessage">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject <span class="text-gray-400">(optional)</span></label>
            <input
              v-model="form.subject"
              type="text"
              placeholder="Question about service"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message <span class="text-red-500">*</span></label>
            <textarea
              v-model="form.body"
              rows="4"
              required
              placeholder="I need to reschedule my pool service..."
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none"
            ></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Work Order ID <span class="text-gray-400">(optional)</span></label>
              <input v-model.number="form.work_order_id" type="number" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-pink-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Invoice ID <span class="text-gray-400">(optional)</span></label>
              <input v-model.number="form.invoice_id" type="number" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-pink-500" />
            </div>
          </div>
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="sending || !form.body.trim()"
              class="px-6 py-2.5 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 transition"
            >
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>
            <button type="button" class="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition" @click="showCompose = false">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Messages list -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="h-24 bg-gray-200 rounded-2xl"></div>
      </div>

      <div v-else-if="messages.length === 0" class="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <div class="text-5xl mb-4">💬</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No messages yet</h3>
        <p class="text-gray-500 mb-4">Start a conversation with your service provider.</p>
        <button type="button" class="text-pink-600 font-medium hover:text-pink-700" @click="showCompose = true">
          Send your first message →
        </button>
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="thread in messages"
          :key="thread.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 class="font-semibold text-gray-900">Thread #{{ thread.id }}</h3>
              <div class="text-sm text-gray-500 mt-1 space-y-1">
                <p v-if="thread.status">Status: {{ formatStatus(thread.status) }}</p>
                <p v-if="thread.work_order_id">Work Order: #{{ thread.work_order_id }}</p>
                <p v-if="thread.invoice_id">Invoice: #{{ thread.invoice_id }}</p>
              </div>
            </div>
            <time class="text-xs text-gray-400 shrink-0">{{ formatDate(thread.created_at) }}</time>
          </div>

          <div class="space-y-4">
            <div
              v-for="message in thread.messages || []"
              :key="message.id"
              class="rounded-2xl border border-gray-100 p-4 bg-gray-50"
            >
              <div class="flex items-center justify-between gap-3 mb-2">
                <span class="text-sm font-semibold text-gray-900">{{ message.sender_type === 'customer' ? 'You' : 'Provider' }}</span>
                <time class="text-xs text-gray-400">{{ formatDate(message.created_at) }}</time>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{{ message.body }}</p>
            </div>
          </div>

          <div v-if="!(thread.messages?.length)" class="text-sm text-gray-600">
            No messages available for this thread.
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatDate, formatStatus } from '../utils/formatters.js'

const loading = ref(true)
const sending = ref(false)
const showCompose = ref(false)
const messages = ref([])
const form = ref({ subject: '', body: '', work_order_id: null, invoice_id: null })

const fetchMessages = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getMessages()
    messages.value = Array.isArray(data)
      ? data
      : data?.data || data?.messages || []
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Messages', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const sendMessage = async () => {
  sending.value = true
  try {
    const payload = {
      body: form.value.body.trim(),
      ...(form.value.subject && { subject: form.value.subject }),
      ...(form.value.work_order_id && { work_order_id: form.value.work_order_id }),
      ...(form.value.invoice_id && { invoice_id: form.value.invoice_id }),
    }
    await customerPortalApi.sendMessage(payload)
    await Swal.fire({ icon: 'success', title: 'Message Sent', timer: 2000, showConfirmButton: false })
    form.value = { subject: '', body: '', work_order_id: null, invoice_id: null }
    showCompose.value = false
    await fetchMessages()
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Send', text: getApiErrorMessage(error) })
  } finally {
    sending.value = false
  }
}

onMounted(fetchMessages)
</script>
