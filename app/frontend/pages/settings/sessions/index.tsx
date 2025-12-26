import { Head, Link, usePage } from "@inertiajs/react"

import HeadingSmall from "@/components/heading-small"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/layouts/settings/layout"
import { sessionPath } from "@/routes"
import type { Session, SharedData } from "@/types"

const pageTitle = "Sessions"

interface SessionsProps {
  sessions: Session[]
}

export default function Sessions({ sessions }: SessionsProps) {
  const { auth } = usePage<SharedData>().props

  return (
    <AppLayout>
      <Head title={pageTitle} />

      <SettingsLayout>
        <div className="space-y-6 pb-10">
          <HeadingSmall
            title="Sessions"
            description="Manage your active sessions across devices"
          />

          <div className="divide-y rounded-2xl border bg-card/60">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium break-words">{session.user_agent}</p>
                    {session.id === auth.session.id && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    IP: {session.ip_address}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Active since:{" "}
                    {new Date(session.created_at).toLocaleString()}
                  </p>
                </div>
                {session.id !== auth.session.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="self-start sm:self-center"
                  >
                    <Link
                      method="delete"
                      href={sessionPath({ id: session.id })}
                      as="button"
                    >
                      Sign out
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
