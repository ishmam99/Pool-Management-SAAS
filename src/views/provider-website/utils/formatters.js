export const stripHtml = (html, maxLength = 200) => {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!maxLength || text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export const renderStars = (rating) => {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)))
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}
