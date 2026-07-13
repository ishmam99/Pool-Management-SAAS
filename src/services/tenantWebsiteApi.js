import axios from 'axios'

const baseURL = `${import.meta.env.VITE_BASE_URL}/api`

const client = axios.create({
  baseURL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

const unwrap = (response) => response.data?.data ?? response.data

const paginated = (response) => {
  const body = response.data
  if (Array.isArray(body?.data)) return body
  if (Array.isArray(body)) return { data: body, current_page: 1, last_page: 1, total: body.length }
  return body
}

export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (data?.errors) {
    const first = Object.keys(data.errors)[0]
    return data.errors[first]?.[0] || data.message || fallback
  }
  return data?.message || fallback
}

export const normalizePage = (payload) => {
  if (!payload) return null
  if (Array.isArray(payload)) return payload[0] || null
  if (Array.isArray(payload?.data)) return payload.data[0] || null
  return payload
}

export const tenantWebsiteApi = {
  getWebsite: () => client.get('tenant/website').then(unwrap),

  getPage: (pageType) =>
    client
      .get('tenant/website/pages', { params: { page_type: pageType } })
      .then(unwrap)
      .then(normalizePage),

  getTestimonials: () => client.get('tenant/website/testimonials').then(unwrap),

  getBlog: (params) => client.get('tenant/website/blog', { params }).then(paginated),

  getBlogPost: (id) => client.get(`tenant/website/blog/${id}`).then(unwrap),

  getFaqs: () => client.get('tenant/website/faqs').then(unwrap),

  getServiceAreas: () => client.get('tenant/website/service-areas').then(unwrap),

  submitContact: (payload) => client.post('public/contact', payload).then(unwrap),
}
