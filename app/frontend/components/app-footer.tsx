import { Link } from "@inertiajs/react"

import { publicPostsPath } from "@/routes"

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-background py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 md:max-w-7xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg tracking-tight text-foreground">Signify</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Authenticity for writers</p>
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

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Signify. Proof that every story is human.
        </p>
      </div>
    </footer>
  )
}
