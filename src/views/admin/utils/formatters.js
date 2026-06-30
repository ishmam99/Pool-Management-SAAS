export const formatCurrency = (amount) => {
  const value = Number(amount)
  if (Number.isNaN(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', {
    weekday: options.weekday ? 'short' : undefined,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

export const formatStatus = (status) => {
  if (!status) return 'Unknown'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const statusBadgeClass = (status) => {
  const key = (status || '').toLowerCase()
  const map = {
    paid: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-600',
    draft: 'bg-slate-100 text-slate-600',
    scheduled: 'bg-sky-100 text-sky-700',
    missed: 'bg-amber-100 text-amber-700',
    rescheduled: 'bg-orange-100 text-orange-700',
    in_progress: 'bg-blue-100 text-blue-700',
    trial: 'bg-sky-100 text-sky-700',
    past_due: 'bg-red-100 text-red-700',
    suspended: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    sent: 'bg-sky-100 text-sky-700',
    void: 'bg-gray-100 text-gray-500',
  }
  return map[key] || 'bg-gray-100 text-gray-700'
}
