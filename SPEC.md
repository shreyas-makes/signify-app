# Signify Chrome Extension — Twitter-First MVP Spec

## Purpose
Enable users to append a proof-of-human authorship byline to a tweet before publishing. Verification is based on typing behavior, with paste detection flagged as “mixed.” Output is a short public verification URL.

## Primary User Story
As a writer, I want to click a Signify button next to the Twitter/X composer after finishing my draft, so a verification link is appended and I can publish with proof that my writing was human.

---

## 1) Product Scope

### In
- Chrome extension (Manifest V3)
- Twitter/X compose box detection
- Inline Signify button (appears once typing starts)
- Keystroke timing capture + paste detection
- Verification record + public URL
- Byline appended before publish:
  - `Proof of human authorship: signifywriting.com/p/<id>`
- Public verification page + user feed page

### Out (MVP)
- Multi-platform support (LinkedIn, etc.)
- Scores or “confidence numbers”
- Full keystroke replay by default
- Short domain (optional later)

---

## 2) Privacy & Trust Model (Must-Have)

### Principles
- No global keylogging.
- Capture only within whitelisted domains (twitter.com/x.com) and only within the composer DOM.
- Default to on-device processing.
- Nothing sent until user clicks “Signify.”

### Data sent on verification
- Content hash (not raw text)
- Keystroke timing aggregates (bucketed)
- Total keystrokes
- Paste events (boolean + count)
- Draft duration (start/end timestamps)
- Platform: `twitter`
- Optional: full keystroke timeline (for replay/graph on `/p/:id`)

### UI transparency
- Inline label: “Signify active in this box only”
- Tooltip / modal: “View what we collect” with explicit field list

---

## 3) Human-Written Rules (No Score)

### Labels
- `human_written` — no paste events
- `mixed` — any paste occurs

### Notes
- Do not compute confidence or numeric score.
- Do not block publishing if mixed; append byline and mark mixed.

---

## 4) Byline & URL Scheme

### Byline text (fixed)
`Proof of human authorship: signifywriting.com/p/<id>`

### URL routes
- `GET /p/:id` -> verification page
- `GET /u/:username` -> user public feed
- Optional canonical URL: `/u/:username/:id` (exists but not used in byline)

---

## 5) Extension Architecture (MV3)

### Components
- `manifest.json` (MV3)
- `background.ts` (auth/session management, API calls)
- `content_script.ts` (DOM detection + UI injection + keystroke capture)
- `popup.html` / `popup.ts` (login status, privacy info, settings)

### Key behaviors
- Detect Twitter/X compose box via DOM selectors
- Attach listeners to that element only
- Capture keystroke timestamps + paste events
- Show inline Signify button near composer
- On click: send verification payload, receive URL, append byline

---

## 6) Backend Changes

### New endpoint
`POST /api/v1/verifications`

Payload:
```
{
  "platform": "twitter",
  "content_hash": "...",
  "keystroke_stats": { ... },
  "paste": { "occurred": true/false, "count": n },
  "keystrokes": [ ... ],
  "start_at": "...",
  "end_at": "..."
}
```

Response:
```
{
  "id": "...",
  "status": "human_written" | "mixed",
  "public_url": "..."
}
```

### Authentication (extension)
- Accept `Authorization: Bearer <api_token>` or `X-API-Token: <api_token>`
- Tokens are per-user; extension stores the token locally
- CORS allowlist via `SIGNIFY_EXTENSION_ORIGINS` for chrome-extension origins
- Redirect allowlist via `SIGNIFY_EXTENSION_REDIRECT_URIS`
  - Example: `chrome-extension://ldhnipnockdjddnkmedmooobhkghddee/auth.html`

### Extension auth handshake (one-time code)
1) Extension opens `GET /extension/auth?state=<state>&redirect_uri=<chrome-extension://.../auth.html>`
2) User signs in and confirms on the Signify page
3) Signify redirects to `redirect_uri?code=<one-time-code>&state=<state>`
4) Extension exchanges code: `POST /api/v1/extension_tokens` → `{ api_token }`

### Backend coverage
- Request specs cover extension auth confirmation + code exchange

### Data model
- New `Verification` (or reuse `Document` if already exists)
  - user_id
  - platform
  - content_hash
  - status (human_written/mixed)
  - keystroke_stats (json)
  - paste_events (json)
  - created_at
  - public_id (short id)
- Optional: store raw keystrokes only if user explicitly opts in later
- Current: raw keystrokes are stored with each verification to enable the proof graph

---

## 7) Public Pages

### Verification page (`/p/:id`)
- Status label: Human Written / Mixed
- Detailed proof summary: author, time window, platform
- “Mixed” explanation if paste occurred
- Keystroke graph + event summary (no replay by default)

### User feed (`/u/:username`)
- List of verified posts
- Each item: date, status, platform, public URL

---

## 8) Landing Page (Web)

### Message
“Add proof-of-human authorship to any tweet — without leaving the editor.”

### Sections
- Hero: extension-based flow (login -> type -> click Signify -> byline)
- Trust/Privacy: explicit scoping to Twitter composer, no global logging
- Verification pages: link examples
- CTA: “Install Extension” + “View example verification”

---

## 9) QA / Acceptance Criteria

- Signify button appears only in Twitter/X composer after typing starts
- Paste events mark as `mixed`
- Byline appended only when user clicks Signify
- Verification page loads via `signifywriting.com/p/<id>`
- No keystroke capture on other sites
- Privacy tooltip visible and accurate

---

## 10) Future Enhancements (Not MVP)

- Short domain (e.g., `sgfy.co/<id>`)
- Additional platforms (LinkedIn, Medium, Substack)
- Optional full keystroke replay (explicit opt-in)
- Inline verification badges for published posts

---

## 11) Implementation Next Steps (Pick One)

Want me to start implementing the backend + extension scaffolding next?  
If yes, pick:

1. Backend endpoints + models  
2. Extension MVP (Twitter detection + byline)  
3. Landing page rewrite

---

## 12) Pivot Strategy: Use Existing App vs Rebuild

### Short Answer
Don’t rebuild from scratch. Keep the Rails/Inertia app as the backend + public verification pages, and add a Chrome extension alongside it. Then progressively slim the “platform” UI into an extension-first product site.

### How to Transform What’s Already Built

**Keep (high value)**  
- Rails auth (Google OAuth) — needed for the extension  
- Keystroke and verification logic — already built, reuse and simplify  
- Public pages infrastructure (posts/authors) — adapt to `/p/:id` and `/u/:username`

**Change (align to extension)**  
- Document model → Verification model (or keep Document but repurpose)  
- Public routes → focus on `/p/:id` verification + `/u/:username` feed  
- Dashboard → optional internal admin or removed from public nav

**Add**  
- Chrome extension (MV3) that uses the Rails API  
- API endpoint for extension verification payload  
- Lightweight landing page explaining the extension

### Why This Is Better Than Rebuilding
- You already have core auth + public pages + data models.  
- Rebuild would slow you down and introduce new bugs.  
- You can iterate quickly by repurposing existing features.
