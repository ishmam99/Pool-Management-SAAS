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

      <!-- Checklist -->
      <div class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Checklist</h3>
        <div v-if="order.checklist && order.checklist.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">
            <thead class="bg-slate-800 text-white">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">#</th>
                <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Activities</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(item, idx) in order.checklist" :key="idx" class="even:bg-slate-50">
                <td class="px-4 py-2 text-center">{{ idx + 1 }}</td>
                <td class="px-4 py-2">{{ item.item || '—' }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="{
                    'bg-emerald-100 text-emerald-800': item.isChecked === 'true' || item.isChecked === true,
                    'bg-red-100 text-red-800': item.isChecked !== 'true' && item.isChecked !== true,
                  }" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ item.isChecked === 'true' || item.isChecked === true ? '✓ Done' : '✗ Pending' }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ item.activities || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-slate-500 text-sm">No checklist items available.</div>

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

// Reuse the same PDF function (copy from list or import)
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

    const tableData = checklist.map((item, idx) => [
      String(idx + 1),
      item.item || '—',
      item.isChecked === 'true' || item.isChecked === true ? '✓ Done' : '✗ Pending',
      item.activities || '—'
    ])

    autoTable(doc, {
      startY: y,
      head: [['#', 'Item', 'Status', 'Activities']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontSize: 10, halign: 'center' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
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