# Security

This document records the security model of the blog and the hardening applied
after a self-audit (black-box pentest of the live site + white-box review of the
backend).

## Model at a glance

- **Auth**: a single admin password (`ADMIN_PASSWORD`) exchanged at `POST /api/login`
  for a random 128-bit bearer token, held in-memory for 12h. Sent as
  `Authorization: Bearer …` on every `/api/admin/*` and write call.
- **Storage**: posts and projects live in SQLite (`node:sqlite`), reached only through
  parameterized statements — no string-built SQL. Images are content-addressed
  (`sha256(bytes).ext`), so the client never controls a written file path: the
  `?name=` parameter only labels the metadata.
- **Edge**: [Caddy](Caddyfile) terminates TLS and adds HSTS/CSP/other headers;
  the Node app binds to `127.0.0.1` only and is never exposed directly.

## Hardening applied

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `ADMIN_PASSWORD` defaulted to `change-me` | **High** (if deployed unset) | Server **refuses to start** without a non-default password; compose requires it via `${ADMIN_PASSWORD:?…}` |
| 2 | Uploaded **SVG → stored XSS** (served `image/svg+xml`, script runs on-origin, can read the admin token from `localStorage`) | Medium | `/img/*` served with `Content-Security-Policy: default-src 'none'; … sandbox` + `nosniff`, reinforced at Caddy |
| 3 | `GET /api/images` listed image metadata **without auth** | Low | Now requires the admin token like the other image endpoints |
| 4 | No rate-limit on `/api/login` (single password, brute-forceable) | Medium | Per-IP throttle: 10 failures / 15 min → `429`; XFF overwritten at Caddy so it can't be spoofed |
| 5 | No security headers (HSTS, CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) | Medium | Added at Caddy (global) + `nosniff` on every app response |
| 6 | Timing-variable password compare | Low | `crypto.timingSafeEqual` over SHA-256 digests |
| 7 | Malformed JSON → `500` | Info | Guarded `JSON.parse` → `400` |
| 8 | `startsWith(WWWROOT)` static-path guard (sibling-dir edge) | Low | Tightened to `WWWROOT + path.sep` |

### Verified already-solid (no change needed)

- `/api/admin/*` PUT/DELETE reject unauthenticated requests **before** parsing the
  body; slug and image-name params reject path traversal and injection (clean 404s —
  an upload sent as `?name=../../evil.png` is still stored under its content hash);
  all SQL goes through parameterized statements; the static handler blocks directory
  escape; CORS does not reflect arbitrary origins; bearer-token-in-header (not cookies)
  makes CSRF non-applicable; error responses never leak stack traces; no secrets in
  the JS bundle.

## Deploying the hardening

1. Set a strong secret — e.g. a gitignored `.env` with `ADMIN_PASSWORD=…`.
2. Rebuild the app: `docker compose up -d --build`.
3. Install [`Caddyfile`](Caddyfile) on the host and `caddy reload`.
4. Load the site and `/admin`, watch the browser console, and loosen a CSP source
   only if it blocks something legitimate.

## Known trade-offs / follow-ups

- The `/admin` CSP keeps `script-src 'unsafe-inline'` because the page uses inline
  scripts; moving that logic to an external file would let it drop to `'self'`.
- Post bodies render Markdown with `html: true`. Only the authenticated admin can
  author posts, but sanitizing (e.g. DOMPurify) would remove the residual risk.
- Bearer token lives in `localStorage`; an `HttpOnly` cookie + CSRF token would make
  it unreadable to any XSS.

## Reporting

Found something? Email the address in the site footer rather than opening a public issue.
