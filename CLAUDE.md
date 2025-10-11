# Signify

This is a modern full-stack application built with Rails backend and React frontend using Inertia.js. It provides a complete authentication system and modern development toolchain.

For info on building shadcn-ui components, apps, refer to docs/shadcn-ui.md

For info on building inertia-rails apps, refer to docs/inertia-rails.md

Once you implement instructions from @prompts, make sure to update @todo.md checklist to reflect the changes. As we go through all the files in @prompts, we build a simple, lovable, complete MVP of Signify.

bin/setup to run the app.

## Architecture Overview

### Stack
- **Backend**: Rails 8+ with Inertia Rails adapter
- **Database**: SQLite (configured for Hetzner VPS deployment)
- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite with Ruby plugin
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Authentication**: Custom authentication system based on Authentication Zero
- **Testing**: RSpec for Rails, System tests with Capybara/Selenium
- **Deployment**: Kamal for Docker deployment

### Key Architecture Patterns

#### Inertia.js Integration
- **Server-side**: Controllers inherit from `InertiaController` which extends `ApplicationController`
- **Client-side**: Single-page application with server-side routing
- **Data sharing**: Global data shared via `inertia_share` in `InertiaController`
- **Layout system**: Default persistent layout with optional page-specific layouts

#### Authentication System
- **Session-based**: Uses signed cookies with `Session` model
- **User model**: BCrypt password hashing with secure token generation
- **Current context**: Thread-local `Current` object for user/session access
- **Route protection**: `authenticate` before_action in `ApplicationController`

#### Frontend Structure
- **Components**: shadcn/ui component library with custom app components
- **Layouts**: Hierarchical layout system (persistent → app → page-specific)
- **Types**: TypeScript interfaces for shared data structures
- **Hooks**: Custom React hooks for theme, flash messages, etc.

## Essential Development Commands

### Setup & Development
```bash
bin/setup                    # Initial setup (installs deps, prepares DB, starts server)
bin/dev                      # Start development server (Rails + Vite)
bin/rails server            # Rails server only
bin/vite dev                 # Vite dev server only
```

### Code Quality
```bash
npm run check               # TypeScript type checking
npm run lint                # ESLint frontend code
npm run lint:fix            # Auto-fix ESLint issues
npm run format              # Check Prettier formatting
npm run format:fix          # Auto-fix Prettier formatting
bin/rubocop                 # Ruby linting
bin/rubocop -A              # Auto-fix Ruby issues
```

### Testing
```bash
bin/rspec                   # Run all tests
bin/rspec spec/requests/    # Run request specs
bin/rspec spec/system/      # Run system tests
```

### Database
```bash
bin/rails db:migrate        # Run migrations
bin/rails db:seed           # Seed database
bin/rails db:reset          # Reset database
```

### Assets & Build
```bash
bin/vite build              # Build assets for production
bin/rails assets:precompile # Precompile assets (includes js:routes)
```

## Key Configuration Files

### Frontend Build System
- `vite.config.ts` - Vite configuration with React, Tailwind, and Ruby plugin
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript path mapping for @/ alias
- `eslint.config.js` - ESLint with TypeScript, React, and import ordering

### Rails Configuration
- `config/initializers/inertia_rails.rb` - Inertia configuration
- `config/routes.rb` - Application routes
- `Gemfile` - Ruby dependencies
- `bin/dev` - Development server orchestration

### shadcn/ui Setup
- `components.json` - shadcn/ui configuration
- `app/frontend/lib/utils.ts` - Utility functions
- `app/frontend/components/ui/` - shadcn/ui components

## Design System & Component Guidelines

### Component Architecture
```
app/frontend/components/
├── ui/                    # shadcn/ui base components (Button, Input, etc.)
├── forms/                 # Form-specific components (FormField, FormSection)
├── layout/                # Layout components (Header, Sidebar, Container)
├── feedback/              # User feedback (Toast, Alert, LoadingSpinner)
└── domain/                # Feature-specific components (DocumentCard, WriteEditor)
```

### Component Conventions

#### Base Components (shadcn/ui)
Use shadcn/ui components as the foundation:
```bash
npx shadcn@latest add button input textarea card badge alert
```

