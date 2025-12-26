import { Link } from "@inertiajs/react"

import AppLogo from "@/components/app-logo"
import { publicPostsPath } from "@/routes"

export function AppFooter() {
  return (
    <footer className="bg-white py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex w-full flex-col gap-4 px-4 md:max-w-7xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Signify
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Human only stories, and ideas</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={publicPostsPath()} className="transition-colors hover:text-foreground">
            Explore
          </Link>
          <a href="/legal/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="/legal/terms" className="transition-colors hover:text-foreground">
            Terms
          </a>
          <a href="/support/contact" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>

        <p className="text-xs text-muted-foreground">© 2025 Signify</p>
      </div>
    </footer>
  )
}
