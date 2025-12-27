import { Head, Link, usePage } from '@inertiajs/react'
import { SquarePen } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { AppHeader } from '@/components/app-header'
import { PublicPostFooter } from '@/components/public-post-footer'
import { Button } from '@/components/ui/button'
import { MiniGitGraph } from '@/components/ui/mini-git-graph'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import AppLayout from '@/layouts/app-layout'
import type { Keystroke, PageProps } from '@/types'


interface Author {
  id: number
  name: string
  display_name: string
  avatar_url?: string | null
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
  subtitle?: string | null
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
  og_image: string
  og_type: string
  twitter_card: string
}

interface Props {
  post: Post
  meta: MetaTags
}

export default function PublicPostShow({ post, meta }: Props) {
  const { auth } = usePage<PageProps>().props
  const isSignedIn = Boolean(auth?.user)
  const getInitials = useInitials()
  const keystrokeUrl = `/posts/${post.public_slug}/keystrokes`
  const authorDescription = post.author.bio?.trim()
    ? post.author.bio
    : "The author has not added a description yet."
  const canEdit = Boolean(post.can_edit)
  const editUrl = canEdit ? `/documents/${post.id}/edit` : null
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [isNavScrolled, setIsNavScrolled] = useState(false)
  const navVisible = isNavHovered || isNavScrolled
  const authorHeaderName = post.author.name?.trim() ? post.author.name : post.author.display_name
  const authorInitials = useMemo(() => getInitials(authorHeaderName), [getInitials, authorHeaderName])
  const publishedDate = useMemo(() => {
    if (!meta?.published_time) {
      return post.published_at
    }

    const parsed = new Date(meta.published_time)
    if (Number.isNaN(parsed.valueOf())) {
      return post.published_at
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [meta?.published_time, post.published_at])

  useEffect(() => {
    if (!isSignedIn || typeof window === 'undefined') {
      return
    }

    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 16)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSignedIn])
  const headMarkup = (
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
      <meta property="og:image" content={meta.og_image} />
      <meta property="og:type" content={meta.og_type} />
      <meta property="article:published_time" content={meta.published_time} />
      <meta property="article:author" content={meta.author} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content={meta.twitter_card} />
      <meta name="twitter:title" content={meta.og_title} />
      <meta name="twitter:description" content={meta.og_description} />
      <meta name="twitter:image" content={meta.og_image} />

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
  )

  const articleContent = (
    <div className="mx-auto w-full max-w-6xl px-4 pb-6 pt-16 sm:px-6 lg:px-8">
      <article className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <header className="flex w-full flex-col items-center text-center">
          <Avatar className="h-14 w-14 overflow-hidden border border-[#e3d6c3] shadow-[0_12px_30px_rgba(52,40,21,0.08)] sm:h-16 sm:w-16">
            <AvatarImage src={post.author.avatar_url ?? undefined} alt={authorHeaderName} />
            <AvatarFallback className="bg-[#f3ede0] text-xs font-semibold text-[#7c6b51]">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[#8a7a60] sm:mt-6 sm:text-[0.75rem] sm:tracking-[0.45em]">
            {authorHeaderName}
          </p>
          <p className="mt-1 text-sm text-[#9a8a73] sm:mt-2">{publishedDate}</p>
          <h1 className="mt-5 text-[2.2rem] font-semibold leading-[1.1] text-[#2f2416] sm:mt-8 sm:text-[3.1rem] lg:text-[3.4rem]">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-3 max-w-2xl text-lg text-[#6b5a41] sm:mt-4 sm:text-xl">
              {post.subtitle}
            </p>
          )}
          {post.sample_keystrokes.length > 0 && (
            <MiniGitGraph
              keystrokes={post.sample_keystrokes}
              height={52}
              label="Keystroke activity"
              ctaText="View timeline ↗"
              className="mt-5 w-full max-w-[18rem] cursor-pointer rounded-[12px] border border-[#e8dfcf] bg-[#f6f1e4]/70 px-2 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-[#d6c7ab] sm:mt-8 sm:max-w-sm sm:px-3 sm:py-3"
              graphClassName="rounded-[14px] border border-[#eadfce] bg-[#fffdf6]"
              keystrokeUrl={keystrokeUrl}
              ariaLabel="View keystroke timeline"
            />
          )}
        </header>

        <div className="mt-12 w-full text-left">
          <div
            className="prose prose-lg max-w-none text-[#3f3422]
              prose-headings:font-semibold prose-headings:text-[#322718]
              prose-blockquote:border-l-[#eadcc6] prose-blockquote:text-[#5c4d35]
              prose-p:text-[1.05rem] prose-p:leading-[1.85] prose-p:text-[#3f3422]
              prose-strong:text-[#2d2518] whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-12 w-full text-center">
          <a
            href="http://www.signifywriting.com"
            className="text-sm font-medium text-[#8f7d61] transition hover:text-[#8a6d44]"
          >
            This post was written by a human
          </a>
          <div className="mx-auto mt-5 h-px w-28 bg-[#eadcc6]" />
        </div>

        <div className="mt-10 w-full text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#9b8a70]">
            About {post.author.display_name}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-[#5c4d35]">
            {authorDescription}
          </p>
        </div>
      </article>
    </div>
  )

  const publicShell = (
    <div className="min-h-screen bg-white">
      {articleContent}
      <PublicPostFooter />
    </div>
  )

  const signedInNav = (
    <div
      className="fixed left-0 right-0 top-0 z-40"
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
    >
      <div
        className={[
          'transition-all duration-300',
          navVisible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
        ].join(' ')}
      >
        <div className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <AppHeader />
        </div>
      </div>
    </div>
  )

  const editButton = editUrl ? (
    <div className="no-print fixed bottom-6 right-6 z-40">
      <Button
        asChild
        size="icon"
        className="h-11 w-11 rounded-full border border-black bg-black text-white shadow-lg transition hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
      >
        <Link href={editUrl} aria-label="Edit in Composer">
          <SquarePen className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  ) : null

  return isSignedIn ? (
    <AppLayout showHeader={false} showFooter={false} contentClassName="max-w-none px-0">
      {headMarkup}
      {signedInNav}
      <div className="min-h-screen bg-background">
        {articleContent}
        <PublicPostFooter />
      </div>
      {editButton}
    </AppLayout>
  ) : (
    <>
      {headMarkup}
      {publicShell}
      {editButton}
    </>
  )
}