#### Custom Component Patterns
```tsx
// Component naming: PascalCase with descriptive names
export function DocumentEditor({ document, onSave }: DocumentEditorProps) {
  // Use consistent prop patterns
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{document.title || 'Untitled Document'}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  )
}

// Always define interfaces for props
interface DocumentEditorProps {
  document: Document
  onSave: (document: Document) => void
  className?: string // Always include optional className for flexibility
}
```

### Design Tokens & Styling

#### Color System
```css
/* Use CSS variables for consistent theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

#### Typography Scale
```tsx
// Use consistent typography classes
<h1 className="text-4xl font-bold tracking-tight">Page Title</h1>
<h2 className="text-2xl font-semibold tracking-tight">Section Title</h2>
<h3 className="text-lg font-medium">Subsection</h3>
<p className="text-sm text-muted-foreground">Helper text</p>
<p className="text-base leading-7">Body text</p>
```

#### Spacing System
```tsx
// Use consistent spacing patterns
<div className="space-y-6">           {/* Vertical spacing between sections */}
  <div className="space-y-4">         {/* Vertical spacing within sections */}
    <div className="flex items-center gap-2"> {/* Horizontal spacing */}
      <Button size="sm" className="px-4 py-2">Action</Button>
    </div>
  </div>
</div>

// Container patterns
<div className="container mx-auto px-4">      {/* Page containers */}
<div className="max-w-4xl mx-auto">           {/* Content width limits */}
<div className="p-6">                         {/* Card padding */}
```

### Interactive States & Feedback

#### Button States
```tsx
// Primary actions
<Button variant="default" size="default">Save Document</Button>

// Secondary actions  
<Button variant="outline" size="sm">Cancel</Button>

// Destructive actions
<Button variant="destructive" size="sm">Delete</Button>

// Loading states
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

#### Status Indicators
```tsx
// Use Badge component for status
<Badge variant="secondary">Draft</Badge>
<Badge variant="default">Published</Badge>
<Badge variant="destructive">Error</Badge>

// Save status with colors
<Badge variant={status === 'saved' ? 'default' : status === 'saving' ? 'secondary' : 'destructive'}>
  {status === 'saved' && <Check className="w-3 h-3 mr-1" />}
  {status === 'saving' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
  {statusText}
</Badge>
```

#### Form Patterns
```tsx
// Consistent form field structure
<div className="space-y-2">
  <Label htmlFor="title">Document Title</Label>
  <Input
    id="title"
    value={data.document.title}
    onChange={(e) => setData('document.title', e.target.value)}
    placeholder="Enter document title..."
    className="text-base"
  />
  {errors['document.title'] && (
    <p className="text-sm text-destructive">{errors['document.title']}</p>
  )}
</div>

// Textarea for content
<div className="space-y-2">
  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    value={data.document.content}
    onChange={(e) => setData('document.content', e.target.value)}
    placeholder="Start writing..."
    className="min-h-[400px] text-base leading-7 resize-none"
  />
</div>
```

### Layout Patterns

#### Page Structure
```tsx
// Standard page layout
export default function DocumentPage({ document }: { document: Document }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold">Signify</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page content */}
        </div>
      </main>
    </div>
  )
}
```

#### Card Layouts
```tsx
// Standard card pattern
<Card className="w-full">
  <CardHeader className="space-y-1">
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl">{document.title}</CardTitle>
      <Badge variant="secondary">{document.status}</Badge>
    </div>
    <CardDescription>
      {wordCount} words • Last saved {formatTime(document.updated_at)}
    </CardDescription>
  </CardHeader>
  
  <CardContent className="space-y-4">
    {/* Card content */}
  </CardContent>
  
  <CardFooter className="flex justify-between">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Save Changes</Button>
  </CardFooter>
</Card>
```

### Responsive Design

#### Breakpoint Usage
```tsx
// Mobile-first responsive patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
  {/* Responsive flex layouts */}
</div>

// Text scaling
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
```

#### Mobile Considerations
```tsx
// Touch-friendly button sizes
<Button size="default" className="min-h-[44px]">Mobile Friendly</Button>

// Adequate spacing for touch
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
  {/* More spacing on larger screens */}
</div>
```

### Animation & Transitions

