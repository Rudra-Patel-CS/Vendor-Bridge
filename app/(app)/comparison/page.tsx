"use client"

import { useMemo, useState } from "react"
import {
  GitCompareArrows,
  SlidersHorizontal,
  DollarSign,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RatingStars } from "@/components/rating-stars"
import { rfqs, quotations as initialQuotations, formatFullCurrency } from "@/lib/mock-data"
import { StatusBadge } from "@/components/status-badge"
import { toast } from "sonner"

export default function ComparisonPage() {
  const [selectedRfqId, setSelectedRfqId] = useState(rfqs[0]?.id || "")
  const [quotations, setQuotations] = useState(initialQuotations)

  const activeRfq = useMemo(() => {
    return rfqs.find((r) => r.id === selectedRfqId)
  }, [selectedRfqId])

  const rfqQuotations = useMemo(() => {
    return quotations.filter((q) => q.rfqId === selectedRfqId)
  }, [quotations, selectedRfqId])

  const comparisonMetrics = useMemo(() => {
    if (rfqQuotations.length === 0) return null

    let lowestPrice = Infinity
    let lowestPriceId = ""
    let fastestDelivery = Infinity
    let fastestDeliveryId = ""
    let bestRating = -1
    let bestRatingId = ""

    rfqQuotations.forEach((q) => {
      if (q.price < lowestPrice) {
        lowestPrice = q.price
        lowestPriceId = q.id
      }
      if (q.deliveryDays < fastestDelivery) {
        fastestDelivery = q.deliveryDays
        fastestDeliveryId = q.id
      }
      if (q.rating > bestRating) {
        bestRating = q.rating
        bestRatingId = q.id
      }
    })

    return {
      lowestPriceId,
      fastestDeliveryId,
      bestRatingId,
    }
  }, [rfqQuotations])

  const handleAward = (quoteId: string, vendorName: string) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.rfqId === selectedRfqId) {
          return {
            ...q,
            status: q.id === quoteId ? ("shortlisted" as const) : ("rejected" as const),
          }
        }
        return q
      })
    )
    toast.success(`Contract awarded to ${vendorName}!`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quotation Comparison"
        description="Analyze and compare vendor quotations side-by-side to make data-driven procurement decisions."
      />

      {/* Select RFQ Panel */}
      <Card>
        <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-md">
            <span className="text-sm font-semibold text-muted-foreground">Select RFQ for Comparison</span>
            <Select value={selectedRfqId} onValueChange={setSelectedRfqId}>
              <SelectTrigger className="w-full sm:w-[320px]">
                <SelectValue placeholder="Select RFQ" />
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

          {activeRfq && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm bg-muted/30 p-3 rounded-lg border">
              <div>
                <span className="text-muted-foreground">Target Product: </span>
                <span className="font-semibold">{activeRfq.product} ({activeRfq.quantity} {activeRfq.unit})</span>
              </div>
              <div>
                <span className="text-muted-foreground">Allocated Budget: </span>
                <span className="font-semibold">{formatFullCurrency(activeRfq.budget)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Grid */}
      {rfqQuotations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <GitCompareArrows className="size-12 text-muted-foreground/50 mb-3" />
          <CardTitle className="text-lg">No Quotations for Comparison</CardTitle>
          <CardDescription className="mt-1">
            There are no quotes submitted for {selectedRfqId} yet. Go to Quotations to submit.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfqQuotations.map((q) => {
            const isLowestPrice = comparisonMetrics?.lowestPriceId === q.id
            const isFastest = comparisonMetrics?.fastestDeliveryId === q.id
            const isBestRated = comparisonMetrics?.bestRatingId === q.id

            return (
              <Card
                key={q.id}
                className={`flex flex-col relative transition-all duration-200 ${
                  q.status === "shortlisted"
                    ? "border-success shadow-lg ring-1 ring-success"
                    : isLowestPrice
                    ? "border-primary/50 shadow-md"
                    : ""
                }`}
              >
                {/* Badges/Highlights */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  {q.status === "shortlisted" && (
                    <span className="bg-success text-success-foreground text-xs font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <CheckCircle className="size-3" /> Awarded
                    </span>
                  )}
                  {isLowestPrice && q.status !== "shortlisted" && (
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <DollarSign className="size-3" /> Lowest Price
                    </span>
                  )}
                  {isFastest && q.status !== "shortlisted" && (
                    <span className="bg-warning text-warning-foreground text-xs font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <Clock className="size-3" /> Fastest Delivery
                    </span>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-base truncate max-w-[180px]">{q.vendor}</CardTitle>
                  <CardDescription className="font-mono text-xs">{q.id}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Price */}
                  <div className="bg-muted/40 p-3 rounded-lg border">
                    <span className="text-xs text-muted-foreground block">Proposed Price Offer</span>
                    <span className="text-xl font-bold text-card-foreground">
                      {formatFullCurrency(q.price)}
                    </span>
                    {activeRfq && (
                      <span className={`text-xs block mt-1 ${q.price <= activeRfq.budget ? "text-success" : "text-destructive"}`}>
                        {q.price <= activeRfq.budget
                          ? `₹${((activeRfq.budget - q.price) / 1000).toFixed(1)}K under budget`
                          : `₹${((q.price - activeRfq.budget) / 1000).toFixed(1)}K over budget`}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center border-b pb-1.5">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-4 text-muted-foreground/70" /> Delivery Time
                      </span>
                      <span className="font-semibold">{q.deliveryDays} Days</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-1.5">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Star className="size-4 text-muted-foreground/70" /> Supplier Rating
                      </span>
                      <span className="font-semibold flex items-center gap-1">
                        {q.rating} <RatingStars value={q.rating} />
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-muted-foreground/70" /> Bid Status
                      </span>
                      <StatusBadge status={q.status} />
                    </div>
                  </div>

                  {/* Notes */}
                  {q.notes && (
                    <div className="text-xs bg-muted/20 p-2.5 rounded border italic text-muted-foreground">
                      &ldquo;{q.notes}&rdquo;
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <Button
                    className="w-full"
                    variant={q.status === "shortlisted" ? "outline" : "default"}
                    disabled={q.status === "shortlisted"}
                    onClick={() => handleAward(q.id, q.vendor)}
                  >
                    {q.status === "shortlisted" ? "Contract Awarded" : "Award Contract"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
