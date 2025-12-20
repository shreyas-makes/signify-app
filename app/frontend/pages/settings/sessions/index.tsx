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
        <div className="space-y-6">
          <HeadingSmall
            title="Sessions"
            description="Manage your active sessions across devices"
          />

          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col space-y-2 rounded-lg border p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium break-words">
                      {session.user_agent}
                      {session.id === auth.session.id && (
                        <Badge variant="secondary" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      IP: {session.ip_address}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Active since:{" "}
                      {new Date(session.created_at).toLocaleString()}
                    </p>
                  </div>
                  {session.id !== auth.session.id && (
                    <Button variant="destructive" asChild className="self-start sm:self-center">
                      <Link
                        method="delete"
                        href={sessionPath({ id: session.id })}
                        as="button"
                      >
                        Log out
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
