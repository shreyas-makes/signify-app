import { Head, router, usePage } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import { documentsPath } from "@/routes"
import type { PageProps } from "@/types"

export default function NotFound() {
  const { auth } = usePage<PageProps>().props
  const isPublicRoute = window.location.pathname.startsWith('/posts')

  const handleBackClick = () => {
    if (isPublicRoute) {
      router.visit('/posts')
    } else if (auth?.user) {
      router.visit(documentsPath())
    } else {
      router.visit('/')
    }
  }

  const getBackText = () => {
    if (isPublicRoute) {
      return "Back to Posts"
    } else if (auth?.user) {
      return "Back to Documents"
    } else {
      return "Back to Home"
    }
  }

  // For public routes, don't use AppLayout
  const content = (
    <>
      <Head title="Page Not Found - Signify" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">Page not found</h2>
            <p className="text-muted-foreground">
              {isPublicRoute 
                ? "The post you're looking for doesn't exist or hasn't been published yet."
                : "The document you're looking for doesn't exist or you don't have permission to view it."
              }
            </p>
          </div>
          
          <div className="pt-8">
            <Button onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getBackText()}
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        {content}
      </div>
    )
  }

  return (
    <AppLayout>
      {content}
    </AppLayout>
  )
}