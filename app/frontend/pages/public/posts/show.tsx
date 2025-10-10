import { Head, router } from '@inertiajs/react'
import { ArrowLeft, BookOpen, CheckCircle, Clock, Facebook, Keyboard, LinkIcon, Linkedin, Play, Shield, TrendingUp, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MiniGitGraph } from '@/components/ui/mini-git-graph'
import type { Keystroke } from '@/types'


interface Author {
  display_name: string
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
  const [readingProgress, setReadingProgress] = useState(0)
  const [copyLinkText, setCopyLinkText] = useState('Copy Link')
  const shareUrl = meta.og_url
  const shareText = `Check out "${post.title}" by ${post.author.display_name} on Signify`

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = async (platform: string) => {
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl)
          setCopyLinkText('Copied!')
          setTimeout(() => setCopyLinkText('Copy Link'), 2000)
        } catch (err) {
          console.error('Failed to copy link:', err)
        }
        return
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const handleViewKeystrokeTimeline = () => {
    router.visit(`/posts/${post.public_slug}/keystrokes`)
  }

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
      
      <div className="min-h-screen bg-background">
        {/* Reading Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150 no-print"
          style={{ width: `${readingProgress}%` }}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation */}
          <div className="mb-8 no-print">
            <Button 
              variant="ghost" 
              onClick={() => router.visit('/posts')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <span className="text-lg">By {post.author.display_name}</span>
              <span>•</span>
              <span>{post.published_at}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {post.word_count.toLocaleString()} words
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.reading_time_minutes} min read
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Keyboard className="h-4 w-4" />
                {post.keystroke_count.toLocaleString()} keystrokes
              </div>
            </div>

            {/* Enhanced Verification Section */}
            {post.verification.keystroke_verified && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Human Verified
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-green-700 mb-3">
                          This content was written with <strong>{post.verification.total_keystrokes.toLocaleString()} verified keystrokes</strong>, 
                          ensuring authentic human authorship without AI assistance.
                        </p>
                        
                        {/* Enhanced Writing Pattern Fingerprint */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-green-700">Writing Pattern Fingerprint:</span>
                          </div>
                          <div className="bg-card/80 rounded-lg p-3 border border-green-200 shadow-sm">
                            <div className="flex items-center justify-center">
                              <MiniGitGraph 
                                keystrokes={post.sample_keystrokes} 
                                width={160} 
                                height={50}
                                className="mx-auto"
                              />
                            </div>
                            <div className="text-xs text-green-600 text-center mt-2 font-medium">
                              Unique typing signature
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-green-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Real-time verification</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Keyboard className="h-3 w-3" />
                            <span>Every keystroke tracked</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Tamper-proof</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewKeystrokeTimeline}
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        View Full Timeline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </header>

          {/* Article Content */}
          <article 
            className="prose prose-lg max-w-none mb-12 print:text-black"
            role="main"
            aria-label="Article content"
          >
            <div 
              className="text-foreground leading-relaxed font-serif text-lg sm:text-xl print:text-base"
              style={{ 
                lineHeight: '1.7',
                letterSpacing: '0.01em'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Enhanced Share Section */}
          <div className="border-t pt-8 no-print">
            <h3 className="text-lg font-semibold text-foreground mb-4">Share this verified content</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => void handleShare('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-500" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => void handleShare('linkedin')}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4 text-blue-600" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => void handleShare('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => void handleShare('copy')}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                {copyLinkText}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Help others discover authentic, human-generated content verified by keystroke tracking.
            </p>
          </div>

          {/* Enhanced Author Section */}
          <div className="border-t pt-8 mt-8">
            <div className="bg-gradient-to-r from-muted/50 to-primary/10 rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {post.author.display_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{post.author.display_name}</h3>
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Writer
                    </Badge>
                  </div>
                  <p className="text-foreground/80 mb-3">
                    A verified writer on Signify, committed to creating authentic human-generated content 
                    without AI assistance. Every keystroke is tracked and verified for content authenticity.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Human-verified content</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Keyboard className="h-4 w-4 text-primary" />
                      <span>Keystroke authenticated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="text-center mt-12 pt-8 border-t no-print">
            <Button 
              onClick={() => router.visit('/posts')}
              className="px-6"
            >
              Explore More Posts
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}