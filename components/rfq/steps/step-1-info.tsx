"use client"

import { useRfqForm } from "../rfq-form-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDays, IndianRupee } from "lucide-react"

const categories = [
  "Raw Materials",
  "Office Supplies",
  "IT Equipment",
  "Industrial Machinery",
  "Packaging Materials",
  "Electrical Components",
  "Safety Equipment",
  "Maintenance & Repair",
]

const procurementTypes = [
  "Direct Procurement",
  "Indirect Procurement",
  "Services Procurement",
  "Capital Procurement",
]

const departments = [
  "Engineering",
  "Operations",
  "Manufacturing",
  "IT & Infrastructure",
  "Facilities",
  "Research & Development",
  "Finance",
  "Human Resources",
]

const priorities = [
  { value: "low", label: "Low", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", color: "text-warning" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "critical", label: "Critical", color: "text-destructive" },
]

const currencies = [
  { value: "INR", label: "₹ INR" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
  { value: "GBP", label: "£ GBP" },
]

export function Step1Info() {
  const { info, updateInfo, triggerAutoSave } = useRfqForm()

  function handleChange(field: string, value: string) {
    updateInfo({ [field]: value })
    triggerAutoSave()
  }

  return (
    <div className="space-y-6">
      {/* Section: Basic Information */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
        <p className="text-xs text-muted-foreground">
          Provide core details about the procurement request.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* RFQ Title */}
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="rfq-title" className="text-sm font-medium text-foreground">
            RFQ Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="rfq-title"
            placeholder="e.g. Q3 2026 — Industrial Grade Bearings"
            value={info.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="h-9"
          />
          <p className="text-xs text-muted-foreground">
            A clear title helps vendors understand the scope quickly.
          </p>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            RFQ Category <span className="text-destructive">*</span>
          </label>
          <Select value={info.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Procurement Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Procurement Type</label>
          <Select
            value={info.procurementType}
            onValueChange={(v) => handleChange("procurementType", v)}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {procurementTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Department <span className="text-destructive">*</span>
          </label>
          <Select value={info.department} onValueChange={(v) => handleChange("department", v)}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Priority</label>
          <Select value={info.priority} onValueChange={(v) => handleChange("priority", v)}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>●</span> {p.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Section: Budget & Timeline */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">Budget & Timeline</h3>
        <p className="text-xs text-muted-foreground">
          Set budget constraints and key dates for this RFQ.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Budget */}
        <div className="space-y-1.5">
          <label htmlFor="rfq-budget" className="text-sm font-medium text-foreground">
            Estimated Budget
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <IndianRupee className="size-3.5 text-muted-foreground" />
            </div>
            <Input
              id="rfq-budget"
              type="number"
              placeholder="500000"
              value={info.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              className="h-9 pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This is the maximum spend threshold for approvals.
          </p>
        </div>

        {/* Currency */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Currency</label>
          <Select value={info.currency} onValueChange={(v) => handleChange("currency", v)}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencies.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Date */}
        <div className="space-y-1.5">
          <label htmlFor="rfq-delivery" className="text-sm font-medium text-foreground">
            Required Delivery Date
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
            </div>
            <Input
              id="rfq-delivery"
              type="date"
              value={info.deliveryDate}
              onChange={(e) => handleChange("deliveryDate", e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>

        {/* Submission Deadline */}
        <div className="space-y-1.5">
          <label htmlFor="rfq-deadline" className="text-sm font-medium text-foreground">
            Quotation Submission Deadline
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
            </div>
            <Input
              id="rfq-deadline"
              type="date"
              value={info.submissionDeadline}
              onChange={(e) => handleChange("submissionDeadline", e.target.value)}
              className="h-9 pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Vendors must submit their quotations before this date.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="rfq-desc" className="text-sm font-medium text-foreground">
          Description & Specifications
        </label>
        <Textarea
          id="rfq-desc"
          placeholder="Provide detailed requirements, specifications, quality standards, and any other relevant information for vendors..."
          value={info.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="min-h-28"
        />
        <p className="text-xs text-muted-foreground">
          Include technical specs, quality standards, compliance requirements, and delivery instructions.
        </p>
      </div>
    </div>
  )
}
