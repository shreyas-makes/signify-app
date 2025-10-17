import { Head, router } from '@inertiajs/react'
import { BookOpen, CheckCircle, Clock, FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


interface Author {
  id: number
  display_name: string
  bio?: string | null
  member_since?: string | null
  published_count: number
}

interface Post {
  id: number
  title: string
  public_slug: string
  published_at: string | null
  word_count: number
  reading_time_minutes: number
  excerpt: string
}

interface MetaTags {
  title: string
  description: string
  canonical_url: string
  author: string
}

interface Props {
  author: Author
  posts: Post[]
  meta: MetaTags
}

export default function PublicAuthorShow({ author, posts, meta }: Props) {
  const authorDescription = author.bio?.trim()
    ? author.bio
    : `Explore published work written by ${author.display_name} on Signify.`
  const visitPost = (publicSlug: string) => {
    router.visit(`/posts/${publicSlug}`)
  }

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

      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              {author.display_name}
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground">
              {authorDescription}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>
                {author.published_count} published {author.published_count === 1 ? 'post' : 'posts'}
              </span>
              {author.member_since && (
                <span>Member since {author.member_since}</span>
              )}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-lg font-medium text-foreground">
                No published posts yet
              </h2>
              <p className="text-muted-foreground">
                Check back soon to see what {author.display_name} shares.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => visitPost(post.public_slug)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2 text-xl font-semibold text-foreground transition-colors hover:text-primary">
                          {post.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {post.published_at && <span>{post.published_at}</span>}
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {post.word_count.toLocaleString()} words
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.reading_time_minutes} min read
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-foreground/80">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button variant="outline" onClick={() => router.visit('/posts')} className="px-6">
              ← Back to all posts
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