#### Subtle Animations
```tsx
// Hover states
<Button className="transition-colors hover:bg-primary/90">
  Hover Effect
</Button>

// Loading animations
<Loader2 className="h-4 w-4 animate-spin" />

// Content transitions
<div className="transition-all duration-200 ease-in-out hover:shadow-md">
  {/* Smooth transitions */}
</div>
```

### Accessibility Guidelines

#### Semantic HTML
```tsx
// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

// Form accessibility
<Label htmlFor="document-title">Document Title</Label>
<Input 
  id="document-title"
  aria-describedby="title-help"
  aria-invalid={!!errors['document.title']}
/>
<p id="title-help" className="text-sm text-muted-foreground">
  Choose a descriptive title for your document
</p>
```

#### Keyboard Navigation
```tsx
// Focus management
<Button 
  autoFocus={isFirstAction}
  onKeyDown={(e) => {
    if (e.key === 'Escape') handleCancel()
  }}
>
  Action Button
</Button>
```

### Component Testing Patterns

#### Component Test Structure
```tsx
// Test essential component behaviors
describe('DocumentEditor', () => {
  it('renders document title and content', () => {
    render(<DocumentEditor document={mockDocument} onSave={jest.fn()} />)
    expect(screen.getByDisplayValue(mockDocument.title)).toBeInTheDocument()
  })
  
  it('calls onSave when save button is clicked', async () => {
    const onSave = jest.fn()
    render(<DocumentEditor document={mockDocument} onSave={onSave} />)
    
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      title: mockDocument.title
    }))
  })
})
```

### Component Documentation

#### Props Documentation
```tsx
/**
 * A comprehensive document editor with auto-save functionality
 * 
 * @param document - The document to edit
 * @param onSave - Callback when document is saved
 * @param className - Additional CSS classes
 * @param autoSaveInterval - Auto-save interval in milliseconds (default: 30000)
 */
export function DocumentEditor({
  document,
  onSave,
  className,
  autoSaveInterval = 30000
}: DocumentEditorProps) {
  // Component implementation
}
```

### Performance Considerations

#### Component Optimization
```tsx
// Memoize expensive components
const DocumentCard = memo(function DocumentCard({ document }: { document: Document }) {
  return (
    <Card>
      {/* Component content */}
    </Card>
  )
})

// Optimize event handlers
const handleSave = useCallback(async () => {
  await onSave(document)
}, [document, onSave])
```

### Error Boundaries

#### Error Handling Pattern
```tsx
// Wrap components in error boundaries
<ErrorBoundary fallback={<ErrorMessage />}>
  <DocumentEditor document={document} onSave={handleSave} />
</ErrorBoundary>

// Error display component
function ErrorMessage({ error }: { error?: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        {error?.message || 'An unexpected error occurred'}
      </AlertDescription>
    </Alert>
  )
}
```

## Important Patterns & Conventions

### File Organization
```
app/
├── controllers/           # Rails controllers
│   ├── application_controller.rb
│   ├── inertia_controller.rb  # Base for Inertia pages
│   └── ...
├── frontend/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # App-specific components
│   ├── entrypoints/      # Vite entry points
│   │   ├── inertia.ts    # Main Inertia app setup
│   │   └── application.css
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Inertia page components
│   ├── types/            # TypeScript type definitions
│   └── lib/              # Utility functions
└── models/               # Rails models
```

### Inertia Page Creation
1. Create Rails controller action that renders Inertia response
2. Create React component in `app/frontend/pages/` matching controller path
3. Component automatically gets persistent layout unless overridden

### Authentication Flow
- Unauthenticated users redirected to `/sign_in`
- Authentication state available in all Inertia pages via shared `auth` prop
- Current user/session accessible in controllers via `Current.user`/`Current.session`

### Styling Conventions
- Use Tailwind CSS classes for styling
- shadcn/ui components for complex UI elements
- CSS variables for theming (light/dark mode support)
- Custom CSS in `application.css` for global styles

### Testing Patterns
- **Request specs**: Test controller actions and API responses
- **System specs**: Full-stack browser testing with Capybara
- **Factory Bot**: Test data generation
- **Authentication helpers**: Provided for testing authenticated flows

