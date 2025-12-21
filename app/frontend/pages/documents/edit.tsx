import { Head, router, useForm } from "@inertiajs/react"
import type { Editor } from "@tiptap/react"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Play,
  Sparkles,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { EditorToolbar } from "@/components/editor-toolbar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { KeystrokeReplay } from "@/components/ui/keystroke-replay"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useKeystrokeCapture } from "@/hooks/useKeystrokeCapture"
import { usePastePrevention } from "@/hooks/usePastePrevention"
import AppLayout from "@/layouts/app-layout"
import { cn } from "@/lib/utils"
import { dashboardPath, documentPath } from "@/routes"
import type { Document } from "@/types"

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
  documents: Document[]
  keystrokes?: KeystrokeEvent[]
}

export default function DocumentsEdit({ document, documents, keystrokes = [] }: DocumentsEditProps) {
  const { data, setData, errors } = useForm({
    document: {
      title: document.title,
      content: document.content,
    },
  })
  const [wordCount, setWordCount] = useState<number>(document.word_count || 0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showKeystrokeReplay, setShowKeystrokeReplay] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showPasteNotice, setShowPasteNotice] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const editorRef = useRef<RichTextEditorRef>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const publicPostUrl = document.public_slug ? `/posts/${document.public_slug}` : null
  const hasExistingDocuments = documents.some((doc) => doc.id !== document.id)
  const isFirstDocument = !hasExistingDocuments

  // Check if this is a new document (just created)
  const isNewDocument = document.title === "Untitled Document" && !document.content.trim() && wordCount === 0
  
  // Show welcome message only for the user's first document
  useEffect(() => {
    if (isNewDocument && isFirstDocument) {
      setShowWelcome(true)
      // Auto-focus title after a short delay
      const timer = setTimeout(() => {
        titleInputRef.current?.focus()
        titleInputRef.current?.select()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isNewDocument, isFirstDocument])

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
  
  // Briefly surface paste warnings then fade them out
  useEffect(() => {
    if (pasteAttemptCount > 0) {
      setShowPasteNotice(true)
      const timer = setTimeout(() => setShowPasteNotice(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [pasteAttemptCount])

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
    
    // Hide welcome message once user starts typing
    if (isNewDocument && words > 0) {
      setShowWelcome(false)
      // Show a success toast for first words
      if (words === 1) {
        toast.success("Great! Your keystrokes are being verified in real-time. ✨", {
          duration: 4000,
        })
      }
    }
  }, [data.document.content, isNewDocument])

  const handleContentChange = (content: string) => {
    setData('document.content', content)
  }

  const handleManualSave = async ({ showSuccessToast = true }: { showSuccessToast?: boolean } = {}) => {
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
      if (showSuccessToast) {
        toast.success('Document saved successfully')
      }
    } catch (error) {
      console.error('Manual save error:', error)
      toast.error('Failed to save document')
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
    
    // Use a single toast that updates its message
    const publishToastId = toast.loading('Saving document before publishing...')
    
    try {
      // Save first, then publish
      await handleManualSave({ showSuccessToast: false })
      
      // Update toast message for publishing step
      toast.loading('Publishing document...', { id: publishToastId })
      
      router.post(`/documents/${document.id}/publish`, {}, {
        onSuccess: () => {
          toast.success('Document published successfully!', { id: publishToastId })
          // Will be redirected by the controller
        },
        onError: (errors) => {
          console.error('Publishing failed:', errors)
          toast.error('Failed to publish document. Please try again.', { id: publishToastId })
          setIsPublishing(false)
        },
        onFinish: () => {
          setIsPublishing(false)
        }
      })
    } catch (error) {
      console.error('Publish error:', error)
      toast.error('Failed to publish document', { id: publishToastId })
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

  const canPublishNow = canPublish()
  const saveStatusLabel = autoSave.getSaveStatusText()
  const publishButtonLabel = isPublishing ? "Publishing..." : getPublishButtonText()
  const isSaving = autoSave.saveStatus === 'saving'
  const isTyping = autoSave.saveStatus === 'typing'
  const isError = autoSave.saveStatus === 'error'
  const isSaved = autoSave.saveStatus === 'saved'
  const pageBackgroundClass = "bg-background"
  const shellPaddingClass = "w-full px-4 pt-4 pb-8 sm:pt-6 sm:pb-10 gap-6"
  const editorSurfaceClass = "w-full bg-transparent"
  const toolbarWrapperClass = cn(
    "sticky top-0 z-20 border-b border-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
  )
  const contentInsetClass = "px-0"
  const metaTextClass = "text-xs uppercase tracking-[0.18em] text-[#7a6a52]"
  const metaAccentClass = "text-[#7a6a52]/70"
  const previewClassName = cn(
    "prose prose-lg max-w-none text-[#3f3422]",
    "prose-headings:font-semibold prose-headings:text-[#322718]",
    "prose-blockquote:border-l-[#eadcc6] prose-blockquote:text-[#5c4d35]"
  )

  return (
    <div className="composer-theme min-h-screen bg-background">
      <AppLayout showHeader={false}>
        <Head title={`Edit: ${document.title || "Untitled Document"}`} />

        <div className={cn("h-full flex flex-col", pageBackgroundClass)}>
          <div className="flex-1 overflow-visible">
            <div className={cn(toolbarWrapperClass)}>
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-[#5c4d35]"
                  >
                    <a href={dashboardPath()} aria-label="Back to dashboard">
                      <ArrowLeft className="h-4 w-4" />
                    </a>
                  </Button>
                  <button
                    onClick={autoSave.saveStatus === 'error' ? () => void autoSave.retry() : undefined}
                    aria-label={`Save status: ${saveStatusLabel}`}
                    className={cn(
                      "inline-flex items-center rounded-full border border-transparent bg-transparent px-1 py-1 text-xs font-medium text-[#5c4d35] transition-colors",
                      autoSave.saveStatus === 'error' ? "hover:bg-white/60 cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "block h-2.5 w-2.5 rounded-full bg-amber-400",
                        (isTyping || isSaving) && "bg-amber-400",
                        isSaved && "bg-emerald-500",
                        isError && "bg-red-500",
                        isSaving && "animate-pulse"
                      )}
                    />
                    <span className="sr-only">{saveStatusLabel}</span>
                  </button>
                  {publicPostUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs font-medium text-[#5c4d35]"
                    >
                      <a
                        href={publicPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View post"
                      >
                        View
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsPreview((prev) => !prev)}
                    size="sm"
                    variant="ghost"
                    aria-pressed={isPreview}
                    className="h-7 px-2 text-xs font-semibold text-[#5c4d35]"
                  >
                    {isPreview ? (
                      <>
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Preview
                      </>
                    )}
                  </Button>
                  {document.status !== 'published' && (
                    <Button
                      onClick={() => void handlePublish()}
                      disabled={!canPublishNow || isPublishing}
                      size="sm"
                      aria-label={publishButtonLabel}
                      className="rounded-full bg-[#2b2417] px-4 text-xs font-semibold text-white hover:bg-[#2b2417]/90"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className={cn("flex flex-col w-full max-w-6xl", shellPaddingClass)}>
              <div className="mt-1 flex-1">
                <div className="mt-4 space-y-6">
                  <div className={cn("space-y-2 pt-1 sm:pt-2", contentInsetClass)}>
                    {!isPreview && (
                      <EditorToolbar
                        editor={editor}
                        className="mb-2"
                      />
                    )}
                    {isPreview ? (
                      <h1 className="text-[2.5rem] font-semibold tracking-tight text-[#322718] sm:text-[3.1rem] lg:text-[3.35rem] leading-[1.12] sm:leading-[1.05]">
                        {data.document.title.trim() || "Untitled Document"}
                      </h1>
                    ) : (
                      <>
                        <Input
                          ref={titleInputRef}
                          id="title"
                          name="title"
                          type="text"
                          value={data.document.title}
                          onChange={(e) => setData('document.title', e.target.value)}
                          placeholder="Untitled Document"
                          className={cn(
                            "text-[2.5rem] font-semibold tracking-tight text-[#322718] sm:text-[3.1rem] lg:text-[3.35rem] leading-[1.12] sm:leading-[1.05] border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-[#cbbba4] touch-manipulation transition-all duration-300",
                            "h-auto px-0 py-3 sm:py-4 shadow-none",
                            isNewDocument && data.document.title === 'Untitled Document' && isFirstDocument && "rounded-md px-2 -mx-2",
                          )}
                        />
                        {errors['document.title'] && (
                          <p className="text-sm text-destructive">{errors['document.title']}</p>
                        )}
                      </>
                    )}
                  </div>

                  {pasteAttemptCount > 0 && (
                    <div className={cn(metaTextClass, contentInsetClass)}>
                      <span
                        className={cn(
                          "font-semibold transition-opacity duration-500",
                          showPasteNotice ? "text-[#9a6b2f]" : "text-[#9a6b2f]/40"
                        )}
                      >
                        {pasteAttemptCount} paste attempt{pasteAttemptCount !== 1 ? 's' : ''} blocked
                      </span>
                    </div>
                  )}

                  {showWelcome && isNewDocument && isFirstDocument && (
                    <div className={contentInsetClass}>
                      <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                        <div className="relative">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">Welcome to Signify!</h3>
                          </div>
                          <p className="mb-4 text-muted-foreground">
                            You&apos;re about to create your first keystroke-verified document. Every character you type will be captured 
                            and stored for verification, proving this content was written by a human.
                          </p>
                          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                            <div className="flex items-center gap-2 text-primary">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span>Start with a title above</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span>Write naturally - no copy/paste</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span>Auto-save keeps your work safe</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowWelcome(false)}
                            className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Dismiss welcome message"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={cn(editorSurfaceClass, "min-h-[420px] px-0 py-0 sm:px-0 sm:py-0", contentInsetClass)}>
                    {isPreview ? (
                      <div className={previewClassName}>
                        {data.document.content.trim() ? (
                          <div dangerouslySetInnerHTML={{ __html: data.document.content }} />
                        ) : (
                          <p className="text-[#a89a86]">Nothing to preview yet.</p>
                        )}
                      </div>
                    ) : (
                      <RichTextEditor
                        ref={editorRef}
                        value={data.document.content}
                        onChange={handleContentChange}
                        placeholder={isNewDocument && isFirstDocument ? "Start typing your first keystroke-verified document..." : "Start writing your document..."}
                        className="h-full min-h-[320px] sm:min-h-[calc(100vh-300px)] touch-manipulation"
                        textareaClassName="p-0 text-[1.1rem] leading-[1.95] text-[#3f3422] bg-transparent"
                        onEditorReady={setEditor}
                      />
                    )}
                  </div>
                  {errors['document.content'] && (
                    <p className={cn("text-sm text-destructive", contentInsetClass)}>{errors['document.content']}</p>
                  )}

                  {keystrokes.length > 0 && (
                    <div className="border-t border-[#eadcc6] pt-6">
                      <Collapsible open={showKeystrokeReplay} onOpenChange={setShowKeystrokeReplay}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="flex h-auto items-center gap-2 p-0 text-left text-[#3f3422] hover:bg-transparent">
                            {showKeystrokeReplay ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Play className="h-4 w-4" />
                            <span className="font-medium">Keystroke Replay</span>
                            <span className={cn("text-sm", metaAccentClass)}>
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
          </div>
        </div>
      </AppLayout>
    </div>
  )
}
