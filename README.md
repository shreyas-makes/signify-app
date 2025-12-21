# Signify

Prove every word you publish is unmistakably yours.

Signify is the open-source writing platform that proves human authorship through keystroke verification. Publish with a shareable proof bundle that shows exactly how your story came to life—no AI, just you.

## Why teams choose Signify

- Verified human authorship end-to-end with keystroke capture baked into every draft.
- Proof-ready publishing with a shareable bundle of drafts, replays, and session metadata in a single link.
- Public exploration with a library of verified essays and proof links.
- Live analytics that surface writing velocity, focus breaks, and correction patterns across your workspace.
- Built on modern Rails + React foundations so contributors can ship confidently and extend the platform quickly.

## Platform highlights

### Keystroke DNA
See the human fingerprint in every draft. Keystroke telemetry renders an immutable barcode of the writing session so reviewers can spot real authorship at a glance.

### Proof bundles
Ship every story with an integrity packet. Each shareable link includes the full draft timeline, verified session metadata, and replay evidence to prove authenticity.

### Immersive replays
Walk readers through every decision. Collaborators can scrub through the draft exactly as it unfolded—pauses, edits, corrections, and all.

### Live analytics
Spot authenticity trends in real time. Aggregate keystroke evidence to understand writing velocity, focus breaks, and correction rhythms across your team.

### Open-source community
Spin up your first verified session in minutes, or contribute code, docs, and ideas to make authorship verification stronger for everyone.

## Quick start

1. Install dependencies and prepare the app:
   ```bash
   bin/setup
   ```
2. Launch the Rails + Vite development servers:
   ```bash
   bin/dev
   ```
3. Open `http://localhost:3000` and start writing with proof.

### Core stack

- [Ruby on Rails](https://rubyonrails.org/) backend with [Inertia.js](https://inertiajs.com/) transport
- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript UI with [shadcn/ui](https://ui.shadcn.com/) components
- Authentication foundation based on [Authentication Zero](https://github.com/lazaronixon/authentication-zero)
- [Kamal](https://kamal-deploy.org/) deployment templates and optional SSR support

## Project layout

- `app/frontend/pages/home` – marketing landing page and reusable messaging
- `app/frontend/pages/documents` – keystroke-first writing experience
- `app/services/keystroke_verification_service.rb` – signing and verification pipeline
- `docs/` – product requirements, APIs, and contributor notes
- `DEPLOYMENT.md` – production rollout guide (Hetzner + Kamal)

## Contributing

We welcome issues, pull requests, and feature proposals:

- Browse `todo.md` and `docs/prd.md` for open problems and roadmap context.
- Open an issue describing the change you’d like to make or pick up an existing one.
- Follow conventional GitHub etiquette (small PRs, clear descriptions, tests where it makes sense).

Join the conversation, share ideas, or showcase how you’re using Signify—every contribution helps keep human writing verifiable.

## Enabling SSR

Server-side rendering is optional but ready to enable:

1. In `app/frontend/entrypoints/inertia.ts`, uncomment the SSR hydration block in `setup`.
2. In `config/deploy.yml`, uncomment the SSR server, environment variables, and `Dockerfile-ssr` builder.

## License

Available under the [MIT License](https://opensource.org/licenses/MIT).
