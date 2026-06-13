# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migration from schema changes
npm run db:migrate   # Apply pending migrations to Supabase
npm run db:studio    # Open Drizzle Studio (DB browser)
```

`db:generate` and `db:migrate` require `DATABASE_URL` in `.env.local`. The `drizzle.config.ts` loads it automatically via dotenv.

## Architecture

Single-page lead capture form. Stack: Next.js 16 (App Router) + Drizzle ORM + Supabase (Postgres via transaction-mode pooler).

**Data flow:** `LeadForm` (client component) → `createLead` server action (`src/app/actions.ts`) → Drizzle → Supabase

**Database connection** (`src/db/index.ts`): Uses `postgres-js` with `prepare: false` — required for Supabase transaction-mode pooler (port 6543). Do not remove this option.

**Schema** (`src/db/schema.ts`): Single `leads` table. After any schema change, always run `db:generate` then `db:migrate`.

**Validation** (`src/app/actions.ts`): Server-side only. Rules: name must be Korean (한글 2–10자), email must contain `@`, phone must match `010-XXXX-XXXX`. Validation errors are returned as `{ success: false, errors }` — never thrown.

**Environment variables:**
- `DATABASE_URL` — Supabase transaction pooler URL (port 6543, `prepare: false` required)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
