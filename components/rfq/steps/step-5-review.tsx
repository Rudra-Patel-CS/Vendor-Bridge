"use client"

import { useRfqForm } from "../rfq-form-context"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Package,
  Users,
  Paperclip,
  Calendar,
  IndianRupee,
  Building2,
  Star,
  Clock,
} from "lucide-react"

/* ─── Helpers from vendor step (duplicated for review independence) ─── */
const VENDOR_MAP: Record<string, { name: string; rating: number; logo: string }> = {
  v1: { name: "Tata Steel Ltd.", rating: 4.8, logo: "TS" },
  v2: { name: "Mahindra Industrial", rating: 4.5, logo: "MI" },
  v3: { name: "Bharat Forge Ltd.", rating: 4.6, logo: "BF" },
  v4: { name: "Larsen & Toubro", rating: 4.7, logo: "LT" },
  v5: { name: "Godrej Precision", rating: 4.2, logo: "GP" },
  v6: { name: "Sundaram Fasteners", rating: 4.4, logo: "SF" },
  v7: { name: "SKF India Pvt. Ltd.", rating: 4.3, logo: "SK" },
  v8: { name: "Voltamp Transformers", rating: 3.9, logo: "VT" },
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

interface ValidationItem {
  label: string
  passed: boolean
}

export function Step5Review() {
  const { info, lineItems, selectedVendorIds, attachments, estimatedTotal } = useRfqForm()

  const validations: ValidationItem[] = [
    { label: "RFQ title provided", passed: !!info.title },
    { label: "Category assigned", passed: !!info.category },
    { label: "Department selected", passed: !!info.department },
    { label: "At least one line item", passed: lineItems.length > 0 && !!lineItems[0].name },
    { label: "Vendor(s) selected", passed: selectedVendorIds.length > 0 },
    { label: "Submission deadline set", passed: !!info.submissionDeadline },
  ]
  const allPassed = validations.every((v) => v.passed)

  return (
    <div className="space-y-6">
      {/* Validation check */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          allPassed
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10"
            : "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10"
        }`}
      >
        {allPassed ? (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
        ) : (
          <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
        )}
        <div className="space-y-2 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {allPassed ? "All checks passed — Ready to submit" : "Some items need attention"}
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {validations.map((v) => (
              <div key={v.label} className="flex items-center gap-2 text-xs">
                {v.passed ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="size-3.5 text-amber-500" />
                )}
                <span className={v.passed ? "text-foreground" : "text-amber-700 dark:text-amber-400"}>
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ Summary */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            RFQ Summary
          </h3>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs text-muted-foreground">Title</span>
              <p className="text-sm font-medium text-foreground">{info.title || "—"}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Category</span>
              <p className="text-sm font-medium text-foreground">{info.category || "—"}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Department</span>
              <p className="text-sm font-medium text-foreground">{info.department || "—"}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Priority</span>
              <Badge variant="secondary" className="capitalize mt-0.5">
                {info.priority}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <IndianRupee className="size-3" /> Budget
              </span>
              <p className="text-sm font-medium text-foreground">
                {info.budget ? formatCurrency(Number(info.budget)) : "—"}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Delivery Date
              </span>
              <p className="text-sm font-medium text-foreground">
                {formatDate(info.deliveryDate)}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> Submission Deadline
              </span>
              <p className="text-sm font-medium text-foreground">
                {formatDate(info.submissionDeadline)}
              </p>
            </div>
            {info.procurementType && (
              <div>
                <span className="text-xs text-muted-foreground">Procurement Type</span>
                <p className="text-sm font-medium text-foreground">{info.procurementType}</p>
              </div>
            )}
          </div>
          {info.description && (
            <div className="mt-4 border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">Description</span>
              <p className="mt-1 text-sm text-foreground whitespace-pre-line leading-relaxed">
                {info.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Line Items Summary */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Line Items ({lineItems.filter((i) => i.name).length})
          </h3>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[2fr_0.8fr_0.8fr_1fr] gap-3 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Item</span>
            <span>Qty</span>
            <span>Unit Price</span>
            <span className="text-right">Subtotal</span>
          </div>
          <div className="divide-y divide-border">
            {lineItems
              .filter((i) => i.name)
              .map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 gap-2 px-4 py-3 sm:grid-cols-[2fr_0.8fr_0.8fr_1fr] sm:gap-3 sm:items-center"
                >
                  <div className="col-span-3 sm:col-span-1">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    {item.description && (
                      <span className="block text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </div>
                  <span className="text-sm tabular-nums text-foreground">
                    {item.quantity} {item.unit}
                  </span>
                  <span className="text-sm tabular-nums text-foreground">
                    {formatCurrency(item.estimatedPrice)}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground text-right">
                    {formatCurrency(item.quantity * item.estimatedPrice)}
                  </span>
                </div>
              ))}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
            <span className="text-xs text-muted-foreground font-medium">Estimated Total</span>
            <span className="text-base font-bold text-foreground tabular-nums">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>
        </div>
      </section>

      {/* Selected Vendors */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Selected Vendors ({selectedVendorIds.length})
          </h3>
          <div className="h-px flex-1 bg-border" />
        </div>
        {selectedVendorIds.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {selectedVendorIds.map((id) => {
              const v = VENDOR_MAP[id]
              if (!v) return null
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {v.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {v.rating}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No vendors selected.</p>
        )}
      </section>

      {/* Attachments */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Attachments ({attachments.length})
          </h3>
          <div className="h-px flex-1 bg-border" />
        </div>
        {attachments.length > 0 ? (
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-3 px-4 py-2.5">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{att.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {(att.size / 1024).toFixed(0)} KB
                </span>
                {att.status === "complete" ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="text-xs text-primary tabular-nums">{att.progress}%</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No attachments added.</p>
        )}
      </section>
    </div>
  )
}
