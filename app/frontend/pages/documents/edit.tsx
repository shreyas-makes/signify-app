import { Head, useForm } from "@inertiajs/react"
import { ArrowLeft, Save } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
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
  const { data, setData, errors } = useForm({
    document: {
      title: document.title,
      content: document.content,
    },
  })
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [wordCount, setWordCount] = useState<number>(document.word_count || 0)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const editorRef = useRef<RichTextEditorRef>(null)

  // Auto-save functionality
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (data.document.title !== document.title || data.document.content !== document.content) {
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
  }, [data.document.title, data.document.content])

  // Update word count when content changes
  useEffect(() => {
    // Remove HTML tags and count words
    const textContent = data.document.content.replace(/<[^>]*>/g, '').trim()
    const words = textContent ? textContent.split(/\s+/).length : 0
    setWordCount(words)
  }, [data.document.content])

  const handleContentChange = (content: string) => {
    setData('document.content', content)
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    
    try {
      const response = await fetch(documentPath({ id: document.id }), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': window.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          document: {
            title: data.document.title,
            content: data.document.content
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setSaveStatus('saved')
        console.log('Document saved successfully:', result)
      } else {
        console.error('Save failed:', response.status, response.statusText)
        setSaveStatus('unsaved')
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('unsaved')
    }
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

      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
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
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
            {/* Title */}
            <div className="mb-8">
              <Input
                id="title"
                name="title"
                type="text"
                value={data.document.title}
                onChange={(e) => setData('document.title', e.target.value)}
                placeholder="Untitled Document"
                className="text-4xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
              {errors['document.title'] && (
                <p className="text-sm text-destructive mt-2">{errors['document.title']}</p>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 border border-input rounded-lg overflow-hidden bg-background shadow-sm">
              <RichTextEditor
                ref={editorRef}
                value={data.document.content}
                onChange={handleContentChange}
                placeholder="Start writing your document..."
                className="h-full min-h-[calc(100vh-300px)]"
              />
              {errors['document.content'] && (
                <p className="text-sm text-destructive mt-2 px-6">{errors['document.content']}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}