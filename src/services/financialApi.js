import api from './api.js'

const unwrap = (response) => response.data?.data ?? response.data

const paginated = (response) => {
  const body = response.data
  if (Array.isArray(body?.data)) return body
  if (Array.isArray(body)) return { data: body, current_page: 1, last_page: 1, total: body.length }
  return body
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (data?.errors) {
    const first = Object.keys(data.errors)[0]
    return data.errors[first]?.[0] || data.message || fallback
  }
  return data?.message || fallback
}

export const financialApi = {
  getInvoices: (params) =>
    api().get('financial-management/invoices', { params }).then(paginated),
  getInvoice: (invoiceId) =>
    api().get(`financial-management/invoices/${invoiceId}`).then(unwrap),

  getInvoiceSummary: () =>
    api().get('financial-management/invoices/summary').then(unwrap),

  createInvoice: (payload) =>
    api().post('financial-management/invoices', payload).then(unwrap),

  sendInvoice: (invoiceId) =>
    api().post(`financial-management/${invoiceId}/send`).then(unwrap),

  addInvoicePayment: (invoiceId, payload) =>
    api().post(`financial-management/${invoiceId}/payments`, payload).then(unwrap),

  downloadInvoice: (invoiceId) =>
    api().get(`financial-management/${invoiceId}/download`, { responseType: 'blob' }),

  getPayments: (params) =>
    
    api().get('financial-management/payments', { params }).then(paginated),

  getPaymentStats: () =>
    api().get('financial-management/payments/stats').then(unwrap),

  refundPayment: (paymentId) =>
    api().post(`financial-management/${paymentId}/refund`).then(unwrap),

  getPaymentMethods: (params) =>
    api().get('financial-management/payment-methods', { params }).then(paginated),

  addPaymentMethod: (payload) =>
    api().post('financial-management/payment-methods', payload).then(unwrap),

  setDefaultPaymentMethod: (methodId) =>
    api().post(`financial-management/payment-methods/default/${methodId}`).then(unwrap),

  removePaymentMethod: (methodId) =>
    api().delete(`financial-management/payment-methods/${methodId}`).then(unwrap),
}
