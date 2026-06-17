# LinkedReach — BS23 Internal Outreach Tool

A Dripify-style LinkedIn outreach automation SaaS for internal BS23 team use.
5 seats · 5 campaigns · Free · Self-hosted on Vercel.

## Deploy to Vercel (one-time setup)

1. Create a free account at https://github.com and https://vercel.com
2. Create a new repo on GitHub named `linkedreach`
3. Upload all these files to that repo (drag & drop in GitHub UI)
4. Go to vercel.com → New Project → Import your GitHub repo
5. Click Deploy — done. You get a free URL like linkedreach.vercel.app

## Run locally

```bash
npm install
npm run dev
```
Open http://localhost:3000

## Features (Phase 1 — Frontend)
- Dashboard with live stats
- 5 campaign slots with sequence builder
- Dedicated inbox with threading
- Analytics with charts
- Sequence templates per service line
- Prospect table with CSV export
- LinkedIn protection settings
- Team management (5 seats)

## Phase 2 (coming next)
- Supabase auth + real login
- Database-backed campaigns and prospects
- LinkedIn cookie integration
- Real message sending via li_at cookie
