import { SidebarTrigger } from "@/components/ui/sidebar"
export function AppSidebarHeader() {
  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-start gap-3 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:hidden">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  )
}
