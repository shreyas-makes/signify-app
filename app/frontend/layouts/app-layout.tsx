import type { ReactNode } from "react"

import AppLayoutTemplate from "@/layouts/app/app-header-layout"

interface AppLayoutProps {
  children: ReactNode
  showHeader?: boolean
}

export default function AppLayout({ children, showHeader = true }: AppLayoutProps) {
  return <AppLayoutTemplate showHeader={showHeader}>{children}</AppLayoutTemplate>
}
