import { Sun } from "lucide-react"
import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export default function AppearanceIndicator({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-sm font-medium",
        className,
      )}
      {...props}
    >
      <Sun className="h-4 w-4 text-primary" />
      Light theme
    </div>
  )
}
