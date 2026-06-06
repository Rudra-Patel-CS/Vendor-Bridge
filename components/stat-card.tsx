import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  hint,
  accent = "primary",
}: {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  hint?: string
  accent?: "primary" | "success" | "warning" | "danger"
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground dark:text-warning",
    danger: "bg-destructive/10 text-destructive",
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className={cn("flex size-9 items-center justify-center rounded-lg", accentMap[accent])}>
            <Icon className="size-4.5" />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          <div className="flex items-center gap-2">
            {trend ? (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  trendUp ? "text-success" : "text-destructive",
                )}
              >
                {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {trend}
              </span>
            ) : null}
            {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
