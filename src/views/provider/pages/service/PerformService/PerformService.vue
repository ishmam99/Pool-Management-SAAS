<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">

    <!-- ═══════════════════════════════════════════════════
         HEADER - Glassmorphism Style
    ════════════════════════════════════════════════════ -->
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
      <div class=" px-4 sm:px-6 lg:px-8 py-4">
        <div v-if="loading" class="animate-pulse flex items-start justify-between gap-4">
          <div class="space-y-2">
            <div class="h-8 bg-slate-200 rounded-lg w-56"></div>
            <div class="h-4 bg-slate-200 rounded w-80"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-10 bg-slate-200 rounded-xl w-24"></div>
            <div class="h-10 bg-slate-200 rounded-xl w-20"></div>
          </div>
        </div>
        <div v-else class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
                Work Order #{{ workOrder?.id }}
              </h1>
              <span :class="workOrderStatusBadge(workOrder?.status)" class="text-sm">
                {{ formatStatus(workOrder?.status) }}
              </span>
              <span :class="workOrderTypeBadge(workOrder?.type)" class="text-sm">
                {{ formatStatus(workOrder?.type) }}
              </span>
            </div>
            <div class="mt-1.5 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-slate-600">
              <span class="flex items-center gap-1.5">
                <RiCalendarLine class="w-4 h-4 text-slate-400" />
                {{ formatDate(workOrder?.scheduled_visit?.scheduled_date) }}
              </span>
              <span class="flex items-center gap-1.5">
                <RiUserLine class="w-4 h-4 text-slate-400" />
                Technician: {{ workOrder?.technician?.name ?? 'Unassigned' }}
              </span>
              <span class="flex items-center gap-1.5">
                <RiGroupLine class="w-4 h-4 text-slate-400" />
                Customer: {{ workOrder?.customer?.contact_name ?? '—' }}
              </span>
              <span v-if="workOrder?.scheduled_visit?.time_window_start" class="flex items-center gap-1.5">
                <RiTimeLine class="w-4 h-4 text-slate-400" />
                {{ formatTime(workOrder?.scheduled_visit?.time_window_start) }} - {{ formatTime(workOrder?.scheduled_visit?.time_window_end) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
                 <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm text-slate-500">
            <span class="font-semibold text-slate-700">{{ completedCount }}</span> of {{ checklist.length }} completed
          </span>
          <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <button 
            @click="downloadPDF" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>

           <button 
            @click="downloadPDF" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Send Email
          </button>
         
        </div>
            <button @click="fetchWorkOrder" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow">
              <RiRefreshLine class="w-4 h-4" />
              Refresh
            </button>
            <!-- <button @click="openEditModal" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
              <RiEditLine class="w-4 h-4" />
              Edit
            </button> -->
            <button @click="$router.back()" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow">
              <RiArrowLeftLine class="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- ═══════════════════════════════════════════════════
           SKELETON LOADING
      ════════════════════════════════════════════════════ -->
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 animate-pulse space-y-4">
          <div class="h-6 bg-slate-200 rounded-lg w-40"></div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="j in 4" :key="j" class="h-5 bg-slate-200 rounded"></div>
          </div>
        </div>
      </template>

      <template v-else>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div class="flex flex-col items-center justify-center py-12">
            <div class="relative">
              <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p class="mt-4 text-slate-500 font-medium">Loading services...</p>
          </div>
        </div>

        <!-- Table Container -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="service-table">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Service ID
                  </th>
                  <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">
                    Photos
                  </th>
                  <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">
                    Status
                  </th>
                  <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">
                    Activities
                  </th>
                  <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[140px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in checklist" 
                  :key="index"
                  class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors duration-150"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'"
                >
                  <!-- Service ID -->
                  <td class="px-4 py-3.5 font-mono text-xs text-slate-500">
                    #{{ formatServiceId(item.service_id) }}
                  </td>

                  <!-- Service Name -->
                  <td class="px-4 py-3.5 font-medium text-slate-700">
                    {{ item.item }}
                  </td>

                  <!-- Photos -->
                  <td class="px-4 py-3.5">
                    <div class="space-y-2">
                      <!-- Existing Photos -->
                      <div v-if="item.photos && item.photos.length > 0" class="flex flex-wrap gap-2">
                        <div 
                          v-for="photo in item.photos" 
                          :key="photo.id"
                          class="relative group"
                        >
                          <img 
                            :src="buildImageUrl(photo.path)" 
                            alt="Checklist photo"
                            class="w-16 h-16 rounded-lg object-cover border border-slate-200"
                          />
                          <button
                            @click="deletePhotoFromChecklist(index, photo.id)"
                            class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            :disabled="savingRow === index"
                          >
                            <RiCloseLine class="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <!-- Upload Button -->
                      <div class="flex items-center gap-2">
                        <input
                          type="file"
                          :id="`checklist-file-${index}`"
                          class="hidden"
                          accept="image/*"
                          @change="handleChecklistFileUpload($event, index)"
                          :disabled="savingRow === index"
                        />
                        <label
                          :for="`checklist-file-${index}`"
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap"
                          :class="{'opacity-50 cursor-not-allowed': savingRow === index}"
                        >
                          <RiUploadLine class="w-3.5 h-3.5" />
                          Upload
                        </label>
                        <span v-if="pendingUploads[index]" class="text-xs text-blue-600">
                          <RiLoader4Line class="w-3.5 h-3.5 inline animate-spin" />
                          Uploading...
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-4 py-3.5">
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="item.isChecked"
                        :true-value="true"
                        :false-value="false"
                        class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        :disabled="savingRow === index"
                        @change="markDirty(index)"
                      />
                      <span class="text-xs" :class="item.isChecked ? 'text-emerald-600' : 'text-amber-600'">
                        {{ item.isChecked ? 'Completed' : 'Pending' }}
                      </span>
                    </div>
                  </td>

                  <!-- Activities -->
                  <td class="px-4 py-3.5">
                    <textarea
                      v-model="item.activities"
                      rows="2"
                      class="w-full px-3 py-1.5 text-xs bg-transparent border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y transition-all duration-200 placeholder:text-slate-400"
                      placeholder="Enter activities..."
                      :disabled="savingRow === index"
                      @input="markDirty(index)"
                    ></textarea>
                  </td>

                  <!-- Action -->
                  <td class="px-4 py-3.5">
                    <button
                      @click="applyRowChanges(index)"
                      :disabled="!dirtyRows[index] || savingRow === index"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                      <RiLoader4Line v-if="savingRow === index" class="w-3.5 h-3.5 animate-spin" />
                      <RiSaveLine v-else class="w-3.5 h-3.5" />
                      {{ savingRow === index ? 'Saving...' : 'Apply Changes' }}
                    </button>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="checklist.length === 0">
                  <td colspan="6" class="px-4 py-12 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <RiClipboardLine class="w-12 h-12 text-slate-300 mb-3" />
                      <p class="text-slate-500 font-medium">No checklist items available</p>
                      <p class="text-slate-400 text-sm mt-1">Checklist items will appear here once they are added</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ════════════════════════════
             SECTION 2 — Service Overview
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-blue-600"></span>
              Service Overview
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
              <span :class="workOrderStatusBadge(workOrder?.status)" class="self-start">{{ formatStatus(workOrder?.status) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</span>
              <span :class="workOrderTypeBadge(workOrder?.type)" class="self-start">{{ formatStatus(workOrder?.type) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Scheduled Date</span>
              <span class="text-sm font-medium text-slate-900">{{ formatDate(workOrder?.scheduled_visit?.scheduled_date) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Service Window</span>
              <span class="text-sm font-medium text-slate-900">{{ formatTime(workOrder?.scheduled_visit?.time_window_start) }} — {{ formatTime(workOrder?.scheduled_visit?.time_window_end) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Started At</span>
              <span class="text-sm font-medium text-slate-900">{{ formatDateTime(workOrder?.started_at) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Finished At</span>
              <span class="text-sm font-medium text-slate-900">{{ formatDateTime(workOrder?.finished_at) }}</span>
            </div>
            <div v-if="workOrder?.notes" class="flex flex-col gap-0.5 sm:col-span-2 lg:col-span-3">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</span>
              <span class="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{{ workOrder.notes }}</span>
            </div>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 3 — Checklist (Legacy View)
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-emerald-600"></span>
              Checklist Overview
            </h2>
            <span class="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {{ getCompletedChecklistCount() }} / {{ checklist.length }}
            </span>
          </div>
          <div class="p-6">
            <div v-if="checklist.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(item, index) in checklist"
                :key="index"
                @click="toggleChecklist(item)"
                :class="[
                  'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none',
                  item.isChecked
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                ]"
              >
                <div :class="[
                  'w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all duration-200',
                  item.isChecked ? 'bg-emerald-500 border-emerald-500 shadow-sm' : 'border-slate-300 bg-white'
                ]">
                  <RiCheckLine v-if="item.isChecked" class="w-3.5 h-3.5 text-white" />
                </div>
                <span :class="['text-sm font-medium transition-all duration-200', item.isChecked ? 'text-emerald-700 line-through' : 'text-slate-700']">
                  {{ item.item }}
                </span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
              <div class="p-4 rounded-full bg-slate-100 mb-3">
                <RiClipboardLine class="w-8 h-8 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500">No checklist items available.</p>
            </div>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 4 — Customer & Pool (Two Column)
        ═════════════════════════════ -->
        <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span class="w-1 h-5 rounded-full bg-indigo-600"></span>
                Customer
              </h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-indigo-50">
                  <RiUserLine class="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Contact Name</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.customer?.contact_name ?? '—' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-indigo-50">
                  <RiPhoneLine class="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.customer?.phone ?? '—' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-indigo-50">
                  <RiMailLine class="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.customer?.email ?? '—' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-indigo-50">
                  <RiMapPinLine class="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Billing Address</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.customer?.billing_address ?? '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span class="w-1 h-5 rounded-full bg-cyan-600"></span>
                Pool Information
              </h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyan-50">
                  <RiWaterFlashLine class="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Pool Name</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.pool?.label ?? '—' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyan-50">
                  <RiMapPin2Line class="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Service Address</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.pool?.service_address ?? '—' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-xl bg-cyan-50">
                    <RiKeyLine class="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Gate Code</p>
                    <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.pool?.gate_code ?? '—' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-xl bg-cyan-50">
                    <RiFootprintLine class="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Has Dog</p>
                    <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.pool?.has_dog ? 'Yes' : 'No' }}</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-xl bg-cyan-50">
                    <RiFlaskLine class="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Chemical Type</p>
                    <p class="text-sm font-medium text-slate-900 mt-0.5">{{ formatStatus(workOrder?.pool?.chemical_type) }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-xl bg-cyan-50">
                    <RiSunLine class="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Season</p>
                    <p class="text-sm font-medium text-slate-900 mt-0.5">{{ formatStatus(workOrder?.pool?.season) }}</p>
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyan-50">
                  <RiRulerLine class="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Volume</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder?.pool?.volume_gallons ? workOrder.pool.volume_gallons + ' gal' : '—' }}</p>
                </div>
              </div>
              <div v-if="workOrder?.pool?.access_notes" class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyan-50">
                  <RiFileTextLine class="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Access Notes</p>
                  <p class="text-sm font-medium text-slate-900 mt-0.5">{{ workOrder.pool.access_notes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 5 — Equipment
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-orange-600"></span>
              Equipment
            </h2>
          </div>
          <div v-if="workOrder?.pool?.equipment?.length" class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-100">
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Brand</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Model</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Serial Number</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Install Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(eq, i) in workOrder.pool?.equipment" :key="eq.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-3.5 text-sm font-medium text-slate-900">
                    <span class="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                      {{ formatStatus(eq.type) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-sm text-slate-700">{{ eq.brand ?? '—' }}</td>
                  <td class="px-4 py-3.5 text-sm text-slate-700">{{ eq.model ?? '—' }}</td>
                  <td class="px-4 py-3.5 text-sm font-mono text-slate-500">{{ eq.serial_number ?? '—' }}</td>
                  <td class="px-4 py-3.5 text-sm text-slate-700">{{ formatDate(eq.install_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <div class="p-4 rounded-full bg-slate-100 mb-3">
              <RiToolsLine class="w-8 h-8 text-slate-400" />
            </div>
            <p class="text-sm text-slate-500">No equipment found.</p>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 6 — Photos
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-purple-600"></span>
              Photos
              <span class="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {{ workOrder?.photos?.length || 0 }}
              </span>
            </h2>
          </div>
          <div class="p-6 space-y-8">

            <div v-for="group in photoGroups" :key="group.type">
              <div v-if="group.photos.length">
                <h3 class="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  {{ group.label }}
                  <span class="ml-1 text-slate-400">({{ group.photos.length }})</span>
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div
                    v-for="photo in group.photos"
                    :key="photo.id"
                    class="relative rounded-xl overflow-hidden border border-slate-200 group aspect-square bg-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <img :src="buildImageUrl(photo.path)" :alt="group.label" class="w-full h-full object-cover"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                      <button @click="deletePhoto(photo.id)" class="bg-rose-600 text-white rounded-xl px-4 py-1.5 text-xs font-medium hover:bg-rose-700 transition-all duration-200 shadow-lg">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 pt-6">
              <h3 class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <RiUploadCloudLine class="w-4 h-4 text-slate-400" />
                Upload Photo
              </h3>
              <div class="space-y-4">
                <div
                  @dragover.prevent
                  @drop.prevent="onPhotoDrop"
                  @click="$refs.photoInput.click()"
                  class="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-200"
                >
                  <div class="p-4 rounded-full bg-blue-50 mb-3">
                    <RiImageAddLine class="w-8 h-8 text-blue-500" />
                  </div>
                  <p class="text-sm text-slate-600">Drag & drop or <span class="text-blue-600 font-semibold hover:underline">click to browse</span></p>
                  <p class="text-xs text-slate-400 mt-1">Supports JPG, PNG, GIF</p>
                  <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelect"/>
                </div>

                <div v-if="uploadPreview" class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <img :src="uploadPreview" class="w-16 h-16 rounded-xl object-cover border border-slate-200"/>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 truncate">{{ uploadFile?.name }}</p>
                    <p class="text-xs text-slate-500">{{ formatFileSize(uploadFile?.size) }}</p>
                  </div>
                  <button @click="clearPhotoUpload" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg">
                    <RiCloseLine class="w-4 h-4" />
                  </button>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                  <select v-model="uploadType" class="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                    <option value="">Select Type</option>
                    <option v-for="t in photoTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                  </select>
                  <button
                    @click="uploadPhoto"
                    :disabled="!uploadFile || !uploadType || uploadingPhoto"
                    class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <RiLoader4Line v-if="uploadingPhoto" class="w-4 h-4 animate-spin" />
                    <RiUploadLine v-else class="w-4 h-4" />
                    {{ uploadingPhoto ? 'Uploading…' : 'Upload Photo' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 7 — Chemical Readings
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-amber-600"></span>
              Chemical Readings
            </h2>
            <div v-if="workOrder?.chemical_reading?.is_balanced" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              <RiCheckboxCircleLine class="w-3.5 h-3.5" />
              Balanced
            </div>
          </div>
          <div class="p-6">

            <div v-if="workOrder?.chemical_reading?.recommendations" class="mb-6 flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800">
              <RiAlertLine class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span>{{ workOrder.chemical_reading.recommendations }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">pH</label>
                <input v-model="chemForm.ph" type="number" step="0.01" placeholder="7.4" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Free Chlorine</label>
                <input v-model="chemForm.free_chlorine" type="number" step="0.01" placeholder="1.0" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Chlorine</label>
                <input v-model="chemForm.total_chlorine" type="number" step="0.01" placeholder="1.0" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Alkalinity</label>
                <input v-model="chemForm.alkalinity" type="number" step="1" placeholder="100" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">CYA</label>
                <input v-model="chemForm.cya" type="number" step="1" placeholder="40" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Salt</label>
                <input v-model="chemForm.salt" type="number" step="1" placeholder="3000" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
              </div>
              <div class="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Water Clarity</label>
                <select v-model="chemForm.water_clarity" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="">Select clarity</option>
                  <option v-for="opt in waterClarityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button @click="saveChemicalReading" :disabled="savingChem" 
                class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg">
                <RiLoader4Line v-if="savingChem" class="w-4 h-4 animate-spin" />
                <RiSaveLine v-else class="w-4 h-4" />
                {{ workOrder?.chemical_reading ? 'Update Reading' : 'Create Reading' }}
              </button>
            </div>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 8 — Chemicals Added
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-teal-600"></span>
              Chemicals Added
            </h2>
            <button @click="showAddChemModal = true" 
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow">
              <RiAddLine class="w-3.5 h-3.5" />
              Add Chemical
            </button>
          </div>

          <div v-if="workOrder?.chemicals_added?.length" class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-100">
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Chemical</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Unit</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reason</th>
                  <th class="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(chem, i) in workOrder.chemicals_added" :key="chem.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-3.5 text-sm font-medium text-slate-900">
                    <span class="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
                      {{ formatStatus(chem.chemical_type) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-sm text-slate-700">{{ chem.quantity }}</td>
                  <td class="px-4 py-3.5 text-sm text-slate-700">{{ chem.unit }}</td>
                  <td class="px-4 py-3.5 text-sm text-slate-700">{{ formatStatus(chem.reason) }}</td>
                  <td class="px-4 py-3.5 text-sm text-slate-500">{{ formatDate(chem.created_at) }}</td>
                  <td class="px-4 py-3.5 text-right">
                    <button @click="deleteChemical(chem.id)" class="text-rose-500 hover:text-rose-700 text-xs font-medium transition-colors hover:bg-rose-50 px-3 py-1 rounded-lg">
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <div class="p-4 rounded-full bg-slate-100 mb-3">
              <RiFlaskLine class="w-8 h-8 text-slate-400" />
            </div>
            <p class="text-sm text-slate-500">No chemicals added yet.</p>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 9 — Invoice
        ═════════════════════════════ -->
        <!-- <div v-if="workOrder?.type !== 'routine'" class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-rose-600"></span>
              Invoice
            </h2>
            <div class="flex gap-2">
              <button v-if="!workOrder?.invoice" @click="showInvoiceModal = true" 
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow">
                <RiAddLine class="w-3.5 h-3.5" />
                Create Invoice
              </button>
              <template v-else>
                <button @click="sendInvoice" 
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm">
                  <RiSendPlaneLine class="w-3.5 h-3.5" />
                  Send
                </button>
                <button @click="downloadInvoice" 
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm">
                  <RiDownloadLine class="w-3.5 h-3.5" />
                  PDF
                </button>
              </template>
            </div>
          </div>
          <div class="p-6">
            <div v-if="workOrder?.invoice" class="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</span>
                <span class="text-sm font-semibold text-slate-900">#{{ workOrder.invoice.invoice_number }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                <span :class="invoiceStatusBadge(workOrder.invoice.status)" class="self-start">{{ formatStatus(workOrder.invoice.status) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Total</span>
                <span class="text-sm font-bold text-slate-900">{{ formatCurrency(workOrder.invoice.total) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Paid</span>
                <span class="text-sm font-bold text-emerald-600">{{ formatCurrency(workOrder.invoice.paid) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Balance Due</span>
                <span class="text-sm font-bold text-rose-600">{{ formatCurrency((workOrder.invoice.total ?? 0) - (workOrder.invoice.paid ?? 0)) }}</span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
              <div class="p-4 rounded-full bg-slate-100 mb-3">
                <RiFileTextLine class="w-8 h-8 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500">No invoice created yet.</p>
            </div>
          </div>
        </div> -->

        <!-- ════════════════════════════
             SECTION 10 — Message Thread
        ═════════════════════════════ -->
        <!-- <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span class="w-1 h-5 rounded-full bg-indigo-600"></span>
              Message Thread
            </h2>
            <div v-if="workOrder?.message_thread" class="flex items-center gap-2">
              <span :class="threadStatusBadge(workOrder.message_thread?.status)">{{ formatStatus(workOrder.message_thread?.status) }}</span>
              <button v-if="workOrder.message_thread?.status !== 'closed'" @click="closeThread" 
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm">
                <RiCloseLine class="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          </div>
          <div class="p-6">

            <div v-if="!workOrder?.invoice" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="p-4 rounded-full bg-slate-100 mb-3">
                <RiChat4Line class="w-8 h-8 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500">Create an invoice before starting a conversation.</p>
            </div>

            <div v-else-if="!workOrder?.message_thread" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="p-4 rounded-full bg-slate-100 mb-3">
                <RiChat4Line class="w-8 h-8 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500 mb-4">No active conversation.</p>
              <button @click="openCreateThreadModal" 
                class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
                <RiAddLine class="w-4 h-4" />
                Create Conversation
              </button>
            </div>

            <div v-else>
              <div class="space-y-3 max-h-80 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                <div v-if="!workOrder.message_thread?.messages?.length" class="text-center text-sm text-slate-400 py-6">No messages yet.</div>
                <div
                  v-for="msg in workOrder.message_thread?.messages"
                  :key="msg.id"
                  :class="['flex', msg.sender_type === 'customer' ? 'justify-start' : 'justify-end']"
                >
                  <div :class="[
                    'max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                    msg.sender_type === 'customer'
                      ? 'bg-slate-100 text-slate-900 rounded-tl-sm'
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

              <div v-if="workOrder.message_thread?.status !== 'closed'" class="flex gap-2 border-t border-slate-100 pt-4">
                <select v-model="replyForm.sender_type" 
                  class="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shrink-0">
                  <option value="">As…</option>
                  <option value="office">Office</option>
                  <option value="technician">Technician</option>
                  <option value="customer">Customer</option>
                </select>
                <input v-model="replyForm.body" type="text" placeholder="Type a message…" 
                  class="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"/>
                <button @click="sendMessage" :disabled="!replyForm.body || !replyForm.sender_type" 
                  class="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg">
                  <RiSendPlaneLine class="w-4 h-4" />
                  Send
                </button>
              </div>
              <div v-else class="text-center text-sm text-slate-400 border-t border-slate-100 pt-4">This conversation is closed.</div>
            </div>

          </div>
        </div> -->

        <!-- ════════════════════════════
             FINISH SERVICE — CTA
        ═════════════════════════════ -->
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/60 shadow-sm overflow-hidden">
          <div class="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-semibold text-emerald-900 flex items-center gap-2">
                <span class="w-1 h-5 rounded-full bg-emerald-600"></span>
                Finish Service
              </h2>
              <p class="text-sm text-emerald-700/80 mt-1">
                Current Status: <span :class="workOrderStatusBadge(workOrder?.status)" class="ml-1.5">{{ formatStatus(workOrder?.status) }}</span>
              </p>
              <p class="text-sm text-emerald-600/70 mt-0.5">Mark the work order as completed.</p>
            </div>
            <button
              @click="confirmFinishService"
              :disabled="workOrder?.status === 'completed'"
              class="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RiCheckboxCircleLine class="w-5 h-5" />
              {{ workOrder?.status === 'completed' ? 'Service Completed' : 'Finish Service' }}
            </button>
          </div>
        </div>

      </template>
    </main>

    <!-- ═══════════════════════════════════════════════════
         MODALS
    ════════════════════════════════════════════════════ -->

    <!-- ─── Edit Work Order ─── -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
            <h3 class="text-lg font-bold text-slate-900">Edit Work Order</h3>
            <button @click="closeEditModal" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl">
              <RiCloseLine class="w-5 h-5" />
            </button>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Status -->
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Status</label>
              <select v-model="editForm.status" 
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
              </select>
            </div>

            <!-- Checklist -->
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Checklist</label>
              <div class="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div v-for="(item, index) in editForm.checklist" :key="index" class="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    v-model="item._checked"
                    class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span class="text-sm text-slate-700">{{ item.item }}</span>
                </div>
              </div>
            </div>

            <!-- Timing -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Started At</label>
                <input v-model="editForm.started_at" type="datetime-local" 
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Finished At</label>
                <input v-model="editForm.finished_at" type="datetime-local" 
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
            </div>

            <!-- GPS Coordinates -->
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">GPS Coordinates</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div>
                  <label class="text-xs text-slate-500 block mb-0.5">Start Lat</label>
                  <input v-model="editForm.start_lat" type="number" step="any" 
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                </div>
                <div>
                  <label class="text-xs text-slate-500 block mb-0.5">Start Lng</label>
                  <input v-model="editForm.start_lng" type="number" step="any" 
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                </div>
                <div>
                  <label class="text-xs text-slate-500 block mb-0.5">Finish Lat</label>
                  <input v-model="editForm.finish_lat" type="number" step="any" 
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                </div>
                <div>
                  <label class="text-xs text-slate-500 block mb-0.5">Finish Lng</label>
                  <input v-model="editForm.finish_lng" type="number" step="any" 
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Notes</label>
              <textarea v-model="editForm.notes" rows="4" 
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" 
                placeholder="Add notes..."></textarea>
            </div>
          </div>

          <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-t border-slate-100 flex justify-end gap-3 z-10">
            <button @click="closeEditModal" class="px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200">Cancel</button>
            <button @click="saveWorkOrder" :disabled="savingWorkOrder" 
              class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg">
              <RiLoader4Line v-if="savingWorkOrder" class="w-4 h-4 animate-spin" />
              <RiSaveLine v-else class="w-4 h-4" />
              {{ savingWorkOrder ? 'Saving...' : 'Save Work Order' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ─── Create Thread ─── -->
    <Teleport to="body">
      <div v-if="showCreateThreadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">Create Conversation</h3>
            <button @click="showCreateThreadModal = false" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl">
              <RiCloseLine class="w-5 h-5" />
            </button>
          </div>
          <div class="p-6">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
              <textarea 
                v-model="threadForm.body" 
                rows="4" 
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" 
                placeholder="We have completed your weekly pool service. Everything looks great."
                required
              ></textarea>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button @click="showCreateThreadModal = false" class="px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200">Cancel</button>
            <button @click="createThreadWithMessage" :disabled="!threadForm.body || creatingThread" 
              class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg">
              <RiLoader4Line v-if="creatingThread" class="w-4 h-4 animate-spin" />
              <RiChat4Line v-else class="w-4 h-4" />
              Create Conversation
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ─── Add Chemical ─── -->
    <Teleport to="body">
      <div v-if="showAddChemModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">Add Chemical</h3>
            <button @click="showAddChemModal = false" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl">
              <RiCloseLine class="w-5 h-5" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chemical Type</label>
              <select v-model="chemAddForm.chemical_type" 
                class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="">Select chemical</option>
                <option v-for="c in chemicalTypes" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</label>
                <input v-model="chemAddForm.quantity" type="number" step="0.01" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</label>
                <select v-model="chemAddForm.unit" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="">Select unit</option>
                  <option v-for="u in chemicalUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</label>
              <select v-model="chemAddForm.reason" 
                class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="">Select reason</option>
                <option v-for="r in chemicalReasons" :key="r.value" :value="r.value">{{ r.label }}</option>
              </select>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button @click="showAddChemModal = false" class="px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200">Cancel</button>
            <button @click="addChemical" :disabled="addingChem" 
              class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg">
              <RiLoader4Line v-if="addingChem" class="w-4 h-4 animate-spin" />
              <RiFlaskLine v-else class="w-4 h-4" />
              Add Chemical
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ─── Create Invoice ─── -->
    <Teleport to="body">
      <div v-if="showInvoiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
            <h3 class="text-lg font-bold text-slate-900">Create Invoice</h3>
            <button @click="showInvoiceModal = false" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl">
              <RiCloseLine class="w-5 h-5" />
            </button>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice Date</label>
                <input v-model="invoiceForm.invoice_date" type="date" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</label>
                <input v-model="invoiceForm.due_date" type="date" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Billing Start</label>
                <input v-model="invoiceForm.billing_start" type="date" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Billing End</label>
                <input v-model="invoiceForm.billing_end" type="date" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtotal</label>
                <input v-model="invoiceForm.subtotal" type="number" step="0.01" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax</label>
                <input v-model="invoiceForm.tax" type="number" step="0.01" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discount</label>
                <input v-model="invoiceForm.discount" type="number" step="0.01" 
                  class="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
              </div>
            </div>

            <!-- Line Items -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-semibold text-slate-700">Line Items</h4>
                <button @click="addLineItem" 
                  class="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm">
                  <RiAddLine class="w-3.5 h-3.5" />
                  Add Item
                </button>
              </div>
              <div class="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div v-for="(item, i) in invoiceForm.line_items" :key="i" class="flex flex-wrap gap-2 items-center">
                  <input v-model="item.description" type="text" placeholder="Description" 
                    class="flex-1 min-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                  <input v-model="item.quantity" type="number" placeholder="Qty" 
                    class="w-16 border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                  <input v-model="item.unit_price" type="number" placeholder="Price" 
                    class="w-24 border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
                  <label class="flex items-center gap-1 text-xs text-slate-600 shrink-0">
                    <input v-model="item.taxable" type="checkbox" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                    Tax
                  </label>
                  <button @click="removeLineItem(i)" class="text-rose-400 hover:text-rose-600 transition-colors p-1 hover:bg-rose-50 rounded-lg">
                    <RiCloseLine class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="!invoiceForm.line_items.length" class="text-sm text-slate-400 italic text-center py-2">No line items. Add one above.</div>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-t border-slate-100 flex justify-end gap-3 z-10">
            <button @click="showInvoiceModal = false" class="px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200">Cancel</button>
            <button @click="createInvoice" :disabled="creatingInvoice" 
              class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg">
              <RiLoader4Line v-if="creatingInvoice" class="w-4 h-4 animate-spin" />
              <RiFileTextLine v-else class="w-4 h-4" />
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../../services/api.js'
import jsPDF from "jspdf";

// ─── Icon Imports from Remix Icon ──────────────────────────────────────────
import {
  RiCalendarLine,
  RiUserLine,
  RiGroupLine,
  RiTimeLine,
  RiRefreshLine,
  RiEditLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCloseLine,
  RiClipboardLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiMapPin2Line,
  RiWaterFlashLine,
  RiKeyLine,
  RiFootprintLine,
  RiFlaskLine,
  RiSunLine,
  RiRulerLine,
  RiFileTextLine,
  RiToolsLine,
  RiImageLine,
  RiImageAddLine,
  RiUploadCloudLine,
  RiUploadLine,
  RiLoader4Line,
  RiAlertLine,
  RiSaveLine,
  RiAddLine,
  RiSendPlaneLine,
  RiDownloadLine,
  RiChat4Line
} from '@remixicon/vue'

// ─── Router ───────────────────────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const workOrderId = route.params.id

// ─── State ────────────────────────────────────────────────────────────────────
const workOrder     = ref(null)
const loading       = ref(false)

// Checklist state
const checklist = ref([])
const dirtyRows = reactive({})
const savingRow = ref(null)
const pendingUploads = reactive({})

// Photo upload state
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
const completedCount = computed(() => {
  return checklist.value.filter(item => item.isChecked).length
})

const photoGroups = computed(() => {
  const photos = workOrder.value?.photos ?? []
  return photoTypes.map(t => ({
    type: t.value,
    label: t.label,
    photos: photos.filter(p => p.type === t.value),
  }))
})

const getCompletedChecklistCount = () => {
  return checklist.value.filter(item => item.isChecked).length
}

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

function formatServiceId(serviceId) {
  return `100${serviceId}`
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
  item.isChecked = !item.isChecked
  const index = checklist.value.findIndex(i => i.service_id === item.service_id)
  if (index !== -1) {
    markDirty(index)
  }
}

function markDirty(index) {
  dirtyRows[index] = true
}

// ─── Badge Helpers ────────────────────────────────────────────────────────────
function workOrderStatusBadge(s) {
  const map = {
    completed:   'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    in_progress: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    pending_review: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    scheduled:   'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    created:     'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    assigned:    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  }
  return map[s] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function workOrderTypeBadge(t) {
  const map = {
    routine:      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    emergency:    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    repair:       'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    inspection:   'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    installation: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  }
  return map[t] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function invoiceStatusBadge(s) {
  const map = {
    paid:    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    sent:    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    overdue: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    draft:   'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return map[s] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

function threadStatusBadge(s) {
  const map = {
    open:   'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    closed: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return map[s] ?? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200'
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

// ─── Checklist Photo Management ──────────────────────────────────────────────
function handleChecklistFileUpload(event, index) {
  const file = event.target.files?.[0]
  if (!file) return
  
  // Upload the photo immediately
  uploadChecklistPhoto(index, file)
  event.target.value = ''
}

async function uploadChecklistPhoto(index, file) {
  pendingUploads[index] = true
  
  try {
    const fd = new FormData()
    fd.append('photo', file)
    fd.append('type', 'after')
    fd.append('taken_at', new Date().toISOString())
    
    const res = await api().post(`/work-order-management/${workOrderId}/photos`, fd, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    })
    
    const photoData = res.data?.data || res.data
    
    // Add photo to the checklist item
    if (!checklist.value[index].photos) {
      checklist.value[index].photos = []
    }
    checklist.value[index].photos.push(photoData)
    
    // Mark as dirty so user can save
    markDirty(index)
    
    await Swal.fire({ 
      icon: 'success', 
      title: 'Photo uploaded', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Upload failed', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    delete pendingUploads[index]
  }
}

async function deletePhotoFromChecklist(index, photoId) {
  const confirm = await Swal.fire({ 
    icon: 'warning', 
    title: 'Delete photo?', 
    showCancelButton: true, 
    confirmButtonColor: '#dc2626', 
    confirmButtonText: 'Delete',
    cancelButtonColor: '#6b7280'
  })
  if (!confirm.isConfirmed) return
  
  try {
    await api().delete(`/work-order-management/photos/${photoId}`)
    
    // Remove from local checklist
    const item = checklist.value[index]
    if (item.photos) {
      item.photos = item.photos.filter(p => p.id !== photoId)
      markDirty(index)
    }
    
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Delete failed', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  }
}

// ─── Row Save Functionality ──────────────────────────────────────────────────
async function applyRowChanges(index) {
  if (savingRow.value !== null || !dirtyRows[index]) return
  
  savingRow.value = index
  
  try {
    // Get the current checklist item
    const item = checklist.value[index]
    
    // Prepare the updated checklist array
    const updatedChecklist = checklist.value.map((ci, i) => {
      if (i === index) {
        return {
          ...ci,
          isChecked: ci.isChecked,
          activities: ci.activities || '',
          photos: ci.photos || []
        }
      }
      return ci
    })
    
    // Update the work order with the latest checklist
    const payload = {
      checklist: updatedChecklist.map(ci => ({
        service_id: ci.service_id,
        item: ci.item,
        isChecked: ci.isChecked ? 'true' : 'false',
        activities: ci.activities || '',
        photos: ci.photos || []
      })),
      _method: 'PUT'
    }
    
    await api().post(`/work-order-management/work-orders/${workOrderId}`, payload)
    
    // Clear dirty flag
    delete dirtyRows[index]
    
    await Swal.fire({
      icon: 'success',
      title: 'Changes saved successfully',
      timer: 1500,
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    
    // Refresh the work order data to get the latest
    await fetchWorkOrder()
    
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to save changes',
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    savingRow.value = null
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
        service_id: item.service_id,
        item: item.item,
        isChecked: item._checked ? 'true' : 'false',
        activities: item.activities || '',
        photos: item.photos || []
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
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    
    showEditModal.value = false
    await fetchWorkOrder()
    
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to update work order',
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
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
      text: 'Invoice or customer information is missing.',
      confirmButtonColor: '#3b82f6'
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
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to create thread',
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
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
      checklist.value = data.checklist.map(item => ({
        ...item,
        isChecked: item.isChecked === 'true' || item.isChecked === true,
        activities: item.activities || '',
        photos: item.photos || []
      }))
    } else {
      checklist.value = []
    }
    
    workOrder.value = data
    syncChemForm()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to load work order',
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
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
    await Swal.fire({ 
      icon: 'success', 
      title: 'Photo uploaded', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Upload failed', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    uploadingPhoto.value = false
  }
}

async function deletePhoto(photoId) {
  const confirm = await Swal.fire({ 
    icon: 'warning', 
    title: 'Delete photo?', 
    showCancelButton: true, 
    confirmButtonColor: '#dc2626', 
    confirmButtonText: 'Delete',
    cancelButtonColor: '#6b7280'
  })
  if (!confirm.isConfirmed) return
  try {
    await api().delete(`/work-order-management/photos/${photoId}`)
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Delete failed', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
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
    await Swal.fire({ 
      icon: 'success', 
      title: 'Reading saved', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Save failed', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
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
    await Swal.fire({ 
      icon: 'success', 
      title: 'Chemical added', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to add chemical', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    addingChem.value = false
  }
}

async function deleteChemical(id) {
  const confirm = await Swal.fire({ 
    icon: 'warning', 
    title: 'Remove chemical?', 
    showCancelButton: true, 
    confirmButtonColor: '#dc2626', 
    confirmButtonText: 'Remove',
    cancelButtonColor: '#6b7280'
  })
  if (!confirm.isConfirmed) return
  try {
    await api().delete(`/chemical-management/chemicals-added/${id}`)
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to remove', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  }
}

async function createInvoice() {
  creatingInvoice.value = true
  try {
    await api().post('/financial-management/invoices', { ...invoiceForm.value, work_order_id: workOrderId })
    showInvoiceModal.value = false
    await Swal.fire({ 
      icon: 'success', 
      title: 'Invoice created', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to create invoice', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    creatingInvoice.value = false
  }
}

async function sendInvoice() {
  const invoiceId = workOrder.value?.invoice?.id
  if (!invoiceId) return
  try {
    await api().post(`/financial-management/${invoiceId}/send`)
    await Swal.fire({ 
      icon: 'success', 
      title: 'Invoice sent', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to send invoice', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
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
    Swal.fire({ 
      icon: 'error', 
      title: 'Download failed', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
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
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to send message', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
  }
}

async function closeThread() {
  const threadId = workOrder.value?.message_thread?.id
  if (!threadId) return
  const confirm = await Swal.fire({ 
    icon: 'question', 
    title: 'Close this conversation?', 
    showCancelButton: true, 
    confirmButtonText: 'Close Conversation',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280'
  })
  if (!confirm.isConfirmed) return
  try {
    await api().post(`/communication-management/threads/${threadId}/close`)
    await Swal.fire({ 
      icon: 'success', 
      title: 'Conversation closed', 
      timer: 1500, 
      showConfirmButton: false,
      background: '#ffffff',
      iconColor: '#3b82f6'
    })
    await fetchWorkOrder()
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to close thread', 
      text: err?.response?.data?.message ?? 'Unexpected error.',
      confirmButtonColor: '#3b82f6'
    })
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
    cancelButtonColor: '#6b7280'
  })
  if (!confirm.isConfirmed) return
  await finishService()
}

const finishService = async () => {
  // TODO: Finish Work Order API will be connected later.
  await Swal.fire({
    icon: 'info',
    title: 'Feature Coming Soon',
    text: 'Finish service API will be integrated shortly.',
    confirmButtonColor: '#3b82f6'
  })
}






const loadImageAsBase64 = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${url}`);
  }

  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();

      img.onload = () => {
        resolve({
          data: reader.result,
          width: img.width,
          height: img.height,
          format: blob.type.includes("png") ? "PNG" : "JPEG"
        });
      };

      img.onerror = (err) => reject(new Error(`Could not decode image data from ${url}`));

      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error(`FileReader failed for ${url}`));

    reader.readAsDataURL(blob);
  });
};

const downloadPDF = async () => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Helper function to add text with wrapping
    const addWrappedText = (text, x, y, maxWidth, lineHeight = 6) => {
      if (!text) return y;
      const textStr = String(text);
      const lines = doc.splitTextToSize(textStr, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    // Helper to ensure space on page
    const ensureSpace = (neededSpace) => {
      if (yPos + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    // ---- HEADER ----
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('Pool Visit Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    // ---- REPORT INFORMATION ----
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
    yPos += 6;

    // Get work order data
    const wo = workOrder.value;

    // Two column layout for info
    const col1X = margin;
    const col2X = pageWidth / 2 + 10;
    const lineHeight = 7;

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    // Left column
    let col1Y = yPos;
    doc.setFont('helvetica', 'bold');
    doc.text('Work Order ID:', col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.id || 'N/A'), col1X + 35, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Visit Date:', col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.scheduled_visit?.scheduled_date || 'N/A'), col1X + 30, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Technician:', col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.technician?.name || 'N/A'), col1X + 30, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Customer:', col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.customer?.contact_name || 'N/A'), col1X + 28, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.customer?.phone || 'N/A'), col1X + 22, col1Y);
    col1Y += lineHeight;

    // Right column
    let col2Y = yPos;
    doc.setFont('helvetica', 'bold');
    doc.text('Pool Name:', col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.pool?.label || 'N/A'), col2X + 28, col2Y);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Address:', col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.pool?.service_address || 'N/A'), col2X + 25, col2Y);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    const statusText = String(wo?.status || 'N/A');
    doc.setTextColor(statusText === 'Completed' ? 34 : 234,
                     statusText === 'Completed' ? 197 : 179,
                     statusText === 'Completed' ? 94 : 8);
    doc.text(statusText, col2X + 20, col2Y);
    doc.setTextColor(30, 41, 59);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.customer?.email || 'N/A'), col2X + 18, col2Y);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Type:', col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(wo?.type || 'N/A'), col2X + 18, col2Y);
    col2Y += lineHeight;

    yPos = Math.max(col1Y, col2Y) + 8;

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // ---- SERVICE LIST SECTION ----
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('Service List', margin, yPos);
    yPos += 8;

    // Get checklist data
    const checklist = wo?.checklist || [];

    // Process each checklist item
    for (let i = 0; i < checklist.length; i++) {
      const item = checklist[i];

      // Check if we need a new page for this section
      ensureSpace(50);

      // Separator line before each service (except first)
      if (i > 0) {
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 6;
      }

      // Service Title
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text(`Service: ${String(item?.item || 'Untitled Service')}`, margin, yPos);
      yPos += 7;

      // Status
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('Status:', margin, yPos);
      const isChecked = String(item?.isChecked) === 'true' || item?.isChecked === true;
      doc.setTextColor(isChecked ? 34 : 197, isChecked ? 197 : 179, isChecked ? 94 : 8);
      doc.setFont('helvetica', 'bold');
      doc.text(isChecked ? 'Completed' : 'Pending', margin + 20, yPos);
      doc.setTextColor(30, 41, 59);
      yPos += 7;

      // Activities
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('Activities:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      yPos += 5;

      const activitiesText = String(item?.activities || 'No activities recorded.');
      yPos = addWrappedText(activitiesText, margin + 2, yPos, pageWidth - margin * 2 - 4);
      yPos += 4;

      // Photos
      const photos = item?.photos || [];
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('Photos:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      yPos += 5;

      if (photos.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No photos uploaded.', margin + 2, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        yPos += 6;
      } else {
        // Add photos
        const maxPhotoWidth = 70;
        const maxPhotoHeight = 50;
        const photoSpacing = 5;

        const photosPerRow = Math.floor((pageWidth - margin * 2 - 4) / (maxPhotoWidth + photoSpacing));
        let currentRow = 0;
        let currentCol = 0;
        let photoY = yPos;

        for (let p = 0; p < photos.length; p++) {
          const photo = photos[p];

          let imageUrl = null;

          if (typeof photo === 'string') {
            if (photo.startsWith('work-orders/') || photo.includes('/')) {
              imageUrl = buildImageUrl(photo);
            } else {
              imageUrl = photo;
            }
          } else if (photo?.path) {
            imageUrl = buildImageUrl(photo.path);
          }

          if (!imageUrl) {
            console.warn('Invalid photo data:', photo);
            continue;
          }

          console.log('PDF Image URL:', imageUrl);

          try {
            const image = await loadImageAsBase64(imageUrl);

            let width = image.width;
            let height = image.height;

            if (width > maxPhotoWidth) {
              const ratio = maxPhotoWidth / width;
              width = maxPhotoWidth;
              height = height * ratio;
            }
            if (height > maxPhotoHeight) {
              const ratio = maxPhotoHeight / height;
              height = maxPhotoHeight;
              width = width * ratio;
            }

            const photoX = margin + 2 + (currentCol * (maxPhotoWidth + photoSpacing));
            photoY = yPos + (currentRow * (maxPhotoHeight + photoSpacing));

            if (photoY + maxPhotoHeight > pageHeight - margin) {
              doc.addPage();
              yPos = margin;
              photoY = margin;
              currentRow = 0;
              currentCol = 0;
            }

            doc.addImage(image.data, image.format, photoX, photoY, width, height);

            currentCol++;
            if (currentCol >= photosPerRow) {
              currentCol = 0;
              currentRow++;
            }

          } catch (err) {
            console.error('Failed to load image:', imageUrl, err.message);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(200, 200, 200);
            const placeholderX = margin + 2 + (currentCol * (maxPhotoWidth + photoSpacing));
            const placeholderY = yPos + (currentRow * (maxPhotoHeight + photoSpacing)) + 5;
            doc.text('[Photo unavailable]', placeholderX, placeholderY);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            currentCol++;
            if (currentCol >= photosPerRow) {
              currentCol = 0;
              currentRow++;
            }
          }
        }

        yPos = photoY + ((currentRow + 1) * (maxPhotoHeight + photoSpacing)) + 6;
      }

      yPos += 4;
    }

    // ---- FOOTER ----
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages} | Pool Visit Report`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`pool-visit-report-${dateStr}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    Swal.fire({
      icon: 'error',
      title: 'Failed to generate PDF',
      text: error.message || 'An unexpected error occurred.',
      confirmButtonColor: '#3b82f6'
    });
  }
};


// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchWorkOrder()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>