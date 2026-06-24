import api from './api.js'

const unwrap = (response) => response.data?.data ?? response.data

export const customerPortalApi = {
  getDashboard: () => api().get('customer-portal/dashboard').then(unwrap),
  getPools: () => api().get('customer-portal/pools').then(unwrap),
  getPoolHistory: (poolId) => api().get(`customer-portal/pools/${poolId}/history`).then(unwrap),
  getInvoices: () => api().get('customer-portal/invoices').then(unwrap),
  getInvoice: (invoiceId) => api().get(`customer-portal/invoices/${invoiceId}`).then(unwrap),
  downloadInvoice: (invoiceId) =>
    api().get(`customer-portal/invoices/${invoiceId}/download`, { responseType: 'blob' }),
  getScheduledVisits: () => api().get('customer-portal/scheduled-visits').then(unwrap),
  getAgreements: () => api().get('customer-portal/agreements').then(unwrap),
  getMessages: () => api().get('customer-portal/messages').then(unwrap),
  sendMessage: (payload) => api().post('customer-portal/messages', payload).then(unwrap),
  updateProfile: (payload) => api().patch('customer-portal/profile', payload).then(unwrap),
  getPaymentMethods: () => api().get('customer-portal/payment-methods').then(unwrap),
  addPaymentMethod: (payload) => api().post('customer-portal/payment-methods', payload).then(unwrap),
  removePaymentMethod: (methodId) => api().delete(`customer-portal/payment-methods/${methodId}`).then(unwrap),
  updateNotificationSettings: (payload) =>
    api().put('customer-portal/notification-settings', payload).then(unwrap),
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (data?.errors) {
    const firstField = Object.keys(data.errors)[0]
    return data.errors[firstField]?.[0] || data.message || fallback
  }
  return data?.message || fallback
}
