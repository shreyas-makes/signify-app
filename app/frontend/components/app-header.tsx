import { Link, usePage } from "@inertiajs/react"
import { LayoutGrid, Menu, Newspaper } from "lucide-react"

import { Icon } from "@/components/icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserMenuContent } from "@/components/user-menu-content"
import { useInitials } from "@/hooks/use-initials"
import { cn } from "@/lib/utils"
import { dashboardPath } from "@/routes"
import type { NavItem, SharedData } from "@/types"

import AppLogo from "./app-logo"

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: dashboardPath(),
    icon: LayoutGrid,
  },
  {
    title: "Discover",
    href: "/posts",
    icon: Newspaper,
  },
]

const activeItemStyles =
  "text-foreground bg-accent"

export function AppHeader() {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const getInitials = useInitials()
  return (
    <>
      <div className="border-sidebar-border/80 border-b">
        <div className="mx-auto flex h-14 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 h-[34px] w-[34px]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetHeader className="flex items-center justify-start text-left">
                  <AppLogo
                    showIcon
                    iconClassName="size-6"
                    labelClassName="font-serif text-base leading-tight tracking-tight"
                  />
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                  <div className="flex h-full flex-col justify-between text-sm">
                    <div className="flex flex-col space-y-4">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center space-x-2 font-medium"
                        >
                          {item.icon && (
                            <Icon iconNode={item.icon} className="h-5 w-5" />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>

                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href={dashboardPath()}
            prefetch
            className="flex items-center"
          >
            <AppLogo
              showIcon
              iconClassName="size-6"
              labelClassName="font-serif text-base leading-tight tracking-tight"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
            <NavigationMenu className="flex h-full items-stretch">
              <NavigationMenuList className="flex h-full items-stretch space-x-2">
                {mainNavItems.map((item, index) => (
                  <NavigationMenuItem
                    key={index}
                    className="relative flex h-full items-center"
                  >
                    <Link
                      href={item.href}
                      aria-label={item.title}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        page.url === item.href && activeItemStyles,
                        "h-9 w-9 cursor-pointer justify-center px-0",
                      )}
                    >
                      {item.icon && (
                        <Icon iconNode={item.icon} className="h-4 w-4" />
                      )}
                      <span className="sr-only">{item.title}</span>
                    </Link>
                    {page.url === item.href && (
                      <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-foreground"></div>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-10 rounded-full p-1">
                  <Avatar className="size-8 overflow-hidden rounded-full">
                    <AvatarImage
                      src={auth.user.avatar_image_url ?? auth.user.avatar_url ?? auth.user.avatar}
                      alt={auth.user.name}
                    />
                    <AvatarFallback className="rounded-lg bg-muted text-foreground">
                      {getInitials(auth.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <UserMenuContent auth={auth} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}
