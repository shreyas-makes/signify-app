import type { PropsWithChildren } from "react"

import { AppContent } from "@/components/app-content"
import { AppShell } from "@/components/app-shell"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import type { Document } from "@/types"

export default function AppSidebarLayout({
  children,
  documents,
  currentDocumentId,
}: PropsWithChildren<{
  documents?: Document[]
  currentDocumentId?: number
}>) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar documents={documents} currentDocumentId={currentDocumentId} />
      <AppContent variant="sidebar" className="overflow-x-hidden">
        <AppSidebarHeader />
        {children}
      </AppContent>
    </AppShell>
  )
}
