"use client"

import { cn } from "@/lib/utils"
import { useRfqForm } from "./rfq-form-context"
import {
  ClipboardList,
  Package,
  Users,
  Paperclip,
  Send,
  Check,
} from "lucide-react"

const steps = [
  { label: "RFQ Information", icon: ClipboardList },
  { label: "Line Items", icon: Package },
  { label: "Vendor Selection", icon: Users },
  { label: "Attachments", icon: Paperclip },
  { label: "Review & Submit", icon: Send },
]

export function RfqStepper() {
  const { step, setStep, completedSteps } = useRfqForm()

  return (
    <nav aria-label="RFQ creation steps" className="w-full">
      <ol className="flex items-start gap-0">
        {steps.map((s, i) => {
          const isCurrent = i === step
          const isCompleted = completedSteps.includes(i) && i !== step
          const isPast = i < step
          const Icon = s.icon

          return (
            <li key={s.label} className="flex flex-1 items-center">
              {/* Step node */}
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "group relative flex w-full flex-col items-center gap-2 outline-none transition-all",
                  "focus-visible:outline-none"
                )}
              >
                {/* Connector line (before) */}
                {i > 0 && (
                  <div
                    className={cn(
                      "absolute top-[18px] right-1/2 h-[2px] w-full -translate-x-0",
                      isPast || isCompleted
                        ? "bg-primary"
                        : "bg-border"
                    )}
                    aria-hidden
                  />
                )}

                {/* Circle */}
                <div
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-full border-2 transition-all",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px] shadow-primary/15",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    !isCurrent && !isCompleted &&
                      "border-border bg-card text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium transition-colors text-center whitespace-normal max-w-[65px] sm:max-w-none",
                    isCurrent && "text-primary",
                    isCompleted && "text-foreground",
                    !isCurrent && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
