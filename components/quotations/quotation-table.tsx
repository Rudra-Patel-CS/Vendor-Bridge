"use client"

import { useMemo, useState } from "react"
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Check,
  Quote,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { StatusBadge } from "@/components/status-badge"
import { RatingStars } from "@/components/rating-stars"
import { quotations as initialQuotations, rfqs, vendors, formatFullCurrency } from "@/lib/mock-data"
import { toast } from "sonner"

export function QuotationTable() {
  const [quotations, setQuotations] = useState(initialQuotations)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<any | null>(null)

  // Form Fields
  const [selectedRfqId, setSelectedRfqId] = useState("")
  const [selectedVendorId, setSelectedVendorId] = useState("")
  const [price, setPrice] = useState("")
  const [deliveryDays, setDeliveryDays] = useState("")
  const [notes, setNotes] = useState("")

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const matchesQuery =
        !query ||
        q.id.toLowerCase().includes(query.toLowerCase()) ||
        q.vendor.toLowerCase().includes(query.toLowerCase()) ||
        q.rfqTitle.toLowerCase().includes(query.toLowerCase()) ||
        q.rfqId.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === "all" || q.status === status
      return matchesQuery && matchesStatus
    })
  }, [quotations, query, status])

  const handleOpenCreateModal = () => {
    setEditingQuotation(null)
    setSelectedRfqId(rfqs[0]?.id || "")
    setSelectedVendorId(vendors[0]?.id || "")
    setPrice("")
    setDeliveryDays("")
    setNotes("")
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (q: any) => {
    setEditingQuotation(q)
    setSelectedRfqId(q.rfqId)
    setSelectedVendorId(q.vendorId)
    setPrice(q.price.toString())
    setDeliveryDays(q.deliveryDays.toString())
    setNotes(q.notes)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!price || !deliveryDays) {
      toast.error("Please fill in price and delivery timeline.")
      return
    }

    const rfqObj = rfqs.find((r) => r.id === selectedRfqId)
    const vendorObj = vendors.find((v) => v.id === selectedVendorId)

    if (editingQuotation) {
      // Edit mode
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === editingQuotation.id
            ? {
                ...q,
                rfqId: selectedRfqId,
                rfqTitle: rfqObj?.title || q.rfqTitle,
                vendor: vendorObj?.company || q.vendor,
                vendorId: selectedVendorId,
                price: parseFloat(price),
                deliveryDays: parseInt(deliveryDays),
                notes,
              }
            : q
        )
      )
      toast.success("Quotation updated successfully.")
    } else {
      // Create mode
      const newQuote = {
        id: `QUO-${Math.floor(1000 + Math.random() * 9000)}`,
        rfqId: selectedRfqId,
        rfqTitle: rfqObj?.title || "Custom RFQ",
        vendor: vendorObj?.company || "Custom Vendor",
        vendorId: selectedVendorId,
        price: parseFloat(price),
        deliveryDays: parseInt(deliveryDays),
        rating: vendorObj?.rating || 4.0,
        notes,
        status: "submitted" as const,
        submittedAt: new Date().toISOString().split("T")[0],
      }
      setQuotations((prev) => [newQuote, ...prev])
      toast.success("Quotation submitted successfully!")
    }
    setIsModalOpen(false)
  }

  const handleStatusChange = (id: string, nextStatus: "submitted" | "shortlisted" | "rejected") => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: nextStatus } : q))
    )
    toast.success(`Quotation marked as ${nextStatus}`)
  }

  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:p-5">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-xs">
              <InputGroup>
                <InputGroupInput
                  placeholder="Search quotations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-36">
                  <SlidersHorizontal className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download data-icon="inline-start" />
                Export CSV
              </Button>
              <Button size="sm" onClick={handleOpenCreateModal}>
                <Plus data-icon="inline-start" />
                Submit Quotation
              </Button>
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Quote />
                </EmptyMedia>
                <EmptyTitle>No quotations found</EmptyTitle>
                <EmptyDescription>
                  Submit a new quote or adjust your search filters.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[120px]">Quote ID</TableHead>
                    <TableHead>Vendor Info</TableHead>
                    <TableHead>RFQ Reference</TableHead>
                    <TableHead className="text-right">Price Offer</TableHead>
                    <TableHead className="text-center">Delivery Days</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {q.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{q.vendor}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            Rating: <RatingStars value={q.rating} />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-xs text-muted-foreground">
                            {q.rfqId}
                          </span>
                          <span className="text-sm line-clamp-1">{q.rfqTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {formatFullCurrency(q.price)}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {q.deliveryDays} days
                      </TableCell>
                      <TableCell className="text-sm">
                        {q.submittedAt}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={q.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon-sm" aria-label="Actions">
                              <MoreHorizontal />
                            </Button>
                          } />
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => handleOpenEditModal(q)}>
                                <Pencil data-icon="inline-start" />Edit Quotation
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(q.id, "shortlisted")}>
                                <Check className="size-4 mr-2 text-success" />Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(q.id, "rejected")}>
                                <X className="size-4 mr-2 text-destructive" />Reject
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between border-t pt-4 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length} of {quotations.length} quotations
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Submission/Edit Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingQuotation ? "Edit Quotation Details" : "Submit Vendor Quotation"}</DialogTitle>
            <DialogDescription>
              Enter the pricing offer, delivery schedule, and notes for the RFQ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="rfqSelect">Select RFQ</Label>
              <Select value={selectedRfqId} onValueChange={setSelectedRfqId} disabled={!!editingQuotation}>
                <SelectTrigger id="rfqSelect">
                  <SelectValue placeholder="Choose RFQ" />
                </SelectTrigger>
                <SelectContent>
                  {rfqs.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.id} - {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorSelect">Responding Vendor</Label>
              <Select value={selectedVendorId} onValueChange={setSelectedVendorId} disabled={!!editingQuotation}>
                <SelectTrigger id="vendorSelect">
                  <SelectValue placeholder="Choose Vendor" />
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
                <Label htmlFor="priceInput">Price Offer (INR)</Label>
                <Input
                  id="priceInput"
                  type="number"
                  placeholder="e.g. 1000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliveryInput">Delivery Timeline (Days)</Label>
                <Input
                  id="deliveryInput"
                  type="number"
                  placeholder="e.g. 10"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notesText">Remarks / Terms</Label>
              <Textarea
                id="notesText"
                placeholder="Include custom terms or details about this bid..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQuotation ? "Save Changes" : "Submit Quotation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
