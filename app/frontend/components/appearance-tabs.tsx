import { NotebookPen } from "lucide-react"
import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export default function AppearanceSettings({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card text-muted-foreground flex flex-col gap-3 rounded-3xl border px-6 py-5 shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <NotebookPen className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">Light mode only</p>
          <p className="text-xs text-muted-foreground">
            The interface stays bright to mirror iA Writer&apos;s focus on clean,
            distraction-free reading and writing.
          </p>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        Typography, spacing, and elevation now lean on a softer palette, generous
        rounding, and Spectral plus Source Sans Pro to keep content front and center without
        a theme switcher.
      </p>
    </div>
  )
}
