
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const useInvoicePDF = () => {
  const formatAmount = (value) => {
    if (!value) return '0.00'
    return parseFloat(value).toFixed(2)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const hexToRgb = (hex) => {
    hex = hex.replace('#', '')
    let r, g, b
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
    return { r, g, b }
  }

  const downloadInvoice = (invoice, tenant = null) => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let y = margin

    const brandColor = tenant?.brand_color || '#1a73e8'
    const brandColorRgb = hexToRgb(brandColor)
    
    // Company Header with Brand Color
    doc.setFillColor(brandColorRgb.r, brandColorRgb.g, brandColorRgb.b)
    doc.rect(0, 0, pageWidth, 45, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', pageWidth / 2, 30, { align: 'center' })
    y = 55

    // Invoice Number & Status
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice #:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.invoice_number, margin + 30, y)

    const statusColors = {
      paid: [0, 128, 0],
      sent: [200, 150, 0],
      draft: [128, 128, 128],
      overdue: [200, 0, 0],
      void: [128, 128, 128]
    }
    const color = statusColors[invoice.status] || [128, 128, 128]
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'bold')
    doc.text(capitalize(invoice.status), pageWidth - margin - 30, y)
    doc.setTextColor(0, 0, 0)
    y += 12

    doc.setDrawColor(200, 200, 200)
    doc.line(margin, y, pageWidth - margin, y)
    y += 10

    // From / To with Tenant Details
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('FROM:', margin, y)
    doc.setFont('helvetica', 'normal')
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(brandColorRgb.r, brandColorRgb.g, brandColorRgb.b)
    doc.text(tenant?.company_name || 'Pool Management Inc.', margin, y + 5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    if (tenant?.legal_name) {
      doc.text(tenant.legal_name, margin, y + 10)
      y += 5
    }
    
    if (tenant?.address) {
      doc.text(tenant.address, margin, y + 10)
      y += 5
    }
    
    if (tenant?.phone) {
      doc.text(`Phone: ${tenant.phone}`, margin, y + 10)
      y += 5
    }
    
    doc.text(tenant?.email || 'info@poolmanagement.com', margin, y + 10)
    y += 5
    
    if (tenant?.website) {
      doc.text(tenant.website, margin, y + 10)
      y += 5
    }
    
    if (tenant?.ein || tenant?.business_license) {
      let info = ''
      if (tenant?.ein) info += `EIN: ${tenant.ein}`
      if (tenant?.business_license) info += `  License: ${tenant.business_license}`
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(info, margin, y + 10)
      y += 5
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
    }

    // BILL TO section
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('BILL TO:', pageWidth / 2, y - 20)
    doc.setFont('helvetica', 'normal')
    
    doc.setFont('helvetica', 'bold')
    doc.text(invoice.customer?.contact_name || 'N/A', pageWidth / 2, y - 15)
    doc.setFont('helvetica', 'normal')
    
    let customerY = y - 10
    if (invoice.customer?.email) {
      doc.text(`Email: ${invoice.customer.email}`, pageWidth / 2, customerY)
      customerY += 5
    }
    if (invoice.customer?.phone) {
      doc.text(`Phone: ${invoice.customer.phone}`, pageWidth / 2, customerY)
      customerY += 5
    }
    if (invoice.customer?.address) {
      doc.text(invoice.customer.address, pageWidth / 2, customerY)
      customerY += 5
    }
    doc.text(`Customer ID: #${invoice.customer?.id || 'N/A'}`, pageWidth / 2, customerY + 5)
    
    y += 30

    // Invoice Details Box
    const boxY = y
    const boxHeight = 30
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(margin, boxY, pageWidth - (margin * 2), boxHeight, 4, 4, 'F')
    
    const colWidth = (pageWidth - (margin * 2)) / 3
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    
    doc.text('Invoice Date', margin + 5, boxY + 8)
    doc.setTextColor(0, 0, 0)
    doc.text(formatDate(invoice.invoice_date), margin + 5, boxY + 18)
    
    doc.setTextColor(100, 100, 100)
    doc.text('Due Date', margin + colWidth + 5, boxY + 8)
    doc.setTextColor(0, 0, 0)
    doc.text(formatDate(invoice.due_date), margin + colWidth + 5, boxY + 18)
    
    doc.setTextColor(100, 100, 100)
    doc.text('Billing Period', margin + (colWidth * 2) + 5, boxY + 8)
    doc.setTextColor(0, 0, 0)
    doc.text(formatDate(invoice.billing_period_start), margin + (colWidth * 2) + 5, boxY + 14)
    doc.text(formatDate(invoice.billing_period_end), margin + (colWidth * 2) + 5, boxY + 22)
    
    y = boxY + boxHeight + 15

    // Line Items Table
    if (invoice.line_items && invoice.line_items.length) {
      const tableData = invoice.line_items.map(item => [
        item.description || 'Service',
        item.quantity || 1,
        `$${formatAmount(item.unit_price)}`,
        `$${formatAmount(item.total)}`,
        item.taxable ? 'Yes' : 'No'
      ])
      autoTable(doc, {
        startY: y,
        head: [['Description', 'Qty', 'Unit Price', 'Total', 'Taxable']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [brandColorRgb.r, brandColorRgb.g, brandColorRgb.b],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 9
        },
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30, halign: 'right' },
          4: { cellWidth: 25, halign: 'center' }
        }
      })
      y = doc.lastAutoTable.finalY + 10
    } else {
      doc.setFontSize(10)
      doc.text(`Line Items: ${invoice.line_items_count || 0}`, margin, y)
      y += 10
    }

    // Summary
    const summaryX = pageWidth - margin - 70
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    doc.setTextColor(100, 100, 100)
    doc.text('Subtotal', summaryX, y)
    doc.setTextColor(0, 0, 0)
    doc.text(`$${formatAmount(invoice.subtotal)}`, pageWidth - margin, y, { align: 'right' })
    
    doc.setTextColor(100, 100, 100)
    doc.text('Tax', summaryX, y + 7)
    doc.setTextColor(0, 0, 0)
    doc.text(`$${formatAmount(invoice.tax)}`, pageWidth - margin, y + 7, { align: 'right' })
    
    if (invoice.discount > 0) {
      doc.setTextColor(100, 100, 100)
      doc.text('Discount', summaryX, y + 14)
      doc.setTextColor(200, 0, 0)
      doc.text(`-$${formatAmount(invoice.discount)}`, pageWidth - margin, y + 14, { align: 'right' })
      y += 7
    }
    
    y += 10
    doc.setDrawColor(200, 200, 200)
    doc.line(summaryX, y, pageWidth - margin, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(brandColorRgb.r, brandColorRgb.g, brandColorRgb.b)
    doc.text('TOTAL', summaryX, y + 5)
    doc.text(`$${formatAmount(invoice.total)}`, pageWidth - margin, y + 5, { align: 'right' })
    
    if (invoice.balance_due > 0) {
      y += 12
      doc.setFontSize(10)
      doc.setTextColor(200, 0, 0)
      doc.text('Balance Due:', summaryX, y + 3)
      doc.text(`$${formatAmount(invoice.balance_due)}`, pageWidth - margin, y + 3, { align: 'right' })
    }

    if (invoice.amount_paid > 0) {
      y += 8
      doc.setFontSize(9)
      doc.setTextColor(0, 128, 0)
      doc.text('Amount Paid:', summaryX, y + 3)
      doc.text(`$${formatAmount(invoice.amount_paid)}`, pageWidth - margin, y + 3, { align: 'right' })
    }

    y += 15

    // Payment History
    if (invoice.payments && invoice.payments.length) {
      y += 5
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Payment History', margin, y)
      y += 5
      
      const paymentData = invoice.payments.map(p => [
        formatDate(p.paid_at),
        p.method || 'N/A',
        p.status || 'Completed',
        `$${formatAmount(p.amount)}`
      ])
      autoTable(doc, {
        startY: y,
        head: [['Date', 'Method', 'Status', 'Amount']],
        body: paymentData,
        theme: 'plain',
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8
        },
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30, halign: 'right' }
        }
      })
      y = doc.lastAutoTable.finalY + 10
    }

    // Footer with Company Info
    const footerY = pageHeight - 25
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'italic')
    doc.text(`Thank you for your business with ${tenant?.company_name || 'Pool Management Inc.'}!`, pageWidth / 2, footerY, { align: 'center' })
    
    const footerInfo = []
    if (tenant?.phone) footerInfo.push(`Phone: ${tenant.phone}`)
    if (tenant?.email) footerInfo.push(`Email: ${tenant.email}`)
    if (tenant?.website) footerInfo.push(`Web: ${tenant.website}`)
    
    if (footerInfo.length) {
      doc.setFont('helvetica', 'normal')
      doc.text(footerInfo.join('  |  '), pageWidth / 2, footerY + 5, { align: 'center' })
    }
    
    doc.setFont('helvetica', 'italic')
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 10, { align: 'center' })
    
    if (tenant?.billing_model) {
      doc.setFontSize(7)
      doc.setTextColor(180, 180, 180)
      doc.text(`Billing: ${tenant.billing_model}  |  Status: ${tenant?.status || 'active'}`, pageWidth / 2, footerY + 15, { align: 'center' })
    }

    doc.save(`invoice-${invoice.invoice_number}.pdf`)
  }

  return {
    downloadInvoice
  }
}