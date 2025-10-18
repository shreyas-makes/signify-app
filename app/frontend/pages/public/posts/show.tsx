import { Head, Link } from '@inertiajs/react'
import { LayoutDashboard, SquarePen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MiniGitGraph } from '@/components/ui/mini-git-graph'
import type { Keystroke } from '@/types'


interface Author {
  id: number
  display_name: string
  bio?: string | null
  profile_url: string
}

interface Verification {
  keystroke_verified: boolean
  total_keystrokes: number
}

interface Post {
  id: number
  title: string
  content: string
  public_slug: string
  published_at: string
  word_count: number
  reading_time_minutes: number
  keystroke_count: number
  author: Author
  verification: Verification
  sample_keystrokes: Keystroke[]
  can_edit?: boolean
  dashboard_path?: string | null
}

interface MetaTags {
  title: string
  description: string
  author: string
  published_time: string
  canonical_url: string
  og_title: string
  og_description: string
  og_url: string
  og_type: string
  twitter_card: string
}

interface Props {
  post: Post
  meta: MetaTags
}

export default function PublicPostShow({ post, meta }: Props) {
  const keystrokeUrl = `/posts/${post.public_slug}/keystrokes`
  const authorDescription = post.author.bio?.trim()
    ? post.author.bio
    : "The author has not added a description yet."
  const canEdit = Boolean(post.can_edit)
  const editUrl = canEdit ? `/documents/${post.id}/edit` : null
  const dashboardUrl = post.dashboard_path ?? null

  return (
    <>
      <Head title={meta.title}>
        <meta name="description" content={meta.description} />
        <meta name="author" content={meta.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={meta.canonical_url} />
        
        {/* Print styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print { display: none !important; }
              body { font-size: 12pt; line-height: 1.4; }
              .print\\:text-black { color: black !important; }
              .print\\:text-base { font-size: 12pt !important; }
            }
          `
        }} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={meta.og_title} />
        <meta property="og:description" content={meta.og_description} />
        <meta property="og:url" content={meta.og_url} />
        <meta property="og:type" content={meta.og_type} />
        <meta property="article:published_time" content={meta.published_time} />
        <meta property="article:author" content={meta.author} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content={meta.twitter_card} />
        <meta name="twitter:title" content={meta.og_title} />
        <meta name="twitter:description" content={meta.og_description} />
        
        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": meta.description,
            "author": {
              "@type": "Person",
              "name": post.author.display_name
            },
            "datePublished": meta.published_time,
            "wordCount": post.word_count,
            "url": meta.canonical_url
          })
        }} />
      </Head>
      
      <div className="min-h-screen bg-primary/5 py-30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-12">
          {(dashboardUrl || editUrl) && (
            <div className="no-print mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              {dashboardUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 text-[#3f3422] hover:bg-white"
                >
                  <Link href={dashboardUrl}>
                    <LayoutDashboard className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              )}
              {editUrl && (
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="gap-2 bg-white/80 text-[#3f3422] hover:bg-white"
                >
                  <Link href={editUrl}>
                    <SquarePen className="h-4 w-4" />
                    Edit in Composer
                  </Link>
                </Button>
              )}
            </div>
          )}
          <article className="rounded-[40px] bg-[#fdfaf2] px-8 py-14 shadow-[0_26px_60px_-34px_rgba(50,40,20,0.4)] sm:px-14 sm:py-30 lg:px-16">
            <header className="mb-12">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-[3rem] lg:text-[3.35rem] lg:leading-[1.05]">
                {post.title}
              </h1>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground/70">
                {post.reading_time_minutes} min{post.reading_time_minutes === 1 ? '' : 's'} read
              </p>

              {post.verification.keystroke_verified && (
                <MiniGitGraph 
                  keystrokes={post.sample_keystrokes}
                  height={52}
                  className="mt-8 w-full max-w-sm cursor-pointer rounded-[12px] border border-[#e8dfcf] bg-[#f6f1e4]/70 px-3 py-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-[#d6c7ab]"
                  graphClassName="rounded-[14px] border border-[#eadfce] bg-[#fffdf6]"
                  keystrokeUrl={keystrokeUrl}
                  ariaLabel="View keystroke timeline"
                />
              )}
            </header>

            <div 
              className="prose prose-lg max-w-none text-[#3f3422]
                prose-headings:font-semibold prose-headings:text-foreground
                prose-p:text-[1.05rem] prose-p:leading-[1.85] prose-p:text-[#3f3422]
                prose-strong:text-[#2d2518]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <footer className="mt-16 border-t border-[#eadcc6] pt-9">
              <Link
                href={post.author.profile_url}
                className="text-lg font-semibold text-[#322718] transition-colors hover:text-[#8a6d44]"
              >
                {post.author.display_name}
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[#5c4d35]">
                {authorDescription}
              </p>
            </footer>
          </article>
        </div>
      </div>
    </>
  )
}
