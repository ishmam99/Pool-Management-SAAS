<template>
  <div class="min-h-screen bg-gray-50">

    <!-- ═══════════════════════════════════════════════════
         HEADER
    ════════════════════════════════════════════════════ -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5">
      <div v-if="loading" class="animate-pulse flex items-start justify-between gap-4">
        <div class="space-y-2">
          <div class="h-7 bg-gray-200 rounded w-48"></div>
          <div class="h-4 bg-gray-200 rounded w-72"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-9 bg-gray-200 rounded w-20"></div>
          <div class="h-9 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div v-else class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-2xl font-semibold text-gray-900">Work Order #{{ workOrder?.id }}</h1>
            <span :class="workOrderStatusBadge(workOrder?.status)">{{ formatStatus(workOrder?.status) }}</span>
            <span :class="workOrderTypeBadge(workOrder?.type)">{{ formatStatus(workOrder?.type) }}</span>
          </div>
          <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ formatDate(workOrder?.scheduled_visit?.scheduled_date) }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Technician: {{ workOrder?.technician?.name ?? 'Unassigned' }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
              Customer: {{ workOrder?.customer?.contact_name ?? '—' }}
            </span>
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <button @click="fetchWorkOrder" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh
          </button>
          <button @click="openEditModal" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Edit Work Order
          </button>
          <button @click="$router.back()" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- ═══════════════════════════════════════════════════
           SKELETON
      ════════════════════════════════════════════════════ -->
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse space-y-3">
          <div class="h-5 bg-gray-200 rounded w-40"></div>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="j in 4" :key="j" class="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </template>

      <template v-else>

        <!-- ════════════════════════════
             SECTION 1 — Service Overview
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Service Overview</h2>
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
              <span :class="workOrderStatusBadge(workOrder?.status)" class="self-start">{{ formatStatus(workOrder?.status) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
              <span :class="workOrderTypeBadge(workOrder?.type)" class="self-start">{{ formatStatus(workOrder?.type) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Scheduled Date</span>
              <span class="text-sm text-gray-900">{{ formatDate(workOrder?.scheduled_visit?.scheduled_date) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Service Window</span>
              <span class="text-sm text-gray-900">{{ formatTime(workOrder?.scheduled_visit?.time_window_start)}} - {{ formatTime(workOrder?.scheduled_visit?.time_window_end)}}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Started At</span>
              <span class="text-sm text-gray-900">{{ formatDateTime(workOrder?.started_at) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Finished At</span>
              <span class="text-sm text-gray-900">{{ formatDateTime(workOrder?.finished_at) }}</span>
            </div>
            <div v-if="workOrder?.notes" class="flex flex-col gap-0.5 sm:col-span-2 lg:col-span-3">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</span>
              <span class="text-sm text-gray-900">{{ workOrder.notes }}</span>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 2 — Checklist
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Checklist</h2>
          </div>
          <div class="p-5">
            <div v-if="workOrder?.checklist?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(item, index) in workOrder.checklist"
                :key="index"
                @click="toggleChecklist(item)"
                :class="[
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none',
                  item._checked
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                ]"
              >
                <div :class="[
                  'w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-colors',
                  item._checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                ]">
                  <svg v-if="item._checked" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span :class="['text-sm font-medium', item._checked ? 'text-emerald-700 line-through' : 'text-gray-700']">
                  {{ item.item }}
                </span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-8 text-center">
              <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              <p class="text-sm text-gray-500">No checklist items.</p>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 3 — Customer
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Customer</h2>
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Name</span>
              <span class="text-sm text-gray-900">{{ workOrder?.customer?.contact_name ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</span>
              <span class="text-sm text-gray-900">{{ workOrder?.customer?.phone ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
              <span class="text-sm text-gray-900">{{ workOrder?.customer?.email ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Billing Address</span>
              <span class="text-sm text-gray-900">{{ workOrder?.customer?.billing_address ?? '—' }}</span>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 4 — Pool Information
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Pool Information</h2>
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Pool Name</span>
              <span class="text-sm text-gray-900">{{ workOrder?.pool?.label ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Service Address</span>
              <span class="text-sm text-gray-900">{{ workOrder?.pool?.service_address ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Gate Code</span>
              <span class="text-sm text-gray-900">{{ workOrder?.pool?.gate_code ?? '—' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Has Dog</span>
              <span class="text-sm text-gray-900">{{ workOrder?.pool?.has_dog ? 'Yes' : 'No' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Chemical Type</span>
              <span class="text-sm text-gray-900">{{ formatStatus(workOrder?.pool?.chemical_type) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Season</span>
              <span class="text-sm text-gray-900">{{ formatStatus(workOrder?.pool?.season) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Volume</span>
              <span class="text-sm text-gray-900">{{ workOrder?.pool?.volume_gallons ? workOrder.pool.volume_gallons + ' gal' : '—' }}</span>
            </div>
            <div v-if="workOrder?.pool?.access_notes" class="flex flex-col gap-0.5 sm:col-span-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Access Notes</span>
              <span class="text-sm text-gray-900">{{ workOrder.pool.access_notes }}</span>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 5 — Equipment
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Equipment</h2>
          </div>
          <div v-if="workOrder?.pool?.equipment?.length" class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Model</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Serial Number</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Install Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(eq, i) in workOrder.pool?.equipment" :key="eq.id" :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'" class="border-b border-gray-100">
                  <td class="px-4 py-3 text-gray-900">{{ formatStatus(eq.type) }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ eq.brand ?? '—' }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ eq.model ?? '—' }}</td>
                  <td class="px-4 py-3 font-mono text-xs text-gray-500">{{ eq.serial_number ?? '—' }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ formatDate(eq.install_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-10 text-center px-4">
            <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <p class="text-sm text-gray-500">No equipment found.</p>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 6 — Photos
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Photos</h2>
          </div>
          <div class="p-5 space-y-6">

            <!-- Photo groups -->
            <div v-for="group in photoGroups" :key="group.type">
              <div v-if="group.photos.length">
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{{ group.label }}</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div
                    v-for="photo in group.photos"
                    :key="photo.id"
                    class="relative rounded-lg overflow-hidden border border-gray-200 group aspect-square bg-gray-100"
                  >
                    <img :src="buildImageUrl(photo.path)" :alt="group.label" class="w-full h-full object-cover"/>
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button @click="deletePhoto(photo.id)" class="bg-rose-600 text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-rose-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Photo -->
            <div class="border-t border-gray-100 pt-5">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Upload Photo</h3>
              <div class="space-y-3">
                <!-- Drag & Drop zone -->
                <div
                  @dragover.prevent
                  @drop.prevent="onPhotoDrop"
                  @click="$refs.photoInput.click()"
                  class="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                >
                  <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p class="text-sm text-gray-500">Drag & drop or <span class="text-blue-600 font-medium">click to browse</span></p>
                  <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelect"/>
                </div>

                <!-- Preview -->
                <div v-if="uploadPreview" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <img :src="uploadPreview" class="w-16 h-16 rounded-lg object-cover border border-gray-200"/>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ uploadFile?.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(uploadFile?.size) }}</p>
                  </div>
                  <button @click="clearPhotoUpload" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                  <select v-model="uploadType" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Type</option>
                    <option v-for="t in photoTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                  </select>
                  <button
                    @click="uploadPhoto"
                    :disabled="!uploadFile || !uploadType || uploadingPhoto"
                    class="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="uploadingPhoto" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    {{ uploadingPhoto ? 'Uploading…' : 'Upload Photo' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 7 — Chemical Readings
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900">Chemical Readings</h2>
            <div v-if="workOrder?.chemical_reading?.is_balanced" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              Balanced
            </div>
          </div>
          <div class="p-5">

            <!-- Recommendations -->
            <div v-if="workOrder?.chemical_reading?.recommendations" class="mb-4 flex gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
              <svg class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>{{ workOrder.chemical_reading.recommendations }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">pH</label>
                <input v-model="chemForm.ph" type="number" step="0.01" placeholder="7.4" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Free Chlorine</label>
                <input v-model="chemForm.free_chlorine" type="number" step="0.01" placeholder="1.0" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Chlorine</label>
                <input v-model="chemForm.total_chlorine" type="number" step="0.01" placeholder="1.0" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Alkalinity</label>
                <input v-model="chemForm.alkalinity" type="number" step="1" placeholder="100" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">CYA</label>
                <input v-model="chemForm.cya" type="number" step="1" placeholder="40" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Salt</label>
                <input v-model="chemForm.salt" type="number" step="1" placeholder="3000" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div class="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Water Clarity</label>
                <select v-model="chemForm.water_clarity" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select clarity</option>
                  <option v-for="opt in waterClarityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button @click="saveChemicalReading" :disabled="savingChem" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
                <svg v-if="savingChem" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                {{ workOrder?.chemical_reading ? 'Update Reading' : 'Create Reading' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 8 — Chemicals Added
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900">Chemicals Added</h2>
            <button @click="showAddChemModal = true" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add Chemical
            </button>
          </div>

          <div v-if="workOrder?.chemicals_added?.length" class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Chemical</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(chem, i) in workOrder.chemicals_added" :key="chem.id" :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'" class="border-b border-gray-100">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ formatStatus(chem.chemical_type) }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ chem.quantity }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ chem.unit }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ formatStatus(chem.reason) }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ formatDate(chem.created_at) }}</td>
                  <td class="px-4 py-3">
                    <button @click="deleteChemical(chem.id)" class="text-rose-500 hover:text-rose-700 text-xs font-medium transition-colors">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-10 text-center px-4">
            <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            <p class="text-sm text-gray-500">No chemicals added yet.</p>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 9 — Invoice
             (only for non-routine)
        ═════════════════════════════ -->
        <div v-if="workOrder?.type !== 'routine'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900">Invoice</h2>
            <button v-if="!workOrder?.invoice" @click="showInvoiceModal = true" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Create Invoice
            </button>
            <div v-else class="flex gap-2">
              <button @click="sendInvoice" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">Send Invoice</button>
              <button @click="downloadInvoice" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">Download PDF</button>
            </div>
          </div>
          <div class="p-5">
            <div v-if="workOrder?.invoice" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Invoice #</span>
                <span class="text-sm font-medium text-gray-900">{{ workOrder.invoice.invoice_number }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                <span :class="invoiceStatusBadge(workOrder.invoice.status)" class="self-start">{{ formatStatus(workOrder.invoice.status) }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</span>
                <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(workOrder.invoice.total) }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Paid</span>
                <span class="text-sm font-semibold text-emerald-600">{{ formatCurrency(workOrder.invoice.paid) }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Balance Due</span>
                <span class="text-sm font-semibold text-rose-600">{{ formatCurrency((workOrder.invoice.total ?? 0) - (workOrder.invoice.paid ?? 0)) }}</span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-10 text-center">
              <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
              <p class="text-sm text-gray-500">No invoice created yet.</p>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 10 — Message Thread
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900">Message Thread</h2>
            <div v-if="workOrder?.message_thread" class="flex gap-2">
              <span :class="threadStatusBadge(workOrder.message_thread?.status)">{{ formatStatus(workOrder.message_thread?.status) }}</span>
              <button v-if="workOrder.message_thread?.status !== 'closed'" @click="closeThread" class="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                Close Conversation
              </button>
            </div>
          </div>
          <div class="p-5">

            <!-- No invoice -->
            <div v-if="!workOrder?.invoice" class="flex flex-col items-center justify-center py-10 text-center">
              <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              <p class="text-sm text-gray-500">Create an invoice before starting a conversation.</p>
            </div>

            <!-- No thread, has invoice -->
            <div v-else-if="!workOrder?.message_thread" class="flex flex-col items-center justify-center py-10 text-center">
              <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              <p class="text-sm text-gray-500 mb-3">No active conversation.</p>
              <button @click="openCreateThreadModal" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Create Conversation
              </button>
            </div>

            <!-- Thread exists -->
            <div v-else>
              <!-- Messages -->
              <div class="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
                <div v-if="!workOrder.message_thread?.messages?.length" class="text-center text-sm text-gray-400 py-6">No messages yet.</div>
                <div
                  v-for="msg in workOrder.message_thread?.messages"
                  :key="msg.id"
                  :class="['flex', msg.sender_type === 'customer' ? 'justify-start' : 'justify-end']"
                >
                  <div :class="[
                    'max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-sm',
                    msg.sender_type === 'customer'
                      ? 'bg-gray-100 text-gray-900 rounded-tl-sm'
                      : msg.sender_type === 'technician'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                  ]">
                    <div class="flex items-center gap-2 mb-0.5">
                      <span class="text-xs font-semibold opacity-75">{{ formatStatus(msg.sender_type) }}</span>
                    </div>
                    <p>{{ msg.body }}</p>
                    <p class="text-xs mt-1 opacity-60 text-right">{{ formatDateTime(msg.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- Reply -->
              <div v-if="workOrder.message_thread?.status !== 'closed'" class="flex gap-2 border-t border-gray-100 pt-4">
                <select v-model="replyForm.sender_type" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0">
                  <option value="">As…</option>
                  <option value="office">Office</option>
                  <option value="technician">Technician</option>
                  <option value="customer">Customer</option>
                </select>
                <input v-model="replyForm.body" type="text" placeholder="Type a message…" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button @click="sendMessage" :disabled="!replyForm.body || !replyForm.sender_type" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  Send
                </button>
              </div>
              <div v-else class="text-center text-sm text-gray-400 border-t border-gray-100 pt-4">This conversation is closed.</div>
            </div>

          </div>
        </div>

        <!-- ════════════════════════════
             FINISH SERVICE
        ═════════════════════════════ -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-base font-semibold text-gray-900">Finish Service</h2>
          </div>
          <div class="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p class="text-sm text-gray-700">Current Status: <span :class="workOrderStatusBadge(workOrder?.status)" class="ml-1">{{ formatStatus(workOrder?.status) }}</span></p>
              <p class="text-sm text-gray-500 mt-1">Once you finish the service, the work order will be marked as completed.</p>
            </div>
            <button
              @click="confirmFinishService"
              :disabled="workOrder?.status === 'completed'"
              class="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ workOrder?.status === 'completed' ? 'Service Completed' : 'Finish Service' }}
            </button>
          </div>
        </div>

      </template>
    </div>

    <!-- ═══════════════════════════════════════════════════
         MODAL — Edit Work Order
    ════════════════════════════════════════════════════ -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <h3 class="text-base font-semibold text-gray-900">Edit Work Order</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="p-5 space-y-6">
          <!-- Status -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Status</label>
            <select v-model="editForm.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
            </select>
          </div>

          <!-- Checklist -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Checklist</label>
            <div class="space-y-2">
              <div v-for="(item, index) in editForm.checklist" :key="index" class="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  v-model="item._checked"
                  class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">{{ item.item }}</span>
              </div>
            </div>
          </div>

          <!-- Timing -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Started At</label>
              <input v-model="editForm.started_at" type="datetime-local" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Finished At</label>
              <input v-model="editForm.finished_at" type="datetime-local" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <!-- GPS Coordinates -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">GPS Coordinates</label>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label class="text-xs text-gray-500 block mb-0.5">Start Lat</label>
                <input v-model="editForm.start_lat" type="number" step="any" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-0.5">Start Lng</label>
                <input v-model="editForm.start_lng" type="number" step="any" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-0.5">Finish Lat</label>
                <input v-model="editForm.finish_lat" type="number" step="any" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-0.5">Finish Lng</label>
                <input v-model="editForm.finish_lng" type="number" step="any" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Notes</label>
            <textarea v-model="editForm.notes" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add notes..."></textarea>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100 flex justify-end gap-3 z-10">
          <button @click="closeEditModal" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="saveWorkOrder" :disabled="savingWorkOrder" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <svg v-if="savingWorkOrder" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ savingWorkOrder ? 'Saving...' : 'Save Work Order' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         MODAL — Create Thread
    ════════════════════════════════════════════════════ -->
    <div v-if="showCreateThreadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Create Conversation</h3>
          <button @click="showCreateThreadModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Message</label>
            <textarea 
              v-model="threadForm.body" 
              rows="4" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="We have completed your weekly pool service. Everything looks great."
              required
            ></textarea>
          </div>
        </div>
        <div class="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button @click="showCreateThreadModal = false" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="createThreadWithMessage" :disabled="!threadForm.body || creatingThread" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <svg v-if="creatingThread" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Create Conversation
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         MODAL — Add Chemical
    ════════════════════════════════════════════════════ -->
    <div v-if="showAddChemModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Add Chemical</h3>
          <button @click="showAddChemModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Chemical Type</label>
            <select v-model="chemAddForm.chemical_type" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select chemical</option>
              <option v-for="c in chemicalTypes" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity</label>
              <input v-model="chemAddForm.quantity" type="number" step="0.01" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Unit</label>
              <select v-model="chemAddForm.unit" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select unit</option>
                <option v-for="u in chemicalUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason</label>
            <select v-model="chemAddForm.reason" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select reason</option>
              <option v-for="r in chemicalReasons" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </div>
        </div>
        <div class="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button @click="showAddChemModal = false" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="addChemical" :disabled="addingChem" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <svg v-if="addingChem" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Add Chemical
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         MODAL — Create Invoice
    ════════════════════════════════════════════════════ -->
    <div v-if="showInvoiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <h3 class="text-base font-semibold text-gray-900">Create Invoice</h3>
          <button @click="showInvoiceModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5 space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Invoice Date</label>
              <input v-model="invoiceForm.invoice_date" type="date" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</label>
              <input v-model="invoiceForm.due_date" type="date" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Billing Start</label>
              <input v-model="invoiceForm.billing_start" type="date" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Billing End</label>
              <input v-model="invoiceForm.billing_end" type="date" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtotal</label>
              <input v-model="invoiceForm.subtotal" type="number" step="0.01" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Tax</label>
              <input v-model="invoiceForm.tax" type="number" step="0.01" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Discount</label>
              <input v-model="invoiceForm.discount" type="number" step="0.01" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <!-- Line Items -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-700">Line Items</h4>
              <button @click="addLineItem" class="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Line Item
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(item, i) in invoiceForm.line_items" :key="i" class="flex gap-2 items-center">
                <input v-model="item.description" type="text" placeholder="Description" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input v-model="item.quantity" type="number" placeholder="Qty" class="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input v-model="item.unit_price" type="number" placeholder="Price" class="w-24 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <label class="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                  <input v-model="item.taxable" type="checkbox" class="rounded border-gray-300"/>
                  Tax
                </label>
                <button @click="removeLineItem(i)" class="text-rose-400 hover:text-rose-600 shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div v-if="!invoiceForm.line_items.length" class="text-sm text-gray-400 italic text-center py-2">No line items. Add one above.</div>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100 flex justify-end gap-3 z-10">
          <button @click="showInvoiceModal = false" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="createInvoice" :disabled="creatingInvoice" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <svg v-if="creatingInvoice" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Create Invoice
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../../services/api.js'

// ─── Router ───────────────────────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const workOrderId = route.params.id

// ─── State ────────────────────────────────────────────────────────────────────
const workOrder     = ref(null)
const loading       = ref(false)

const uploadFile    = ref(null)
const uploadPreview = ref(null)
const uploadType    = ref('')
const uploadingPhoto = ref(false)

const savingChem    = ref(false)
const addingChem    = ref(false)
const creatingInvoice = ref(false)
const savingWorkOrder = ref(false)
const creatingThread = ref(false)

const showAddChemModal  = ref(false)
const showInvoiceModal  = ref(false)
const showEditModal     = ref(false)
const showCreateThreadModal = ref(false)

const chemForm = ref({
  ph: '', free_chlorine: '', total_chlorine: '',
  alkalinity: '', cya: '', salt: '', water_clarity: '',
})

const chemAddForm = ref({
  chemical_type: '', quantity: '', unit: '', reason: '',
})

const invoiceForm = ref({
  invoice_date: '', due_date: '', billing_start: '',
  billing_end: '', subtotal: '', tax: '', discount: '',
  line_items: [],
})

const replyForm = ref({ sender_type: '', body: '' })

const threadForm = ref({ body: '' })

const editForm = ref({
  status: '',
  checklist: [],
  started_at: '',
  finished_at: '',
  start_lat: '',
  start_lng: '',
  finish_lat: '',
  finish_lng: '',
  notes: '',
})

// ─── Constants ────────────────────────────────────────────────────────────────
const photoTypes = [
  { value: 'before',  label: 'Before'  },
  { value: 'after',   label: 'After'   },
  { value: 'issue',   label: 'Issue'   },
  { value: 'other',   label: 'Other'   },
]

const waterClarityOptions = [
  { value: 'clear',  label: 'Clear'  },
  { value: 'cloudy', label: 'Cloudy' },
  { value: 'green',  label: 'Green'  },
  { value: 'dirty',  label: 'Dirty'  },
]

const statusOptions = [
  { value: 'created', label: 'Created' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'completed', label: 'Completed' },
]

const chemicalTypes = [
  { value: 'chlorine',       label: 'Chlorine'         },
  { value: 'algaecide',      label: 'Algaecide'        },
  { value: 'shock',          label: 'Shock'            },
  { value: 'ph_up',          label: 'pH Up'            },
  { value: 'ph_down',        label: 'pH Down'          },
  { value: 'alkalinity_up',  label: 'Alkalinity Up'    },
  { value: 'cyanuric_acid',  label: 'Cyanuric Acid'    },
  { value: 'salt',           label: 'Salt'             },
  { value: 'other',          label: 'Other'            },
]

const chemicalUnits = [
  { value: 'lbs',    label: 'lbs'  },
  { value: 'oz',     label: 'oz'   },
  { value: 'gallons',label: 'gal'  },
  { value: 'liters', label: 'L'    },
  { value: 'tablets',label: 'tabs' },
]

const chemicalReasons = [
  { value: 'low_ph',           label: 'Low pH'            },
  { value: 'high_ph',          label: 'High pH'           },
  { value: 'low_chlorine',     label: 'Low Chlorine'      },
  { value: 'algae_treatment',  label: 'Algae Treatment'   },
  { value: 'routine',          label: 'Routine'           },
  { value: 'other',            label: 'Other'             },
]

// ─── Computed ─────────────────────────────────────────────────────────────────
const photoGroups = computed(() => {
  const photos = workOrder.value?.photos ?? []
  return photoTypes.map(t => ({
    type: t.value,
    label: t.label,
    photos: photos.filter(p => p.type === t.value),
  }))
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatDateTime(val) {
  if (!val) return '—'
  return new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatStatus(val) {
  if (!val) return '—'
  return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const formatTime = (t) => {
  if (!t) return '—';
  if (t.includes(':')) {
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return t;
};

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function buildImageUrl(path) {
  return `${import.meta.env.VITE_BASE_URL}/storage/${path}`
}

function syncChemForm() {
  const r = workOrder.value?.chemical_reading
  if (!r) return
  chemForm.value = {
    ph: r.ph ?? '',
    free_chlorine: r.free_chlorine ?? '',
    total_chlorine: r.total_chlorine ?? '',
    alkalinity: r.alkalinity ?? '',
    cya: r.cya ?? '',
    salt: r.salt ?? '',
    water_clarity: r.water_clarity ?? '',
  }
}

function toggleChecklist(item) {
  item._checked = !item._checked
}

// ─── Badge Helpers ────────────────────────────────────────────────────────────
function workOrderStatusBadge(s) {
  const map = {
    completed:   'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    in_progress: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    pending_review: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    scheduled:   'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    created:     'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    assigned:    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  }
  return map[s] ?? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

function workOrderTypeBadge(t) {
  const map = {
    routine:      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    emergency:    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    repair:       'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    inspection:   'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    installation: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  }
  return map[t] ?? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

function invoiceStatusBadge(s) {
  const map = {
    paid:    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    sent:    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    overdue: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    draft:   'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  }
  return map[s] ?? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

function threadStatusBadge(s) {
  const map = {
    open:   'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    closed: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  }
  return map[s] ?? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

function formatDateTimeInput(date) {
  if (!date) return ''
  try {
    const d = new Date(date)
    return d.toISOString().slice(0, 16)
  } catch {
    return ''
  }
}

// ─── Edit Work Order ──────────────────────────────────────────────────────────
function openEditModal() {
  if (!workOrder.value) return
  
  editForm.value = {
    status: workOrder.value.status || '',
    checklist: (workOrder.value.checklist || []).map(item => ({
      ...item,
      _checked: item.isChecked === 'true' || item.isChecked === true
    })),
    started_at: formatDateTimeInput(workOrder.value.started_at),
    finished_at: formatDateTimeInput(workOrder.value.finished_at),
    start_lat: workOrder.value.start_lat || '',
    start_lng: workOrder.value.start_lng || '',
    finish_lat: workOrder.value.finish_lat || '',
    finish_lng: workOrder.value.finish_lng || '',
    notes: workOrder.value.notes || '',
  }
  
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
}

async function saveWorkOrder() {
  savingWorkOrder.value = true
  try {
    const payload = {
      status: editForm.value.status,
      checklist: editForm.value.checklist.map(item => ({
        item: item.item,
        isChecked: item._checked ? 'true' : 'false'
      })),
      started_at: editForm.value.started_at || null,
      finished_at: editForm.value.finished_at || null,
      start_lat: editForm.value.start_lat ? parseFloat(editForm.value.start_lat) : null,
      start_lng: editForm.value.start_lng ? parseFloat(editForm.value.start_lng) : null,
      finish_lat: editForm.value.finish_lat ? parseFloat(editForm.value.finish_lat) : null,
      finish_lng: editForm.value.finish_lng ? parseFloat(editForm.value.finish_lng) : null,
      notes: editForm.value.notes,
      _method: 'PUT'
    }
    
    await api().post(`/work-order-management/work-orders/${workOrderId}`, payload)
    
    await Swal.fire({
      icon: 'success',
      title: 'Work Order Updated',
      timer: 2000,
      showConfirmButton: false
    })
    
    showEditModal.value = false
    await fetchWorkOrder()
    
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to update work order',
      text: err?.response?.data?.message ?? 'Unexpected error.'
    })
  } finally {
    savingWorkOrder.value = false
  }
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────
function onPhotoSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadFile.value = file
  uploadPreview.value = URL.createObjectURL(file)
}

function onPhotoDrop(e) {
  const file = e.dataTransfer.files?.[0]
  if (!file) return
  uploadFile.value = file
  uploadPreview.value = URL.createObjectURL(file)
}

function clearPhotoUpload() {
  uploadFile.value = null
  uploadPreview.value = null
  uploadType.value = ''
}

// ─── Invoice Helpers ──────────────────────────────────────────────────────────
function addLineItem() {
  invoiceForm.value.line_items.push({ description: '', quantity: 1, unit_price: '', taxable: false })
}

function removeLineItem(i) {
  invoiceForm.value.line_items.splice(i, 1)
}

// ─── Thread ──────────────────────────────────────────────────────────────────
function openCreateThreadModal() {
  threadForm.value.body = ''
  showCreateThreadModal.value = true
}

async function createThreadWithMessage() {
  if (!threadForm.value.body.trim()) return
  
  const inv = workOrder.value?.invoice
  const customerId = workOrder.value?.customer?.id
  if (!inv || !customerId) {
    Swal.fire({
      icon: 'error',
      title: 'Missing data',
      text: 'Invoice or customer information is missing.'
    })
    return
  }
  
  creatingThread.value = true
  try {
    await api().post('/communication-management/threads', {
      customer_id: customerId,
      work_order_id: workOrderId,
      invoice_id: inv.id,
      body: threadForm.value.body
    })
    
    showCreateThreadModal.value = false
    await Swal.fire({
      icon: 'success',
      title: 'Conversation created',
      timer: 1500,
      showConfirmButton: false
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to create thread',
      text: err?.response?.data?.message ?? 'Unexpected error.'
    })
  } finally {
    creatingThread.value = false
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchWorkOrder() {
  loading.value = true
  try {
    const res = await api().get(`/work-order-management/work-orders/${workOrderId}`)
    const data = res.data?.data ?? res.data
    
    // Process checklist - convert string booleans to actual booleans
    if (data.checklist && Array.isArray(data.checklist)) {
      data.checklist = data.checklist.map(item => ({
        ...item,
        _checked: item.isChecked === 'true' || item.isChecked === true
      }))
    }
    
    workOrder.value = data
    syncChemForm()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to load work order',
      text: err?.response?.data?.message ?? 'Unexpected error.'
    })
  } finally {
    loading.value = false
  }
}

async function uploadPhoto() {
  if (!uploadFile.value || !uploadType.value) return
  uploadingPhoto.value = true
  try {
    const fd = new FormData()
    fd.append('photo', uploadFile.value)
    fd.append('type', uploadType.value)
    fd.append('taken_at', new Date().toISOString())
    await api().post(`/work-order-management/${workOrderId}/photos`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    clearPhotoUpload()
    await Swal.fire({ icon: 'success', title: 'Photo uploaded', timer: 1500, showConfirmButton: false })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Upload failed', text: err?.response?.data?.message ?? 'Unexpected error.' })
  } finally {
    uploadingPhoto.value = false
  }
}

async function deletePhoto(photoId) {
  const confirm = await Swal.fire({ icon: 'warning', title: 'Delete photo?', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!confirm.isConfirmed) return
  try {
    await api().delete(`/work-order-management/photos/${photoId}`)
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.response?.data?.message ?? 'Unexpected error.' })
  }
}

async function saveChemicalReading() {
  savingChem.value = true
  try {
    const reading = workOrder.value?.chemical_reading
    if (reading) {
      await api().post(`/chemical-management/readings/${reading.id}`, { ...chemForm.value, work_order_id: workOrderId, _method: 'PUT' })
    } else {
      await api().post('/chemical-management/readings', { ...chemForm.value, work_order_id: workOrderId })
    }
    await Swal.fire({ icon: 'success', title: 'Reading saved', timer: 1500, showConfirmButton: false })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Save failed', text: err?.response?.data?.message ?? 'Unexpected error.' })
  } finally {
    savingChem.value = false
  }
}

async function addChemical() {
  addingChem.value = true
  try {
    await api().post('/chemical-management/chemicals-added', { ...chemAddForm.value, work_order_id: workOrderId })
    showAddChemModal.value = false
    chemAddForm.value = { chemical_type: '', quantity: '', unit: '', reason: '' }
    await Swal.fire({ icon: 'success', title: 'Chemical added', timer: 1500, showConfirmButton: false })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to add chemical', text: err?.response?.data?.message ?? 'Unexpected error.' })
  } finally {
    addingChem.value = false
  }
}

async function deleteChemical(id) {
  const confirm = await Swal.fire({ icon: 'warning', title: 'Remove chemical?', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Remove' })
  if (!confirm.isConfirmed) return
  try {
    await api().delete(`/chemical-management/chemicals-added/${id}`)
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to remove', text: err?.response?.data?.message ?? 'Unexpected error.' })
  }
}

async function createInvoice() {
  creatingInvoice.value = true
  try {
    await api().post('/financial-management/invoices', { ...invoiceForm.value, work_order_id: workOrderId })
    showInvoiceModal.value = false
    await Swal.fire({ icon: 'success', title: 'Invoice created', timer: 1500, showConfirmButton: false })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to create invoice', text: err?.response?.data?.message ?? 'Unexpected error.' })
  } finally {
    creatingInvoice.value = false
  }
}

async function sendInvoice() {
  const invoiceId = workOrder.value?.invoice?.id
  if (!invoiceId) return
  try {
    await api().post(`/financial-management/${invoiceId}/send`)
    await Swal.fire({ icon: 'success', title: 'Invoice sent', timer: 1500, showConfirmButton: false })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to send invoice', text: err?.response?.data?.message ?? 'Unexpected error.' })
  }
}

async function downloadInvoice() {
  const invoiceId = workOrder.value?.invoice?.id
  if (!invoiceId) return
  try {
    const res = await api().get(`/financial-management/${invoiceId}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoiceId}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Download failed', text: err?.response?.data?.message ?? 'Unexpected error.' })
  }
}

async function sendMessage() {
  const threadId = workOrder.value?.message_thread?.id
  if (!threadId || !replyForm.value.body || !replyForm.value.sender_type) return
  try {
    await api().post(`/communication-management/threads/${threadId}/messages`, { ...replyForm.value })
    replyForm.value.body = ''
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to send message', text: err?.response?.data?.message ?? 'Unexpected error.' })
  }
}

async function closeThread() {
  const threadId = workOrder.value?.message_thread?.id
  if (!threadId) return
  const confirm = await Swal.fire({ icon: 'question', title: 'Close this conversation?', showCancelButton: true, confirmButtonText: 'Close Conversation' })
  if (!confirm.isConfirmed) return
  try {
    await api().post(`/communication-management/threads/${threadId}/close`)
    await Swal.fire({ icon: 'success', title: 'Conversation closed', timer: 1500, showConfirmButton: false })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to close thread', text: err?.response?.data?.message ?? 'Unexpected error.' })
  }
}

async function confirmFinishService() {
  const confirm = await Swal.fire({
    icon: 'question',
    title: 'Finish Service?',
    text: 'This will mark the work order as completed.',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Yes, Finish Service',
  })
  if (!confirm.isConfirmed) return
  await finishService()
}

const finishService = async () => {
  // TODO:
  // Finish Work Order API will be connected later.
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchWorkOrder()
})
</script>