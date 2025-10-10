import { Head, Link, router } from "@inertiajs/react"
import { Calendar, Edit, ExternalLink, Eye, FileText, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import { documentPath, documentsPath, editDocumentPath, newDocumentPath } from "@/routes"
import type { BreadcrumbItem, Document } from "@/types"

interface DocumentsIndexProps {
  documents: Document[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Documents",
    href: documentsPath(),
  },
]

export default function DocumentsIndex({ documents }: DocumentsIndexProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'default' : 'secondary'
  }

  const getPublicUrl = (document: Document) => {
    return document.public_slug ? `/posts/${document.public_slug}` : null
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Documents" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Your Documents</h1>
              <p className="text-lg text-muted-foreground">
                Simple document listing
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href={newDocumentPath()}>
                <Plus className="mr-2 h-4 w-4" />
                New Document
              </Link>
            </Button>
          </div>

          {/* Documents Content */}
          {documents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No documents yet</h3>
                <p className="mt-2 text-muted-foreground text-center max-w-sm">
                  Start writing your first verified document to get started with keystroke-verified authorship.
                </p>
                <Button asChild className="mt-6" size="lg">
                  <Link href={newDocumentPath()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first document
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Card key={document.id} className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {document.title || "Untitled Document"}
                      </CardTitle>
                      <Badge 
                        variant={getStatusColor(document.status)}
                        className="shrink-0 capitalize"
                      >
                        {document.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {document.content && (
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                          {document.content}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>{document.word_count} words</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(document.updated_at)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:gap-3 pt-2 justify-end">
                        {document.status === 'published' && getPublicUrl(document) && (
                          <Button variant="outline" size="sm" asChild className="touch-manipulation min-h-[44px] min-w-[44px]">
                            <a 
                              href={getPublicUrl(document)!} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="View published post"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild className="touch-manipulation min-h-[44px] min-w-[44px]">
                          <Link href={editDocumentPath({ id: document.id })} aria-label="Edit document">
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        {document.status === 'draft' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            aria-label="Delete document"
                            className="touch-manipulation min-h-[44px] min-w-[44px]"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                                router.delete(documentPath({ id: document.id }))
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}