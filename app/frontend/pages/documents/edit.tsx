import { Head, router, useForm } from "@inertiajs/react"
import { ArrowLeft, ChevronDown, ChevronRight, Eye, Loader2, Play, RefreshCw, Save, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { KeystrokeReplay } from "@/components/ui/keystroke-replay"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useKeystrokeCapture } from "@/hooks/useKeystrokeCapture"
import { usePastePrevention } from "@/hooks/usePastePrevention"
import AppLayout from "@/layouts/app-layout"
import { documentPath, documentsPath } from "@/routes"
import type { BreadcrumbItem, Document } from "@/types"

interface KeystrokeEvent {
  id: number
  event_type: 'keydown' | 'keyup'
  key_code: number
  character: string | null
  timestamp: string
  sequence_number: number
  document_position?: number
}

interface DocumentsEditProps {
  document: Document
  keystrokes?: KeystrokeEvent[]
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

export default function DocumentsEdit({ document, keystrokes = [] }: DocumentsEditProps) {
  const { data, setData, errors } = useForm({
    document: {
      title: document.title,
      content: document.content,
    },
  })
  
  const [wordCount, setWordCount] = useState<number>(document.word_count || 0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showKeystrokeReplay, setShowKeystrokeReplay] = useState(false)
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
          toast.error(`Failed to save: ${response.statusText}`)
          return false
        }
      } catch (error) {
        console.error('Save error:', error)
        toast.error('Network error: Unable to save document')
        return false
      }
    },
    onError: (error, attempt) => {
      console.error(`Save attempt ${attempt} failed:`, error)
      if (attempt === 3) {
        toast.error('Save failed after 3 attempts. Please try again.')
      }
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
    setIsSaving(true)
    try {
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
      
      toast.success('Document saved successfully')
    } catch (error) {
      console.error('Manual save error:', error)
      toast.error('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  const canPublish = () => {
    const hasTitle = data.document.title.trim().length > 0
    const hasContent = data.document.content.trim().length > 0
    const hasKeystrokes = keystrokeCount > 0
    const isNotPublished = document.status !== 'published'
    
    return hasTitle && hasContent && hasKeystrokes && isNotPublished
  }

  const handlePublish = async () => {
    if (!canPublish() || isPublishing) return
    
    setIsPublishing(true)
    try {
      // Save first, then publish
      toast.loading('Saving document before publishing...')
      await handleManualSave()
      
      toast.loading('Publishing document...')
      router.post(`/documents/${document.id}/publish`, {}, {
        onSuccess: () => {
          toast.success('Document published successfully!')
          // Will be redirected by the controller
        },
        onError: (errors) => {
          console.error('Publishing failed:', errors)
          toast.error('Failed to publish document. Please try again.')
          setIsPublishing(false)
        },
        onFinish: () => {
          setIsPublishing(false)
        }
      })
    } catch (error) {
      console.error('Publish error:', error)
      toast.error('Failed to publish document')
      setIsPublishing(false)
    }
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b bg-background gap-4">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <a href={documentsPath()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Documents</span>
              <span className="sm:hidden">Back</span>
            </a>
          </Button>

          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              <span className="inline-block">{wordCount} words</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">{keystrokeCount} keystrokes</span>
              {pasteAttemptCount > 0 && (
                <span className="text-amber-600 font-medium block sm:inline">
                  <span className="hidden sm:inline"> • </span>
                  {pasteAttemptCount} paste attempt{pasteAttemptCount !== 1 ? 's' : ''} blocked
                </span>
              )}
            </div>
            
            {/* Actions Row */}
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
              <Badge variant={autoSave.getSaveStatusColor()} className="text-xs">
                {autoSave.getSaveStatusText()}
              </Badge>
              {autoSave.saveStatus === 'error' && (
                <Button
                  onClick={() => void autoSave.retry()}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
              <Button
                onClick={() => void handleManualSave()}
                disabled={isSaving || autoSave.saveStatus === 'saving' || (autoSave.saveStatus === 'saved' && !autoSave.hasUnsavedChanges)}
                size="sm"
                variant="outline"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
              
              {document.status === 'published' ? (
                <Button size="sm" disabled variant="default">
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Published</span>
                </Button>
              ) : (
                <Button
                  onClick={() => void handlePublish()}
                  disabled={!canPublish() || autoSave.saveStatus === 'saving' || isPublishing}
                  size="sm"
                  variant={canPublish() ? "default" : "outline"}
                >
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">{isPublishing ? 'Publishing...' : getPublishButtonText()}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8">
            {/* Title */}
            <div className="mb-6 sm:mb-8">
              <Input
                ref={titleInputRef}
                id="title"
                name="title"
                type="text"
                value={data.document.title}
                onChange={(e) => setData('document.title', e.target.value)}
                placeholder="Untitled Document"
                className="text-2xl sm:text-4xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 touch-manipulation"
              />
              {errors['document.title'] && (
                <p className="text-sm text-destructive mt-2">{errors['document.title']}</p>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 border border-input rounded-lg overflow-hidden bg-background shadow-sm min-h-0">
              <RichTextEditor
                ref={editorRef}
                value={data.document.content}
                onChange={handleContentChange}
                placeholder="Start writing your document..."
                className="h-full min-h-[300px] sm:min-h-[calc(100vh-300px)] touch-manipulation"
              />
              {errors['document.content'] && (
                <p className="text-sm text-destructive mt-2 px-4 sm:px-6">{errors['document.content']}</p>
              )}
            </div>

            {/* Keystroke Replay Section */}
            {keystrokes.length > 0 && (
              <div className="mt-8 border-t pt-8">
                <Collapsible open={showKeystrokeReplay} onOpenChange={setShowKeystrokeReplay}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-left p-0 h-auto">
                      {showKeystrokeReplay ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Play className="h-4 w-4" />
                      <span className="font-medium">Keystroke Replay</span>
                      <span className="text-sm text-muted-foreground">
                        ({keystrokes.length} keystrokes recorded)
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <KeystrokeReplay
                      keystrokes={keystrokes}
                      title={data.document.title || "Untitled Document"}
                      finalContent={data.document.content}
                      className="max-w-none"
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}