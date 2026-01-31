import { Head, Link } from '@inertiajs/react'
import { CheckCircle2, Fingerprint, TriangleAlert } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PublicLayout from '@/layouts/public-layout'

interface User {
  display_name: string
  username: string
  bio?: string | null
  member_since?: string | null
}

interface VerificationItem {
  id: string
  status: 'human_written' | 'mixed'
  platform: string
  created_at: string
  paste: {
    occurred: boolean
    count: number
  }
  public_url: string
}

interface MetaTags {
  title: string
  description: string
  canonical_url: string
  author: string
}

interface Props {
  user: User
  verifications: VerificationItem[]
  meta: MetaTags
}

export default function PublicUserFeedShow({ user, verifications, meta }: Props) {
  const description = user.bio?.trim()
    ? user.bio
    : `Verification feed for ${user.display_name} on Signify.`

  return (
    <>
      <Head title={meta.title}>
        <meta name="description" content={meta.description} />
        <meta name="author" content={meta.author} />
        <link rel="canonical" href={meta.canonical_url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical_url} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-10 text-center">
              <h1 className="mb-3 text-4xl font-semibold text-foreground">
                {user.display_name}
              </h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {description}
              </p>
              {user.member_since && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Member since {user.member_since}
                </p>
              )}
            </div>

            {verifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
                <p className="text-base text-muted-foreground">
                  No proofs published yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {verifications.map((verification) => {
                  const isMixed = verification.status === 'mixed'
                  return (
                    <Card key={verification.id} className="transition-shadow hover:shadow-md">
                      <CardHeader className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <CardTitle className="text-xl font-semibold text-foreground">
                            Proof {verification.id}
                          </CardTitle>
                          <Badge variant={isMixed ? 'secondary' : 'default'} className="inline-flex items-center gap-1">
                            {isMixed ? <TriangleAlert className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {isMixed ? 'Mixed' : 'Human Written'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Fingerprint className="h-4 w-4" />
                            {verification.platform}
                          </span>
                          <span>{verification.created_at}</span>
                          <span>
                            {verification.paste.occurred
                              ? `${verification.paste.count} paste event${verification.paste.count === 1 ? '' : 's'}`
                              : 'No paste detected'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                          Proof link: {verification.public_url}
                        </p>
                        <Button asChild size="sm">
                          <Link href={verification.public_url}>View proof</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/posts">Explore public posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  )
}
