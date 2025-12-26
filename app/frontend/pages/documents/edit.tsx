import { Head, router, useForm } from "@inertiajs/react"
import type { Editor } from "@tiptap/react"
import { ArrowLeft, Eye, Loader2, Pencil, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { EditorToolbar } from "@/components/editor-toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useKeyboardOffset } from "@/hooks/useKeyboardOffset"
import { useKeystrokeCapture } from "@/hooks/useKeystrokeCapture"
import { usePastePrevention } from "@/hooks/usePastePrevention"
import AppLayout from "@/layouts/app-layout"
import { cn } from "@/lib/utils"
import { dashboardPath, documentPath } from "@/routes"
import type { Document } from "@/types"

interface DocumentsEditProps {
  document: Document
  documents: Document[]
}

export default function DocumentsEdit({ document, documents }: DocumentsEditProps) {
  const { data, setData, errors } = useForm({
    document: {
      title: document.title,
      subtitle: document.subtitle ?? '',
      content: document.content,
    },
  })
  const [wordCount, setWordCount] = useState<number>(document.word_count || 0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [documentMeta, setDocumentMeta] = useState({
    status: document.status,
    updated_at: document.updated_at,
    published_at: document.published_at ?? null
  })
  const editorRef = useRef<RichTextEditorRef>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const subtitleInputRef = useRef<HTMLInputElement>(null)
  const keyboardOffset = useKeyboardOffset()
  const publicPostUrl = document.public_slug ? `/posts/${document.public_slug}` : null
  const hasExistingDocuments = documents.some((doc) => doc.id !== document.id)
  const isFirstDocument = !hasExistingDocuments

  useEffect(() => {
    setDocumentMeta({
      status: document.status,
      updated_at: document.updated_at,
      published_at: document.published_at ?? null
    })
  }, [document.id, document.published_at, document.status, document.updated_at])

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
    getPasteAttempts
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
          const result = await response.json() as { document?: { updated_at?: string; published_at?: string | null; status?: Document["status"] } }
          console.log('Document saved successfully:', result)
          if (result.document) {
            setDocumentMeta((prev) => ({
              status: result.document?.status ?? prev.status,
              updated_at: result.document?.updated_at ?? prev.updated_at,
              published_at: result.document?.published_at ?? prev.published_at
            }))
          }
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

  // Attach paste prevention to subtitle input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (subtitleInputRef.current) {
        console.log('Attaching paste prevention to subtitle input')
        attachPastePrevention(subtitleInputRef.current)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [attachPastePrevention])
  
  // Update auto-save when data changes
  useEffect(() => {
    autoSave.updateData({
      document: {
        title: data.document.title,
        subtitle: data.document.subtitle,
        content: data.document.content
      },
      keystrokes: getKeystrokesForTransmission(),
      paste_attempts: getPasteAttempts()
    })
  }, [data.document.title, data.document.subtitle, data.document.content])

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
          subtitle: data.document.subtitle,
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

  const totalKeystrokes = Math.max(keystrokeCount, document.keystroke_count ?? 0)
  const hasPublishableChanges = documentMeta.status !== 'published' || (
    documentMeta.published_at &&
    new Date(documentMeta.updated_at).getTime() > new Date(documentMeta.published_at).getTime()
  )
  const canPublish = () => {
    const hasTitle = data.document.title.trim().length > 0
    const hasContent = data.document.content.trim().length > 0
    const hasKeystrokes = totalKeystrokes > 0
    
    return hasTitle && hasContent && hasKeystrokes
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
          toast.dismiss(publishToastId)
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
    if (document.status === 'published' && !hasPublishableChanges) return 'Published'
    if (!data.document.title.trim()) return 'Add title to publish'
    if (!data.document.content.trim()) return 'Add content to publish'
    return 'Publish'
  }

  const canPublishNow = canPublish() && hasPublishableChanges
  const saveStatusLabel = autoSave.getSaveStatusText()
  const publishButtonLabel = isPublishing ? "Publishing..." : getPublishButtonText()
  const isSaving = autoSave.saveStatus === 'saving'
  const isTyping = autoSave.saveStatus === 'typing'
  const isError = autoSave.saveStatus === 'error'
  const isSaved = autoSave.saveStatus === 'saved'
  const pageBackgroundClass = "bg-background"
  const shellPaddingClass = "w-full px-4 pt-4 pb-24 sm:px-6 sm:pt-6 sm:pb-10 gap-6"
  const editorSurfaceClass = "w-full bg-transparent"
  const toolbarWrapperClass = cn(
    "sticky top-0 z-20 border-b border-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
  )
  const mobileToolbarWrapperClass = cn(
    "fixed bottom-0 left-0 right-0 z-30 border-t border-[#eadcc6] bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80",
    "sm:static sm:border-0 sm:bg-transparent sm:pb-0 sm:backdrop-blur-0"
  )
  const mobileToolbarInnerClass = "w-full max-w-4xl px-4 py-2 sm:px-0 sm:py-0"
  const contentInsetClass = "px-0"
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
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
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
                </div>

                <div className="flex items-center gap-3">
                  {publicPostUrl ? (
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs font-semibold text-[#5c4d35]"
                    >
                      <a href={publicPostUrl} aria-label="Preview public post">
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Preview
                      </a>
                    </Button>
                  ) : (
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
                  )}
                  <Button
                    onClick={() => void handlePublish()}
                    disabled={!canPublishNow || isPublishing}
                    size="sm"
                    aria-label={publishButtonLabel}
                    className="rounded-full bg-[#2b2417] px-4 text-xs font-semibold text-white hover:bg-[#2b2417]/90 disabled:opacity-80"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      publishButtonLabel
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className={cn("mx-auto flex w-full max-w-6xl flex-col", shellPaddingClass)}>
              <div className="mt-1 flex-1">
                <div className="mt-4 space-y-2">
                  <div className={cn("space-y-2 pt-1 sm:pt-2", contentInsetClass)}>
                    {!isPreview && (
                      <div
                        className={cn(mobileToolbarWrapperClass, "transition-transform duration-200")}
                        style={keyboardOffset ? { transform: `translateY(-${keyboardOffset}px)` } : undefined}
                      >
                        <div className={mobileToolbarInnerClass}>
                          <EditorToolbar
                            editor={editor}
                            layout="scroll"
                            className="mb-0 gap-1 sm:mb-2 sm:gap-2"
                          />
                        </div>
                      </div>
                    )}
                    {isPreview ? (
                      <div className="space-y-1.5 mb-6">
                        <h1 className="text-[2.1rem] font-semibold tracking-tight text-[#322718] sm:text-[3.1rem] lg:text-[3.35rem] leading-[1.2] sm:leading-[1.05]">
                          {data.document.title.trim() || "Untitled Document"}
                        </h1>
                        {data.document.subtitle.trim() && (
                          <p className="text-[0.95rem] sm:text-xl md:text-xl lg:text-2xl text-[#6b5a41]">
                            {data.document.subtitle}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-6">
                        <Input
                          ref={titleInputRef}
                          id="title"
                          name="title"
                          type="text"
                          value={data.document.title}
                          onChange={(e) => setData('document.title', e.target.value)}
                          placeholder="Untitled Document"
                          className={cn(
                            "text-[2.1rem] font-semibold tracking-tight text-[#322718] sm:text-[3.1rem] md:text-[3.1rem] lg:text-[3.35rem] leading-[1.2] sm:leading-[1.05] border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-[#cbbba4] touch-manipulation transition-all duration-300",
                            "h-auto px-0 py-3 sm:py-4 shadow-none",
                            isNewDocument && data.document.title === 'Untitled Document' && isFirstDocument && "rounded-md px-2 -mx-2",
                          )}
                        />
                        {errors['document.title'] && (
                          <p className="text-sm text-destructive">{errors['document.title']}</p>
                        )}
                        <Input
                          ref={subtitleInputRef}
                          id="subtitle"
                          name="subtitle"
                          type="text"
                          value={data.document.subtitle}
                          onChange={(e) => setData('document.subtitle', e.target.value)}
                          placeholder="Add a subtitle"
                          className="text-[0.95rem] sm:text-xl md:text-xl lg:text-2xl text-[#6b5a41] border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-[#cbbba4] transition-all duration-300 rounded-none shadow-none h-auto"
                        />
                        {errors['document.subtitle'] && (
                          <p className="text-sm text-destructive">{errors['document.subtitle']}</p>
                        )}
                      </div>
                    )}
                  </div>

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
                        placeholderClassName="left-0 top-0 p-0 text-[1.1rem] leading-[1.95]"
                        onEditorReady={setEditor}
                      />
                    )}
                  </div>
                  {errors['document.content'] && (
                    <p className={cn("text-sm text-destructive", contentInsetClass)}>{errors['document.content']}</p>
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
