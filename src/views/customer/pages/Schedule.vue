<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40 p-4 md:p-8">
    <div v-if="loading" class="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div class="h-10 w-72 bg-gray-200 rounded-xl"></div>
      <div v-for="i in 3" :key="i" class="h-28 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-calendar-check-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p class="text-gray-500">Upcoming and past scheduled pool service visits.</p>
        </div>
      </header>

      <div v-if="visits.length === 0" class="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <div class="text-5xl mb-4">📅</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No visits scheduled</h3>
        <p class="text-gray-500">Your upcoming service visits will appear here.</p>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="(visit, index) in visits"
          :key="visit.id || index"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 hover:shadow-md transition flex flex-col md:flex-row md:items-center gap-4"
        >
          <div class="flex items-center gap-4 md:w-48 shrink-0">
            <div class="w-16 h-16 rounded-xl bg-orange-50 flex flex-col items-center justify-center text-orange-600">
              <span class="text-xs font-medium uppercase">{{ formatMonth(visit.scheduled_date) }}</span>
              <span class="text-2xl font-bold leading-none">{{ formatDay(visit.scheduled_date) }}</span>
            </div>
            <div class="md:hidden">
              <div class="font-semibold text-gray-900">{{ visit.pool?.label || visit.pool_name || 'Pool Visit' }}</div>
              <div class="text-sm text-gray-500">{{ formatDate(visit.scheduled_date) }}</div>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="hidden md:block font-semibold text-gray-900 text-lg">
              {{ visit.pool?.label || visit.pool_name || 'Pool Visit' }}
            </div>
            <div class="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              <span v-if="visit.technician?.name" class="flex items-center gap-1">
                <i class="ri-user-line text-orange-500"></i>
                {{ visit.technician.name }}
              </span>
              <span v-if="visit.time_window || visit.scheduled_time" class="flex items-center gap-1">
                <i class="ri-time-line text-orange-500"></i>
                {{ visit.time_window || visit.scheduled_time }}
              </span>
              <span v-if="visit.service_type" class="flex items-center gap-1">
                <i class="ri-tools-line text-orange-500"></i>
                {{ visit.service_type }}
              </span>
            </div>
          </div>

          <span
            class="self-start md:self-center px-3 py-1 rounded-full text-xs font-semibold shrink-0"
            :class="statusBadgeClass(visit.status || 'scheduled')"
          >
            {{ formatStatus(visit.status || 'scheduled') }}
          </span>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import { formatDate, formatStatus, statusBadgeClass } from '../utils/formatters.js'

const loading = ref(true)
const visits = ref([])

const formatDay = (d) => (d ? new Date(d).getDate() : '—')
const formatMonth = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short' }) : '')

const fetchVisits = async () => {
  loading.value = true
  try {
    const data = await customerPortalApi.getScheduledVisits()
    visits.value = Array.isArray(data) ? data : data?.visits || data?.scheduled_visits || []
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Failed to Load Schedule', text: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

onMounted(fetchVisits)
</script>
