import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function RatingStars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star className="size-3.5 fill-warning text-warning" />
      <span className="text-sm font-medium tabular-nums">{value.toFixed(1)}</span>
    </span>
  )
}
