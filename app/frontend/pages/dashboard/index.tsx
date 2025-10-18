import { Head, Link, router } from "@inertiajs/react"
import {
  ArrowUpDown, 
  ChevronLeft,
  ChevronRight,
  Clock, 
  Edit, 
  Eye, 
  FileText,
  Keyboard,
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import { dashboardBulkActionPath, dashboardPath, documentPath, editDocumentPath, newDocumentPath } from "@/routes"
import type { 
  Document, 
  DocumentFilters, 
  DocumentPagination, 
  DocumentStatistics 
} from "@/types"

interface DashboardProps {
  documents: Document[]
  pagination: DocumentPagination
  filters: DocumentFilters
  statistics: DocumentStatistics
}

export default function Dashboard({ 
  documents, 
  pagination, 
  filters, 
  statistics 
}: DashboardProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'ready_to_publish': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusBadgeText = (status: string) => {
    return status.replace('_', ' ')
  }

  const handleSearch = (search: string) => {
    router.get(dashboardPath(), { ...filters, search, page: 1 }, { preserveState: true })
  }

  const handleFilter = (key: string, value: string) => {
    router.get(dashboardPath(), { ...filters, [key]: value, page: 1 }, { preserveState: true })
  }

  const handleSort = (column: string) => {
    const direction = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc'
    router.get(dashboardPath(), { ...filters, sort: column, direction }, { preserveState: true })
  }

  const handlePageChange = (page: number) => {
    router.get(dashboardPath(), { ...filters, page }, { preserveState: true })
  }

  const toggleDocumentSelection = (documentId: number) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedDocuments(prev => 
      prev.length === documents.length ? [] : documents.map(doc => doc.id)
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedDocuments.length === 0) {
      toast.error("Please select documents first")
      return
    }

    setIsPerformingBulkAction(true)
    
    try {
      const response = await fetch(dashboardBulkActionPath(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
        },
        body: JSON.stringify({
          document_ids: selectedDocuments,
          bulk_action: action
        })
      })

      const result = await response.json() as { success: boolean; message: string }
      
      if (result.success) {
        toast.success(result.message)
        setSelectedDocuments([])
        router.reload()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("An error occurred while performing the action")
    } finally {
      setIsPerformingBulkAction(false)
    }
  }

  const formatReadingTime = (minutes: number) => {
    return minutes === 1 ? '1 min' : `${minutes} mins`
  }

  return (
    <AppLayout>
      <Head title="Dashboard" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="mt-4 space-y-1">
              <p className="text-lg text-muted-foreground">
                Create and manage your verified writings
              </p>
            </div>
            <Button asChild size="lg" className="mt-4 shrink-0">
              <Link href={newDocumentPath()}>
                <Plus className="mr-2 h-4 w-4" />
                New Document
              </Link>
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-8 sm:p-10 space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Total Documents</span>
                </div>
                <p className="text-2xl font-bold">{statistics.total_documents}</p>
                <p className="text-xs text-muted-foreground">
                  {statistics.draft_count} drafts, {statistics.published_count} published
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8 sm:p-10 space-y-3">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Total Words</span>
                </div>
                <p className="text-2xl font-bold">{statistics.total_words.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  ~{formatReadingTime(statistics.avg_reading_time)} avg reading time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8 sm:p-10 space-y-3">
                <div className="flex items-center space-x-2">
                  <Keyboard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Keystrokes</span>
                </div>
                <p className="text-2xl font-bold">{statistics.total_keystrokes.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  Verified authenticity
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8 sm:p-10 space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Ready to Publish</span>
                </div>
                <p className="text-2xl font-bold">{statistics.ready_to_publish_count}</p>
                <p className="text-xs text-muted-foreground">
                  Documents ready for publication
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <div className="flex w-full flex-col gap-5 rounded-[32px] border border-[#eadfce] bg-[#fdfaf2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80 lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => handleFilter('status', value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ready_to_publish">Ready to Publish</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-3">
              {selectedDocuments.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isPerformingBulkAction}>
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Bulk Actions ({selectedDocuments.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => void handleBulkAction('mark_ready')}>
                      Mark as Ready to Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void handleBulkAction('mark_draft')}>
                      Mark as Draft
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => void handleBulkAction('delete')}
                      className="text-destructive"
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Documents Content */}
          {documents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  {filters.search || filters.status !== 'all' ? 'No documents found' : 'No documents yet'}
                </h3>
                <p className="mt-2 text-muted-foreground text-center max-w-sm">
                  {filters.search || filters.status !== 'all' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Start writing your first verified document to get started with keystroke-verified authorship.'
                  }
                </p>
                {(!filters.search && filters.status === 'all') && (
                  <Button asChild className="mt-6" size="lg">
                    <Link href={newDocumentPath()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create your first document
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[36px] border border-[#eadfce] bg-[#fdfaf2] shadow-[0_26px_60px_-34px_rgba(50,40,20,0.35)]">
              <CardContent className="p-0 overflow-hidden">
                <div className="px-6 py-5 sm:px-10 sm:py-8">
                  <Table className="w-full text-sm [&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4 [&_th:first-child]:pl-0 [&_td:first-child]:pl-0 [&_th:last-child]:pr-0 [&_td:last-child]:pr-0">
                  <TableHeader>
                    <TableRow className="border-b border-[#eadfce] bg-[#f8f4eb]">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedDocuments.length === documents.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('title')}
                          className="h-auto p-0 font-medium"
                        >
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('status')}
                          className="h-auto p-0 font-medium"
                        >
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('word_count')}
                          className="h-auto p-0 font-medium"
                        >
                          Words
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Keystrokes</TableHead>
                      <TableHead>Reading Time</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('updated_at')}
                          className="h-auto p-0 font-medium"
                        >
                          Updated
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.id} className="border-b border-[#eadfce]/70 last:border-0 hover:bg-[#f7f1e6]">
                        <TableCell>
                          <Checkbox
                            checked={selectedDocuments.includes(document.id)}
                            onCheckedChange={() => toggleDocumentSelection(document.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link 
                            href={editDocumentPath({ id: document.id })}
                            className="hover:text-primary transition-colors"
                          >
                            {document.title || "Untitled Document"}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(document.status)} className="capitalize">
                            {getStatusBadgeText(document.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{document.word_count}</TableCell>
                        <TableCell>{document.keystroke_count}</TableCell>
                        <TableCell>{formatReadingTime(document.reading_time_minutes)}</TableCell>
                        <TableCell>{formatDate(document.updated_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={editDocumentPath({ id: document.id })} aria-label="Edit document">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            {document.status === 'draft' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                aria-label="Delete document"
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total_documents)} of{' '}
                {pagination.total_documents} documents
              </p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.total_pages ||
                    Math.abs(page - pagination.current_page) <= 2
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === pagination.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    </div>
                  ))
                }
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
