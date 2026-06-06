"use client"

import { useState, useMemo } from "react"
import { useRfqForm, type Vendor } from "../rfq-form-context"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Search,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Sparkles,
  CheckCircle2,
  Building2,
} from "lucide-react"

/* ─────────────── Mock vendor data ─────────────── */

const VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Tata Steel Ltd.",
    category: "Raw Materials",
    location: "Mumbai, India",
    rating: 4.8,
    performance: 96,
    transactions: 142,
    riskLevel: "low",
    logo: "TS",
    recommended: true,
  },
  {
    id: "v2",
    name: "Mahindra Industrial",
    category: "Industrial Machinery",
    location: "Pune, India",
    rating: 4.5,
    performance: 91,
    transactions: 87,
    riskLevel: "low",
    logo: "MI",
    recommended: true,
  },
  {
    id: "v3",
    name: "Bharat Forge Ltd.",
    category: "Raw Materials",
    location: "Pune, India",
    rating: 4.6,
    performance: 93,
    transactions: 65,
    riskLevel: "low",
    logo: "BF",
    aiSuggested: true,
  },
  {
    id: "v4",
    name: "Larsen & Toubro",
    category: "Industrial Machinery",
    location: "Chennai, India",
    rating: 4.7,
    performance: 94,
    transactions: 113,
    riskLevel: "low",
    logo: "LT",
    recommended: true,
  },
  {
    id: "v5",
    name: "Godrej Precision",
    category: "Electrical Components",
    location: "Mumbai, India",
    rating: 4.2,
    performance: 85,
    transactions: 39,
    riskLevel: "medium",
    logo: "GP",
    aiSuggested: true,
  },
  {
    id: "v6",
    name: "Sundaram Fasteners",
    category: "Raw Materials",
    location: "Chennai, India",
    rating: 4.4,
    performance: 89,
    transactions: 74,
    riskLevel: "low",
    logo: "SF",
  },
  {
    id: "v7",
    name: "SKF India Pvt. Ltd.",
    category: "Raw Materials",
    location: "Bangalore, India",
    rating: 4.3,
    performance: 87,
    transactions: 56,
    riskLevel: "medium",
    logo: "SK",
  },
  {
    id: "v8",
    name: "Voltamp Transformers",
    category: "Electrical Components",
    location: "Vadodara, India",
    rating: 3.9,
    performance: 78,
    transactions: 22,
    riskLevel: "high",
    logo: "VT",
  },
]

const categoryFilters = ["All", "Raw Materials", "Industrial Machinery", "Electrical Components"]

function RiskIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low") return <ShieldCheck className="size-3.5 text-emerald-500" />
  if (level === "medium") return <ShieldAlert className="size-3.5 text-amber-500" />
  return <ShieldX className="size-3.5 text-red-500" />
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="size-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold tabular-nums">{rating.toFixed(1)}</span>
    </div>
  )
}

export function Step3Vendors() {
  const { selectedVendorIds, toggleVendor, triggerAutoSave } = useRfqForm()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = VENDORS
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== "All") {
      list = list.filter((v) => v.category === categoryFilter)
    }
    return list
  }, [search, categoryFilter])

  const recommended = filtered.filter((v) => v.recommended)
  const aiSuggested = filtered.filter((v) => v.aiSuggested)
  const others = filtered.filter((v) => !v.recommended && !v.aiSuggested)

  function handleToggle(id: string) {
    toggleVendor(id)
    triggerAutoSave()
  }

  function VendorCard({ vendor }: { vendor: Vendor }) {
    const isSelected = selectedVendorIds.includes(vendor.id)

    return (
      <button
        type="button"
        onClick={() => handleToggle(vendor.id)}
        className={cn(
          "group relative flex w-full flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all",
          isSelected
            ? "border-primary bg-primary/[0.03] shadow-[0_0_0_1px] shadow-primary/20"
            : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
        )}
      >
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3">
            <CheckCircle2 className="size-5 text-primary" />
          </div>
        )}

        {/* Top row: avatar + name */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
              isSelected
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {vendor.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground truncate">
                {vendor.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">
                {vendor.location}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {vendor.category}
          </Badge>
          <Badge variant="outline" className="text-[10px] gap-1">
            <RiskIcon level={vendor.riskLevel} />
            {vendor.riskLevel} risk
          </Badge>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <StarRating rating={vendor.rating} />
            </div>
            <span className="text-[10px] text-muted-foreground">Rating</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5">
              <TrendingUp className="size-3 text-emerald-500" />
              <span className="text-xs font-semibold tabular-nums">{vendor.performance}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Performance</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Building2 className="size-3 text-muted-foreground" />
              <span className="text-xs font-semibold tabular-nums">{vendor.transactions}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Transactions</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Select Vendors</h3>
          <p className="text-xs text-muted-foreground">
            Choose one or more vendors to receive this RFQ.{" "}
            <span className="font-medium text-primary tabular-nums">
              {selectedVendorIds.length} selected
            </span>
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <Search className="size-3.5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search vendors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              categoryFilter === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended section */}
      {recommended.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Recommended
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      )}

      {/* AI Suggested section */}
      {aiSuggested.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-violet-500" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              AI Suggested
            </span>
            <Badge variant="secondary" className="text-[10px]">
              Based on your RFQ
            </Badge>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {aiSuggested.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      )}

      {/* Other vendors */}
      {others.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              All Vendors
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {others.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="size-8 text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No vendors found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}
