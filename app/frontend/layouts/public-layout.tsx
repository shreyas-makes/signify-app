import type { PropsWithChildren } from "react"

import { PublicFooter } from "@/components/public-footer"
import { PublicHeader } from "@/components/public-header"
import { cn } from "@/lib/utils"

interface PublicLayoutProps {
  className?: string
  footerVariant?: "default" | "gradient"
}

export default function PublicLayout({
  children,
  className,
  footerVariant = "default",
}: PropsWithChildren<PublicLayoutProps>) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <PublicHeader />
      {children}
      <PublicFooter variant={footerVariant} />
    </div>
  )
}
