import { router } from "@inertiajs/react"
import { FileText, Globe, Keyboard, Shield, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"

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
  hidden_from_public: boolean
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
  stats: Stats
}

export default function AdminDashboard({ users, documents, stats }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const togglePublicVisibility = (document: Document) => {
    router.patch(
      `/admin/documents/${document.id}`,
      { hidden_from_public: !document.hidden_from_public },
      { preserveScroll: true }
    )
  }

  return (
    <AppLayout>
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            Admin Dashboard
          </h1>
      
        </div>

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

        <div className="space-y-8">
          {/* All Documents */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Documents
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Curate which published posts appear on the public library.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatNumber(documents.length)} total
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No published documents yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Words</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="py-4 font-medium max-w-[260px] truncate">
                            {document.title || "Untitled Document"}
                          </TableCell>
                          <TableCell className="py-4">{document.user.display_name}</TableCell>
                          <TableCell className="py-4">{formatNumber(document.word_count)}</TableCell>
                          <TableCell className="py-4">{formatDate(document.updated_at)}</TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                              {document.public_slug ? (
                                <a
                                  href={`/posts/${document.public_slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                              <Button
                                size="sm"
                                variant={document.hidden_from_public ? "default" : "outline"}
                                onClick={() => togglePublicVisibility(document)}
                              >
                                {document.hidden_from_public ? "Show on public" : "Hide from public"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium">{user.display_name}</p>
                        <p className="break-words text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{user.documents_count} docs</span>
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.verified && <Badge className="text-xs">Verified</Badge>}
                      {user.admin && <Badge variant="destructive" className="text-xs">Admin</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  )
}
