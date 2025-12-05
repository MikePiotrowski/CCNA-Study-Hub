# CCNA Search API (Phase 2 Skeleton)

This is a minimal Express server to back the site search with trusted online results. Providers are stubbed for now; no keys are required.

## Quick Start

1) Copy env example:
```pwsh
Copy-Item .env.example .env
```

2) Install dependencies:
```pwsh
Push-Location "c:\Users\Fireloks\Desktop\HTML\server"
npm install
Pop-Location
```

3) Run the server:
```pwsh
Push-Location "c:\Users\Fireloks\Desktop\HTML\server"
npm run dev
```

4) Test endpoints:
- Health: http://localhost:8080/api/health
- Search: http://localhost:8080/api/search?q=ospf%20areas

## Configure Providers (Later)
- Google CSE: set `GOOGLE_CSE_KEY` and `GOOGLE_CSE_CX`
- Bing Search: set `BING_KEY`
- Whitelist domains via `ALLOWED_DOMAINS`

## Frontend Integration (Later)
Replace the Wikipedia-only client call with `/api/search?q=...&limit=5` and append results in the “Online” section. Keep our two-pass UX.

## Notes
- CORS allows `http://localhost:5500` by default (see `.env.example`).
- Includes rate limiting and an LRU cache.
- No git actions performed; this is a local scaffold only.
