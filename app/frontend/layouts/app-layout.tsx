import type { ReactNode } from "react"

import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout"
import type { Document } from "@/types"

interface AppLayoutProps {
  children: ReactNode
  documents?: Document[]
  currentDocumentId?: number
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
