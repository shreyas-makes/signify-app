import { Head, router } from '@inertiajs/react'
import { BookOpen, CheckCircle, Clock, Search } from 'lucide-react'
import type React from 'react';
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'


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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.get('/posts', { search: searchQuery }, {
      preserveState: true,
      replace: true
    })
  }

  const visitPost = (publicSlug: string) => {
    router.visit(`/posts/${publicSlug}`)
  }

  return (
    <>
      <Head title="Published Posts - Signify" />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Published Posts
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover verified human-written content on Signify
            </p>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-gray-600">
                {search 
                  ? 'Try adjusting your search terms.'
                  : 'Check back later for published content.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => visitPost(post.public_slug)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>By {post.author.display_name}</span>
                          <span>{post.published_at}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {post.word_count.toLocaleString()} words
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.reading_time_minutes} min read
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Back to Home */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              onClick={() => router.visit('/')}
              className="px-6"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}