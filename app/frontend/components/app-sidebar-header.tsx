import { Breadcrumbs } from "@/components/breadcrumbs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { BreadcrumbItem } from "@/types"

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

export function AppSidebarHeader({ breadcrumbs = [] }: AppSidebarHeaderProps) {
  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="hidden flex-1 items-center justify-end md:flex">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </header>
  )
}
