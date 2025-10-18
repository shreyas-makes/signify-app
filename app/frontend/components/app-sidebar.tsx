import { Link, router } from "@inertiajs/react"
import { BookOpen, Calendar, ChevronDown, ChevronRight, FileText, Folder, LayoutGrid, Plus } from "lucide-react"
import { useState } from "react"

import { NavFooter } from "@/components/nav-footer"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { dashboardPath, documentsPath, editDocumentPath, newDocumentPath } from "@/routes"
import type { Document, NavItem } from "@/types"

import AppLogo from "./app-logo"

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: dashboardPath(),
    icon: LayoutGrid,
  },
]

const footerNavItems: NavItem[] = [
  {
    title: "Repository",
    href: "https://github.com/inertia-rails/signify",
    icon: Folder,
  },
  {
    title: "Documentation",
    href: "https://inertia-rails.dev",
    icon: BookOpen,
  },
]

interface AppSidebarProps {
  documents?: Document[]
  currentDocumentId?: number
}

export function AppSidebar({ documents, currentDocumentId }: AppSidebarProps) {
  const [documentsExpanded, setDocumentsExpanded] = useState(true)
  const { state } = useSidebar()
  const isSidebarExpanded = state === "expanded"
  const documentsList = documents ?? []
  const hasDocuments = documentsList.length > 0
  const showDocumentsSection = isSidebarExpanded && hasDocuments
  
  const handleNewDocument = () => {
    router.post(newDocumentPath())
  }

  const handleDocumentClick = (document: Document) => {
    if (currentDocumentId !== document.id) {
      router.get(editDocumentPath({ id: document.id }))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'draft':
        return 'secondary'
      default:
        return 'outline'
    }
  }
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboardPath()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
        
        {/* Documents Section */}
        {showDocumentsSection && (
          <SidebarGroup>
            <Collapsible open={documentsExpanded} onOpenChange={setDocumentsExpanded}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="group/collapsible cursor-pointer">
                  <div className="flex items-center gap-2">
                    {documentsExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <Calendar className="h-4 w-4" />
                    <span>Recent Documents</span>
                  </div>
                  <span className="ml-auto text-xs">{documentsList.length}</span>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <SidebarGroupAction asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNewDocument}
                  className="h-5 w-5 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </SidebarGroupAction>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {documentsList.slice(0, 10).map((document) => (
                      <SidebarMenuItem key={document.id}>
                        <SidebarMenuButton
                          onClick={() => handleDocumentClick(document)}
                          isActive={document.id === currentDocumentId}
                          className="flex flex-col items-start gap-1 p-2 h-auto"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <FileText className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate text-sm font-medium">
                              {document.title || "Untitled Document"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 w-full pl-5">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(document.updated_at)}
                            </span>
                            <Badge 
                              variant={getStatusBadgeVariant(document.status)}
                              className="text-xs h-4 px-1"
                            >
                              {document.status}
                            </Badge>
                            {document.word_count > 0 && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                {document.word_count} words
                              </span>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  {documentsList.length > 10 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={documentsPath()}>
                          <FileText className="h-4 w-4" />
                          <span>View All Documents ({documentsList.length})</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