## Development Workflow

### Adding New Features
1. Create Rails routes and controller actions
2. Add Inertia page components in `frontend/pages/`
3. Add necessary types to `frontend/types/index.ts`
4. Write tests (request + system specs)
5. Run linting and type checking

### Adding UI Components
1. Use `npx shadcn@latest add <component>` for shadcn/ui components
2. Create custom components in `frontend/components/`
3. Follow TypeScript and React best practices
4. Ensure responsive design with Tailwind

### Database Changes
1. Generate migration: `bin/rails generate migration`
2. Update models and add validations
3. Update TypeScript types if data structure changes
4. Update tests and factories

## SSR Support (Optional)

SSR is disabled by default but can be enabled:
1. Uncomment hydration code in `app/frontend/entrypoints/inertia.ts`
2. Update deployment configuration in `config/deploy.yml`
3. Use `Dockerfile-ssr` for SSR builds

## Deployment

### Using Kamal
```bash
bin/kamal setup             # Initial deployment setup
bin/kamal deploy            # Deploy application
bin/kamal app logs          # View application logs
```

### Manual Deployment
1. Build assets: `bin/rails assets:precompile`
2. Run migrations: `bin/rails db:migrate`
3. Start application with production settings

## Security Considerations

- CSRF protection enabled by default
- Secure password requirements (minimum 12 characters)
- Session-based authentication with signed cookies
- Email verification for new accounts
- Password reset with time-limited tokens
- Modern browser requirements enforced

## Performance Notes

- Vite provides fast HMR in development
- Assets are fingerprinted and cached in production
- Inertia provides SPA-like navigation without full page reloads
- Tailwind CSS is purged in production builds
- Optional SSR for improved initial page load

## Dependency Management Notes
- The package-lock.json and docs/inertia-rails.md references are lower priority and can be updated when dependencies are reinstalled or docs are regenerated.

## Memory Log

### System Testing
- System tests need to work with inertia.js and should use selenium headless for the same purposes.

### Document CRUD Implementation Learnings
- **Controller before_action scope**: Only include actions that actually exist in before_action callbacks (e.g., avoid `:show` if no show action exists)
- **Model validations with defaults**: Always provide default values for required enum fields via before_validation callbacks
- **Authentication helpers for request specs**: Use `request.cookie_jar.signed[:session_token]` for request specs, not direct cookie access
- **Inertia controller patterns**: Use redirects for successful POST/PATCH/DELETE actions, render inertia for GET and failed validations
- **Test database changes**: Use `Document.count` instead of `user.documents.count` in change expectations for better reliability

## Development Patterns from Step 3 Implementation

### CRUD Controller Best Practices
```ruby
# Good pattern for Inertia controllers
class DocumentsController < InertiaController
  before_action :set_document, only: [:edit, :update, :destroy] # Only existing actions
  
  def create
    @document = Current.user.documents.build(document_params)
    if @document.save
      redirect_to edit_document_path(@document), notice: "Created successfully."
    else
      render inertia: "documents/new", props: inertia_errors(@document)
    end
  end
  
  def update
    if @document.update(document_params)
      render json: { document: document_json(@document), flash: { success: "Saved." } }
    else
      render json: inertia_errors(@document), status: :unprocessable_content
    end
  end
end
```

### Model Pattern for Enums with Defaults
```ruby
class Document < ApplicationRecord
  enum :status, {draft: 0, published: 1}
  validates :status, presence: true
  before_validation :set_default_status, if: -> { status.blank? }
  
  private
  def set_default_status
    self.status = :draft
  end
end
```

### React Component Patterns for Inertia
```tsx
// Auto-save pattern
const { data, setData, patch, processing } = useForm({ title: document.title })
const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

useEffect(() => {
  if (data.title !== document.title) {
    setSaveStatus('unsaved')
    const timeout = setTimeout(() => handleSave(), 2000)
    return () => clearTimeout(timeout)
  }
}, [data.title])

// Word count pattern
const [wordCount, setWordCount] = useState(0)
useEffect(() => {
  const words = data.content.trim() ? data.content.trim().split(/\s+/).length : 0
  setWordCount(words)
}, [data.content])
```

