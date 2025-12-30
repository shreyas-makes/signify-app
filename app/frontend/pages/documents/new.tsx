import { Head, useForm } from "@inertiajs/react"
import type { Editor } from "@tiptap/react"
import { ArrowLeft, Eye, Pencil, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { EditorToolbar } from "@/components/editor-toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import AppLayout from "@/layouts/app-layout"
import { dashboardPath, documentsPath } from "@/routes"

export default function DocumentsNew() {
  const { data, setData, post, processing, errors } = useForm({
    document: {
      title: '',
      subtitle: '',
      content: '',
    },
  })

  const [wordCount, setWordCount] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.document.title.trim()) {
      toast.error("Please add a title for your document")
      return
    }
    toast.loading("Creating your document...")
    post(documentsPath())
  }

  const previewClassName =
    "prose prose-lg max-w-none text-[#3f3422] prose-headings:font-semibold prose-headings:text-[#322718] prose-blockquote:border-l-[#eadcc6] prose-blockquote:text-[#5c4d35]"

  return (
    <AppLayout showHeader={false} showFooter={false}>
      <Head title="New Document" />

      <div className="editor-body min-h-svh h-dvh flex flex-col bg-background">
        <div className="sticky top-0 z-10 border-b border-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
            <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0 text-[#5c4d35]">
              <a href={dashboardPath()}>
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>

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
              <span className="text-xs uppercase tracking-[0.18em] text-[#7a6a52]">
                {wordCount} words
              </span>
              <Button
                type="submit"
                form="document-form"
                disabled={processing}
                className="rounded-full bg-[#2b2417] px-4 text-xs font-semibold text-white hover:bg-[#2b2417]/90"
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                {processing ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <form
            id="document-form"
            onSubmit={handleSubmit}
            className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-10"
          >
            <div className="mb-2 space-y-2">
              {!isPreview && (
                <div className="hidden sm:block">
                  <EditorToolbar
                    editor={editor}
                    layout="scroll"
                    className="mb-2 gap-2"
                  />
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
                    id="title"
                    name="title"
                    type="text"
                    value={data.document.title}
                    onChange={(e) => setData('document.title', e.target.value)}
                    placeholder="Untitled Document"
                    required
                    autoFocus
                    className="text-[2.1rem] font-semibold tracking-tight text-[#322718] sm:text-[3.1rem] md:text-[3.1rem] lg:text-[3.35rem] leading-[1.2] sm:leading-[1.05] border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-[#cbbba4]"
                  />
                  {errors['document.title'] && (
                    <p className="text-sm text-destructive mt-2">{errors['document.title']}</p>
                  )}
                  <Input
                    id="subtitle"
                    name="subtitle"
                    type="text"
                    value={data.document.subtitle}
                    onChange={(e) => setData('document.subtitle', e.target.value)}
                    placeholder="Add a subtitle"
                    className="text-[0.95rem] sm:text-xl md:text-xl lg:text-2xl text-[#6b5a41] border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-[#cbbba4] rounded-none shadow-none h-auto"
                  />
                  {errors['document.subtitle'] && (
                    <p className="text-sm text-destructive mt-2">{errors['document.subtitle']}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1">
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
                  value={data.document.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your document..."
                  sentenceCaseAfterPeriod
                  className="h-full min-h-[320px] sm:min-h-[calc(100vh-300px)]"
                  textareaClassName="p-0 text-[1.1rem] leading-[1.95] text-[#3f3422] bg-transparent"
                  placeholderClassName="left-0 top-0 p-0 text-[1.1rem] leading-[1.95]"
                  onEditorReady={setEditor}
                />
              )}
              {errors['document.content'] && (
                <p className="text-sm text-destructive mt-2">{errors['document.content']}</p>
              )}
            </div>
          </form>
        </div>
        {!isPreview && (
          <div className="sm:hidden border-t border-[#eadcc6] bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto w-full max-w-4xl px-4 py-2">
              <EditorToolbar
                editor={editor}
                layout="scroll"
                className="mb-0 gap-1"
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
