import type { ReactNode } from "react"

import AppLayoutTemplate from "@/layouts/app/app-header-layout"

interface AppLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  contentClassName?: string
}

export default function AppLayout({
  children,
  showHeader = true,
  showFooter = true,
  contentClassName,
}: AppLayoutProps) {
  return (
    <AppLayoutTemplate
      showHeader={showHeader}
      showFooter={showFooter}
      contentClassName={contentClassName}
    >
      {children}
    </AppLayoutTemplate>
  )
}
