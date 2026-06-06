"use client"

import { useMemo, useState } from "react"
import {
  ShoppingCart,
  Plus,
  MoreHorizontal,
  Eye,
  FileText,
  Printer,
  Mail,
  Receipt,
  Download,
  AlertCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"
import { purchaseOrders as initialPOs, vendors, formatFullCurrency } from "@/lib/mock-data"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function PurchaseOrdersPage() {
  const router = useRouter()
  const [purchaseOrders, setPurchaseOrders] = useState(initialPOs)

  // Creation State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || "")
  const [itemCount, setItemCount] = useState("3")
  const [amount, setAmount] = useState("")

  // Details Dialog State
  const [selectedPO, setSelectedPO] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) {
      toast.error("Please specify a PO amount.")
      return
    }

    const vendorObj = vendors.find((v) => v.id === selectedVendorId)
    const newPO = {
      id: `PO-${Math.floor(3302 + Math.random() * 100)}`,
      vendor: vendorObj?.company || "Custom Vendor",
      vendorId: selectedVendorId,
      items: parseInt(itemCount),
      amount: parseFloat(amount),
      status: "draft" as const,
      createdAt: new Date().toISOString().split("T")[0],
      deliveryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    setPurchaseOrders((prev) => [newPO, ...prev])
    toast.success(`Purchase Order ${newPO.id} generated!`)
    setIsCreateOpen(false)
  }

  const handleStatusChange = (id: string, nextStatus: "draft" | "sent" | "approved" | "closed") => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: nextStatus } : po))
    )
    toast.success(`Purchase Order ${id} marked as ${nextStatus}`)
  }

  const handleGenerateInvoice = (po: any) => {
    // Navigate or trigger invoice state
    toast.success(`Invoice created from ${po.id}! Navigating to invoices...`)
    setTimeout(() => {
      router.push(`/invoices?poRef=${po.id}&vendor=${encodeURIComponent(po.vendor)}&amount=${po.amount}`)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Purchase Orders (POs)"
        description="Release verified purchase orders to suppliers and monitor fulfillment."
      >
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus data-icon="inline-start" /> Create PO
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs uppercase font-medium text-muted-foreground">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4 text-right">Total Amount</th>
                  <th className="p-4">Delivery Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-muted/10">
                    <td className="p-4 font-mono text-xs font-semibold text-primary">{po.id}</td>
                    <td className="p-4 font-medium">{po.vendor}</td>
                    <td className="p-4 text-center">{po.items}</td>
                    <td className="p-4 text-right font-semibold">{formatFullCurrency(po.amount)}</td>
                    <td className="p-4 text-xs">{po.deliveryDate}</td>
                    <td className="p-4">
                      <StatusBadge status={po.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedPO(po)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateInvoice(po)}
                          disabled={po.status !== "approved"}
                        >
                          <Receipt className="size-3.5 mr-1" /> Invoice
                        </Button>

                        <Select
                          value={po.status}
                          onValueChange={(val: any) => handleStatusChange(po.id, val)}
                        >
                          <SelectTrigger className="w-[100px] h-8 text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PO Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-primary" /> Purchase Order Details
            </DialogTitle>
            <DialogDescription>Overview and status of release document.</DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-b pb-3.5">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">PO NUMBER</span>
                  <span className="font-mono font-bold text-sm text-primary">{selectedPO.id}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">STATUS</span>
                  <StatusBadge status={selectedPO.status} className="mt-0.5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">SUPPLIER</span>
                  <span className="font-semibold text-card-foreground">{selectedPO.vendor}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">RELEASE DATE</span>
                  <span>{selectedPO.createdAt}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-2">Item Breakdown</span>
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted border-b font-medium text-muted-foreground">
                      <tr>
                        <th className="p-2">Item Details</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Est. Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Standard Industrial Consumables</td>
                        <td className="p-2 text-center">{selectedPO.items}</td>
                        <td className="p-2 text-right">{formatFullCurrency(selectedPO.amount / selectedPO.items)}</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td colSpan={2} className="p-2 font-semibold text-right">Total:</td>
                        <td className="p-2 font-bold text-right text-card-foreground">{formatFullCurrency(selectedPO.amount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="size-4 mr-1.5" /> Print PO
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("PO downloaded as PDF.")}>
                  <Download className="size-4 mr-1.5" /> PDF
                </Button>
                <Button size="sm" onClick={() => toast.success(`PO emailed to supplier contacts`)}>
                  <Mail className="size-4 mr-1.5" /> Send PO
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create PO Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Generate Purchase Order</DialogTitle>
            <DialogDescription>Directly create an official purchase draft for a vendor.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePO} className="space-y-4 py-1.5">
            <div className="grid gap-2">
              <Label htmlFor="createPoVendor">Select Supplier</Label>
              <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                <SelectTrigger id="createPoVendor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="itemCountInput">Number of Items</Label>
                <Input
                  id="itemCountInput"
                  type="number"
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="poAmountInput">PO Amount (INR)</Label>
                <Input
                  id="poAmountInput"
                  type="number"
                  placeholder="e.g. 500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Generate Draft PO</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
