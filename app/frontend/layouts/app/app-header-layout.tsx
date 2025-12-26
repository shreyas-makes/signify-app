import type { PropsWithChildren } from "react"

import { AppContent } from "@/components/app-content"
import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { AppShell } from "@/components/app-shell"

export default function AppHeaderLayout({
  children,
  showHeader = true,
  showFooter = true,
  contentClassName,
}: PropsWithChildren<{ showHeader?: boolean; showFooter?: boolean; contentClassName?: string }>) {
  return (
    <AppShell>
      {showHeader ? <AppHeader /> : null}
      <AppContent className={contentClassName}>{children}</AppContent>
      {showFooter ? <AppFooter /> : null}
    </AppShell>
  )
}
