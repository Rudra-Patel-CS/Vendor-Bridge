"use client"

import { useRfqForm } from "./rfq-form-context"
import {
  IndianRupee,
  Users,
  Star,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react"

const VENDOR_RATINGS: Record<string, number> = {
  v1: 4.8,
  v2: 4.5,
  v3: 4.6,
  v4: 4.7,
  v5: 4.2,
  v6: 4.4,
  v7: 4.3,
  v8: 3.9,
}

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const recentActivity = [
  { text: "RFQ-2026-041 approved", time: "2h ago", color: "text-emerald-500" },
  { text: "3 new quotations received", time: "5h ago", color: "text-primary" },
  { text: "PO-1182 dispatched", time: "1d ago", color: "text-muted-foreground" },
]

export function RfqInsightsPanel() {
  const { estimatedTotal, selectedVendorIds, info, lineItems, completedSteps } =
    useRfqForm()

  const avgRating =
    selectedVendorIds.length > 0
      ? selectedVendorIds.reduce((sum, id) => sum + (VENDOR_RATINGS[id] || 0), 0) /
        selectedVendorIds.length
      : 0

  const daysUntilDeadline = info.submissionDeadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(info.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : null

  const itemCount = lineItems.filter((i) => i.name).length
  const progressPercent = Math.round((completedSteps.length / 5) * 100)

  /* Health score: rough heuristic */
  const healthScore =
    (info.title ? 15 : 0) +
    (info.category ? 10 : 0) +
    (info.department ? 10 : 0) +
    (itemCount > 0 ? 20 : 0) +
    (selectedVendorIds.length > 0 ? 20 : 0) +
    (info.submissionDeadline ? 10 : 0) +
    (info.budget ? 15 : 0)

  const healthColor =
    healthScore >= 80 ? "text-emerald-500" : healthScore >= 50 ? "text-amber-500" : "text-red-500"

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Completion
          </span>
          <span className="text-xs font-bold text-primary tabular-nums">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {completedSteps.length} of 5 steps completed
        </p>
      </div>

      {/* Procurement Health */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Activity className={`size-4 ${healthColor}`} />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Procurement Health
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold tabular-nums ${healthColor}`}>{healthScore}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              healthScore >= 80
                ? "bg-emerald-500"
                : healthScore >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Key metrics */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {/* Estimated Value */}
        <div className="flex items-center gap-3 p-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <IndianRupee className="size-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Est. Value
            </span>
            <p className="text-sm font-bold text-foreground tabular-nums">
              {estimatedTotal > 0 ? formatCurrency(estimatedTotal) : "—"}
            </p>
          </div>
        </div>

        {/* Selected vendors */}
        <div className="flex items-center gap-3 p-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Users className="size-4 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Vendors
            </span>
            <p className="text-sm font-bold text-foreground tabular-nums">
              {selectedVendorIds.length}
            </p>
          </div>
        </div>

        {/* Avg rating */}
        <div className="flex items-center gap-3 p-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Star className="size-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Avg Rating
            </span>
            <p className="text-sm font-bold text-foreground tabular-nums">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-3 p-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <Clock className="size-4 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Deadline
            </span>
            <p className="text-sm font-bold text-foreground tabular-nums">
              {daysUntilDeadline !== null ? `${daysUntilDeadline} days` : "—"}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="flex items-center gap-3 p-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <Truck className="size-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Line Items
            </span>
            <p className="text-sm font-bold text-foreground tabular-nums">{itemCount}</p>
          </div>
        </div>
      </div>

      {/* Risk indicators */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Risk Indicators
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Budget compliance</span>
            {info.budget && estimatedTotal <= Number(info.budget) ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="size-3" /> Within budget
              </span>
            ) : info.budget ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="size-3" /> Over budget
              </span>
            ) : (
              <span className="text-muted-foreground">No budget set</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Vendor diversity</span>
            <span
              className={
                selectedVendorIds.length >= 3
                  ? "text-emerald-600"
                  : selectedVendorIds.length >= 1
                    ? "text-amber-600"
                    : "text-muted-foreground"
              }
            >
              {selectedVendorIds.length >= 3
                ? "Good"
                : selectedVendorIds.length >= 1
                  ? "Fair"
                  : "None"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Documentation</span>
            <span className="text-muted-foreground">
              {info.description ? "Provided" : "Missing"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Recent Activity
          </span>
        </div>
        <div className="space-y-2.5">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`mt-1 size-1.5 shrink-0 rounded-full ${item.color.replace("text-", "bg-")}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-snug">{item.text}</p>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
