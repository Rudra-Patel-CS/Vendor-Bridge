"use client"

import { useRfqForm } from "../rfq-form-context"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Copy,
  Trash2,
  Package,
  CalendarDays,
} from "lucide-react"

const units = ["pcs", "kg", "litre", "meter", "box", "set", "pair", "dozen", "ton", "roll"]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function Step2Items() {
  const {
    lineItems,
    addLineItem,
    updateLineItem,
    removeLineItem,
    duplicateLineItem,
    estimatedTotal,
    triggerAutoSave,
  } = useRfqForm()

  function handleFieldChange(id: string, field: string, value: string | number) {
    updateLineItem(id, { [field]: value })
    triggerAutoSave()
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Procurement Items</h3>
          <p className="text-xs text-muted-foreground">
            Add line items with quantities and estimated pricing.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addLineItem}>
          <Plus data-icon="inline-start" />
          Add Item
        </Button>
      </div>

      {/* Line items table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_1.5fr_0.7fr_0.7fr_1fr_1fr_auto] gap-3 items-center px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Item Name</span>
          <span>Description</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Est. Price (₹)</span>
          <span>Expected Delivery</span>
          <span className="text-center">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {lineItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative grid grid-cols-1 gap-3 p-4 transition-colors hover:bg-muted/30 lg:grid-cols-[2fr_1.5fr_0.7fr_0.7fr_1fr_1fr_auto] lg:items-center lg:gap-3 lg:py-3"
            >
              {/* Row number badge (mobile + desktop) */}
              <div className="absolute top-3 left-3 flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground lg:hidden">
                {index + 1}
              </div>

              {/* Item name */}
              <div className="space-y-1 pt-5 lg:pt-0">
                <label className="text-xs font-medium text-muted-foreground lg:hidden">Item Name</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 lg:hidden">
                    <Package className="size-3.5 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="e.g. Ball Bearings 6205-2RS"
                    value={item.name}
                    onChange={(e) => handleFieldChange(item.id, "name", e.target.value)}
                    className="h-8 text-sm lg:pl-2.5 pl-7"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground lg:hidden">Description</label>
                <Input
                  placeholder="SKU or specs"
                  value={item.description}
                  onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground lg:hidden">Quantity</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    handleFieldChange(item.id, "quantity", parseInt(e.target.value) || 0)
                  }
                  className="h-8 text-sm"
                />
              </div>

              {/* Unit */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground lg:hidden">Unit</label>
                <Select
                  value={item.unit}
                  onValueChange={(v) => handleFieldChange(item.id, "unit", v)}
                >
                  <SelectTrigger className="h-8 w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {units.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Price */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground lg:hidden">Est. Price (₹)</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={item.estimatedPrice || ""}
                  onChange={(e) =>
                    handleFieldChange(item.id, "estimatedPrice", parseFloat(e.target.value) || 0)
                  }
                  className="h-8 text-sm"
                />
              </div>

              {/* Expected Delivery */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground lg:hidden">Expected Delivery</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                  </div>
                  <Input
                    type="date"
                    value={item.expectedDelivery}
                    onChange={(e) => handleFieldChange(item.id, "expectedDelivery", e.target.value)}
                    className="h-8 pl-7 text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 justify-end lg:justify-center">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => duplicateLineItem(item.id)}
                  title="Duplicate"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Copy />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeLineItem(item.id)}
                  title="Remove"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </div>

              {/* Row subtotal (mobile) */}
              {item.quantity > 0 && item.estimatedPrice > 0 && (
                <div className="col-span-full text-xs text-muted-foreground lg:hidden">
                  Subtotal:{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(item.quantity * item.estimatedPrice)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer: totals */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {lineItems.length} item{lineItems.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={addLineItem}
              className="text-xs font-medium text-primary hover:underline underline-offset-2"
            >
              + Add another
            </button>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Estimated Total</div>
            <div className="text-base font-bold text-foreground tabular-nums">
              {formatCurrency(estimatedTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
