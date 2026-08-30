import { ref, reactive, computed } from 'vue';
import { billingApi } from '@/api/tenant/billing.js';
import Swal from 'sweetalert2';

export function useBilling() {
    const loading = ref(false);
    const billingInfo = ref(null);
    const invoices = ref([]);
    const currentInvoice = ref(null);
    const summary = ref({
        total_invoices: 0,
        total_amount: 0,
        paid_amount: 0,
        pending_amount: 0
    });
    const pagination = reactive({
        currentPage: 1,
        perPage: 20,
        total: 0,
        lastPage: 1
    });

    const showToast = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
        });
    };

    const fetchBillingInfo = async () => {
        loading.value = true;
        try {
            const response = await billingApi.getMyBilling();
            billingInfo.value = response.data.data;
            return response.data.data;
        } catch (error) {
            showToast('error', 'Error', 'Failed to load billing information');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const fetchInvoices = async (params = {}) => {
        loading.value = true;
        try {
            const response = await billingApi.getMyInvoices({
                page: pagination.currentPage,
                per_page: pagination.perPage,
                ...params
            });
            
            invoices.value = response.data.data.invoices.data;
            summary.value = response.data.data.summary || summary.value;
            pagination.total = response.data.data.invoices.total;
            pagination.lastPage = response.data.data.invoices.last_page;
            pagination.currentPage = response.data.data.invoices.current_page;
            
            return invoices.value;
        } catch (error) {
            showToast('error', 'Error', 'Failed to load invoices');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const fetchInvoiceDetail = async (invoiceId) => {
        loading.value = true;
        try {
            const response = await billingApi.getInvoiceDetail(invoiceId);
            currentInvoice.value = response.data.data;
            return response.data.data;
        } catch (error) {
            showToast('error', 'Error', 'Failed to load invoice details');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const payInvoice = async (invoiceId, paymentData) => {
        loading.value = true;
        try {
            const response = await billingApi.payInvoice(invoiceId, paymentData);
            showToast('success', 'Success', 'Invoice paid successfully');
            return response.data.data;
        } catch (error) {
            showToast('error', 'Payment Failed', error.response?.data?.message || 'Payment failed');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const downloadInvoice = async (invoiceId) => {
        loading.value = true;
        try {
            const response = await billingApi.downloadInvoice(invoiceId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast('success', 'Success', 'Invoice downloaded successfully');
        } catch (error) {
            showToast('error', 'Error', 'Failed to download invoice');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const downloadAllInvoices = async () => {
        loading.value = true;
        try {
            // This would typically be a bulk download endpoint
            const response = await billingApi.getMyInvoices({ 
                per_page: 9999,
                ...(filters.value || {})
            });
            // Create a CSV or combined PDF
            showToast('info', 'Info', 'Download all invoices feature coming soon');
        } catch (error) {
            showToast('error', 'Error', 'Failed to download invoices');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const totalInvoices = computed(() => pagination.total);
    const hasInvoices = computed(() => invoices.value?.length > 0);
    const pendingInvoices = computed(() => 
        invoices.value?.filter(inv => ['pending', 'overdue'].includes(inv.status)) || []
    );
    const totalPendingAmount = computed(() => 
        pendingInvoices.value.reduce((sum, inv) => sum + parseFloat(inv.total), 0)
    );

    return {
        loading,
        billingInfo,
        invoices,
        currentInvoice,
        summary,
        pagination,
        totalInvoices,
        hasInvoices,
        pendingInvoices,
        totalPendingAmount,
        fetchBillingInfo,
        fetchInvoices,
        fetchInvoiceDetail,
        payInvoice,
        downloadInvoice,
        downloadAllInvoices
    };
}