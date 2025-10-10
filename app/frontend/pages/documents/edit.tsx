import { Head, router, useForm } from "@inertiajs/react"
import { ArrowLeft, Eye, RefreshCw, Save, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useKeystrokeCapture } from "@/hooks/useKeystrokeCapture"
import { usePastePrevention } from "@/hooks/usePastePrevention"
import AppLayout from "@/layouts/app-layout"
import { documentPath, documentsPath } from "@/routes"
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
  
  const [wordCount, setWordCount] = useState<number>(document.word_count || 0)
  const editorRef = useRef<RichTextEditorRef>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  
  // Keystroke capture
  const { attachToElement, getKeystrokesForTransmission, keystrokeCount } = useKeystrokeCapture({
    enabled: true
  })

  // Paste prevention
  const { 
    attachToElement: attachPastePrevention, 
    getPasteAttempts, 
    pasteAttemptCount 
  } = usePastePrevention({
    enabled: true,
    detectRapidInput: true,
    rapidInputThreshold: 200
  })

  // Auto-save functionality
  const autoSave = useAutoSave({
    saveInterval: 2000, // 2 seconds
    typingIndicatorDelay: 1000, // 1 second
    retryAttempts: 3,
    retryDelay: 2000, // 2 seconds
    onSave: async (saveData) => {
      try {
        const response = await fetch(documentPath({ id: document.id }), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': window.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(saveData)
        })
        
        if (response.ok) {
          const result = await response.json() as unknown
          console.log('Document saved successfully:', result)
          if (saveData.keystrokes && Array.isArray(saveData.keystrokes)) {
            console.log(`Transmitted ${saveData.keystrokes.length} keystrokes`)
          }
          if (saveData.paste_attempts && Array.isArray(saveData.paste_attempts)) {
            console.log(`Transmitted ${saveData.paste_attempts.length} paste attempts`)
          }
          return true
        } else {
          console.error('Save failed:', response.status, response.statusText)
          return false
        }
      } catch (error) {
        console.error('Save error:', error)
        return false
      }
    },
    onError: (error, attempt) => {
      console.error(`Save attempt ${attempt} failed:`, error)
    }
  })

  // Attach keystroke capture and paste prevention to editor
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current) {
        const editorElement = editorRef.current.getElement()
        if (editorElement) {
          console.log('Attaching keystroke capture and paste prevention to editor element')
          attachToElement(editorElement)
          attachPastePrevention(editorElement)
        } else {
          console.warn('Editor element not found when trying to attach keystroke capture and paste prevention')
        }
      }
    }, 100) // Small delay to ensure editor is mounted

    return () => clearTimeout(timer)
  }, [attachToElement, attachPastePrevention])

  // Attach paste prevention to title input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleInputRef.current) {
        console.log('Attaching paste prevention to title input')
        attachPastePrevention(titleInputRef.current)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [attachPastePrevention])

  // Update auto-save when data changes
  useEffect(() => {
    autoSave.updateData({
      document: {
        title: data.document.title,
        content: data.document.content
      },
      keystrokes: getKeystrokesForTransmission(),
      paste_attempts: getPasteAttempts()
    })
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

  const handleManualSave = async () => {
    const keystrokeData = getKeystrokesForTransmission()
    const pasteAttemptData = getPasteAttempts()
    
    await autoSave.save({
      document: {
        title: data.document.title,
        content: data.document.content
      },
      keystrokes: keystrokeData,
      paste_attempts: pasteAttemptData
    })
  }

  const canPublish = () => {
    const hasTitle = data.document.title.trim().length > 0
    const hasContent = data.document.content.trim().length > 0
    const hasKeystrokes = keystrokeCount > 0
    const isNotPublished = document.status !== 'published'
    
    return hasTitle && hasContent && hasKeystrokes && isNotPublished
  }

  const handlePublish = () => {
    if (!canPublish()) return
    
    // Save first, then publish
    void handleManualSave().then(() => {
      router.post(`/documents/${document.id}/publish`, {}, {
        onSuccess: () => {
          // Will be redirected by the controller
        },
        onError: (errors) => {
          console.error('Publishing failed:', errors)
        }
      })
    })
  }

  const getPublishButtonText = () => {
    if (document.status === 'published') return 'Published'
    if (!data.document.title.trim()) return 'Add title to publish'
    if (!data.document.content.trim()) return 'Add content to publish'
    if (keystrokeCount === 0) return 'No keystrokes recorded'
    return 'Publish'
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
              {wordCount} words • {keystrokeCount} keystrokes
              {pasteAttemptCount > 0 && (
                <span className="text-amber-600 font-medium">
                  • {pasteAttemptCount} paste attempt{pasteAttemptCount !== 1 ? 's' : ''} blocked
                </span>
              )}
            </div>
            <Badge variant={autoSave.getSaveStatusColor()}>
              {autoSave.getSaveStatusText()}
            </Badge>
            {autoSave.saveStatus === 'error' && (
              <Button
                onClick={() => void autoSave.retry()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            <Button
              onClick={() => void handleManualSave()}
              disabled={autoSave.saveStatus === 'saving' || (autoSave.saveStatus === 'saved' && !autoSave.hasUnsavedChanges)}
              size="sm"
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            {document.status === 'published' ? (
              <Button size="sm" disabled variant="default">
                <Eye className="h-4 w-4 mr-2" />
                Published
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!canPublish() || autoSave.saveStatus === 'saving'}
                size="sm"
                variant={canPublish() ? "default" : "outline"}
              >
                <Send className="h-4 w-4 mr-2" />
                {getPublishButtonText()}
              </Button>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
            {/* Title */}
            <div className="mb-8">
              <Input
                ref={titleInputRef}
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