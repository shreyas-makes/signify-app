import { Head } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import { documentsPath } from "@/routes"

export default function NotFound() {
  return (
    <AppLayout>
      <Head title="Not Found" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">Page not found</h2>
            <p className="text-muted-foreground">
              The document you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
          
          <div className="pt-8">
            <Button asChild>
              <a href={documentsPath()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </a>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}