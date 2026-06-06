"use client"

import { useRouter } from "next/navigation"
import { RfqFormProvider, useRfqForm } from "@/components/rfq/rfq-form-context"
import { RfqStepper } from "@/components/rfq/rfq-stepper"
import { RfqInsightsPanel } from "@/components/rfq/rfq-insights-panel"
import { Step1Info } from "@/components/rfq/steps/step-1-info"
import { Step2Items } from "@/components/rfq/steps/step-2-items"
import { Step3Vendors } from "@/components/rfq/steps/step-3-vendors"
import { Step4Attachments } from "@/components/rfq/steps/step-4-attachments"
import { Step5Review } from "@/components/rfq/steps/step-5-review"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Send,
  CheckCircle2,
  Loader2,
  CloudOff,
  Cloud,
} from "lucide-react"
import { useState } from "react"

function AutoSaveIndicator() {
  const { autoSaveStatus } = useRfqForm()

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {autoSaveStatus === "saving" && (
        <>
          <Loader2 className="size-3 animate-spin" />
          <span>Saving…</span>
        </>
      )}
      {autoSaveStatus === "saved" && (
        <>
          <Cloud className="size-3 text-emerald-500" />
          <span className="text-emerald-600">Saved</span>
        </>
      )}
      {autoSaveStatus === "idle" && (
        <>
          <CloudOff className="size-3" />
          <span>Draft</span>
        </>
      )}
    </div>
  )
}

const STEP_COMPONENTS = [Step1Info, Step2Items, Step3Vendors, Step4Attachments, Step5Review]

function CreateRfqContent() {
  const router = useRouter()
  const { step, nextStep, prevStep, setStep } = useRfqForm()
  const [submitting, setSubmitting] = useState(false)

  const CurrentStep = STEP_COMPONENTS[step]

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      router.push("/rfqs")
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Create RFQ</h1>
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
              Draft
            </Badge>
            <AutoSaveIndicator />
          </div>
          <p className="text-sm text-muted-foreground">
            Create and send quotation requests to selected vendors.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Save data-icon="inline-start" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            <Eye data-icon="inline-start" />
            Preview
          </Button>
          {step === 4 ? (
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                  Sending…
                </>
              ) : (
                <>
                  <Send data-icon="inline-start" />
                  Send RFQ
                </>
              )}
            </Button>
          ) : (
            <Button size="sm" onClick={nextStep}>
              <Send data-icon="inline-start" />
              Send RFQ
            </Button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
        <RfqStepper />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
        {/* Form panel */}
        <div className="min-w-0">
          <div className="rounded-xl border border-border bg-card p-5 md:p-6">
            <CurrentStep />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={step === 0}
              className={step === 0 ? "invisible" : ""}
            >
              <ArrowLeft data-icon="inline-start" />
              Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStep(i)}
                  className={`size-2 rounded-full transition-all ${
                    i === step
                      ? "bg-primary w-5"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {step < 4 ? (
              <Button size="sm" onClick={nextStep}>
                Next
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 data-icon="inline-start" />
                    Submit RFQ
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Insights sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <RfqInsightsPanel />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function CreateRfqPage() {
  return (
    <RfqFormProvider>
      <CreateRfqContent />
    </RfqFormProvider>
  )
}
