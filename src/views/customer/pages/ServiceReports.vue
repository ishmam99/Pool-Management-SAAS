<template>
  <div class="p-6 mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">My Service Reports</h2>
      <span class="bg-slate-200 px-4 py-1.5 rounded-full text-sm font-medium text-slate-700">
        Total: {{ total }} reports
      </span>
    </div>

    <!-- Controls -->
    <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
      <div class="flex items-center gap-2 text-sm text-slate-600">
        <label for="perPage" class="font-medium">Show</label>
        <select
          id="perPage"
          v-model="perPage"
          @change="handlePerPageChange"
          class="border border-slate-300 rounded-md px-3 py-1.5 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-slate-200 rounded-lg shadow-sm bg-white">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-800 text-white">
          <tr>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">ID</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Pool</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Technician</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Type</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Notes</th>
            <th class="px-4 py-3 border-e border-slate-200 text-left text-xs font-medium uppercase tracking-wider">Created</th>
            <th class="px-4 py-3 border-e border-slate-200 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="loading">
            <td colspan="9" class="px-4 py-10 text-center text-slate-500">
              <span class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-blue-600 mr-2"></span>
              Loading...
            </td>
          </tr>
          <tr v-else-if="reports.length === 0">
            <td colspan="9" class="px-4 py-10 text-center text-slate-500">No work orders found</td>
          </tr>
          <tr
            v-for="report in reports"
            :key="report.id"
            class="even:bg-slate-50 hover:bg-slate-100 transition"
          >
            <td class="px-4 py-3 border-e border-slate-100 font-medium text-slate-800">#{{ report.id }}</td>
            <td class="px-4 py-3 border-e border-slate-100">{{ report.customer?.contact_name || 'N/A' }}</td>
            <td class="px-4 py-3 border-e border-slate-100">
              <span class="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ report.pool?.label || 'N/A' }}
              </span>
            </td>
            <td class="px-4 py-3 border-e border-slate-100">{{ report.technician?.name || 'N/A' }}</td>
            <td class="px-4 py-3 border-e border-slate-100">
              <span :class="{
                'bg-blue-100 text-blue-800': report.type === 'routine',
                'bg-amber-100 text-amber-800': report.type === 'repair',
                'bg-emerald-100 text-emerald-800': report.type === 'installation',
                'bg-purple-100 text-purple-800': report.type === 'inspection',
              }" class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ report.type }}
              </span>
            </td>
            <td class="px-4 py-3 border-e border-slate-100">
              <span :class="{
                'bg-blue-100 text-blue-800': report.status === 'scheduled',
                'bg-slate-100 text-slate-700': report.status === 'created',
                'bg-amber-100 text-amber-800': report.status === 'in_progress',
                'bg-emerald-100 text-emerald-800': report.status === 'completed',
                'bg-red-100 text-red-800': report.status === 'cancelled',
              }" class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ report.status }}
              </span>
            </td>
            <td class="px-4 py-3 border-e border-slate-100 max-w-xs truncate text-slate-600" :title="report.notes || ''">
              {{ report.notes ? truncate(report.notes, 30) : '—' }}
            </td>
            <td class="px-4 py-3 border-e border-slate-100 text-sm text-slate-500">{{ formatDate(report.created_at) }}</td>
            <td class="px-4 py-3 border-e border-slate-100 text-center">
              <div class="flex items-center justify-center gap-2">
                <router-link
                  :to="{ name: 'customer-service-reports-details', params: { id: report.id } }"
                  class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </router-link>
                <button
                  @click="downloadPDF(report)"
                  class="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100 transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  PDF
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-6">
      <div class="text-sm text-slate-600">
        Showing {{ from }} to {{ to }} of {{ total }} entries
      </div>
      <div class="flex items-center gap-1">
        <button
          class="px-3 py-1.5 border border-slate-300 rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          &laquo; Previous
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="px-3 py-1.5 border border-slate-300 rounded-md text-sm transition"
          :class="page === currentPage ? 'bg-slate-800 text-white border-slate-800' : 'hover:bg-slate-50'"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1.5 border border-slate-300 rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          :disabled="currentPage === lastPage"
          @click="goToPage(currentPage + 1)"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../../../services/api.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const reports = ref([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const lastPage = ref(1)
const from = ref(0)
const to = ref(0)

const visiblePages = computed(() => {
  const pages = []
  const totalP = lastPage.value
  const current = currentPage.value
  const delta = 2
  let start = Math.max(1, current - delta)
  let end = Math.min(totalP, current + delta)

  if (current - delta > 1) {
    pages.push(1)
    if (current - delta > 2) pages.push('…')
  }
  for (let i = start; i <= end; i++) pages.push(i)
  if (current + delta < totalP) {
    if (current + delta < totalP - 1) pages.push('…')
    pages.push(totalP)
  }
  return pages
})

const fetchReports = async () => {
  loading.value = true
  try {
    const response = await api().get('/work-order-management/work-orders', {
      params: { page: currentPage.value, per_page: perPage.value }
    })
    const data = response.data
    reports.value = data.data || []
    total.value = data.total || 0
    lastPage.value = data.last_page || 1
    currentPage.value = data.current_page || 1
    from.value = data.from || 0
    to.value = data.to || 0
  } catch (error) {
    console.error('Failed to fetch reports:', error)
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > lastPage.value || page === currentPage.value) return
  currentPage.value = page
  fetchReports()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePerPageChange = () => {
  currentPage.value = 1
  fetchReports()
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

const truncate = (text, len) => text?.length > len ? text.slice(0, len) + '…' : text

// PDF generation (same as before)
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

onMounted(fetchReports)
</script>