import { Head, router, usePage } from '@inertiajs/react'
import { Search, Verified, Clock3, FileText, X } from 'lucide-react'
import type React from 'react';
import { useState, useRef, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import type { PageProps } from '@/types'


interface Author {
  display_name: string
}

interface Post {
  id: number
  title: string
  public_slug: string
  published_at: string
  word_count: number
  reading_time_minutes: number
  author: Author
  excerpt: string
}

interface Props {
  posts: Post[]
  search?: string | null
}

export default function PublicPostsIndex({ posts, search = '' }: Props) {
  const [searchQuery, setSearchQuery] = useState(search ?? '')
  const [isSearchExpanded, setIsSearchExpanded] = useState(!!search)
  const { auth } = usePage<PageProps>().props
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = searchQuery.trim() ? { search: searchQuery.trim() } : {}
    router.get('/posts', params, {
      preserveState: true,
      replace: true
    })
  }

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else if (!searchQuery) {
      // If collapsing and no search query, clear any existing search
      router.get('/posts', {}, {
        preserveState: true,
        replace: true
      })
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearchExpanded(false)
    router.get('/posts', {}, {
      preserveState: true,
      replace: true
    })
  }

  const visitPost = (publicSlug: string) => {
    router.visit(`/posts/${publicSlug}`)
  }

  // Auto-expand if there's a search query from URL
  useEffect(() => {
    if (search) {
      setIsSearchExpanded(true)
    }
  }, [search])

  // Clear search when query becomes empty
  useEffect(() => {
    if (searchQuery === '' && search) {
      // If the local search query is empty but URL still has search param, clear it
      router.get('/posts', {}, {
        preserveState: true,
        replace: true
      })
    }
  }, [searchQuery, search])

  const pageContent = (
    <>
      <Head title="Discover - Signify" />
      
      <div className="min-h-screen bg-background">
        <div className="mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl font-medium text-foreground mb-2">
                  Discover
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Latest verified human-written posts
                </p>
              </div>
              
              {/* Search Toggle */}
              <div className="flex items-center gap-2">
                {!isSearchExpanded ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSearch}
                    className="h-9 w-9 p-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-48 sm:w-64 text-sm border-muted"
                        onBlur={(e) => {
                          // Only collapse if no search query and not clicking on clear button
                          if (!searchQuery && e.relatedTarget?.getAttribute('data-search-action') !== 'clear') {
                            setIsSearchExpanded(false)
                          }
                        }}
                      />
                    </form>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-9 w-9 p-0"
                        data-search-action="clear"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {search ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {search 
                  ? 'Try adjusting your search terms.'
                  : 'Check back later for published content.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {posts.map((post, index) => (
                <article 
                  key={post.id} 
                  className="group cursor-pointer border-b border-border pb-6 sm:pb-8 last:border-b-0"
                  onClick={() => visitPost(post.public_slug)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-5 sm:w-6 text-right">
                      <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span className="font-medium">{post.author.display_name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{post.published_at}</span>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Clock3 className="h-3 w-3" />
                          <span>{post.reading_time_minutes}m</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Verified className="h-3 w-3 text-green-600" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                onClick={() => router.visit('/')}
                className="text-muted-foreground hover:text-foreground px-0 self-start"
              >
                ← Back to Home
              </Button>
              <span className="text-xs sm:text-sm">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return auth?.user ? (
    <AppLayout>
      {pageContent}
    </AppLayout>
  ) : pageContent
}
