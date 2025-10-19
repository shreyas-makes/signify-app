import { Head, router, useForm, usePage } from "@inertiajs/react"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  Save,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useKeystrokeCapture } from "@/hooks/useKeystrokeCapture"
import { usePastePrevention } from "@/hooks/usePastePrevention"
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout"
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
  const { url } = usePage()
  
  const [wordCount, setWordCount] = useState<number>(document.word_count || 0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showKeystrokeReplay, setShowKeystrokeReplay] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const editorRef = useRef<RichTextEditorRef>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const publicPostUrl = document.public_slug ? `/posts/${document.public_slug}` : null
  const isPublished = document.status === 'published'
  const initialView = (() => {
    const queryString = url.includes("?") ? url.split("?")[1] : ""
    const params = new URLSearchParams(queryString)
    const view = params.get("view")
    if (view === "write" || view === "preview") {
      return view
    }
    return isPublished ? "preview" : "write"
  })() as 'write' | 'preview'
  const [activeView, setActiveView] = useState<'write' | 'preview'>(initialView)
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
      if (showSuccessToast) {
        toast.success('Document saved successfully')
      }
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
  const saveButtonLabel = isSaving ? "Saving..." : "Save"
  const publishButtonLabel = isPublishing ? "Publishing..." : getPublishButtonText()
  const documentStatusIndicator = (() => {
    switch (document.status) {
      case 'published':
        return {
          label: 'Published',
          indicatorClassName: "bg-emerald-400"
        }
      case 'ready_to_publish':
        return {
          label: 'Ready to publish',
          indicatorClassName: "bg-emerald-300"
        }
      default:
        return {
          label: 'Draft',
          indicatorClassName: "bg-amber-300"
        }
    }
  })()
  const previewWordCount = wordCount
  const previewReadingTimeMinutes = Math.max(1, Math.round(Math.max(previewWordCount, 1) / 200))
  const previewReadingLabel = `${previewReadingTimeMinutes} min${previewReadingTimeMinutes === 1 ? '' : 's'} read`
  const previewTitle = data.document.title.trim() || "Untitled Document"
  const hasAnyContent = data.document.content.trim().length > 0
  const previewContentMarkup = hasAnyContent
    ? data.document.content
    : '<p class="text-muted-foreground/70">Start writing to see your public preview.</p>'
  const previewKeystrokeCount = (typeof document.keystroke_count === 'number'
    ? document.keystroke_count
    : keystrokeCount) ?? 0
  const pageBackgroundClass = "bg-background"
  const shellPaddingClass = "max-w-6xl px-6 sm:px-14 lg:px-24 py-10 sm:py-16 gap-8"
  const editorSurfaceClass =
    "rounded-[36px] border border-[#eadfce] bg-[#fdfaf2] shadow-[0_26px_60px_-34px_rgba(50,40,20,0.4)]"
  const previewSurfaceClass =
    "rounded-[40px] border border-[#eadfce] bg-[#fdfaf2] px-8 py-10 shadow-[0_26px_60px_-34px_rgba(50,40,20,0.4)] sm:px-14 sm:py-14"
  const toolbarWrapperClass = cn(
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 px-0 pt-2 pb-4 text-[#5c4d35]"
  )
  const metaTextClass = "text-sm text-[#5c4d35]"
  const previewMetaAccentClass = "text-[#5c4d35]/80"

  return (
    <div className="composer-theme min-h-screen bg-background">
      <AppSidebarLayout 
        documents={documents}
        currentDocumentId={document.id}
      >
        <Head title={`Edit: ${document.title || "Untitled Document"}`} />

        <div className={cn("h-full flex flex-col", pageBackgroundClass)}>
          <div className="flex-1 overflow-auto">
            <div className={cn("flex flex-col mx-auto w-full", shellPaddingClass)}>
              <Tabs
                value={activeView}
                onValueChange={(value) => setActiveView(value as 'write' | 'preview')}
                className="mt-2 flex-1"
              >
                <div className={toolbarWrapperClass}>
                  <TabsList className="rounded-full border border-[#d6c7ab]/70 bg-white/60 p-1 text-[#6e5a3d] shadow-none transition-colors">
                    <TabsTrigger
                      value="write"
                      aria-label="Edit mode"
                      className="group flex items-center justify-center rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6c7ab]/50 focus-visible:ring-offset-0 data-[state=active]:bg-white data-[state=active]:text-[#322718] data-[state=active]:shadow-sm"
                    >
                      <Edit className="h-4 w-4 transition-colors group-data-[state=active]:text-[#322718]" strokeWidth={1.75} />
                      <span className="sr-only">Edit</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      aria-label="Preview mode"
                      className="group flex items-center justify-center rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6c7ab]/50 focus-visible:ring-offset-0 data-[state=active]:bg-white data-[state=active]:text-[#322718] data-[state=active]:shadow-sm"
                    >
                      <Eye className="h-4 w-4 transition-colors group-data-[state=active]:text-[#322718]" strokeWidth={1.75} />
                      <span className="sr-only">Preview</span>
                    </TabsTrigger>
                  </TabsList>

                  <TooltipProvider delayDuration={0}>
                    <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            aria-label={`${documentStatusIndicator.label} status`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6c7ab]/50 bg-white/50 shadow-none"
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "block h-2.5 w-2.5 rounded-full opacity-80",
                                documentStatusIndicator.indicatorClassName,
                              )}
                            />
                            <span className="sr-only">{documentStatusIndicator.label}</span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{documentStatusIndicator.label}</TooltipContent>
                      </Tooltip>
                      <span className="sr-only" role="status" aria-live="polite">
                        {saveStatusLabel}
                      </span>

                      {autoSave.saveStatus === 'error' && (
                        <Button
                          onClick={() => void autoSave.retry()}
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Retry save</span>
                        </Button>
                      )}

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

                      <Button
                        onClick={() => void handleManualSave()}
                        disabled={
                          isSaving ||
                          autoSave.saveStatus === 'saving' ||
                          (autoSave.saveStatus === 'saved' && !autoSave.hasUnsavedChanges)
                        }
                        size="icon"
                        variant="ghost"
                        aria-label={saveButtonLabel}
                        className="rounded-full border border-[#d6c7ab]/70 bg-white/70 text-[#5c4d35] shadow-none hover:bg-white"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span className="sr-only">{saveButtonLabel}</span>
                      </Button>

                      {document.status !== 'published' && (
                        <Button
                          onClick={() => void handlePublish()}
                          disabled={!canPublishNow || autoSave.saveStatus === 'saving' || isPublishing}
                          size="icon"
                          variant={canPublishNow ? "default" : "outline"}
                          aria-label={publishButtonLabel}
                          className={cn(
                            "rounded-full shadow-sm",
                            !canPublishNow && "border border-[#d6c7ab]/60 bg-white/70 text-muted-foreground hover:bg-white",
                          )}
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

                <TabsContent value="write" className="mt-6 space-y-6">
                <div className="space-y-2 pt-1 sm:pt-2">
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
                      "h-auto px-1 sm:px-0 py-3 sm:py-4 shadow-none",
                      isNewDocument && data.document.title === 'Untitled Document' && isFirstDocument && "rounded-md px-2 -mx-2",
                    )}
                  />
                  {errors['document.title'] && (
                    <p className="text-sm text-destructive">{errors['document.title']}</p>
                  )}
                </div>

                <div className={cn(metaTextClass, "flex flex-wrap items-center gap-x-3 gap-y-1 px-1 sm:px-0")}>
                  <span>{wordCount} words</span>
                  <span className="text-[#d0c3ae]">•</span>
                  <span>{keystrokeCount} keystrokes</span>
                  {pasteAttemptCount > 0 && (
                    <span className="text-amber-600 font-medium">
                      {pasteAttemptCount} paste attempt{pasteAttemptCount !== 1 ? 's' : ''} blocked
                    </span>
                  )}
                </div>

                {showWelcome && isNewDocument && isFirstDocument && (
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
                )}

                <div className={cn(editorSurfaceClass, "min-h-[420px] overflow-hidden px-6 py-8 sm:px-12 sm:py-12 mx-auto")}>
                  <RichTextEditor
                    ref={editorRef}
                    value={data.document.content}
                    onChange={handleContentChange}
                    placeholder={isNewDocument && isFirstDocument ? "Start typing your first keystroke-verified document..." : "Start writing your document..."}
                    className="h-full min-h-[300px] sm:min-h-[calc(100vh-300px)] touch-manipulation"
                    textareaClassName="p-0 sm:px-2 sm:py-3 md:px-4 md:py-5 text-[1.05rem] leading-[1.85] text-[#3f3422] bg-transparent"
                  />
                </div>
                {errors['document.content'] && (
                  <p className="px-1 text-sm text-destructive">{errors['document.content']}</p>
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
                          <span className={cn("text-sm", previewMetaAccentClass)}>
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
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <div className={previewSurfaceClass}>
                  <article>
                    <header className="mb-10">
                      <h1 className="text-4xl font-semibold tracking-tight text-[#322718] sm:text-[3rem] lg:text-[3.35rem] lg:leading-[1.05]">
                        {previewTitle}
                      </h1>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.35em] text-[#a38f74]">
                        {previewReadingLabel}
                      </p>
                      <div className="mt-6 text-sm text-[#5c4d35]">
                        <span>{previewWordCount.toLocaleString()} words</span>
                        <span className="mx-2 inline-block text-[#d0c3ae]">•</span>
                        <span>{previewKeystrokeCount.toLocaleString()} keystrokes</span>
                      </div>
                    </header>

                    <div
                      className="prose prose-lg max-w-none text-[#3f3422] prose-headings:font-semibold prose-headings:text-[#2d2518] prose-p:text-[1.05rem] prose-p:leading-[1.85] prose-p:text-[#3f3422] prose-strong:text-[#2d2518]"
                      dangerouslySetInnerHTML={{ __html: previewContentMarkup }}
                    />

                    <footer className="mt-12 border-t border-[#eadcc6] pt-6 text-sm text-[#5c4d35]">
                      {publicPostUrl ? (
                        <p>
                          Readers currently view this page at{" "}
                          <a
                            href={publicPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-[#8a6d44]/60 underline-offset-4 transition-colors hover:text-[#8a6d44]"
                          >
                            {publicPostUrl}
                          </a>.
                        </p>
                      ) : (
                        <p>Publish to generate a shareable public link for this post.</p>
                      )}
                      <p className="mt-3 text-[#7a674a]">
                        Because you&apos;re signed in, you can switch back to Edit to keep refining your draft without leaving this page.
                      </p>
                      {!hasAnyContent && (
                        <p className="mt-3 text-muted-foreground">
                          Add content in the editor to see a richer preview.
                        </p>
                      )}
                    </footer>
                  </article>
                </div>
              </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </AppSidebarLayout>
    </div>
  )
}
