import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Tone = "success" | "warning" | "danger" | "info" | "neutral"

const toneStyles: Record<Tone, string> = {
  success: "border-transparent bg-success/15 text-success",
  warning: "border-transparent bg-warning/20 text-warning-foreground dark:text-warning",
  danger: "border-transparent bg-destructive/15 text-destructive",
  info: "border-transparent bg-primary/15 text-primary",
  neutral: "border-transparent bg-muted text-muted-foreground",
}

const statusToneMap: Record<string, Tone> = {
  active: "success",
  approved: "success",
  paid: "success",
  closed: "neutral",
  shortlisted: "success",
  open: "info",
  sent: "info",
  submitted: "info",
  pending: "warning",
  draft: "neutral",
  inactive: "neutral",
  overdue: "danger",
  rejected: "danger",
  high: "danger",
  medium: "warning",
  low: "neutral",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusToneMap[status.toLowerCase()] ?? "neutral"
  return (
    <Badge variant="outline" className={cn("capitalize font-medium", toneStyles[tone], className)}>
      {status}
    </Badge>
  )
}
