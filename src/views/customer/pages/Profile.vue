<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-user-3-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p class="text-gray-500">Manage your account and notification preferences.</p>
        </div>
      </header>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition"
          :class="activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Profile -->
      <div v-show="activeTab === 'profile'" class="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
        <form class="space-y-4" @submit.prevent="saveProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input v-model="profile.contact_name" type="text" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="profile.phone" type="tel" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="profile.email" type="email" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
              <select v-model="profile.preferred_contact" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
            <textarea v-model="profile.billing_address" rows="2" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 resize-none"></textarea>
          </div>

          <hr class="my-6 border-gray-100" />
          <h3 class="text-md font-semibold text-gray-900 mb-4">Change Password</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input v-model="profile.current_password" type="password" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input v-model="profile.password" type="password" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input v-model="profile.password_confirmation" type="password" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
            </div>
          </div>

          <button type="submit" :disabled="savingProfile" class="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
            {{ savingProfile ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>
      </div>

      <!-- Notifications -->
      <div v-show="activeTab === 'notifications'" class="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
        <div class="space-y-4">
          <label v-for="item in notificationItems" :key="item.key" class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
            <div>
              <div class="font-medium text-gray-900">{{ item.label }}</div>
              <div class="text-sm text-gray-500">{{ item.description }}</div>
            </div>
            <input v-model="notifications[item.key]" type="checkbox" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
          </label>
        </div>
        <button type="button" :disabled="savingNotifications" class="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition" @click="saveNotifications">
          {{ savingNotifications ? 'Saving...' : 'Save Preferences' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '../../../store/AuthStore.js'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'

const authStore = useAuthStore()
const activeTab = ref('profile')
const savingProfile = ref(false)
const savingNotifications = ref(false)

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
]

const profile = reactive({
  contact_name: '',
  phone: '',
  email: '',
  billing_address: '',
  preferred_contact: 'email',
  current_password: '',
  password: '',
  password_confirmation: '',
})

const notifications = reactive({
  email_notifications: true,
  sms_notifications: true,
  visit_reminders: true,
  invoice_alerts: true,
  promotional_emails: false,
})

const notificationItems = [
  { key: 'email_notifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'sms_notifications', label: 'SMS Notifications', description: 'Receive text message alerts' },
  { key: 'visit_reminders', label: 'Visit Reminders', description: 'Get reminded before scheduled visits' },
  { key: 'invoice_alerts', label: 'Invoice Alerts', description: 'Notifications when new invoices are issued' },
  { key: 'promotional_emails', label: 'Promotional Emails', description: 'Offers and news from your provider' },
]

const initProfile = () => {
  const user = authStore.user || {}
  profile.contact_name = user.contact_name || user.name || ''
  profile.phone = user.phone || ''
  profile.email = user.email || ''
  profile.billing_address = user.billing_address || ''
  profile.preferred_contact = user.preferred_contact || 'email'
  notifications.email_notifications = Boolean(user.email_notifications)
  notifications.sms_notifications = Boolean(user.sms_notifications)
  notifications.visit_reminders = Boolean(user.visit_reminders)
  notifications.invoice_alerts = Boolean(user.invoice_alerts)
  notifications.promotional_emails = Boolean(user.promotional_emails)
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    const payload = {
      contact_name: profile.contact_name,
      phone: profile.phone,
      email: profile.email,
      billing_address: profile.billing_address,
      preferred_contact: profile.preferred_contact,
    }
    if (profile.current_password) {
      payload.current_password = profile.current_password
      payload.password = profile.password
      payload.password_confirmation = profile.password_confirmation
    }
    const updated = await customerPortalApi.updateProfile(payload)
    if (updated) authStore.user = { ...authStore.user, ...updated }
    profile.current_password = ''
    profile.password = ''
    profile.password_confirmation = ''
    await Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 2000, showConfirmButton: false })
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Update Failed', text: getApiErrorMessage(error) })
  } finally {
    savingProfile.value = false
  }
}

const saveNotifications = async () => {
  savingNotifications.value = true
  try {
    await customerPortalApi.updateNotificationSettings({
      email_notifications: notifications.email_notifications ? 1 : 0,
      sms_notifications: notifications.sms_notifications ? 1 : 0,
      visit_reminders: notifications.visit_reminders ? 1 : 0,
      invoice_alerts: notifications.invoice_alerts ? 1 : 0,
      promotional_emails: notifications.promotional_emails ? 1 : 0,
    })
    await Swal.fire({ icon: 'success', title: 'Preferences Saved', timer: 2000, showConfirmButton: false })
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Save Failed', text: getApiErrorMessage(error) })
  } finally {
    savingNotifications.value = false
  }
}

onMounted(initProfile)
</script>
