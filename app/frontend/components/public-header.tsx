import { Link, usePage } from "@inertiajs/react"

import AppLogo from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { dashboardPath, publicPostsPath, signInPath, signUpPath } from "@/routes"
import type { SharedData } from "@/types"

interface PublicHeaderProps {
  navItems?: Array<{ label: string; href: string }>
}

const defaultNavItems = [
  { label: "Discover", href: publicPostsPath() },
  { label: "Features", href: "/features" },
]

export function PublicHeader({ navItems = defaultNavItems }: PublicHeaderProps) {
  const page = usePage<SharedData>()
  const { auth } = page.props

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          <AppLogo
            showIcon
            iconClassName="size-7"
            labelClassName="font-serif text-xl leading-tight tracking-tight"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {auth.user ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={dashboardPath()}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={signInPath()}>Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={signUpPath()}>Start for free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
