<template>
  <div class="p-6 mx-auto">
    <!-- Back button & header -->
    <div class="flex items-center gap-4 mb-6">
      <router-link
        :to="{ name: 'customer-service-reports' }"
        class="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to list
      </router-link>
      <h2 class="text-2xl font-bold text-slate-800 ml-auto">Service Report #{{ order?.id }}</h2>
    </div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-center py-10 text-slate-500">Loading order details...</div>
    <div v-else-if="error" class="text-center py-10 text-red-600">{{ error }}</div>

    <!-- Order Details -->
    <div v-else-if="order" class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <!-- Summary -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-200">
        <div><span class="font-medium text-slate-600">Order #</span> {{ order.id }}</div>
        <div><span class="font-medium text-slate-600">Customer</span> {{ order.customer?.contact_name || 'N/A' }}</div>
        <div><span class="font-medium text-slate-600">Pool</span> {{ order.pool?.label || 'N/A' }}</div>
        <div><span class="font-medium text-slate-600">Technician</span> {{ order.technician?.name || 'N/A' }}</div>
        <div>
          <span class="font-medium text-slate-600">Type</span>
          <span :class="{
            'bg-blue-100 text-blue-800': order.type === 'routine',
            'bg-amber-100 text-amber-800': order.type === 'repair',
            'bg-emerald-100 text-emerald-800': order.type === 'installation',
            'bg-purple-100 text-purple-800': order.type === 'inspection',
          }" class="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
            {{ order.type }}
          </span>
        </div>
        <div>
          <span class="font-medium text-slate-600">Status</span>
          <span :class="{
            'bg-blue-100 text-blue-800': order.status === 'scheduled',
            'bg-slate-100 text-slate-700': order.status === 'created',
            'bg-amber-100 text-amber-800': order.status === 'in_progress',
            'bg-emerald-100 text-emerald-800': order.status === 'completed',
            'bg-red-100 text-red-800': order.status === 'cancelled',
          }" class="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
            {{ order.status }}
          </span>
        </div>
        <div class="md:col-span-2">
          <span class="font-medium text-slate-600">Created</span>
          <span class="ml-2">{{ formatDate(order.created_at) }}</span>
        </div>
        <div class="md:col-span-2">
          <span class="font-medium text-slate-600">Notes</span>
          <p class="mt-1 text-slate-700">{{ order.notes || 'No notes' }}</p>
        </div>
      </div>

      <!-- Checklist Section - Redesigned -->
      <div class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Service Tasks</h3>
        
        <!-- Empty State -->
        <div v-if="!order.checklist || order.checklist.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <p class="text-slate-500 text-lg">No checklist items available.</p>
        </div>

        <!-- Checklist Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(item, idx) in order.checklist" 
            :key="idx"
            class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div class="p-5">
              <!-- Status Badge -->
              <div class="flex justify-between items-start mb-3">
                <span 
                  :class="{
                    'bg-emerald-100 text-emerald-800 border-emerald-200': isChecked(item),
                    'bg-slate-100 text-slate-600 border-slate-200': !isChecked(item)
                  }"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                >
                  <span v-if="isChecked(item)" class="text-emerald-600">✓</span>
                  <span v-else class="text-slate-400">○</span>
                  {{ isChecked(item) ? 'Completed' : 'Pending' }}
                </span>
                
                <!-- Service ID Badge -->
                <span class="text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  #{{ item.service_id || 'N/A' }}
                </span>
              </div>

              <!-- Service Name -->
              <h4 class="text-lg font-semibold text-slate-800 mb-3">
                {{ item.item || 'Unnamed Service' }}
              </h4>

              <!-- Activity Notes -->
              <div class="mb-4">
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</span>
                <p class="mt-1 text-sm text-slate-700 bg-slate-50 rounded-md p-3 border border-slate-100">
                  {{ item.activities || 'No activity provided.' }}
                </p>
              </div>

              <!-- Photos Section -->
              <div>
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">Photos</span>
                
                <div v-if="item.photos && item.photos.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div 
                    v-for="(photo, photoIdx) in item.photos" 
                    :key="photoIdx"
                    class="relative group cursor-pointer rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-400 transition-colors"
                    @click="openPhotoPreview(photo)"
                  >
                    <img 
                      :src="buildImageUrl(photo.path)" 
                      :alt="photo.type || 'Service photo'"
                      class="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                      @error="handleImageError"
                    />
                    <span 
                      v-if="photo.type"
                      class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-sm"
                    >
                      {{ photo.type }}
                    </span>
                  </div>
                </div>

                <div v-else class="text-sm text-slate-400 bg-slate-50 rounded-md p-3 border border-slate-100 text-center">
                  <span class="block text-2xl mb-1">🖼️</span>
                  No photos uploaded.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Download PDF button -->
        <div class="mt-6 flex justify-end">
          <button
            @click="downloadPDF(order)"
            class="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-red-700 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Photo Preview Modal -->
    <div 
      v-if="previewPhoto" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      @click="closePhotoPreview"
    >
      <div 
        class="relative max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
        @click.stop
      >
        <button 
          @click="closePhotoPreview"
          class="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="p-4 bg-slate-50 border-b border-slate-200">
          <span class="text-sm font-medium text-slate-600">
            {{ previewPhoto.type || 'Service Photo' }}
          </span>
        </div>
        
        <div class="flex items-center justify-center p-4 bg-black/5 min-h-[200px]">
          <img 
            :src="buildImageUrl(previewPhoto.path)" 
            :alt="previewPhoto.type || 'Service photo'"
            class="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../../services/api.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const error = ref(null)
