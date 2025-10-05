import { Head, Link, router } from "@inertiajs/react"
import { Plus, FileText, Calendar, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import { documentsPath, newDocumentPath, editDocumentPath, documentPath } from "@/routes"
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Documents" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Your Documents</h1>
            <p className="text-muted-foreground">
              Create and manage your verified writings
            </p>
          </div>
          <Button asChild>
            <Link href={newDocumentPath()}>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Link>
          </Button>
        </div>

        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Start writing your first verified document to get started.
              </p>
              <Button asChild>
                <Link href={newDocumentPath()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first document
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {document.title}
                    </CardTitle>
                    <Badge variant={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {document.content && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {document.content}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {document.word_count} words
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(document.updated_at)}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={editDocumentPath({ id: document.id })}>
                          Edit
                        </Link>
                      </Button>
                      {document.status === 'draft' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                              router.delete(documentPath({ id: document.id }))
                            }
                          }}
                        >
                          Delete
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
    </AppLayout>
  )
}