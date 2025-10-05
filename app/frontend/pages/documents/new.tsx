import { Head, useForm } from "@inertiajs/react"
import { ArrowLeft, Save } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor, type RichTextEditorRef } from "@/components/ui/rich-text-editor"
import AppLayout from "@/layouts/app-layout"
import { documentsPath } from "@/routes"
import type { BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Documents",
    href: documentsPath(),
  },
  {
    title: "New Document",
    href: "#",
  },
]

export default function DocumentsNew() {
  const { data, setData, post, processing, errors } = useForm({
    document: {
      title: '',
      content: '',
    },
  })

  const [wordCount, setWordCount] = useState(0)
  const editorRef = useRef<RichTextEditorRef>(null)

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
    post(documentsPath())
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Document" />

      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
          <Button variant="ghost" size="sm" asChild>
            <a href={documentsPath()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </a>
          </Button>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {wordCount} words
            </div>
            <Button type="submit" form="document-form" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <form id="document-form" onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
              {/* Title */}
              <div className="mb-8">
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={data.document.title}
                  onChange={(e) => setData('document.title', e.target.value)}
                  placeholder="Untitled Document"
                  required
                  autoFocus
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
          </form>
        </div>
      </div>
    </AppLayout>
  )
}