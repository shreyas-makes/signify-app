import { Link } from "@inertiajs/react"

export function PublicPostFooter() {
  return (
    <footer className="mt-10 border-t border-[#eadfce] bg-white sm:mt-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-4 text-center sm:flex-row sm:justify-between">
        <Link href="/" className="text-xs text-[#6a5a42] hover:text-[#8a6d44]">
          Published and verified with{" "}
          <span className="font-serif tracking-tight text-[#3f3422]">Signify</span>.
        </Link>
        <Link
          href="/posts"
          className="text-xs font-normal text-[#6a5a42] underline-offset-4 hover:text-[#8a6d44] hover:underline"
        >
          Browse all human written stories and essays
        </Link>
      </div>
    </footer>
  )
}