const previewPhoto = ref(null)

// Helper: Build image URL
const buildImageUrl = (path) => {
  if (!path) return ''
  return `${import.meta.env.VITE_BASE_URL}/storage/${path}`
}

// Helper: Check if item is checked
const isChecked = (item) => {
  return item.isChecked === true || item.isChecked === 'true'
}

// Handle image loading errors
const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-size="14" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E'
}

// Open photo preview
const openPhotoPreview = (photo) => {
  previewPhoto.value = photo
  document.body.style.overflow = 'hidden'
}

// Close photo preview
const closePhotoPreview = () => {
  previewPhoto.value = null
  document.body.style.overflow = ''
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch { return dateStr }
}

const fetchOrder = async () => {
  const id = route.params.id
  try {
    const response = await api().get(`/work-order-management/work-orders/${id}`)
    order.value = response.data
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load order details. Please try again.'
  } finally {
    loading.value = false
  }
}

// Updated PDF generation with checklist enhancements
const downloadPDF = (report) => {
  if (!report) return
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = margin

  doc.setFontSize(18)
  doc.setTextColor(30, 58, 138)
  doc.text('Work Order Report', pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' })
  y += 10
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFontSize(11)
  doc.setTextColor(50, 50, 50)

  const fields = [
    ['Order #', `#${report.id}`],
    ['Customer', report.customer?.contact_name || 'N/A'],
    ['Pool', report.pool?.label || 'N/A'],
    ['Technician', report.technician?.name || 'N/A'],
    ['Type', report.type || 'N/A'],
    ['Status', report.status || 'N/A'],
    ['Created At', formatDate(report.created_at)],
    ['Notes', report.notes || 'No notes']
  ]

  const col1 = 35
  const col2 = pageWidth - margin * 2 - col1 - 4
  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label + ':', margin, y)
    doc.setFont('helvetica', 'normal')
    const wrapped = doc.splitTextToSize(String(value), col2)
    doc.text(wrapped, margin + col1 + 2, y)
    y += wrapped.length * 5.5 + 1
  })
  y += 4

  const checklist = report.checklist || []
  if (checklist.length) {
    doc.setFontSize(13)
    doc.setTextColor(30, 58, 138)
    doc.setFont('helvetica', 'bold')
    doc.text('Checklist', margin, y)
    y += 6

    const tableData = checklist.map((item, idx) => {
      const status = isChecked(item) ? '✓ Done' : '✗ Pending'
      const photoCount = item.photos?.length || 0
      const photosText = photoCount > 0 ? `Yes (${photoCount})` : 'No'
      
      return [
        String(idx + 1),
        item.item || '—',
        String(item.service_id || 'N/A'),
        status,
        item.activities || '—',
        photosText
      ]
    })

    autoTable(doc, {
      startY: y,
      head: [['#', 'Service Name', 'Service ID', 'Status', 'Activities', 'Photos']],
      body: tableData,
      theme: 'striped',
      headStyles: { 
        fillColor: [30, 58, 138], 
        textColor: [255, 255, 255], 
        fontSize: 9, 
        halign: 'center' 
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
      },
      margin: { left: margin, right: margin }
    })
  } else {
    doc.setFontSize(11)
    doc.setTextColor(150, 150, 150)
    doc.text('No checklist items.', margin, y)
  }

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  doc.save(`WorkOrder_${report.id}_${report.customer?.contact_name || 'report'}.pdf`)
}

onMounted(fetchOrder)
</script>