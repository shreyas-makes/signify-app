import { Link } from "@inertiajs/react"

export function PublicPostFooter() {
  return (
    <footer className="py-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Verified of 100% human authorship on Signify.
        </p>
        <Link
          href="/posts"
          className="text-sm font-medium text-primary underline-offset-4 hover:text-primary/80 hover:underline"
        >
          View more posts by writers on Signify
        </Link>
      </div>
    </footer>
  )
}
