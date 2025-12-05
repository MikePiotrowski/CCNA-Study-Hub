require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { LRUCache } = require('lru-cache');
const { z } = require('zod');

const app = express();

// Config
const PORT = Number(process.env.PORT || 8080);
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'http://localhost:5500';
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 600);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 60);
const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || '').split(',').map(s => s.trim()).filter(Boolean);
const PROVIDERS = (process.env.SEARCH_PROVIDER || 'cse,bing').split(',').map(s => s.trim()).filter(Boolean);

// CORS
app.use(cors({ origin: ALLOW_ORIGIN, credentials: false }));

// Rate limit
const limiter = rateLimit({ windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Cache
const cache = new LRUCache({ max: 500, ttl: CACHE_TTL_SECONDS * 1000 });

// Validation
const querySchema = z.object({
  q: z.string().min(2).max(200),
  limit: z.string().optional().transform(v => v ? Math.min(10, Math.max(1, Number(v) || 5)) : 5),
  sources: z.string().optional(),
});

// Helpers
function toDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function normalize(items) {
  return items.map(i => ({
    title: String(i.title || '').slice(0, 120),
    url: String(i.url || ''),
    snippet: String(i.snippet || '').replace(/<[^>]+>/g, '').slice(0, 220),
    source: i.source || 'unknown',
    domain: toDomain(i.url || '')
  }));
}

function filterAllowed(items) {
  if (!ALLOWED_DOMAINS.length) return items;
  return items.filter(i => ALLOWED_DOMAINS.includes(i.domain));
}

// Providers (stubs for now)
async function searchCSE(q, limit) { return []; }
async function searchBing(q, limit) { return []; }

async function runProviders(q, limit, providerList) {
  const tasks = [];
  for (const p of providerList) {
    if (p === 'cse') tasks.push(searchCSE(q, limit).then(r => r.map(x => ({ ...x, source: 'cse' }))));
    if (p === 'bing') tasks.push(searchBing(q, limit).then(r => r.map(x => ({ ...x, source: 'bing' }))));
  }
  const settled = await Promise.allSettled(tasks);
  const merged = [];
  for (const s of settled) if (s.status === 'fulfilled') merged.push(...s.value);
  return merged.slice(0, limit);
}

// Search endpoint (stubbed providers)
app.get('/api/search', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Bad Request', message: parsed.error.issues?.[0]?.message || 'Invalid query', code: 'VALIDATION_ERROR' });
  }
  const { q, limit, sources } = parsed.data;
  const providerList = (sources ? sources.split(',') : PROVIDERS).map(s => s.trim()).filter(Boolean);

  const cacheKey = `q=${q}|l=${limit}|s=${providerList.join(',')}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ query: q, tookMs: 0, results: cached, provider: providerList, cached: true });

  const started = Date.now();
  // For now, providers are stubs; this returns empty or sample data
  let results = await runProviders(q, limit, providerList);

  // Sample placeholder: add Wikipedia hint line if nothing else
  if (results.length === 0) {
    results = [{
      title: `Search online for: ${q}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      snippet: 'Backend providers are not configured yet. This is a placeholder result.',
      source: 'placeholder',
      domain: 'google.com'
    }];
  }

  results = normalize(results);
  results = filterAllowed(results);

  cache.set(cacheKey, results);
  res.json({ query: q, tookMs: Date.now() - started, results, provider: providerList, cached: false });
});

app.listen(PORT, () => {
  console.log(`[ccna-search-api] listening on http://localhost:${PORT}`);
});
