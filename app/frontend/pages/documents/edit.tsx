import { Head, router, useForm } from "@inertiajs/react"
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Play,
  Send,
  Sparkles,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { KeystrokeReplay } from "@/components/ui/keystroke-replay"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useKeystrokeCapture } from "@/hooks/useKeystrokeCapture"
import { usePastePrevention } from "@/hooks/usePastePrevention"
import AppLayout from "@/layouts/app-layout"
import { documentPath } from "@/routes"
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
  const saveStatusIndicator = (() => {
    const status = autoSave.saveStatus
    switch (status) {
      case 'saved':
        return {
          label: 'Saved - Ready to publish',
          indicatorClassName: "bg-emerald-400"
        }
      case 'saving':
        return {
          label: 'Saving...',
          indicatorClassName: "bg-blue-400 animate-pulse"
        }
      case 'typing':
        return {
          label: 'Typing - Auto-save pending',
          indicatorClassName: "bg-amber-400"
        }
      case 'error':
        return {
          label: 'Save failed - Click to retry',
          indicatorClassName: "bg-red-400"
        }
      default:
        return {
          label: 'Unsaved changes',
          indicatorClassName: "bg-amber-400"
        }
    }
  })()
  const pageBackgroundClass = "bg-background"
  const shellPaddingClass = "max-w-6xl px-6 sm:px-14 lg:px-24 py-6 sm:py-10 gap-6"
  const editorSurfaceClass = "w-full bg-transparent"
  const toolbarWrapperClass = cn(
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 pt-2 pb-4 text-[#5c4d35]"
  )
  const contentInsetClass = "px-6 sm:px-10 lg:px-12"
  const metaTextClass = "text-sm text-[#5c4d35]"
  const metaAccentClass = "text-[#5c4d35]/80"

  return (
    <div className="composer-theme min-h-screen bg-background">
      <AppLayout>
        <Head title={`Edit: ${document.title || "Untitled Document"}`} />

        <div className={cn("h-full flex flex-col", pageBackgroundClass)}>
          <div className="flex-1 overflow-auto">
            <div className={cn("flex flex-col mx-auto w-full", shellPaddingClass)}>
              <div className="mt-2 flex-1">
                <div className={cn(toolbarWrapperClass, contentInsetClass)}>
                  <TooltipProvider delayDuration={0}>
                    <div className="flex flex-wrap items-center gap-2 justify-start w-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={autoSave.saveStatus === 'error' ? () => void autoSave.retry() : undefined}
                            aria-label={`${saveStatusIndicator.label} status`}
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6c7ab]/50 bg-white/50 shadow-none transition-colors",
                              autoSave.saveStatus === 'error' ? "hover:bg-white cursor-pointer" : "cursor-default"
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "block h-2.5 w-2.5 rounded-full opacity-80",
                                saveStatusIndicator.indicatorClassName,
                              )}
                            />
                            <span className="sr-only">{saveStatusIndicator.label}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{saveStatusIndicator.label}</TooltipContent>
                      </Tooltip>
                      <span className="sr-only" role="status" aria-live="polite">
                        {saveStatusLabel}
                      </span>

                      {publicPostUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="text-[#3f3422]"
                        >
                          <a
                            href={publicPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View post"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}

                      {document.status !== 'published' && autoSave.saveStatus === 'saved' && (
                        <Button
                          onClick={() => void handlePublish()}
                          disabled={!canPublishNow || isPublishing}
                          size="icon"
                          aria-label={publishButtonLabel}
                          className="rounded-full bg-black text-white hover:bg-black/90 shadow-sm"
                        >
                          {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span className="sr-only">{publishButtonLabel}</span>
                        </Button>
                      )}
                    </div>
                  </TooltipProvider>
                </div>

                <div className="mt-6 space-y-6">
                  <div className={cn("space-y-2 pt-1 sm:pt-2", contentInsetClass)}>
                    <Input
                      ref={titleInputRef}
                      id="title"
                      name="title"
                      type="text"
                      value={data.document.title}
                      onChange={(e) => setData('document.title', e.target.value)}
                      placeholder="Untitled Document"
                      className={cn(
                        "text-4xl font-semibold tracking-tight text-[#322718] sm:text-[3rem] lg:text-[3.35rem] leading-[1.12] sm:leading-[1.05] border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-[#cbbba4] touch-manipulation transition-all duration-300",
                        "h-auto px-0 py-3 sm:py-4 shadow-none",
                        isNewDocument && data.document.title === 'Untitled Document' && isFirstDocument && "rounded-md px-2 -mx-2",
                      )}
                    />
                    {errors['document.title'] && (
                      <p className="text-sm text-destructive">{errors['document.title']}</p>
                    )}
                  </div>

                  <div className={cn(metaTextClass, "flex flex-wrap items-center gap-x-3 gap-y-1", contentInsetClass)}>
                    <span>{wordCount} words</span>
                    <span className="text-[#d0c3ae]">•</span>
                    <span>{keystrokeCount} keystrokes</span>
                    {pasteAttemptCount > 0 && (
                      <span
                        className={cn(
                          "font-medium transition-opacity duration-500",
                          showPasteNotice ? "text-amber-600" : "text-amber-600/40"
                        )}
                      >
                        {pasteAttemptCount} paste attempt{pasteAttemptCount !== 1 ? 's' : ''} blocked
                      </span>
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
                    <RichTextEditor
                      ref={editorRef}
                      value={data.document.content}
                      onChange={handleContentChange}
                      placeholder={isNewDocument && isFirstDocument ? "Start typing your first keystroke-verified document..." : "Start writing your document..."}
                      className="h-full min-h-[300px] sm:min-h-[calc(100vh-300px)] touch-manipulation"
                      textareaClassName="p-0 text-[1.05rem] leading-[1.85] text-[#3f3422] bg-transparent"
                    />
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
