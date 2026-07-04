import { useAuthStore } from '../store/AuthStore.js'
import api from './api.js'

const authStore = useAuthStore()

const unwrap = (response) => response.data?.data ?? response.data
const isProviderPortal = () => authStore.authType == 'provider'

export const customerPortalApi = {
  getDashboard: () => api().get(`${isProviderPortal() ? `customer-portal/dashboard?customer_id=${authStore.customerId}` : 'customer-portal/dashboard'}`).then(unwrap),
  
  getPools: () => api().get(`${isProviderPortal() ? `customer-portal/pools?customer_id=${authStore.customerId}` : 'customer-portal/pools'}`).then(unwrap),
  
  getPoolHistory: (poolId) => api().get(`${isProviderPortal() ? `customer-portal/pools/${poolId}/history?customer_id=${authStore.customerId}` : `customer-portal/pools/${poolId}/history`}`).then(unwrap),
  
  getInvoices: () => api().get(`${isProviderPortal() ? `customer-portal/invoices?customer_id=${authStore.customerId}` : 'customer-portal/invoices'}`).then(unwrap),
  
  getInvoice: (invoiceId) => api().get(`${isProviderPortal() ? `customer-portal/invoices/${invoiceId}?customer_id=${authStore.customerId}` : `customer-portal/invoices/${invoiceId}`}`).then(unwrap),
  
  downloadInvoice: (invoiceId) => api().get(`${isProviderPortal() ? `customer-portal/invoices/${invoiceId}/download?customer_id=${authStore.customerId}` : `customer-portal/invoices/${invoiceId}/download`}`, { responseType: 'blob' }),
  
  getScheduledVisits: () => api().get(`${isProviderPortal() ? `customer-portal/scheduled-visits?customer_id=${authStore.customerId}` : 'customer-portal/scheduled-visits'}`).then(unwrap),
  
  getAgreements: () => api().get(`${isProviderPortal() ? `customer-portal/agreements?customer_id=${authStore.customerId}` : 'customer-portal/agreements'}`).then(unwrap),
  
  getMessages: () => api().get(`${isProviderPortal() ? `customer-portal/messages?customer_id=${authStore.customerId}` : 'customer-portal/messages'}`).then(unwrap),
  
  sendMessage: (payload) => api().post('customer-portal/messages', payload).then(unwrap),
  
  updateProfile: (payload) => api().patch('customer-portal/profile', payload).then(unwrap),
  
  getPaymentMethods: () => api().get(`${isProviderPortal() ? `customer-portal/payment-methods?customer_id=${authStore.customerId}` : 'customer-portal/payment-methods'}`).then(unwrap),
  
  addPaymentMethod: (payload) => api().post('customer-portal/payment-methods', payload).then(unwrap),
  
  removePaymentMethod: (methodId) => api().delete(`customer-portal/payment-methods/${methodId}`).then(unwrap),
  
  updateNotificationSettings: (payload) => api().put('customer-portal/notification-settings', payload).then(unwrap),
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (data?.errors) {
    const firstField = Object.keys(data.errors)[0]
    return data.errors[firstField]?.[0] || data.message || fallback
  }
  return data?.message || fallback
}