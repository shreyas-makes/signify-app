# Signify

This is a modern full-stack application built with Rails backend and React frontend using Inertia.js. It provides a complete authentication system and modern development toolchain.

For info on building shadcn-ui components, apps, refer to docs/shadcn-ui.md

For info on building inertia-rails apps, refer to docs/inertia-rails.md

Once you implement instructions from @prompts, make sure to update @todo.md checklist to reflect the changes.

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