import { Head, useForm } from "@inertiajs/react"
import { ArrowLeft, Save } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import { documentsPath, documentPath } from "@/routes"
import type { BreadcrumbItem, Document } from "@/types"

interface DocumentsEditProps {
  document: Document
}

const breadcrumbs = (document: Document): BreadcrumbItem[] => [
  {
    title: "Documents",
    href: documentsPath(),
  },
  {
    title: document.title,
    href: "#",
  },
]

export default function DocumentsEdit({ document }: DocumentsEditProps) {
  const { data, setData, patch, processing, errors } = useForm({
    title: document.title,
    content: document.content,
  })
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [wordCount, setWordCount] = useState(document.word_count)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save functionality
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (data.title !== document.title || data.content !== document.content) {
      setSaveStatus('unsaved')
      
      // Auto-save after 2 seconds of no changes
      saveTimeoutRef.current = setTimeout(() => {
        handleSave()
      }, 2000)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [data.title, data.content])

  // Update word count when content changes
  useEffect(() => {
    const words = data.content.trim() ? data.content.trim().split(/\s+/).length : 0
    setWordCount(words)
  }, [data.content])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [data.content])

  const handleSave = () => {
    setSaveStatus('saving')
    patch(documentPath({ id: document.id }), {
      onSuccess: () => {
        setSaveStatus('saved')
      },
      onError: () => {
        setSaveStatus('unsaved')
      }
    })
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return 'Saved'
      case 'unsaved':
        return 'Unsaved changes'
    }
  }

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'secondary'
      case 'saved':
        return 'default'
      case 'unsaved':
        return 'destructive'
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs(document)}>
      <Head title={`Edit: ${document.title}`} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <a href={documentsPath()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </a>
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {wordCount} words
            </div>
            <Badge variant={getSaveStatusColor()}>
              {getSaveStatusText()}
            </Badge>
            <Button
              onClick={handleSave}
              disabled={processing || saveStatus === 'saved'}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Document title"
                  className="text-xl font-semibold"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                ref={textareaRef}
                id="content"
                name="content"
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                placeholder="Start writing your document..."
                className="w-full min-h-[400px] p-4 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                style={{ overflow: 'hidden' }}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}