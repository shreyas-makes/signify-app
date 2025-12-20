import {
  Calendar,
  Eye, 
  FileText, 
  Globe, 
  Keyboard,
  Shield, 
  TrendingUp, 
  Users
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: number
  name: string
  display_name: string
  email: string
  verified: boolean
  admin: boolean
  documents_count: number
  published_count: number
  total_keystrokes: number
  created_at: string
  last_session: string | null
}

interface Document {
  id: number
  title: string
  slug: string
  public_slug: string | null
  status: string
  word_count: number
  keystroke_count: number
  created_at: string
  updated_at: string
  published_at: string | null
  user: {
    id: number
    name: string
    display_name: string
  }
}

interface Post {
  id: number
  title: string
  public_slug: string
  word_count: number
  keystroke_count: number
  published_at: string
  user: {
    id: number
    display_name: string
  }
}

interface Stats {
  total_users: number
  total_documents: number
  published_posts: number
  total_keystrokes: number
  users_today: number
  documents_today: number
  posts_published_today: number
}

interface Props {
  users: User[]
  documents: Document[]
  recent_posts: Post[]
  stats: Stats
}

export default function AdminDashboard({ users, documents, recent_posts, stats }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Dashboard
            </h1>
            <Badge variant="destructive">Admin Access</Badge>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.total_users)}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.users_today} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.total_documents)}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.documents_today} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.published_posts)}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.posts_published_today} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keystrokes</CardTitle>
              <Keyboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.total_keystrokes)}</div>
              <p className="text-xs text-muted-foreground">
                Verification data points
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{user.display_name}</p>
                      <p className="break-words text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        {user.verified && <Badge variant="default" className="text-xs">Verified</Badge>}
                        {user.admin && <Badge variant="destructive" className="text-xs">Admin</Badge>}
                      </div>
                    </div>
                    <div className="text-left text-sm sm:text-right">
                      <p>{user.documents_count} docs</p>
                      <p className="text-muted-foreground">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                All Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents have been created yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[720px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Words</TableHead>
                        <TableHead>Keystrokes</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Public Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium max-w-[220px] truncate">
                            {document.title || "Untitled Document"}
                          </TableCell>
                          <TableCell>{document.user.display_name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={document.status === "published" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {document.status.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatNumber(document.word_count)}</TableCell>
                          <TableCell>{formatNumber(document.keystroke_count)}</TableCell>
                          <TableCell>{formatDate(document.created_at)}</TableCell>
                          <TableCell>{formatDate(document.updated_at)}</TableCell>
                          <TableCell className="text-right">
                            {document.public_slug ? (
                              <a
                                href={`/posts/${document.public_slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Published Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Recently Published Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {recent_posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">by {post.user.display_name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{formatNumber(post.word_count)} words</span>
                      <span>{formatNumber(post.keystroke_count)} keystrokes</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                    <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                      <a href={`/posts/${post.public_slug}`} target="_blank" rel="noreferrer">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                    <div className="text-left text-sm sm:text-right">
                      <p className="text-muted-foreground">{formatDate(post.published_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                View Analytics
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                Export Data
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                View Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
