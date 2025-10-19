import { Link } from "@inertiajs/react"

export function PublicPostFooter() {
  return (
    <footer className="border-t border-[#eadfce] bg-[#fdfaf2]/95">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-5 py-6 text-center sm:flex-row sm:justify-between">
        <p className="text-sm text-[#5c4d35]">
          Published with keystroke verification on Signify.
        </p>
        <Link
          href="/posts"
          className="text-sm font-semibold text-[#322718] underline-offset-4 hover:text-[#8a6d44] hover:underline"
        >
          Browse all verified posts
        </Link>
      </div>
    </footer>
  )
}
