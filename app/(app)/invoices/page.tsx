"use client"

import { useMemo, useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  ReceiptText,
  Plus,
  MoreHorizontal,
  Eye,
  Printer,
  Mail,
  Download,
  DollarSign,
  FileCheck,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { invoices as initialInvoices, formatFullCurrency } from "@/lib/mock-data"
import { toast } from "sonner"

function InvoicesContent() {
  const searchParams = useSearchParams()
  const [invoices, setInvoices] = useState(initialInvoices)

  // Details Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Intercept query params from PO generation
  useEffect(() => {
    const poRef = searchParams.get("poRef")
    const vendor = searchParams.get("vendor")
    const amountStr = searchParams.get("amount")

    if (poRef && vendor && amountStr) {
      const amount = parseFloat(amountStr)
      // Check if already created
      if (!invoices.some((inv) => inv.poRef === poRef)) {
        const gst = Math.round(amount * 0.18)
        const total = amount + gst
        const newInv = {
          id: `INV-${Math.floor(9903 + Math.random() * 100)}`,
          vendor,
          vendorId: "VEN-1001",
          poRef,
          subtotal: amount,
          gst,
          total,
          status: "pending" as const,
          issuedAt: new Date().toISOString().split("T")[0],
          dueAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }
        setInvoices((prev) => [newInv, ...prev])
        toast.info(`Pre-filled invoice generated from ${poRef}`)
      }
    }
  }, [searchParams, invoices])

  const handleStatusChange = (id: string, nextStatus: "paid" | "pending" | "overdue") => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: nextStatus } : inv))
    )
    toast.success(`Invoice ${id} marked as ${nextStatus}`)
  }

  const handleSendEmail = (invoice: any) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Sending invoice email to accounts department...",
        success: `Invoice ${invoice.id} sent successfully to vendor finance contact!`,
        error: "Failed to send invoice.",
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoices Management"
        description="Verify vendor invoices, calculate taxes, and execute payouts."
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs uppercase font-medium text-muted-foreground">
                <tr>
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">PO Reference</th>
                  <th className="p-4 text-right">Subtotal</th>
                  <th className="p-4 text-right">GST (18%)</th>
                  <th className="p-4 text-right">Grand Total</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/10">
                    <td className="p-4 font-mono text-xs font-semibold text-primary">{inv.id}</td>
                    <td className="p-4 font-medium">{inv.vendor}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{inv.poRef}</td>
                    <td className="p-4 text-right">{formatFullCurrency(inv.subtotal)}</td>
                    <td className="p-4 text-right text-muted-foreground">{formatFullCurrency(inv.gst)}</td>
                    <td className="p-4 text-right font-bold text-card-foreground">{formatFullCurrency(inv.total)}</td>
                    <td className="p-4 text-xs">{inv.dueAt}</td>
                    <td className="p-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedInvoice(inv)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={inv.status === "paid"}
                          onClick={() => handleStatusChange(inv.id, "paid")}
                        >
                          <FileCheck className="size-3.5 mr-1" /> Mark Paid
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleSendEmail(inv)}
                        >
                          <Mail className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ReceiptText className="size-5 text-primary" /> Invoice Summary & Tax Details
            </DialogTitle>
            <DialogDescription>Overview of taxes, items, and payout states.</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b pb-3.5">
                <div>
                  <span className="text-xs text-muted-foreground block">INVOICE ID</span>
                  <span className="font-mono font-semibold">{selectedInvoice.id}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">PO REF</span>
                  <span className="font-mono font-semibold">{selectedInvoice.poRef}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">VENDOR</span>
                  <span className="font-semibold">{selectedInvoice.vendor}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">DATE RECEIVED</span>
                  <span>{selectedInvoice.issuedAt}</span>
                </div>
              </div>

              {/* Tax Calculations */}
              <div className="space-y-2 bg-muted/40 p-3 rounded-lg border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal Amount</span>
                  <span className="font-medium">{formatFullCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Integrated GST (18%)</span>
                  <span className="font-medium text-warning-foreground dark:text-warning">{formatFullCurrency(selectedInvoice.gst)}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-base">
                  <span>Grand Total</span>
                  <span className="text-primary">{formatFullCurrency(selectedInvoice.total)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="size-4 mr-1.5" /> Print Invoice
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Invoice downloaded as PDF.")}>
                  <Download className="size-4 mr-1.5" /> PDF
                </Button>
                <Button size="sm" onClick={() => handleSendEmail(selectedInvoice)}>
                  <Mail className="size-4 mr-1.5" /> Send Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div>Loading invoices...</div>}>
      <InvoicesContent />
    </Suspense>
  )
}