### Testing Authentication in Request Specs
```ruby
# spec/support/authentication_helpers.rb
def sign_in_as(user)
  session = user.sessions.create!
  if respond_to?(:request) && request.respond_to?(:cookie_jar)
    request.cookie_jar.signed[:session_token] = session.id
  end
end
```

### Route Generation After Model Changes
```bash
# Always regenerate JS routes after adding new resource routes
bin/rails js:routes
```

### TypeScript Interface Updates
```tsx
// Always update types when adding new models
export interface Document {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  content: string
  word_count: number
  created_at: string
  updated_at: string
}
```

### Comprehensive Testing Strategy
1. **Request specs**: Test all CRUD operations, authentication, authorization
2. **System specs**: Test complete user workflows with browser simulation
3. **Authorization tests**: Ensure users can't access other users' resources
4. **Validation tests**: Test both success and failure scenarios

## Inertia.js + Rails Integration Learnings

### Auto-Save and AJAX Patterns

**Problem**: Inertia.js is designed for full-page navigation, but auto-save features need AJAX-style requests without page transitions.

**Solution**: Use hybrid approach based on request type:
```ruby
# Controller pattern for handling both Inertia and AJAX requests
def update
  if @document.update(document_params)
    if request.xhr?
      # AJAX requests (auto-save) - return JSON
      render json: {
        document: document_json(@document),
        flash: { success: "Document saved." }
      }
    else
      # Form submissions - use Inertia redirect
      redirect_to edit_document_path(@document), notice: "Document saved."
    end
  else
    if request.xhr?
      render json: inertia_errors(@document), status: :unprocessable_content
    else
      render inertia: "documents/edit", props: {
        document: document_json(@document),
        **inertia_errors(@document)
      }
    end
  end
end
```

**Frontend implementation**:
```tsx
// Use fetch() for auto-save with proper headers
const handleSave = async () => {
  const response = await fetch(documentPath({ id: document.id }), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': window.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      'X-Requested-With': 'XMLHttpRequest' // Key for Rails to detect AJAX
    },
    body: JSON.stringify({
      document: { title: data.document.title, content: data.document.content }
    })
  })
}
```

### Parameter Conventions and Form Data Structure

**Critical**: Rails expects nested parameters (`document: {title, content}`) but Inertia forms can send flat parameters.

**Best Practice**: Always structure useForm data to match Rails strong parameters:
```tsx
// ✅ Correct - matches Rails params.require(:document).permit(:title, :content)
const { data, setData } = useForm({
  document: {
    title: document.title,
    content: document.content,
  },
})

// ❌ Wrong - sends flat parameters that don't match Rails expectations
const { data, setData } = useForm({
  title: document.title,
  content: document.content,
})
```

**Form field binding**:
```tsx
// Use nested setData calls
onChange={(e) => setData('document.title', e.target.value)}
// Reference nested data
value={data.document.title}
// Handle nested errors
{errors['document.title'] && <p>{errors['document.title']}</p>}
```

### Variable Naming Conflicts in React Components

**Problem**: Component props can conflict with global objects (e.g., `document` prop vs `window.document`).

**Solution**: Always be explicit when accessing global objects:
```tsx
// ✅ Correct - explicit reference to DOM document
'X-CSRF-Token': window.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

// ❌ Wrong - conflicts with component prop named 'document'
'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
```

### Response Format Consistency

**Key Principle**: All Inertia requests must receive Inertia responses, AJAX requests get JSON.

**Detection Pattern**:
- Use `request.xhr?` in Rails controllers to detect AJAX requests
- Set `X-Requested-With: XMLHttpRequest` header in fetch requests
- Never mix JSON responses with Inertia requests without proper detection

### State Management for Auto-Save Features

**Pattern**: Separate UI state from form state for better UX:
```tsx
// Form state (Inertia)
const { data, setData } = useForm({ document: { title, content } })

// UI state (local)
const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
const [wordCount, setWordCount] = useState(0)

// Don't mix Inertia's 'processing' state with custom save states
// Use saveStatus for button disabling, not processing
disabled={saveStatus === 'saving' || saveStatus === 'saved'}
```

### Error Handling and Debugging

**Always include**:
- Console logging for AJAX requests
- Proper error boundaries
- Network error handling
- Status code checking

