# SPEC Completion Log

This file tracks progress against `SPEC.md`.

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Completed

---

## 1) Product Scope
- [ ] Chrome extension (Manifest V3)
- [ ] Twitter/X compose box detection
- [ ] Inline Signify button (appears once typing starts)
- [ ] Keystroke timing capture + paste detection
- [x] Verification record + public URL
- [ ] Byline appended before publish
- [x] Public verification page + user feed page

## 2) Privacy & Trust Model
- [ ] Domain whitelist + composer-only capture
- [ ] On-device processing
- [ ] Send minimal payload only after click
- [ ] Inline label + privacy tooltip/modal

## 3) Human-Written Rules
- [x] `human_written` if no paste
- [x] `mixed` if any paste

## 4) Byline & URL Scheme
- [ ] Byline format fixed
- [x] `/p/:id` verification route
- [x] `/u/:username` feed route

## 5) Extension Architecture
- [ ] MV3 manifest
- [ ] Background script
- [ ] Content script (Twitter)
- [ ] Popup UI

## 6) Backend Changes
- [x] `POST /api/v1/verifications`
- [x] Verification model/data fields
- [x] Response returns id/status/public_url

## 7) Public Pages
- [x] Verification page `/p/:id`
- [x] User feed `/u/:username`

## 8) Landing Page
- [~] Extension-first landing rewrite

## 9) QA / Acceptance
- [ ] Signify button appears only in Twitter composer after typing
- [ ] Paste events mark as mixed
- [ ] Byline appended only on click
- [x] `/p/:id` loads
- [ ] No capture on other sites
- [ ] Privacy tooltip visible
