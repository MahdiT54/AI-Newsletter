# AI Newsletter

AI Newsletter is a full-stack Next.js application for building newsletters from RSS feeds with AI-generated content.

Users can:
- Add and manage RSS feeds
- Refresh and deduplicate feed articles
- Generate newsletters with OpenAI (streamed output)
- Save generated newsletters (Pro users)
- Configure reusable newsletter defaults (Pro users)

## Tech Stack

- Next.js 16 (App Router + Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + Radix UI
- Clerk authentication and plan checks
- Prisma ORM with MongoDB
- Vercel AI SDK + OpenAI (`gpt-4o`)
- Biome for linting and formatting

## Core Features

### 1) Feed Management
- Add RSS feed URLs from the dashboard
- Validate feed URLs before save
- Store feed metadata (title, description, image, language)
- Delete feeds safely without breaking article relations

### 2) RSS Ingestion + Deduplication
- Parse RSS using `rss-parser`
- Deduplicate globally using article `guid`
- Track multi-source references with `sourceFeedIds`
- Refresh stale feeds based on a 3-hour cache window

### 3) AI Newsletter Generation
- Select feeds + date range
- Prepare articles for generation
- Build prompt with article summaries + optional user settings
- Stream structured AI output via API route

### 4) History + Settings (Pro)
- Save generated newsletters to history
- View and manage previous newsletters
- Persist configurable defaults (tone, audience, branding, footer, etc.)

### 5) Access Control
- Public landing page at `/`
- Protected dashboard routes via Clerk middleware (`proxy.ts`)
- Paid-plan checks (`starter` or `pro`) for dashboard access
- Pro-specific gating for history/settings persistence flows

---

## Project Structure

```text
app/
  api/newsletter/
    prepare/route.ts            # pre-generation checks
    generate-stream/route.ts    # streamed AI generation endpoint
  dashboard/
    page.tsx                    # feed manager + generator
    generate/page.tsx
    history/page.tsx
    history/[id]/page.tsx
    settings/page.tsx
    pricing/page.tsx
    account/page.tsx
  layout.tsx
  page.tsx

actions/
  rss-feed.ts                   # feed CRUD
  rss-fetch.ts                  # validate/add/fetch feeds
  rss-article.ts                # article creation + query
  generate-newsletter.ts        # server-side generation/save utilities
  newsletter.ts
  user.ts
  user-settings.ts

lib/
  auth/helpers.ts
  database/error-handler.ts
  newsletter/
    newsletter-schema.ts
    prompt-builder.ts
    types.ts
  rss/
    parser.ts
    feed-refresh.ts
    types.ts
  prisma.ts

prisma/schema.prisma            # MongoDB data model
proxy.ts                        # Clerk route protection
```

---

## Data Model (Prisma + MongoDB)

Defined in `prisma/schema.prisma`.

- `User`  
  Links Clerk user IDs to local app data.

- `UserSettings`  
  Saved newsletter defaults for Pro users.

- `RssFeed`  
  User feed records with metadata and fetch timestamps.

- `RssArticle`  
  Deduplicated article store:
  - `guid` is globally unique
  - `feedId` points to a canonical feed relation
  - `sourceFeedIds` tracks all feed records referencing the article

- `Newsletter`  
  Stores generated newsletter content and generation context.

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<your-clerk-publishable-key>"
CLERK_SECRET_KEY="<your-clerk-secret-key>"
OPENAI_API_KEY="<your-openai-api-key>"
```

### Security Note

If secret values were ever committed/shared accidentally, rotate them immediately in:
- MongoDB Atlas
- Clerk dashboard
- OpenAI dashboard

---

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Generate Prisma client (optional, also runs on postinstall)

```bash
pnpm prisma:generate
```

### 3) Push schema to MongoDB

```bash
pnpm prisma:push
```

### 4) Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

- `pnpm dev` - Run Next.js in development mode
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome checks
- `pnpm format` - Format code with Biome
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:push` - Push Prisma schema to database
- `pnpm prisma:studio` - Open Prisma Studio

---

## Newsletter Generation Flow

1. User selects feeds and date range in dashboard
2. `POST /api/newsletter/prepare` checks:
   - valid request shape
   - authenticated user
   - feed freshness
   - article availability
3. `POST /api/newsletter/generate-stream`:
   - loads user settings
   - refreshes stale feeds
   - queries deduplicated articles
   - builds AI prompt
   - streams structured output
4. Pro users can save generated newsletters to history

---

## RSS Feed Behavior

- Feed freshness window: 3 hours (`lib/rss/feed-refresh.ts`)
- Max article set for generation: 100
- Duplicate articles are merged by `guid`
- Deleting feeds handles dependent article relations safely to avoid Prisma relation errors

---

## Authentication and Plans

- Route protection is configured in `proxy.ts`
- `/dashboard/**` requires authentication
- Dashboard access checks paid plans (`starter` or `pro`)
- Some capabilities are Pro-only (history/settings persistence and advanced save flows)

---

## Troubleshooting

### Tailwind plugin resolution errors

If you see plugin resolution issues (e.g. `@tailwindcss/typography`):

```bash
pnpm install
```

Then restart:

```bash
pnpm dev
```

### Prisma / relation delete errors

If feed deletion throws relation errors, ensure the app is on recent changes where feed deletion reassigns or removes dependent articles transactionally.

### Lint failures from non-project temp/config files

If `pnpm lint` fails on editor/tooling files, scope checks to app source files or clean malformed JSON files before running full checks.

---

## Deployment

Deploy on Vercel or any Node-compatible platform:

1. Set all required environment variables
2. Ensure MongoDB is reachable from deployment environment
3. Run schema sync during release (`pnpm prisma:push`) as needed
4. Build and start:
   - `pnpm build`
   - `pnpm start`

---

## License

Private project. Add a license section if you plan to open source it.
