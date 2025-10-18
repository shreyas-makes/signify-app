import type { ReactNode } from "react"

import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout"
import type { BreadcrumbItem, Document } from "@/types"

interface AppLayoutProps {
  children: ReactNode
  documents?: Document[]
  currentDocumentId?: number
  breadcrumbs?: BreadcrumbItem[]
}

export default function AppLayout({
  children,
  ...props
}: AppLayoutProps) {
  return (
    <AppLayoutTemplate {...props}>
      {children}
    </AppLayoutTemplate>
  )
}
