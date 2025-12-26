import type { LucideIcon } from "lucide-react"

export interface Auth {
  user: User
  session: Pick<Session, "id">
}

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon | null
  isActive?: boolean
}

export interface Flash {
  alert?: string
  notice?: string
}

export interface SharedData {
  auth: Auth
  flash: Flash
  [key: string]: unknown
}

export interface PageProps {
  auth?: Auth
  flash?: Flash
  [key: string]: unknown
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  avatar_url?: string | null
  avatar_image_url?: string | null
  display_name: string
  bio?: string | null
  verified: boolean
  admin: boolean
  created_at: string
  updated_at: string
  [key: string]: unknown // This allows for additional properties...
}

export interface Session {
  id: string
  user_agent: string
  ip_address: string
  created_at: string
}

export interface Document {
  id: number
  title: string
  subtitle?: string | null
  slug: string
  public_slug?: string
  status: 'draft' | 'ready_to_publish' | 'published'
  content: string
  word_count: number
  reading_time_minutes: number
  keystroke_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface DocumentFilters {
  search: string
  status: string
  sort: string
  direction: string
}

export interface DocumentPagination {
  current_page: number
  total_pages: number
  total_documents: number
  per_page: number
}

export interface DocumentStatistics {
  total_documents: number
  draft_count: number
  ready_to_publish_count: number
  published_count: number
  total_words: number
  total_keystrokes: number
  avg_reading_time: number
}

export interface Keystroke {
  id: number
  event_type: 'keydown' | 'keyup'
  key_code: number
  character: string | null
  timestamp: number // milliseconds
  cursor_position: number
  sequence_number: number
}

export interface TypingStatistics {
  total_keystrokes: number
  average_wpm: number
  total_time_seconds: number
  pause_count: number
  backspace_count: number
  correction_count: number
}

export interface TimelineEvent {
  timestamp: number
  type: 'typing' | 'pause' | 'correction'
  duration?: number
  keystrokes?: number
  words?: number
}

export interface GitCommit {
  id: string
  timestamp: number
  type: 'typing' | 'pause' | 'correction' | 'milestone'
  keystrokes: number
  duration: number
  displayDuration?: number
  position: { x: number; y: number }
  branches: string[]
  intensity: number
}

export interface GitBranch {
  id: string
  fromCommit: string
  toCommit: string
  type: 'main' | 'correction' | 'merge'
  intensity: number
}
