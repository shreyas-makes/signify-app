import { Head, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    title: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(documentsPath())
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Document" />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href={documentsPath()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter a title for your document"
                  required
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                >
                  <a href={documentsPath()}>Cancel</a>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Document'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}