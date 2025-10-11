import type { PropsWithChildren } from "react"

import { AppContent } from "@/components/app-content"
import { AppShell } from "@/components/app-shell"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import type { BreadcrumbItem, Document } from "@/types"

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  documents,
  currentDocumentId,
}: PropsWithChildren<{
  breadcrumbs?: BreadcrumbItem[]
  documents?: Document[]
  currentDocumentId?: number
}>) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar documents={documents} currentDocumentId={currentDocumentId} />
      <AppContent variant="sidebar" className="overflow-x-hidden">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        {children}
      </AppContent>
    </AppShell>
  )
}
