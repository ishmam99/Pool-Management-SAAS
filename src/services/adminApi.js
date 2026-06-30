import api from './api.js'

const unwrap = (response) => response.data?.data ?? response.data

export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const paginated = (response) => {
  const body = response.data
  if (Array.isArray(body?.data)) return body
  if (Array.isArray(body)) return { data: body, current_page: 1, last_page: 1, total: body.length }
  return body || { data: [], current_page: 1, last_page: 1, total: 0 }
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (data?.errors) {
    const first = Object.keys(data.errors)[0]
    return data.errors[first]?.[0] || data.message || fallback
  }
  return data?.message || fallback
}

export const adminApi = {
  // Tenants
  getTenants: (params) => api().get('tenant/tenants', { params }).then(paginated),
  getTenant: (id) => api().get(`tenant/tenants/${id}`).then(unwrap),
  createTenant: (payload) => api().post('tenant/tenants', payload).then(unwrap),
  updateTenant: (id, payload) => api().put(`tenant/tenants/${id}`, payload).then(unwrap),
  deleteTenant: (id) => api().delete(`tenant/tenants/${id}`).then(unwrap),
  restoreTenant: (id) => api().post(`tenant/tenants/${id}/restore`).then(unwrap),
  addTenantDomain: (tenantId, payload) => api().post(`tenant/${tenantId}/domains`, payload).then(unwrap),
  verifyTenantDomain: (tenantId, domain) =>
    api().get(`tenant/${tenantId}/domains/${encodeURIComponent(domain)}/verify`).then(unwrap),

  // Admins
  getAdmins: (params) => api().get('platform/admins', { params }).then(paginated),
  createAdmin: (payload) => api().post('platform/admins', payload).then(unwrap),
  updateAdmin: (id, payload) =>
    api().post(`platform/admins/${id}`, { ...payload, _method: 'PUT' }).then(unwrap),
  deleteAdmin: (id) => api().delete(`platform/admins/${id}`).then(unwrap),

  // Subscription plans
  getPlans: (params) => api().get('subscription/plans', { params }).then(paginated),
  createPlan: (payload) => api().post('subscription/plans', payload).then(unwrap),
  updatePlan: (id, payload) => api().put(`subscription/plans/${id}`, payload).then(unwrap),
  deletePlan: (id) => api().delete(`subscription/plans/${id}`).then(unwrap),

  // Tenant subscriptions
  getSubscriptions: (params) => api().get('subscription/tenant-subscriptions', { params }).then(paginated),
  createSubscription: (payload) => api().post('subscription/tenant-subscriptions', payload).then(unwrap),
  updateSubscription: (id, payload) => api().put(`subscription/tenant-subscriptions/${id}`, payload).then(unwrap),
  cancelSubscription: (id) => api().delete(`subscription/tenant-subscriptions/${id}/cancel`).then(unwrap),
}