```tsx
try {
  const response = await fetch(url, options)
  if (response.ok) {
    const result = await response.json()
    console.log('Success:', result) // Helpful for debugging
  } else {
    console.error('Save failed:', response.status, response.statusText)
  }
} catch (error) {
  console.error('Network error:', error)
}
```

### Testing Auto-Save Features

**System Test Considerations**:
- Test both manual save and auto-save functionality
- Verify proper state transitions (unsaved → saving → saved)
- Test network failure scenarios
- Ensure CSRF protection works with AJAX requests

## Auto-Save System Implementation (Step 7)

### Key Features Implemented
- **Auto-save timer**: 30-second intervals with intelligent pausing during user activity
- **Visual status indicators**: Typing, Saving, Saved, Error states with timestamps
- **Robust error handling**: Automatic retry logic (3 attempts) with manual retry option
- **Optimized operations**: Change detection to prevent unnecessary saves
- **Comprehensive hook**: Reusable `useAutoSave` hook for timer and state management

### Auto-Save Hook Architecture

```typescript
// useAutoSave.ts - Complete auto-save solution
const autoSave = useAutoSave({
  saveInterval: 30000,        // 30 seconds
  typingIndicatorDelay: 1000, // 1 second
  retryAttempts: 3,
  retryDelay: 2000,          // 2 seconds
  onSave: async (saveData) => {
    // Custom save implementation
    const response = await fetch(url, { ... })
    return response.ok
  },
  onError: (error, attempt) => {
    console.error(`Save attempt ${attempt} failed:`, error)
  }
})

// Usage in components
useEffect(() => {
  autoSave.updateData({
    document: { title, content },
    keystrokes: keystrokeData,
    paste_attempts: pasteAttemptData
  })
}, [title, content])
```

### Smart Auto-Save Behavior
- **Typing detection**: Shows "Typing..." immediately when user starts typing
- **Activity-aware**: Pauses auto-save while user is actively typing
- **Change detection**: Only saves when content actually changes
- **Network resilience**: Automatic retries with exponential backoff
- **Manual override**: Save button for immediate saves
- **Error recovery**: Retry button when auto-save fails

### Status Management
```typescript
// Status states with appropriate UI feedback
type SaveStatus = 'typing' | 'saving' | 'saved' | 'error'

// Visual indicators with proper colors
getSaveStatusColor() // 'secondary' | 'default' | 'destructive'
getSaveStatusText()  // 'Typing...' | 'Saving...' | 'Saved at 2:34 PM' | 'Error saving (attempt 2/3)'
```

### Integration with Keystroke Capture
The auto-save system seamlessly integrates with keystroke capture and paste prevention:
- Transmits keystroke data with each save
- Includes paste attempt logs
- Maintains data integrity across save operations
- Batches keystroke data efficiently

### Performance Optimizations
- **Debounced updates**: Prevents excessive API calls
- **Timer management**: Proper cleanup to prevent memory leaks
- **State batching**: Efficient React state updates
- **Network optimization**: Only sends changed data

### Testing Strategy
- **Unit tests**: Hook behavior and state management
- **System tests**: Full auto-save workflow with browser simulation
- **Error scenarios**: Network failures and retry logic
- **Integration tests**: Keystroke data transmission

### Important Learnings and Future App Instructions
- Always create a comprehensive README.md with setup, development, and deployment instructions
- Implement a robust authentication system with secure password hashing and token management
- Use TypeScript for type safety and improved developer experience
- Leverage Inertia.js for seamless server-side routing and data sharing
- Utilize shadcn/ui for consistent and customizable UI components
- Implement comprehensive testing with RSpec and system tests
- Follow a modular and scalable file structure for frontend and backend
- Use Tailwind CSS for rapid and responsive styling
- Set up CI/CD pipelines for automated testing and deployment
- Implement performance optimizations like asset caching and HMR
- Always consider security best practices in authentication and data handling
- **Auto-save systems**: Create reusable hooks with proper timer management and error handling
- **User feedback**: Always provide clear visual indicators for save states
- **Network resilience**: Implement retry logic for unreliable connections
- **Data integrity**: Ensure keystroke and content data are saved together atomically