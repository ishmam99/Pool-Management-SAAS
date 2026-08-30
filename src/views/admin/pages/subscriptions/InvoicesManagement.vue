<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Invoices</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage all tenant invoices</p>
                </div>
                <div class="mt-4 sm:mt-0 flex gap-3">
                    <button @click="refreshData" 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Total Invoices</p>
                    <p class="text-2xl font-bold text-gray-900">{{ summary.total_invoices || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Total Amount</p>
                    <p class="text-2xl font-bold text-gray-900">${{ (summary.total_amount || 0) }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Paid</p>
                    <p class="text-2xl font-bold text-green-600">${{ (summary.paid_amount || 0) }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Pending</p>
                    <p class="text-2xl font-bold text-amber-600">${{ (summary.pending_amount || 0) }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Overdue</p>
                    <p class="text-2xl font-bold text-red-600">${{ (summary.overdue_amount || 0) }}</p>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
                        <select v-model="filters.tenant_id" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All Tenants</option>
                            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                                {{ tenant.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="filters.status" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Billing Model</label>
                        <select v-model="filters.billing_model" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All</option>
                            <option value="subscription">Subscription</option>
                            <option value="per_pool">Per Pool</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                        <input type="date" v-model="filters.date_from" 
                               @change="applyFilters"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                        <input type="date" v-model="filters.date_to" 
                               @change="applyFilters"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    </div>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                    <button @click="resetFilters" 
                            class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Bulk Actions -->
        <div class="max-w-7xl mx-auto mb-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <input type="checkbox" v-model="selectAll" 
                       class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                <span class="text-sm text-gray-500">Select All</span>
                <span v-if="selectedInvoices.length > 0" class="text-sm text-gray-500 ml-2">
                    {{ selectedInvoices.length }} selected
                </span>
            </div>
            <div class="flex gap-2">
                <button v-if="selectedInvoices.length > 0" 
                        @click="bulkMarkPaid"
                        class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Mark Paid
                </button>
                <button v-if="selectedInvoices.length > 0" 
                        @click="bulkDelete"
                        class="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Delete
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading invoices...</p>
            </div>
        </div>

        <!-- Invoices Table -->
        <div v-else class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-sky-50">
                            <tr>
                                <th class="px-3 py-3 border-e border-slate-300 text-left">
                                    <input type="checkbox" v-model="selectAll" 
                                           class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                                </th>
                                <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                                <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th class="px-6 py-3 border-e border-slate-300 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-3 py-4 border-e border-slate-200">
                                    <input type="checkbox" v-model="selectedInvoices" :value="invoice.id"
                                           class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200">
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</p>
                                        <p class="text-xs text-gray-500">#{{ invoice.id }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                    <p class="text-sm text-gray-900">{{ invoice.tenant?.company_name || 'N/A' }}</p>
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                    <p class="text-sm text-gray-600">{{ invoice.billing_period }}</p>
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                    <p class="text-sm font-semibold text-gray-900">${{ parseFloat(invoice.total).toFixed(2) }}</p>
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
                                    <span :class="{
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                        'bg-green-100 text-green-800': invoice.status === 'paid',
                                        'bg-amber-100 text-amber-800': invoice.status === 'pending',
                                        'bg-red-100 text-red-800': invoice.status === 'overdue',
                                        'bg-gray-100 text-gray-800': invoice.status === 'cancelled',
                                        'bg-purple-100 text-purple-800': invoice.status === 'failed'
                                    }">
                                        {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(invoice.due_date) }}
                                    <span v-if="isOverdue(invoice)" class="text-red-600 ml-1">(Overdue)</span>
                                </td>
                                <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="viewInvoice(invoice)" 
                                                class="text-indigo-600 hover:text-indigo-900 transition-colors">
                                            View
                                        </button>
                                        <button v-if="invoice.status !== 'paid'" 
                                                @click="markPaid(invoice)"
                                                class="text-green-600 hover:text-green-900 transition-colors">
                                            Mark Paid
                                        </button>
                                        <button @click="sendReminder(invoice)" 
                                                v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                                                class="text-amber-600 hover:text-amber-900 transition-colors">
                                            Remind
                                        </button>
                                        <button @click="downloadInvoice(invoice.id)" 
                                                class="text-gray-600 hover:text-gray-900 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Showing {{ (pagination.currentPage - 1) * pagination.perPage + 1 }} to 
                        {{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }} of 
                        {{ pagination.total }} invoices
                    </div>
                    <div class="flex gap-2">
                        <button @click="prevPage" 
                                :disabled="pagination.currentPage <= 1"
                                class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        <span class="px-3 py-1 text-sm text-gray-700">
                            Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
                        </span>
                        <button @click="nextPage" 
                                :disabled="pagination.currentPage >= pagination.lastPage"
                                class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- View Invoice Modal -->
        <div v-if="selectedInvoice" class="fixed inset-0 z-50 overflow-y-auto" @click.self="selectedInvoice = null">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Invoice Details</h3>
                        <button @click="selectedInvoice = null" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="flex justify-between items-start border-b border-gray-200 pb-4">
                            <div>
                                <p class="text-sm text-gray-500">Invoice Number</p>
                                <p class="font-medium">{{ selectedInvoice.invoice_number }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">Status</p>
                                <span :class="{
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                    'bg-green-100 text-green-800': selectedInvoice.status === 'paid',
                                    'bg-amber-100 text-amber-800': selectedInvoice.status === 'pending',
                                    'bg-red-100 text-red-800': selectedInvoice.status === 'overdue',
                                    'bg-gray-100 text-gray-800': selectedInvoice.status === 'cancelled'
                                }">
                                    {{ selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1) }}
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Tenant</p>
                                <p class="font-medium">{{ selectedInvoice.tenant?.name || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Billing Period</p>
                                <p class="font-medium">{{ selectedInvoice.billing_period }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Due Date</p>
                                <p class="font-medium">{{ formatDate(selectedInvoice.due_date) }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Billing Model</p>
                                <p class="font-medium capitalize">{{ selectedInvoice.billing_model?.replace('_', ' ') }}</p>
                            </div>
                        </div>

                        <div class="border-t border-gray-200 pt-4">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="font-medium">${{ parseFloat(selectedInvoice.subtotal).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Tax</span>
                                    <span class="font-medium">${{ parseFloat(selectedInvoice.tax).toFixed(2) }}</span>
                                </div>
                                <div v-if="parseFloat(selectedInvoice.discount) > 0" class="flex justify-between">
                                    <span class="text-gray-600">Discount</span>
                                    <span class="font-medium text-green-600">-${{ parseFloat(selectedInvoice.discount).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between border-t border-gray-200 pt-2">
                                    <span class="text-base font-semibold text-gray-900">Total</span>
                                    <span class="text-base font-bold text-gray-900">${{ parseFloat(selectedInvoice.total).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-4 border-t border-gray-200">
                            <button @click="downloadInvoice(selectedInvoice.id)" 
                                    class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                Download PDF
                            </button>
                            <button v-if="selectedInvoice.status !== 'paid'"
                                    @click="markPaid(selectedInvoice)"
                                    class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                                Mark as Paid
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const loading = ref(false);
const invoices = ref([]);
const tenants = ref([]);
const selectedInvoice = ref(null);
const selectAll = ref(false);
const selectedInvoices = ref([]);

const summary = reactive({
    total_invoices: 0,
    total_amount: 0,
    paid_amount: 0,
    pending_amount: 0,
    overdue_amount: 0
});

const pagination = reactive({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1
});

const filters = reactive({
    tenant_id: '',
    status: '',
    billing_model: '',
    date_from: '',
    date_to: ''
});

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const isOverdue = (invoice) => {
    return invoice.status === 'overdue' || 
           (invoice.status === 'pending' && new Date(invoice.due_date) < new Date());
};

const fetchInvoices = async () => {
    loading.value = true;
    try {
        const response = await adminApi.getInvoices({
            page: pagination.currentPage,
            per_page: pagination.perPage,
            ...filters
        });
        invoices.value = response.data.data.invoices.data;
        summary.total_invoices = response.data.data.summary?.total_invoices || 0;
        summary.total_amount = response.data.data.summary?.total_amount || 0;
        summary.paid_amount = response.data.data.summary?.paid_amount || 0;
        summary.pending_amount = response.data.data.summary?.pending_amount || 0;
        summary.overdue_amount = response.data.data.summary?.overdue_amount || 0;
        pagination.total = response.data.data.invoices.total;
        pagination.lastPage = response.data.data.invoices.last_page;
    } catch (error) {
        console.error('Failed to load invoices:', error);
        Swal.fire('Error', 'Failed to load invoices', 'error');
    } finally {
        loading.value = false;
    }
};

const applyFilters = () => {
    pagination.currentPage = 1;
    fetchInvoices();
};

const resetFilters = () => {
    filters.tenant_id = '';
    filters.status = '';
    filters.billing_model = '';
    filters.date_from = '';
    filters.date_to = '';
    applyFilters();
};

const nextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
        pagination.currentPage++;
        fetchInvoices();
    }
};

const prevPage = () => {
    if (pagination.currentPage > 1) {
        pagination.currentPage--;
        fetchInvoices();
    }
};

const viewInvoice = (invoice) => {
    selectedInvoice.value = invoice;
};

const markPaid = async (invoice) => {
    const result = await Swal.fire({
        title: 'Mark as Paid',
        text: `Mark invoice ${invoice.invoice_number} as paid?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, mark as paid'
    });
    
    if (result.isConfirmed) {
        try {
            await adminApi.markInvoicePaid(invoice.id, {
                payment_method: 'admin_manual'
            });
            Swal.fire('Success', 'Invoice marked as paid', 'success');
            selectedInvoice.value = null;
            fetchInvoices();
        } catch (error) {
            console.error('Failed to mark invoice paid:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to mark invoice as paid', 'error');
        }
    }
};

const sendReminder = async (invoice) => {
    try {
        await adminApi.sendInvoiceReminder(invoice.id);
        Swal.fire('Success', 'Reminder sent successfully', 'success');
    } catch (error) {
        console.error('Failed to send reminder:', error);
        Swal.fire('Error', 'Failed to send reminder', 'error');
    }
};

const downloadInvoice = async (invoiceId) => {
    try {
        const response = await adminApi.downloadInvoice(invoiceId);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Failed to download invoice:', error);
        Swal.fire('Error', 'Failed to download invoice', 'error');
    }
};

const bulkMarkPaid = async () => {
    if (selectedInvoices.value.length === 0) return;
    
    const result = await Swal.fire({
        title: 'Bulk Mark Paid',
        text: `Mark ${selectedInvoices.value.length} invoices as paid?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, mark as paid'
    });
    
    if (result.isConfirmed) {
        try {
            await adminApi.bulkUpdateInvoiceStatus({
                invoice_ids: selectedInvoices.value,
                status: 'paid'
            });
            Swal.fire('Success', `${selectedInvoices.value.length} invoices marked as paid`, 'success');
            selectedInvoices.value = [];
            fetchInvoices();
        } catch (error) {
            console.error('Failed to bulk mark paid:', error);
            Swal.fire('Error', 'Failed to update invoices', 'error');
        }
    }
};

const bulkDelete = async () => {
    if (selectedInvoices.value.length === 0) return;
    
    const result = await Swal.fire({
        title: 'Bulk Delete',
        text: `Delete ${selectedInvoices.value.length} invoices? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete'
    });
    
    if (result.isConfirmed) {
        try {
            for (const id of selectedInvoices.value) {
                await adminApi.deleteInvoice(id);
            }
            Swal.fire('Success', `${selectedInvoices.value.length} invoices deleted`, 'success');
            selectedInvoices.value = [];
            fetchInvoices();
        } catch (error) {
            console.error('Failed to bulk delete:', error);
            Swal.fire('Error', 'Failed to delete invoices', 'error');
        }
    }
};

const refreshData = () => {
    fetchInvoices();
};

onMounted(() => {
    fetchInvoices();
});

// Watch select all
watch(selectAll, (val) => {
    if (val) {
        selectedInvoices.value = invoices.value.map(i => i.id);
    } else {
        selectedInvoices.value = [];
    }
});
</script>