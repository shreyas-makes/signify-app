import type { PropsWithChildren } from "react"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { AppShell } from "@/components/app-shell"

export default function AppHeaderLayout({
  children,
}: PropsWithChildren<{}>) {
  return (
    <AppShell>
      <AppHeader />
      <AppContent>{children}</AppContent>
    </AppShell>
  )
}
