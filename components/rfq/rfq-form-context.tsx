"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"

/* ─────────────────────────── Types ─────────────────────────── */

export interface RfqInfo {
  title: string
  category: string
  procurementType: string
  department: string
  priority: string
  budget: string
  currency: string
  deliveryDate: string
  submissionDeadline: string
  description: string
}

export interface LineItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  estimatedPrice: number
  expectedDelivery: string
}

export interface Vendor {
  id: string
  name: string
  category: string
  location: string
  rating: number
  performance: number
  transactions: number
  riskLevel: "low" | "medium" | "high"
  logo: string
  recommended?: boolean
  aiSuggested?: boolean
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "complete" | "error"
  addedAt: string
}

export interface RfqFormState {
  step: number
  info: RfqInfo
  lineItems: LineItem[]
  selectedVendorIds: string[]
  attachments: Attachment[]
  autoSaveStatus: "idle" | "saving" | "saved"
}

interface RfqFormContextValue extends RfqFormState {
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateInfo: (patch: Partial<RfqInfo>) => void
  addLineItem: () => void
  updateLineItem: (id: string, patch: Partial<LineItem>) => void
  removeLineItem: (id: string) => void
  duplicateLineItem: (id: string) => void
  toggleVendor: (id: string) => void
  addAttachment: (file: Attachment) => void
  removeAttachment: (id: string) => void
  updateAttachment: (id: string, patch: Partial<Attachment>) => void
  estimatedTotal: number
  completedSteps: number[]
  triggerAutoSave: () => void
}

/* ─────────────────────────── Defaults ─────────────────────────── */

const defaultInfo: RfqInfo = {
  title: "",
  category: "",
  procurementType: "",
  department: "",
  priority: "medium",
  budget: "",
  currency: "INR",
  deliveryDate: "",
  submissionDeadline: "",
  description: "",
}

let itemCounter = 1
function createEmptyItem(): LineItem {
  return {
    id: `item-${Date.now()}-${itemCounter++}`,
    name: "",
    description: "",
    quantity: 1,
    unit: "pcs",
    estimatedPrice: 0,
    expectedDelivery: "",
  }
}

/* ─────────────────────────── Context ─────────────────────────── */

const RfqFormContext = createContext<RfqFormContextValue | null>(null)

export function RfqFormProvider({ children }: { children: ReactNode }) {
  const [step, setStepRaw] = useState(0)
  const [info, setInfo] = useState<RfqInfo>(defaultInfo)
  const [lineItems, setLineItems] = useState<LineItem[]>([createEmptyItem()])
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  /* Navigation */
  const setStep = useCallback((s: number) => setStepRaw(Math.max(0, Math.min(4, s))), [])
  const nextStep = useCallback(() => setStepRaw((s) => Math.min(4, s + 1)), [])
  const prevStep = useCallback(() => setStepRaw((s) => Math.max(0, s - 1)), [])

  /* Info */
  const updateInfo = useCallback(
    (patch: Partial<RfqInfo>) => setInfo((prev) => ({ ...prev, ...patch })),
    []
  )

  /* Line Items */
  const addLineItem = useCallback(() => {
    setLineItems((prev) => [...prev, createEmptyItem()])
  }, [])

  const updateLineItem = useCallback((id: string, patch: Partial<LineItem>) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }, [])

  const removeLineItem = useCallback((id: string) => {
    setLineItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      return filtered.length === 0 ? [createEmptyItem()] : filtered
    })
  }, [])

  const duplicateLineItem = useCallback((id: string) => {
    setLineItems((prev) => {
      const idx = prev.findIndex((item) => item.id === id)
      if (idx === -1) return prev
      const clone: LineItem = {
        ...prev[idx],
        id: `item-${Date.now()}-${itemCounter++}`,
        name: `${prev[idx].name} (copy)`,
      }
      const next = [...prev]
      next.splice(idx + 1, 0, clone)
      return next
    })
  }, [])

  /* Vendors */
  const toggleVendor = useCallback((id: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }, [])

  /* Attachments */
  const addAttachment = useCallback((file: Attachment) => {
    setAttachments((prev) => [...prev, file])
  }, [])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const updateAttachment = useCallback((id: string, patch: Partial<Attachment>) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    )
  }, [])

  /* Auto-save mock */
  const triggerAutoSave = useCallback(() => {
    setAutoSaveStatus("saving")
    setTimeout(() => setAutoSaveStatus("saved"), 800)
    setTimeout(() => setAutoSaveStatus("idle"), 2500)
  }, [])

  /* Computed */
  const estimatedTotal = useMemo(
    () =>
      lineItems.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.estimatedPrice || 0),
        0
      ),
    [lineItems]
  )

  const completedSteps = useMemo(() => {
    const done: number[] = []
    if (info.title && info.category && info.department) done.push(0)
    if (lineItems.length > 0 && lineItems[0].name) done.push(1)
    if (selectedVendorIds.length > 0) done.push(2)
    if (attachments.length > 0) done.push(3)
    return done
  }, [info, lineItems, selectedVendorIds, attachments])

  const value: RfqFormContextValue = {
    step,
    info,
    lineItems,
    selectedVendorIds,
    attachments,
    autoSaveStatus,
    setStep,
    nextStep,
    prevStep,
    updateInfo,
    addLineItem,
    updateLineItem,
    removeLineItem,
    duplicateLineItem,
    toggleVendor,
    addAttachment,
    removeAttachment,
    updateAttachment,
    estimatedTotal,
    completedSteps,
    triggerAutoSave,
  }

  return <RfqFormContext.Provider value={value}>{children}</RfqFormContext.Provider>
}

export function useRfqForm() {
  const ctx = useContext(RfqFormContext)
  if (!ctx) throw new Error("useRfqForm must be used within RfqFormProvider")
  return ctx
}
