import type { PropsWithChildren } from "react"

import { AppContent } from "@/components/app-content"
import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { AppShell } from "@/components/app-shell"

export default function AppHeaderLayout({
  children,
  showHeader = true,
}: PropsWithChildren<{ showHeader?: boolean }>) {
  return (
    <AppShell>
      {showHeader ? <AppHeader /> : null}
      <AppContent>{children}</AppContent>
      <AppFooter />
    </AppShell>
  )
}
