# Signify MVP - Product Requirements Document

## Vision
Signify proves content is 100% human-written through keystroke verification. Writers type in our editor, readers see the complete keystroke timeline.

## Core Value Proposition
- **For Writers**: Prove authenticity with transparent keystroke capture
- **For Readers**: See undeniable proof of human typing through visual timeline

## MVP Scope (Simple, Lovable, Complete)

### What We're Building
A focused writing platform with one killer feature: keystroke-by-keystroke proof of human authorship.

### What We're NOT Building (For MVP)
- Advanced accessibility features
- Performance optimizations  
- Complex user management
- Mobile apps
- Advanced analytics
- Multi-device sync

## Core Features

### 1. Instant Writing Experience
**Simple:**
- Email/password signup (30 seconds)
- Immediate editor access, no tutorial
- Clean, Medium-style interface

**Lovable:**
- Smooth auto-save with gentle feedback
- Satisfying typing experience
- No distractions, just writing

**Complete:**
- Full document management
- Reliable save/restore

### 2. Keystroke Capture (The Magic)
**What We Capture:**
- Every keydown/keyup with precise timestamps
- Character data (including backspaces)
- Typing sequences and natural rhythms
- Complete edit history

**Why It's Lovable:**
- Invisible to writer (just type normally)
- Creates fascinating replay for readers
- Undeniable proof of human authorship

### 3. Paste Prevention
**Simple:**
- Block all paste operations cleanly
- Friendly error messages
- Cross-browser compatibility

**Complete:**
- Ctrl+V, right-click, drag-drop all blocked
- No loopholes or edge cases
- 100% manual typing guarantee

### 4. One-Click Publishing
**Simple:**
- Single "Publish" button
- Instant public URL generation
- No configuration needed

**Complete:**
- Immutable after publication
- SEO-friendly URLs
- Beautiful public presentation

### 5. Keystroke Visualization (The WOW Factor)
**Lovable:**
- Visual timeline of writing progression
- Character-by-character replay with controls
- Natural human typing patterns visible
- Smooth, delightful animations

**Complete:**
- Full keystroke data transparency
- Exportable verification data
- Third-party verification possible

## User Flows

### Writer Flow (< 5 minutes)
```
1. Land on signify.app
2. See clear value prop: "Prove your writing is 100% human"
3. Sign up (email/password/name) - 30 seconds
4. Click "New Document" - editor opens immediately
5. Type naturally - keystroke capture invisible
6. Auto-save works seamlessly
7. Click "Publish" - instant public link
8. Share link with keystroke proof
```

### Reader Flow (Instant delight)
```
1. Click shared link
2. Read content with "✓ Human Verified" badge
3. Click "Watch Writing Process"
4. Mind blown by keystroke replay
5. Share with friends: "You have to see this!"
```

## Success Metrics

### Simple
- ✅ 0-5 minute signup to publish flow
- ✅ Zero learning curve
- ✅ Works on all devices

### Lovable  
- ✅ Writers voluntarily share keystroke replays
- ✅ Readers spend time watching the writing process
- ✅ Natural word-of-mouth growth

### Complete
- ✅ 100% paste prevention success rate
- ✅ Reliable keystroke capture and storage
- ✅ Beautiful, shareable public pages
- ✅ Trustworthy verification system

## Technical Architecture

### Stack
- **Backend**: Rails 8+ with Authentication Zero
- **Database**: SQLite (perfect for MVP)
- **Frontend**: React 19+ with Inertia.js
- **Styling**: Tailwind CSS v4
- **Deployment**: Hetzner VPS with Kamal

### Key Technical Decisions
- **SQLite**: Simple, reliable, no complexity
- **Inertia.js**: SPA feel without API complexity  
- **Authentication Zero**: Proven auth patterns
- **Single server**: No scaling complexity for MVP

## Launch Criteria

### Ready to Launch When:
1. ✅ Complete signup → write → publish → share flow works
2. ✅ Paste prevention is bulletproof across browsers
3. ✅ Keystroke capture is reliable and complete
4. ✅ Keystroke replay is smooth and delightful
5. ✅ Public pages look professional and trustworthy

### The Ultimate Test:
**When a first-time user publishes a post and immediately texts their friends: "Check this out - you can see every keystroke I typed!"**

## MVP Timeline
- **Weeks 1-2**: Foundation (auth, models, basic editor)
- **Weeks 3-4**: Keystroke capture & paste prevention  
- **Weeks 5-6**: Publishing & public views
- **Weeks 7-8**: Keystroke visualization
- **Weeks 9-10**: Polish & launch prep

**Goal**: Launch in 10 weeks with a product people love, not just use.