<template>
    <div class="space-y-6 p-10">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">All Invoices</h1>
                <p class="text-gray-600 mt-1">
                    View and manage invoices generated across all platform tenants.
                </p>
            </div>
            <div class="flex gap-3">
                <button @click="openGenerateModal"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate Invoice
                </button>
                <button @click="refreshInvoices" :disabled="loading"
                    class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L10 8.586l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Unable to load invoices.</h3>
                    <p class="mt-1 text-sm text-red-700">{{ error }}</p>
                    <button @click="fetchInvoices" class="mt-2 text-sm font-medium text-red-800 hover:text-red-600">
                        Try again
                    </button>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div v-if="!error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard v-for="stat in statistics" :key="stat.label" :label="stat.label" :value="stat.value"
                :loading="loading" />
        </div>

        <!-- Filters Section -->
        <div v-if="!error" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Search -->
                <div class="lg:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <div class="relative">
                        <input v-model="filters.search" type="text" placeholder="Invoice number or company name..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :disabled="loading" />
                        <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select v-model="filters.status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        :disabled="loading">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <!-- Billing Period -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Billing Period
                    </label>
                    <div class="flex gap-2">
                        <select v-model="filters.month"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :disabled="loading">
                            <option v-for="m in months" :key="m.value" :value="m.value">
                                {{ m.label }}
                            </option>
                        </select>
                        <select v-model="filters.year"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :disabled="loading">
                            <option v-for="y in years" :key="y" :value="y">
                                {{ y }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Filter Actions -->
            <div class="mt-4 flex flex-wrap gap-2">
                <button @click="applyFilters"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    :disabled="loading">
                    Apply Filters
                </button>
                <button @click="clearFilters"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    :disabled="loading">
                    Clear Filters
                </button>
            </div>
        </div>

        <!-- Invoices Table -->
        <div v-if="!error" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Desktop/Tablet View -->
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 table-zebra">
                    <thead class="bg-green-50">
                        <tr>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice Number
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Billing Period
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Billing Model
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th class="px-6 py-3 border-e border-slate-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <!-- Loading State -->
                        <tr v-if="loading" v-for="i in 5" :key="'skeleton-' + i">
                            <td class="px-6 py-4" colspan="9">
                                <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                        </tr>
                        <!-- Empty State -->
                        <tr v-else-if="invoices.length === 0">
                            <td colspan="9" class="px-6 py-12 text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p class="mt-2 text-sm text-gray-500">No invoices found.</p>
                                <p class="mt-1 text-sm text-gray-400">Invoices generated for platform tenants will
                                    appear here.</p>
                            </td>
                        </tr>
                        <!-- Data Rows -->
                        <tr v-else v-for="invoice in invoices" :key="invoice.id"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="text-sm font-medium text-gray-900">
                                    {{ invoice.invoice_number }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="text-sm text-gray-900">
                                    {{ invoice.tenant?.company_name || 'N/A' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="text-sm text-gray-600">
                                    {{ invoice.billing_period || 'N/A' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {{ invoice.billing_model === 'subscription' ? 'Subscription' : 'Per Pool' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="text-sm font-medium text-gray-900">
                                    {{ formatCurrency(invoice.total) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 ">
                                <StatusBadge :status="invoice.status" />
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="text-sm text-gray-600">
                                    {{ formatDate(invoice.due_date) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                <span class="text-sm text-gray-600">
                                    {{ formatDate(invoice.created_at) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <!-- View Invoice -->
                                    <button @click="openInvoiceDetail(invoice)"
                                        class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Invoice">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>

                                    <!-- Generate PDF -->
                                    <button @click="generateInvoicePDF(invoice)"
                                        class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Generate PDF">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>

                                    <!-- Mark Paid -->
                                    <button v-if="invoice.status?.toLowerCase() !== 'paid'"
                                        @click="markPaid(invoice)"
                                        class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Mark Paid">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile View - Stacked Cards -->
            <div class="md:hidden divide-y divide-gray-200">
                <div v-if="loading" v-for="i in 3" :key="'mobile-skeleton-' + i" class="p-4">
                    <div class="space-y-3">
                        <div class="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                </div>
                <div v-else-if="invoices.length === 0" class="p-8 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-500">No invoices found.</p>
                </div>
                <div v-else v-for="invoice in invoices" :key="invoice.id"
                    class="p-4 hover:bg-gray-50 transition-colors">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <div class="text-sm font-medium text-gray-900">
                                {{ invoice.invoice_number }}
                            </div>
                            <div class="text-sm text-gray-600">
                                {{ invoice.tenant?.company_name || 'N/A' }}
                            </div>
                        </div>
                        <StatusBadge :status="invoice.status" />
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span class="text-gray-500">Period:</span>
                            <span class="text-gray-900 ml-1">{{ invoice.billing_period || 'N/A' }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Model:</span>
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-1">
                                {{ invoice.billing_model === 'subscription' ? 'Subscription' : 'Per Pool' }}
                            </span>
                        </div>
                        <div>
                            <span class="text-gray-500">Total:</span>
                            <span class="text-gray-900 font-medium ml-1">{{ formatCurrency(invoice.total) }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Due:</span>
                            <span class="text-gray-900 ml-1">{{ formatDate(invoice.due_date) }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-200 flex-wrap">
                        <button @click="openInvoiceDetail(invoice)"
                            class="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
                            View
                        </button>
                        <button @click="generateInvoicePDF(invoice)"
                            class="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                            Generate PDF
                        </button>
                        <button v-if="invoice.status?.toLowerCase() !== 'paid'"
                            @click="markPaid(invoice)"
                            class="px-3 py-1.5 text-sm text-green-600 border border-green-200 hover:bg-green-50 rounded-lg transition-colors">
                            Mark Paid
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="pagination && invoices.length > 0" class="px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="text-sm text-gray-600">
                        Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }}
                        results
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="changePage(pagination.current_page - 1)"
                            :disabled="pagination.current_page === 1 || loading"
                            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        <span class="text-sm text-gray-600 px-3">
                            Page {{ pagination.current_page }} of {{ pagination.last_page }}
                        </span>
                        <button @click="changePage(pagination.current_page + 1)"
                            :disabled="pagination.current_page === pagination.last_page || loading"
                            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoice Detail Drawer -->
        <div v-if="showDetailDrawer" class="fixed inset-0 z-50 flex items-start justify-end p-4">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="closeDetailDrawer">
            </div>

            <!-- Drawer panel -->
            <Transition name="slide-drawer" appear>
                <div class="relative w-full max-w-4xl h-full bg-white shadow-2xl overflow-y-auto">
                    <div
                        class="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-4 flex items-center justify-between">
                        <h2 class="text-lg font-semibold text-gray-900">Invoice Preview</h2>
                        <button @click="closeDetailDrawer"
                            class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 md:p-10" v-if="selectedInvoice">
                        <!-- ==================== INVOICE CONTENT ==================== -->
                        <div class="max-w-3xl mx-auto">
                            <!-- Invoice Header -->
                            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-gray-200">
                                <div>
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                            HT
                                        </div>
                                        <div>
                                            <h1 class="text-2xl font-bold text-gray-900">Pool Management System</h1>
                                            <p class="text-sm text-gray-500">Platform Billing System</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-indigo-600">INVOICE</div>
                                    <p class="text-sm text-gray-600 font-medium">{{ selectedInvoice.invoice_number }}</p>
                                    <div class="flex items-center justify-end gap-3 mt-2">
                                        <StatusBadge :status="selectedInvoice.status" />
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {{ selectedInvoice.billing_model === 'subscription' ? 'Subscription' : 'Per Pool' }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Bill To -->
                            <div class="mt-6 pb-6 border-b border-gray-200">
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                                <div class="text-gray-900">
                                    <p class="text-lg font-semibold">{{ selectedInvoice.tenant?.company_name || 'N/A' }}</p>
                                    <p class="text-sm text-gray-600">{{ selectedInvoice.tenant?.email || 'N/A' }}</p>
                                    <p class="text-sm text-gray-600">{{ selectedInvoice.tenant?.phone || 'N/A' }}</p>
                                    <p class="text-sm text-gray-600">{{ selectedInvoice.tenant?.website || 'N/A' }}</p>
                                </div>
                            </div>

                            <!-- Invoice Information -->
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pb-6 border-b border-gray-200">
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wider">Billing Period</p>
                                    <p class="text-sm font-medium text-gray-900">{{ selectedInvoice.billing_period || 'N/A' }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wider">Period Start</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.period_start) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wider">Period End</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.period_end) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wider">Due Date</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.due_date) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 uppercase tracking-wider">Created Date</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.created_at) }}</p>
                                </div>
                            </div>

                            <!-- Line Items / Invoice Details -->
                            <div class="mt-6">
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Invoice Details</h3>

                                <!-- Per Pool Section -->
                                <div v-if="selectedInvoice.billing_model === 'per_pool'">
                                    <!-- Summary row -->
                                    <div class="grid grid-cols-3 gap-4 mb-4">
                                        <div class="p-3 bg-gray-50 rounded-lg text-center">
                                            <p class="text-xs text-gray-500">Active Pools</p>
                                            <p class="text-lg font-bold text-gray-900">{{ selectedInvoice.total_active_pools || 0 }}</p>
                                        </div>
                                        <div class="p-3 bg-gray-50 rounded-lg text-center">
                                            <p class="text-xs text-gray-500">Billable Pools</p>
                                            <p class="text-lg font-bold text-gray-900">{{ selectedInvoice.billable_pools || 0 }}</p>
                                        </div>
                                        <div class="p-3 bg-gray-50 rounded-lg text-center">
                                            <p class="text-xs text-gray-500">Per Pool Price</p>
                                            <p class="text-lg font-bold text-gray-900">{{ formatCurrency(selectedInvoice.per_pool_price) }}</p>
                                        </div>
                                    </div>

                                    <!-- Pool Breakdown Table -->
                                    <div v-if="selectedInvoice.pools_snapshot && selectedInvoice.pools_snapshot.length > 0"
                                        class="overflow-x-auto border border-gray-200 rounded-lg">
                                        <table class="min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-50">
                                                <tr>
                                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool ID</th>
                                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200">
                                                <tr v-for="pool in selectedInvoice.pools_snapshot" :key="pool.id || pool.pool_name">
                                                    <td class="px-4 py-2 text-sm text-gray-600">{{  'PL-'  + selectedInvoice.tenant.id + pool.pool_id || 'N/A' }}</td>
                                                    <td class="px-4 py-2 text-sm text-gray-900">
                                                        {{ pool.pool_name || 'Unnamed Pool' }}
                                                        <span v-if="pool.is_free" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Free</span>
                                                        <span v-else class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Billable</span>
                                                    </td>
                                                    <td class="px-4 py-2 text-sm text-gray-600">{{ pool.customer_name || 'N/A' }}</td>
                                                    <td class="px-4 py-2 text-sm text-gray-900 text-right">{{ formatCurrency(pool.price) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Subscription Section -->
                                <div v-if="selectedInvoice.billing_model === 'subscription'" class="p-4 bg-gray-50 rounded-lg">
                                    <p class="text-xs text-gray-500">Plan Name</p>
                                    <p class="text-base font-medium text-gray-900">{{ selectedInvoice.plan_name || 'Subscription Plan' }}</p>
                                </div>

                                <!-- Financial Summary -->
                                <div class="mt-6 pt-4 border-t border-gray-200">
                                    <div class="space-y-1.5 max-w-xs ml-auto">
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-600">Subtotal</span>
                                            <span class="text-gray-900 font-medium">{{ formatCurrency(selectedInvoice.subtotal) }}</span>
                                        </div>
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-600">Tax</span>
                                            <span class="text-gray-900 font-medium">{{ formatCurrency(selectedInvoice.tax) }}</span>
                                        </div>
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-600">Discount</span>
                                            <span class="text-gray-900 font-medium">-{{ formatCurrency(selectedInvoice.discount) }}</span>
                                        </div>
                                        <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                                            <span class="text-gray-900">TOTAL</span>
                                            <span class="text-indigo-600">{{ formatCurrency(selectedInvoice.total) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Information -->
                            <div v-if="selectedInvoice.status === 'paid'" class="mt-6 pt-6 border-t border-gray-200">
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg ring-1 ring-green-200">
                                    <div>
                                        <p class="text-xs text-green-600 uppercase tracking-wider">Paid At</p>
                                        <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedInvoice.paid_at) }}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-green-600 uppercase tracking-wider">Payment Method</p>
                                        <p class="text-sm font-medium text-gray-900">{{ selectedInvoice.payment_method || 'N/A' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-green-600 uppercase tracking-wider">Transaction ID</p>
                                        <p class="text-sm font-medium text-gray-900">{{ selectedInvoice.transaction_id || 'N/A' }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Terms & Conditions -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Terms &amp; Conditions</h3>
                                <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                    <li v-for="term in INVOICE_TERMS" :key="term">{{ term }}</li>
                                </ul>
                            </div>

                            <!-- Footer Actions -->
                            <div class="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                                <button @click="generateInvoicePDF(selectedInvoice)"
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Generate PDF
                                </button>
                                <button v-if="selectedInvoice.status?.toLowerCase() !== 'paid'"
                                    @click="markPaid(selectedInvoice)"
                                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Mark Paid
                                </button>
                                <button @click="closeDetailDrawer"
                                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Generate Invoice Modal -->
        <Transition name="modal-fade">
            <div v-if="showGenerateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Background overlay -->
                <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                    @click="closeGenerateModal"></div>

                <!-- Modal panel -->
                <Transition name="modal-scale" appear>
                    <div
                        class="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                        <div class="px-6 pt-6 pb-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">
                                        Generate Monthly Invoice
                                    </h3>
                                    <p class="mt-1 text-sm text-gray-500">
                                        Generate a monthly invoice for the selected tenant.
                                    </p>
                                </div>
                                <button @click="closeGenerateModal"
                                    class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                                    :disabled="generating">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div class="mt-5">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Select Tenant
                                </label>
                                <div class="relative">
                                    <select v-model="selectedTenantId"
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
                                        :disabled="loadingTenants || generating">
                                        <option value="">Select a tenant...</option>
                                        <option v-for="tenant in activeTenants" :key="tenant.id" :value="tenant.id">
                                            {{ tenant.company_name }} - {{ tenant.billing_model === 'subscription' ?
                                                'Subscription' : 'Per Pool' }}
                                        </option>
                                    </select>
                                    <div v-if="loadingTenants" class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg class="animate-spin h-5 w-5 text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                    </div>
                                    <svg v-else
                                        class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                <p v-if="!loadingTenants && activeTenants.length === 0"
                                    class="mt-2 text-sm text-gray-400">
                                    No active tenants available.
                                </p>
                            </div>

                            <!-- Selected Tenant Preview -->
                            <Transition name="fade">
                                <div v-if="selectedTenant"
                                    class="mt-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">{{ selectedTenant.company_name
                                            }}</p>
                                            <p class="text-sm text-gray-500">Billing Model: {{
                                                selectedTenant.billing_model === 'subscription' ? 'Subscription' : 'Per Pool' }}</p>
                                        </div>
                                        <span :class="{
                                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                            'bg-purple-100 text-purple-800': true
                                        }">
                                            {{ selectedTenant.billing_model === 'subscription' ? 'Subscription' : 'Per Pool' }}
                                        </span>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Error message -->
                            <Transition name="fade">
                                <div v-if="generateError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-sm text-red-700">{{ generateError }}</p>
                                </div>
                            </Transition>
                        </div>

                        <div class="bg-gray-50/70 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                            <button @click="closeGenerateModal"
                                class="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                :disabled="generating">
                                Cancel
                            </button>
                            <button @click="generateInvoice" :disabled="!selectedTenantId || generating"
                                class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="generating" class="flex items-center justify-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Generating...
                                </span>
                                <span v-else>Generate Invoice</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

        <!-- Success Toast -->
        <div v-if="showToast"
            class="fixed bottom-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm shadow-lg">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">Invoice generated successfully!</p>
                    <p class="text-sm text-green-700 mt-1">{{ toastMessage }}</p>
                </div>
                <button @click="showToast = false" class="ml-auto flex-shrink-0 text-green-400 hover:text-green-600">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../../../services/api.js'
import StatusBadge from '../../components/StatusBadge.vue'
import StatCard from '../../components/StatCard.vue'
import jsPDF from 'jspdf'
import Swal from 'sweetalert2'

// ==========================================================
// CONSTANTS
// ==========================================================

const COMPANY_NAME = 'Pool Management System'

const INVOICE_TERMS = [
    'Payment is due by the invoice due date.',
    'All charges shown on this invoice are based on the selected billing period.',
    'Any applicable taxes, discounts, or adjustments are reflected in the invoice total.',
    'Please contact Pool Management System if there are any questions regarding this invoice.'
]

// ==========================================================
// STATE
// ==========================================================

const loading = ref(false)
const error = ref(null)
const invoices = ref([])
const pagination = ref(null)
const tenantsLoaded = ref(false)

// API Summary
const invoiceSummary = ref({
    total_invoices: 0,
    total_amount: '0.00',
    paid_amount: '0.00',
    pending_amount: '0.00',
    overdue_amount: '0.00'
})

// Detail Drawer State
const showDetailDrawer = ref(false)
const selectedInvoice = ref(null)

// Generate Invoice State
const showGenerateModal = ref(false)
const loadingTenants = ref(false)
const activeTenants = ref([])
const selectedTenantId = ref('')
const generating = ref(false)
const generateError = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

// Current date for default filters
const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

// Filters
const filters = ref({
    search: '',
    tenant_id: '',
    status: '',
    billing_model: '',
    month: String(currentMonth),
    year: String(currentYear)
})

// ==========================================================
// COMPUTED
// ==========================================================

const selectedTenant = computed(() => {
    return activeTenants.value.find(t => t.id === selectedTenantId.value)
})

const statistics = computed(() => {
    return [
        { label: 'Total Invoices', value: invoiceSummary.value.total_invoices || 0 },
        { label: 'Paid Amount', value: formatCurrency(invoiceSummary.value.paid_amount) },
        { label: 'Pending Amount', value: formatCurrency(invoiceSummary.value.pending_amount) },
        { label: 'Overdue Amount', value: formatCurrency(invoiceSummary.value.overdue_amount) },
        { label: 'Total Amount', value: formatCurrency(invoiceSummary.value.total_amount) }
    ]
})

// ==========================================================
// HELPER METHODS
// ==========================================================

const formatCurrency = (amount) => {
    if (amount == null || amount === '') return '$0.00'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(numAmount)
}

const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Months for filter
const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
]

const years = computed(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
        years.push(i)
    }
    return years
})

/**
 * Get the last day of a month for a given year
 */
const getLastDayOfMonth = (month, year) => {
    return new Date(year, month, 0).getDate()
}

/**
 * Build API query parameters from current filters
 */
const getInvoiceQueryParams = () => {
    const month = parseInt(filters.value.month)
    const year = parseInt(filters.value.year)
    
    // Calculate date range
    const lastDay = getLastDayOfMonth(month, year)
    const dateFrom = `${year}-${String(month).padStart(2, '0')}-01`
    const dateTo = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    
    const params = {
        date_from: dateFrom,
        date_to: dateTo,
        status: filters.value.status || '',
        tenant_id: filters.value.tenant_id || '',
        billing_model: filters.value.billing_model || ''
    }
    
    // Only include search if the backend supports it
    // For now, we'll keep it client-side since we don't know if backend supports it
    // If backend does support search, uncomment the line below:
    // if (filters.value.search) params.search = filters.value.search
    
    return params
}

// ==========================================================
// API METHODS - Invoices
// ==========================================================

const fetchInvoices = async () => {
    loading.value = true
    error.value = null

    try {
        const params = getInvoiceQueryParams()
        const response = await api().get('/admin/billing/invoices', { params })
        const responseData = response.data.data || response.data

        // Extract summary
        invoiceSummary.value = responseData.summary || {
            total_invoices: 0,
            total_amount: '0.00',
            paid_amount: '0.00',
            pending_amount: '0.00',
            overdue_amount: '0.00'
        }

        // Extract invoices with pagination
        const data = responseData.invoices || responseData.data
        
        if (Array.isArray(data)) {
            invoices.value = data
            pagination.value = null
        } else if (data && typeof data === 'object') {
            invoices.value = data.data || []
            pagination.value = {
                current_page: data.current_page || data.currentPage || 1,
                last_page: data.last_page || data.lastPage || 1,
                total: data.total || 0,
                from: data.from || 0,
                to: data.to || 0
            }
        } else {
            invoices.value = []
            pagination.value = null
        }
    } catch (err) {
        error.value = err.message || 'Failed to load invoices. Please try again.'
        invoices.value = []
        pagination.value = null
    } finally {
        loading.value = false
    }
}

// ==========================================================
// API METHODS - Tenants
// ==========================================================

const fetchActiveTenants = async () => {
    if (tenantsLoaded.value) return
    
    loadingTenants.value = true
    generateError.value = null

    try {
        const response = await api().get('/tenant/tenants?status=active')
        const data = response.data.data || response.data

        if (Array.isArray(data)) {
            activeTenants.value = data
        } else if (data.data && Array.isArray(data.data)) {
            activeTenants.value = data.data
        } else {
            activeTenants.value = []
        }
        tenantsLoaded.value = true
    } catch (err) {
        generateError.value = 'Failed to load active tenants. Please try again.'
        activeTenants.value = []
    } finally {
        loadingTenants.value = false
    }
}

// ==========================================================
// API METHODS - Generate Invoice
// ==========================================================

const generateInvoice = async () => {
    if (!selectedTenantId.value || generating.value) return

    generating.value = true
    generateError.value = null

    try {
        const response = await api().post(`/admin/tenants/${selectedTenantId.value}/billing/generate-invoice`)
        const newInvoice = response.data.data || response.data

        if (newInvoice) {
            toastMessage.value = `Invoice ${newInvoice.invoice_number || ''} generated successfully`
            showToast.value = true

            setTimeout(() => {
                showToast.value = false
            }, 5000)
        }

        closeGenerateModal()
        await fetchInvoices()

    } catch (err) {
        if (err.response?.status === 422) {
            const errors = err.response.data?.errors
            const firstFieldError = errors ? Object.values(errors)[0]?.[0] : null

            generateError.value =
                err.response.data?.message ||
                firstFieldError ||
                'Validation failed. Please check the selected tenant and try again.'
        } else {
            generateError.value =
                err.response?.data?.message ||
                err.message ||
                'Failed to generate invoice. Please try again.'
        }
    } finally {
        generating.value = false
    }
}

// ==========================================================
// MARK PAID
// ==========================================================

const markPaid = async (invoice) => {
    if (!invoice || invoice.status?.toLowerCase() === 'paid') return

    const result = await Swal.fire({
        title: 'Mark as Paid',
        text: `Mark invoice ${invoice.invoice_number} as paid?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, mark as paid'
    })

    if (result.isConfirmed) {
        try {
            await api().post(`/admin/invoices/${invoice.id}/mark-paid`, {
                payment_method: 'admin_manual'
            })

            await Swal.fire('Success', 'Invoice marked as paid', 'success')

            // Close drawer if open
            if (showDetailDrawer.value) {
                closeDetailDrawer()
            }

            // Refresh everything
            await fetchInvoices()

        } catch (error) {
            console.error('Failed to mark invoice paid:', error)
            await Swal.fire('Error', error.response?.data?.message || 'Failed to mark invoice as paid', 'error')
        }
    }
}

// ==========================================================
// DETAIL DRAWER METHODS
// ==========================================================

const openInvoiceDetail = (invoice) => {
    selectedInvoice.value = invoice
    showDetailDrawer.value = true
}

const closeDetailDrawer = () => {
    showDetailDrawer.value = false
    selectedInvoice.value = null
}

// ==========================================================
// MODAL METHODS
// ==========================================================

const openGenerateModal = async () => {
    showGenerateModal.value = true
    selectedTenantId.value = ''
    generateError.value = null
    await fetchActiveTenants()
}

const closeGenerateModal = () => {
    if (generating.value) return
    showGenerateModal.value = false
    selectedTenantId.value = ''
    generateError.value = null
}

// ==========================================================
// FILTER METHODS
// ==========================================================

const applyFilters = async () => {
    await fetchInvoices()
}

const clearFilters = () => {
    filters.value = {
        search: '',
        tenant_id: '',
        status: '',
        billing_model: '',
        month: String(currentMonth),
        year: String(currentYear)
    }
    // Reload invoices with default filters
    fetchInvoices()
}

const refreshInvoices = () => {
    fetchInvoices()
}

// ==========================================================
// PAGINATION
// ==========================================================

const changePage = async (page) => {
    if (!pagination.value || page < 1 || page > pagination.value.last_page) return
    
    loading.value = true
    error.value = null

    try {
        const params = getInvoiceQueryParams()
        params.page = page
        
        const response = await api().get('/admin/billing/invoices', { params })
        const responseData = response.data.data || response.data

        invoiceSummary.value = responseData.summary || {
            total_invoices: 0,
            total_amount: '0.00',
            paid_amount: '0.00',
            pending_amount: '0.00',
            overdue_amount: '0.00'
        }

        const data = responseData.invoices || responseData.data
        if (data && typeof data === 'object') {
            invoices.value = data.data || []
            pagination.value = {
                current_page: data.current_page || data.currentPage || 1,
                last_page: data.last_page || data.lastPage || 1,
                total: data.total || 0,
                from: data.from || 0,
                to: data.to || 0
            }
        } else {
            invoices.value = []
            pagination.value = null
        }
    } catch (err) {
        error.value = err.message || 'Failed to load invoices. Please try again.'
    } finally {
        loading.value = false
    }
}

// ==========================================================
// PDF GENERATION
// ==========================================================

const PDF_MARGIN = 20
const PDF_PAGE_WIDTH = 210
const PDF_PAGE_HEIGHT = 297
const PDF_CONTENT_WIDTH = PDF_PAGE_WIDTH - PDF_MARGIN * 2

const pdfColors = {
    brand: [99, 102, 241],       // indigo-500 (lighter, softer than before)
    brandDark: [79, 70, 229],    // indigo-600 (used for accents/text, not big fills)
    brandLight: [238, 242, 255], // indigo-50
    dark: [30, 41, 59],          // slate-800
    text: [71, 85, 105],         // slate-600
    muted: [148, 163, 184],      // slate-400
    border: [226, 232, 240],     // slate-200
    zebra: [248, 250, 252],      // slate-50
    white: [255, 255, 255],
    paid: [21, 128, 61],
    paidBg: [220, 252, 231],
    pending: [180, 83, 9],
    pendingBg: [254, 243, 199],
    overdue: [185, 28, 28],
    overdueBg: [254, 226, 226],
    cancelled: [100, 116, 139],
    cancelledBg: [241, 245, 249],
    subscription: [37, 99, 235],
    subscriptionBg: [219, 234, 254],
    perPool: [124, 58, 237],
    perPoolBg: [245, 243, 255],
    free: [21, 128, 61],
    freeBg: [220, 252, 231],
    billable: [37, 99, 235],
    billableBg: [219, 234, 254]
}

const pdfFormatCurrency = (amount) => {
    if (amount == null || amount === '') return '$0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(num)
}

const pdfFormatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const pdfFormatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const pdfCheckPageBreak = (doc, cursorY, neededHeight) => {
    if (cursorY + neededHeight > PDF_PAGE_HEIGHT - PDF_MARGIN - 14) {
        doc.addPage()
        return PDF_MARGIN
    }
    return cursorY
}

// Truncates text to fit a max width, appending an ellipsis if needed
const pdfTruncateText = (doc, text, maxWidth) => {
    let str = String(text)
    if (doc.getTextWidth(str) <= maxWidth) return str
    while (str.length > 1 && doc.getTextWidth(str + '…') > maxWidth) {
        str = str.slice(0, -1)
    }
    return str + '…'
}

const pdfStatusColors = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'paid') return { fg: pdfColors.paid, bg: pdfColors.paidBg }
    if (s === 'pending') return { fg: pdfColors.pending, bg: pdfColors.pendingBg }
    if (s === 'overdue') return { fg: pdfColors.overdue, bg: pdfColors.overdueBg }
    return { fg: pdfColors.cancelled, bg: pdfColors.cancelledBg }
}

const pdfDrawBadge = (doc, text, x, y, fg, bg, align = 'left') => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    const textWidth = doc.getTextWidth(text.toUpperCase())
    const paddingX = 3
    const badgeWidth = textWidth + paddingX * 2
    const badgeHeight = 5.5
    const drawX = align === 'right' ? x - badgeWidth : x

    doc.setFillColor(...bg)
    doc.roundedRect(drawX, y, badgeWidth, badgeHeight, 2.5, 2.5, 'F')
    doc.setTextColor(...fg)
    doc.text(text.toUpperCase(), drawX + paddingX, y + 3.9)

    return badgeWidth
}

const pdfDrawSectionHeader = (doc, title, y, accentColor = pdfColors.brand) => {
    doc.setFillColor(...accentColor)
    doc.roundedRect(PDF_MARGIN, y, 2.5, 6.5, 1, 1, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...pdfColors.dark)
    doc.text(title.toUpperCase(), PDF_MARGIN + 6, y + 5)

    y += 6.5 + 3
    return pdfDrawDivider(doc, y, pdfColors.border) + 2
}

const pdfDrawDivider = (doc, y, color = pdfColors.border) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(0.3)
    doc.line(PDF_MARGIN, y, PDF_MARGIN + PDF_CONTENT_WIDTH, y)
    return y + 4
}

const pdfDrawHeader = (doc, invoice) => {
    // Light, understated header band instead of a heavy solid color block
    const bandHeight = 30
    doc.setFillColor(250, 250, 252)
    doc.rect(0, 0, PDF_PAGE_WIDTH, bandHeight, 'F')

    doc.setFillColor(...pdfColors.brand)
    doc.rect(0, bandHeight - 0.8, PDF_PAGE_WIDTH, 0.8, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(19)
    doc.setTextColor(...pdfColors.dark)
    doc.text(COMPANY_NAME, PDF_MARGIN, 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...pdfColors.muted)
    doc.text('Platform Billing System', PDF_MARGIN, 20)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(17)
    doc.setTextColor(...pdfColors.brandDark)
    doc.text('INVOICE', PDF_PAGE_WIDTH - PDF_MARGIN, 14, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...pdfColors.muted)
    doc.text(invoice.invoice_number || 'N/A', PDF_PAGE_WIDTH - PDF_MARGIN, 20, { align: 'right' })

    let y = bandHeight + 10

    const statusColors = pdfStatusColors(invoice.status)
    const modelLabel = invoice.billing_model === 'subscription' ? 'Subscription' : 'Per Pool'

    doc.setFontSize(8)
    doc.setTextColor(...pdfColors.muted)
    doc.setFont('helvetica', 'normal')
    doc.text('Status', PDF_MARGIN, y)
    pdfDrawBadge(doc, invoice.status || 'N/A', PDF_MARGIN, y + 2, statusColors.fg, statusColors.bg)

    doc.text('Billing Model', PDF_MARGIN + 45, y)
    pdfDrawBadge(doc, modelLabel, PDF_MARGIN + 45, y + 2, pdfColors.perPool, pdfColors.perPoolBg)

    y += 14
    y = pdfDrawDivider(doc, y, pdfColors.border)
    return y + 2
}

const pdfDrawTenantInfo = (doc, invoice, y) => {
    y = pdfCheckPageBreak(doc, y, 30)
    y = pdfDrawSectionHeader(doc, 'Bill To', y)

    const tenant = invoice.tenant || {}
    const lines = [
        ['Company', tenant.company_name || 'N/A'],
        ['Email', tenant.email || 'N/A'],
        ['Phone', tenant.phone || 'N/A'],
        ['Website', tenant.website || 'N/A']
    ]

    doc.setFontSize(9)
    lines.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...pdfColors.muted)
        doc.text(`${label}:`, PDF_MARGIN, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...pdfColors.dark)
        doc.text(String(value), PDF_MARGIN + 30, y)
        y += 5.5
    })

    return y + 4
}

const pdfDrawBillingInfo = (doc, invoice, y) => {
    y = pdfCheckPageBreak(doc, y, 35)
    y = pdfDrawSectionHeader(doc, 'Invoice Information', y, pdfColors.brand)

    const lines = [
        ['Billing Period', invoice.billing_period || 'N/A'],
        ['Period Start', pdfFormatDate(invoice.period_start)],
        ['Period End', pdfFormatDate(invoice.period_end)],
        ['Due Date', pdfFormatDate(invoice.due_date)],
        ['Created Date', pdfFormatDate(invoice.created_at)]
    ]

    doc.setFontSize(9)
    lines.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...pdfColors.muted)
        doc.text(`${label}:`, PDF_MARGIN, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...pdfColors.dark)
        doc.text(String(value), PDF_MARGIN + 35, y)
        y += 5.5
    })

    return y + 4
}

const pdfDrawInvoiceDetails = (doc, invoice, y) => {
    y = pdfCheckPageBreak(doc, y, 55)
    y = pdfDrawSectionHeader(doc, 'Invoice Details', y, pdfColors.perPool)

    doc.setFontSize(9)

    if (invoice.billing_model === 'subscription') {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...pdfColors.muted)
        doc.text('Plan Name:', PDF_MARGIN, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...pdfColors.dark)
        doc.text(invoice.plan_name || 'Subscription Plan', PDF_MARGIN + 35, y)
        y += 7
    } else {
        const poolLines = [
            ['Active Pools', String(invoice.total_active_pools ?? 0)],
            ['Billable Pools', String(invoice.billable_pools ?? 0)],
            ['Per Pool Price', pdfFormatCurrency(invoice.per_pool_price)]
        ]
        poolLines.forEach(([label, value]) => {
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(...pdfColors.muted)
            doc.text(`${label}:`, PDF_MARGIN, y)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(...pdfColors.dark)
            doc.text(value, PDF_MARGIN + 35, y)
            y += 5.5
        })
        y += 2
    }

    const financialRows = [
        ['Subtotal', pdfFormatCurrency(invoice.subtotal), pdfColors.text],
        ['Tax', pdfFormatCurrency(invoice.tax), pdfColors.pending],
        ['Discount', `- ${pdfFormatCurrency(invoice.discount)}`, pdfColors.paid]
    ]

    financialRows.forEach(([label, value, color]) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...pdfColors.text)
        doc.text(label, PDF_MARGIN, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...color)
        doc.text(value, PDF_PAGE_WIDTH - PDF_MARGIN, y, { align: 'right' })
        y += 6
    })

    y += 2

    // Lighter total box: soft tinted background with a colored border instead of a solid fill
    const totalBoxHeight = 14
    doc.setFillColor(...pdfColors.brandLight)
    doc.roundedRect(PDF_MARGIN, y, PDF_CONTENT_WIDTH, totalBoxHeight, 2, 2, 'F')
    doc.setDrawColor(...pdfColors.brand)
    doc.setLineWidth(0.4)
    doc.roundedRect(PDF_MARGIN, y, PDF_CONTENT_WIDTH, totalBoxHeight, 2, 2, 'S')

    doc.setFillColor(...pdfColors.brand)
    doc.roundedRect(PDF_MARGIN, y, 3, totalBoxHeight, 2, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...pdfColors.brandDark)
    doc.text('TOTAL DUE', PDF_MARGIN + 8, y + 9)
    doc.setFontSize(14)
    doc.text(pdfFormatCurrency(invoice.total), PDF_PAGE_WIDTH - PDF_MARGIN - 4, y + 9.5, { align: 'right' })

    y += totalBoxHeight + 8
    return y
}

const pdfDrawPoolBreakdownTable = (doc, invoice, y) => {
    const pools = invoice.pools_snapshot
    if (invoice.billing_model !== 'per_pool' || !Array.isArray(pools) || pools.length === 0) {
        return y
    }

    y = pdfCheckPageBreak(doc, y, 20)
    y = pdfDrawSectionHeader(doc, 'Pool Breakdown', y, pdfColors.perPool)

    // Fixed, non-overlapping columns across the content width (170mm)
    const colX = {
        pool: PDF_MARGIN + 2,        // Pool ID
        desc: PDF_MARGIN + 24,       // Description / Pool Name
        customer: PDF_MARGIN + 82,   // Customer
        price: PDF_MARGIN + 122,     // Price
        status: PDF_MARGIN + 144     // Status badge
    }
    const colWidth = {
        pool: 20,
        desc: 55,
        customer: 38,
        price: 20
    }

    const drawTableHeaderRow = (yPos) => {
        doc.setFillColor(...pdfColors.brandLight)
        doc.roundedRect(PDF_MARGIN, yPos - 4.5, PDF_CONTENT_WIDTH, 7, 1.5, 1.5, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(...pdfColors.brandDark)
        doc.text('POOL ID', colX.pool, yPos)
        doc.text('DESCRIPTION', colX.desc, yPos)
        doc.text('CUSTOMER', colX.customer, yPos)
        doc.text('PRICE', colX.price, yPos)
        doc.text('STATUS', colX.status, yPos)
        return yPos + 5
    }

    y = drawTableHeaderRow(y)

    doc.setFontSize(8.5)

    pools.forEach((pool, idx) => {
        const prevY = y
        y = pdfCheckPageBreak(doc, y, 7)
        if (y !== prevY) {
            y = drawTableHeaderRow(y)
        }

        if (idx % 2 === 0) {
            doc.setFillColor(...pdfColors.zebra)
            doc.rect(PDF_MARGIN, y - 3.5, PDF_CONTENT_WIDTH, 6, 'F')
        }

        const poolId = pool.pool_id == null ? 'N/A' : 'PL-'  + invoice.tenant.id + pool.pool_id
        const poolName = pool.pool_name == null ? 'Unnamed Pool' : pool.pool_name
        const customerName = pool.customer_name === 'N/A' || !pool.customer_name ? 'N/A' : pool.customer_name
        const price = pdfFormatCurrency(pool.price)
        const statusLabel = pool.is_free ? 'Free' : 'Billable'
        const badgeColors = pool.is_free
            ? { fg: pdfColors.free, bg: pdfColors.freeBg }
            : { fg: pdfColors.billable, bg: pdfColors.billableBg }

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...pdfColors.dark)
        doc.text(pdfTruncateText(doc, poolId, colWidth.pool), colX.pool, y)

        doc.text(pdfTruncateText(doc, poolName, colWidth.desc), colX.desc, y)

        doc.text(pdfTruncateText(doc, customerName, colWidth.customer), colX.customer, y)

        doc.setFont('helvetica', 'bold')
        doc.text(price, colX.price, y)

        pdfDrawBadge(doc, statusLabel, colX.status, y - 4, badgeColors.fg, badgeColors.bg)

        y += 6.5
    })

    return y + 4
}

const pdfDrawPaymentInfo = (doc, invoice, y) => {
    if (invoice.status !== 'paid') return y

    y = pdfCheckPageBreak(doc, y, 28)
    y = pdfDrawSectionHeader(doc, 'Payment Information', y, pdfColors.paid)

    doc.setFillColor(...pdfColors.paidBg)
    doc.roundedRect(PDF_MARGIN, y - 4, PDF_CONTENT_WIDTH, 20, 2, 2, 'F')

    const lines = [
        ['Paid At', pdfFormatDate(invoice.paid_at)],
        ['Payment Method', invoice.payment_method || 'N/A'],
        ['Transaction ID', invoice.transaction_id || 'N/A']
    ]

    let lineY = y + 1
    doc.setFontSize(9)
    lines.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...pdfColors.text)
        doc.text(`${label}:`, PDF_MARGIN + 4, lineY)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...pdfColors.paid)
        doc.text(String(value), PDF_MARGIN + 42, lineY)
        lineY += 5.5
    })

    return y + 20 + 4
}

const pdfDrawTermsAndConditions = (doc, y) => {
    y = pdfCheckPageBreak(doc, y, 35)
    y = pdfDrawSectionHeader(doc, 'Terms & Conditions', y, pdfColors.muted)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...pdfColors.text)

    INVOICE_TERMS.forEach((term) => {
        doc.text(`• ${term}`, PDF_MARGIN + 4, y)
        y += 5.5
    })

    return y + 4
}

const pdfDrawFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        const footerY = PDF_PAGE_HEIGHT - 14

        doc.setDrawColor(...pdfColors.border)
        doc.setLineWidth(0.4)
        doc.line(PDF_MARGIN, footerY - 6, PDF_PAGE_WIDTH - PDF_MARGIN, footerY - 6)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(...pdfColors.brandDark)
        doc.text(`Generated by ${COMPANY_NAME}`, PDF_MARGIN, footerY)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7.5)
        doc.setTextColor(...pdfColors.muted)
        doc.text('Platform Billing System', PDF_MARGIN, footerY + 4)

        doc.text(
            `Generated on: ${pdfFormatDateTime(new Date())}`,
            PDF_PAGE_WIDTH - PDF_MARGIN,
            footerY,
            { align: 'right' }
        )
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...pdfColors.brandDark)
        doc.text(
            `Page ${i} of ${pageCount}`,
            PDF_PAGE_WIDTH - PDF_MARGIN,
            footerY + 4,
            { align: 'right' }
        )
    }
}

const generateInvoicePDF = (invoice) => {
    if (!invoice) return

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    let y = pdfDrawHeader(doc, invoice)
    y = pdfDrawTenantInfo(doc, invoice, y)
    y = pdfDrawBillingInfo(doc, invoice, y)
    y = pdfDrawInvoiceDetails(doc, invoice, y)
    y = pdfDrawPoolBreakdownTable(doc, invoice, y)
    y = pdfDrawPaymentInfo(doc, invoice, y)
    y = pdfDrawTermsAndConditions(doc, y)
    pdfDrawFooter(doc)

    const fileName = `Invoice-${invoice.invoice_number || 'invoice'}.pdf`
    doc.save(fileName)
}

// ==========================================================
// LIFECYCLE
// ==========================================================

onMounted(() => {
    // Load tenants once
    fetchActiveTenants()
    // Load invoices with current month/year
    fetchInvoices()
})
</script>

<style scoped>
/* Modal animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-scale-enter-active {
    animation: scaleIn 0.3s ease-out;
}

.modal-scale-leave-active {
    animation: scaleOut 0.2s ease-in;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes scaleOut {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

/* Drawer slide animation */
.slide-drawer-enter-active,
.slide-drawer-leave-active {
    transition: all 0.3s ease;
}

.slide-drawer-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-drawer-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>