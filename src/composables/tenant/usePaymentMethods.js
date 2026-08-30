import { ref, computed } from 'vue';
import { paymentApi } from '@/api/tenant/payments';
import Swal from 'sweetalert2';

export function usePaymentMethods() {
    const loading = ref(false);
    const paymentMethods = ref([]);
    const defaultMethod = ref(null);

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

    const fetchPaymentMethods = async () => {
        loading.value = true;
        try {
            const response = await paymentApi.getPaymentMethods();
            paymentMethods.value = response.data.data || [];
            defaultMethod.value = paymentMethods.value.find(m => m.is_default) || null;
            return paymentMethods.value;
        } catch (error) {
            showToast('error', 'Error', 'Failed to load payment methods');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addPaymentMethod = async (data) => {
        loading.value = true;
        try {
            const response = await paymentApi.addPaymentMethod(data);
            showToast('success', 'Success', 'Payment method added successfully');
            await fetchPaymentMethods();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Error', error.response?.data?.message || 'Failed to add payment method');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const removePaymentMethod = async (paymentMethodId) => {
        loading.value = true;
        try {
            const response = await paymentApi.removePaymentMethod(paymentMethodId);
            showToast('success', 'Success', 'Payment method removed successfully');
            await fetchPaymentMethods();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Error', error.response?.data?.message || 'Failed to remove payment method');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const setDefaultPaymentMethod = async (paymentMethodId) => {
        loading.value = true;
        try {
            const response = await paymentApi.setDefaultPaymentMethod(paymentMethodId);
            showToast('success', 'Success', 'Default payment method updated');
            await fetchPaymentMethods();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Error', error.response?.data?.message || 'Failed to set default payment method');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const hasPaymentMethods = computed(() => paymentMethods.value.length > 0);
    const cardMethods = computed(() => paymentMethods.value.filter(m => m.type === 'card'));
    const bankMethods = computed(() => paymentMethods.value.filter(m => m.type === 'bank'));

    return {
        loading,
        paymentMethods,
        defaultMethod,
        hasPaymentMethods,
        cardMethods,
        bankMethods,
        fetchPaymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod
    };
}