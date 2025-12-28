import { Link } from "@inertiajs/react"

import { publicPostsPath } from "@/routes"

type PublicFooterVariant = "default" | "gradient"

interface PublicFooterProps {
  variant?: PublicFooterVariant
}

export function PublicFooter({ variant = "default" }: PublicFooterProps) {
  const isGradient = variant === "gradient"

  return (
    <footer
      className={
        isGradient
          ? "relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/15 py-6 text-sm text-muted-foreground"
          : "bg-background py-6 text-sm text-muted-foreground"
      }
    >
      {isGradient ? (
        <>
          <div className="pointer-events-none absolute -left-24 top-6 h-[200px] w-[200px] rounded-full bg-primary/15 blur-3xl blob-drift-1" />
          <div className="pointer-events-none absolute bottom-[-12%] right-[-12%] h-[220px] w-[220px] rounded-full bg-accent/30 blur-3xl blob-drift-2" />
        </>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg font-semibold tracking-tight text-foreground">Signify</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Human only stories, and ideas
          </p>
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
