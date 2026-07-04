<template>
  <!-- in work, coun -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
    <div class="">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Perform Service
          </h1>
          <p class="text-slate-500 text-sm mt-1">
            Manage and track all service tasks for your pool maintenance
          </p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm text-slate-500">
            <span class="font-semibold text-slate-700">{{ completedCount }}</span> of {{ services.length }} completed
          </span>
          <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <button 
            @click="downloadPDF" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
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
          <button 
            @click="resetAll" 
            class="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset All
          </button>
        </div>
      </div>

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
                <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">
                  Photo / Document
                </th>
                <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">
                  Status
                </th>
                <th scope="col" class="sticky top-0 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">
                  Activities
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(service, index) in services" 
                :key="service.id"
                class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors duration-150"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'"
              >
                <!-- Service ID -->
                <td class="px-4 py-3.5 font-mono text-xs text-slate-500">
                  #{{ service.id }}
                </td>

                <!-- Service Name -->
                <td class="px-4 py-3.5 font-medium text-slate-700">
                  {{ service.service_name }}
                </td>

                <!-- Photo / Document -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2">
                    <input
                      type="file"
                      :id="`file-${service.id}`"
                      class="hidden"
                      accept="image/*,application/pdf"
                      @change="handleFileUpload($event, service.id)"
                    />
                    <label
                      :for="`file-${service.id}`"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload
                    </label>
                    <span v-if="service.uploadedFile" class="text-xs text-slate-600 truncate max-w-[100px]">
                      {{ service.uploadedFile.name }}
                    </span>
                    <span v-else class="text-xs text-slate-400">No file</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-4 py-3.5">
                  <div v-if="service.status === 'Pending'">
                    <button
                      @click="markCompleted(service.id)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Mark Completed
                    </button>
                  </div>
                  <div v-else>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-medium">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Completed
                    </span>
                  </div>
                </td>

                <!-- Comment -->
                <td class="px-4 py-3.5">
                  <textarea
                    v-model="service.comment"
                    rows="2"
                    class="w-full px-3 py-1.5 text-xs bg-transparent border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y transition-all duration-200 placeholder:text-slate-400"
                    placeholder="Add a comment..."
                    :disabled="service.status === 'Completed'"
                    :class="service.status === 'Completed' ? 'opacity-60 cursor-not-allowed' : ''"
                  ></textarea>
                </td>
              </tr>

              <!-- Empty State (for future use) -->
              <tr v-if="services.length === 0">
                <td colspan="5" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-slate-500 font-medium">No services available</p>
                    <p class="text-slate-400 text-sm mt-1">Services will appear here once they are added</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer Stats -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing <span class="font-medium text-slate-700">{{ services.length }}</span> services
        </div>
        <div class="flex items-center gap-4">
          <span>🟡 Pending: <span class="font-medium text-slate-700">{{ pendingCount }}</span></span>
          <span>🟢 Completed: <span class="font-medium text-slate-700">{{ completedCount }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import html2pdf from 'html2pdf.js'

// Mock data
const mockServices = [
  { id: 1001, service_name: 'Remove Debris', uploadedFile: null, status: 'Pending', comment: 'Pool was clean.' },
  { id: 1002, service_name: 'Vacuum Pool', uploadedFile: null, status: 'Pending', comment: '' },
  { id: 1003, service_name: 'Brush Pool Walls', uploadedFile: null, status: 'Pending', comment: 'Pump making unusual noise.' },
  { id: 1004, service_name: 'Clean Skimmer Basket', uploadedFile: null, status: 'Pending', comment: 'Needs chemical adjustment.' },
  { id: 1005, service_name: 'Empty Pump Basket', uploadedFile: null, status: 'Pending', comment: '' },
  { id: 1006, service_name: 'Check Water Level', uploadedFile: null, status: 'Pending', comment: 'Water level is low.' },
  { id: 1007, service_name: 'Test Chlorine', uploadedFile: null, status: 'Pending', comment: '' },
  { id: 1008, service_name: 'Test pH', uploadedFile: null, status: 'Pending', comment: 'pH is too high.' },
  { id: 1009, service_name: 'Backwash Filter', uploadedFile: null, status: 'Pending', comment: '' },
  { id: 1010, service_name: 'Inspect Pump & Motor', uploadedFile: null, status: 'Pending', comment: 'Motor running hot.' },
]

// State
const services = ref([])
const loading = ref(true)

// Computed
const completedCount = computed(() => {
  return services.value.filter(s => s.status === 'Completed').length
})

const pendingCount = computed(() => {
  return services.value.filter(s => s.status === 'Pending').length
})

// Methods
const loadMockData = () => {
  // Simulate API loading
  loading.value = true
  setTimeout(() => {
    services.value = JSON.parse(JSON.stringify(mockServices))
    loading.value = false
  }, 800)
}

const handleFileUpload = (event, serviceId) => {
  const file = event.target.files[0]
  if (file) {
    const service = services.value.find(s => s.id === serviceId)
    if (service) {
      service.uploadedFile = file
    }
  }
  // Reset input so same file can be re-uploaded
  event.target.value = ''
}

const markCompleted = (serviceId) => {
  const service = services.value.find(s => s.id === serviceId)
  if (service && service.status === 'Pending') {
    service.status = 'Completed'
  }
}

const resetAll = () => {
  if (confirm('Reset all services to pending state?')) {
    services.value = JSON.parse(JSON.stringify(mockServices))
  }
}

const downloadPDF = () => {
  const element = document.getElementById('service-table')
  
  // Clone the table to avoid affecting the UI
  const clone = element.cloneNode(true)
  clone.style.position = 'absolute'
  clone.style.left = '-9999px'
  clone.style.top = '0'
  clone.style.width = '100%'
  clone.style.background = 'white'
  clone.style.padding = '20px'
  document.body.appendChild(clone)

  // Add title to the clone
  const title = document.createElement('div')
  title.innerHTML = `
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1e293b;">Pool Service Report</h1>
    <p style="color: #64748b; margin-bottom: 20px;">Generated on ${new Date().toLocaleString()}</p>
  `
  clone.prepend(title)

  // Remove upload buttons from clone and show file names only
  const uploadLabels = clone.querySelectorAll('label')
  uploadLabels.forEach(label => {
    label.style.display = 'none'
  })

  // Make textareas readable in PDF
  const textareas = clone.querySelectorAll('textarea')
  textareas.forEach(textarea => {
    textarea.style.border = '1px solid #e2e8f0'
    textarea.style.background = 'transparent'
    textarea.style.resize = 'none'
    textarea.style.height = '60px'
    textarea.style.width = '100%'
    textarea.style.padding = '8px'
  })

  const opt = {
    margin:        [10, 10, 10, 10],
    filename:     `pool-service-report-${new Date().toISOString().split('T')[0]}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF:        { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'landscape' 
    },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  }

  html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(clone)
  }).catch(() => {
    document.body.removeChild(clone)
  })
}

// Lifecycle
onMounted(() => {
  loadMockData()
})
</script>

<style scoped>
/* Custom scrollbar styling */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* PDF print styles */
@media print {
  .no-print {
    display: none !important;
  }
  .bg-gradient-to-br {
    background: white !important;
  }
}
</style>