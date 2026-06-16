# TODO — GUID-in-URL Cloud Persistence

Future enhancement: replace device-only `localStorage` with centralized JSON storage keyed by a user GUID in the URL. No email/password login; the GUID *is* the identity.

**Status:** Not started (v1 uses `localStorage` only).

## Problem

`localStorage` is tied to one browser/device. Clearing site data loses history. GitHub Pages cannot store user data — it serves static files only.

## Target architecture

```
Browser (React on GitHub Pages)
  │
  ├─ Read GUID from URL (?id=… or /u/{guid})
  ├─ GET  /api/data/{guid}  → load AppData JSON
  └─ PUT  /api/data/{guid}  → save AppData JSON

Backend (separate from gh-pages)
  └─ Key-value or single-row-per-GUID store
```

Recommended backend options (pick one):

| Option | Pros | Cons |
|--------|------|------|
| **Cloudflare Workers + KV** | Cheap, fast, minimal ops | New platform to learn |
| **Supabase** (single `user_data` table) | Postgres, dashboard, generous free tier | Heavier than KV blob |
| **Vercel/Netlify serverless + DB** | Familiar if already on those platforms | Cold starts, vendor coupling |

GitHub Pages remains the static frontend host. Only `persistence/` and URL/bootstrap logic change.

## URL design

- **Query param (simplest):** `https://operationivy.github.io/RDSTracker/?id={uuid}`
- **Path (prettier, needs redirect rules):** `/RDSTracker/u/{uuid}`

### Bootstrap flow

1. On load, read `id` from URL.
2. If missing, generate `crypto.randomUUID()`, write to URL with `history.replaceState` (no reload).
3. Show “bookmark this link” hint on level select (one-time or dismissible).
4. Load data from API by GUID; fall back to empty `AppData` if 404.

### Security model

- GUID is a secret capability URL — anyone with the link can read/overwrite that blob.
- Acceptable for pool drill stats; **not** for sensitive data.
- Use UUID v4 (122 bits of entropy). No sequential IDs.
- Optional later: read-only share links, or passphrase-derived encryption client-side.

## API sketch

```
GET  /api/data/:guid     → 200 { currentLevel, frames, racks }
                         → 404 { } (new user)

PUT  /api/data/:guid     → body: AppData JSON
                         → 200 { ok: true }
                         → 413 if payload too large

DELETE /api/data/:guid   → optional; mirrors “clear stats” feature
```

- Validate `guid` format server-side.
- Set reasonable max body size (e.g. 256 KB).
- Consider `If-Match` / version field later for conflict detection (last-write-wins is fine for v1).

## Client changes (this repo)

### New / updated modules

- [ ] `src/modules/persistence/remote-adapter.ts` — `PersistenceAdapter` implementation calling the API
- [ ] `src/modules/persistence/guid.ts` — parse/generate/persist GUID in URL + optional `localStorage` fallback for last-used GUID
- [ ] `src/modules/persistence/store.ts` — factory: `createBrowserStore()` picks remote vs local based on env flag
- [ ] `src/components/DataLinkHint.tsx` — “Save your link” copy-to-clipboard on level select

### Migration from localStorage

- [ ] On first remote load with empty server data, if `localStorage` has data → `PUT` migrate once, then clear local copy (or keep as offline cache)
- [ ] “Clear stats” calls `DELETE /api/data/:guid` + resets client state
- [ ] Handle offline: queue writes or read-only degrade gracefully (optional v2)

### Config

- [ ] `VITE_API_BASE_URL` env var for API endpoint
- [ ] `VITE_USE_REMOTE_PERSISTENCE=true` feature flag for gradual rollout
- [ ] Document CORS: API must allow `https://operationivy.github.io`

## Backend tasks (separate repo or `/api` worker)

- [ ] Deploy Worker/function with KV or DB binding
- [ ] Implement GET/PUT (and optional DELETE) handlers
- [ ] CORS headers for GitHub Pages origin
- [ ] Rate limiting per GUID (basic abuse prevention)
- [ ] Logging/monitoring for 4xx/5xx

## Testing

- [ ] Unit tests for `guid.ts` (URL parse, generate, replaceState behavior mocked)
- [ ] `RemotePersistence` tests with `fetch` mock (load, save, 404 → empty, error handling)
- [ ] Migration test: local data → first PUT
- [ ] Existing `RdsStore` tests unchanged (still use `MemoryPersistence`)

## UX checklist

- [ ] Copy-link button on level select
- [ ] Loading state while fetching remote data
- [ ] Error toast if save fails (retry or “working offline” message)
- [ ] Update README deployment section: frontend on gh-pages, API elsewhere

## Out of scope (for this TODO)

- Email/password accounts
- Real-time multi-device sync conflicts
- Export/import CSV (separate feature; complementary to cloud save)

## References

- Current data shape: `src/types.ts` → `AppData`
- Current adapter interface: `src/modules/persistence/store.ts` → `PersistenceAdapter`
- [Dr. Dave RDS FAQ](https://drdavepoolinfo.com/faq/drill/rds/)
