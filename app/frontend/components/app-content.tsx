import type * as React from "react"

import { cn } from "@/lib/utils"

type AppContentProps = React.ComponentProps<"main">

export function AppContent({ children, className, ...props }: AppContentProps) {
  return (
    <main
      className={cn(
        "mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}
