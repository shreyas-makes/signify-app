import type { ReactNode } from "react"

import AppLayoutTemplate from "@/layouts/app/app-header-layout"

interface AppLayoutProps {
  children: ReactNode
  showHeader?: boolean
  contentClassName?: string
}

export default function AppLayout({
  children,
  showHeader = true,
  contentClassName,
}: AppLayoutProps) {
  return (
    <AppLayoutTemplate showHeader={showHeader} contentClassName={contentClassName}>
      {children}
    </AppLayoutTemplate>
  )
}
