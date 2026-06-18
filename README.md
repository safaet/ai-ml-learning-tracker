# NeuralLog - AI/ML Learning Tracker

A modern, full-stack learning tracker built with Next.js 16, Supabase, and React. Track your progress across 7 AI/ML domains with interactive dashboards, progress visualizations, and goal management.

## Features

- **Dashboard** with real-time progress tracking, stats, weekly charts, and activity heatmap
- **Activity Heatmap** showing your learning consistency over 12 weeks
- **Weekly Progress Charts** with stacked bar charts for domain breakdown
- **Goal Management** with per-domain learning targets and deadlines
- **Quick Logging** with floating action button for fast activity logging (any page)
- **User Settings** with profile management, password change, and data controls
- **Mobile-Optimized** responsive design (375px - 1440px)
- **Dark Theme** with gradient accents and smooth transitions
- **Row-Level Security (RLS)** for complete data privacy and security
- **Persistent Sidebar** with domain quick links and user profile
- **Mobile Navigation** with bottom nav bar
- **Toast Notifications** for all user actions
- **Loading States** with skeleton loaders

## Tech Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL) with Row-Level Security
- **Charts**: Recharts for visualizations
- **UI Components**: shadcn/ui (Button, Card, Input, Dialog, etc.)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Animations**: Framer Motion

## Setup Instructions

### Prerequisites

- Node.js 18+ and pnpm
- A Supabase account (free tier works perfectly)

### 1. Clone and Install

```bash
git clone <repo-url>
cd ai-ml-learning-tracker
pnpm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and password
4. Wait 2-3 minutes for project to initialize
5. Go to Project Settings → API to copy credentials:
   - **Project URL** → copy to `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → copy to `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Up Database (IMPORTANT!)

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase_migration.sql` in this repo
4. Copy the ENTIRE contents
5. Paste into the SQL query box
6. Click **Run** (blue button)
7. Wait for completion - you should see "Success" confirmations for all operations

This creates:
- 4 tables (profiles, daily_logs, goals, progress_snapshots)
- Proper indexes for performance
- Row-Level Security policies
- Automatic profile creation on signup

### 4. Environment Variables

Create `.env.local` in the project root:

```bash
# Required Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 5. Run Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You'll be redirected to `/auth` to create an account or sign in.

## Database Schema

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profile data (name, avatar, etc.) | ✅ User only |
| `daily_logs` | Individual learning activities | ✅ User only |
| `goals` | Per-domain learning goals & targets | ✅ User only |
| `progress_snapshots` | Historical progress data | ✅ User only |

### Row-Level Security (RLS)

Every table has RLS enabled with policies:
- Users can only SELECT/INSERT/UPDATE/DELETE their own data
- Policies are enforced at the database level
- No user can access another user's information
- All queries automatically filtered by `auth.uid()`

**View `supabase_migration.sql` for complete RLS policy details.**

## Project Structure

```
app/
├── (auth)/                    # Auth routes (login/signup)
├── (dashboard)/               # Protected dashboard routes
│   ├── dashboard/            # Main dashboard (stats, charts, heatmap)
│   ├── goals/                # Goal management page
│   ├── history/              # Activity history page
│   ├── log/                  # Daily logging page
│   ├── settings/             # User settings & profile page
│   └── layout.tsx            # Dashboard layout with sidebar/mobile nav
└── actions/                  # Server actions (Supabase queries)

components/
├── layout/
│   ├── Sidebar.tsx          # Desktop sidebar with nav & domains
│   ├── MobileNav.tsx        # Mobile bottom navigation
│   └── QuickLogModal.tsx    # Floating action button + modal
├── dashboard/               # Dashboard components
│   ├── StatsBar.tsx         # Top stat cards
│   ├── DomainProgressCard.tsx
│   ├── ActivityFeed.tsx
│   ├── WeeklyChart.tsx      # Stacked bar chart
│   └── HeatmapCalendar.tsx  # 12-week heatmap
├── goals/                   # Goal management components
└── ui/                      # shadcn/ui components

lib/
├── domains.ts              # Domain config (7 AI/ML domains)
├── auth-actions.ts         # Auth server actions
└── supabase/               # Supabase client utilities
```

## Key Pages

### Dashboard (`/dashboard`)
- **Stats Bar**: Total hours, today's hours, logs count, active goals, streak
- **Domain Progress**: Cards showing progress toward each goal
- **Weekly Chart**: Last 7 days stacked by domain
- **Heatmap Calendar**: 12-week activity visualization
- **Activity Feed**: Recent 20 logged activities

### Log Today (`/log`)
- Create new learning log with domain, hours, description
- Add resources and notes
- Save and get instant confirmation

### Goals (`/goals`)
- Set per-domain learning targets
- Specify target hours and deadline date
- View progress on dashboard

### History (`/history`)
- Filter logs by domain and date range
- View detailed activity history
- Edit or delete past logs

### Settings (`/settings`)
- **Profile**: Update full name
- **Security**: Change password (requires current password verification)
- **Danger Zone**: Reset all data or delete account (with confirmation)

## Learning Domains

Tracked across 7 AI/ML domains:

1. 🧠 **ML Fundamentals** - Statistics, linear algebra, math
2. 🔬 **Deep Learning** - Neural networks, CNNs, RNNs
3. 💬 **NLP/LLMs** - Language models, transformers
4. 👁️ **Computer Vision** - Image processing, detection
5. 🚀 **MLOps/Deployment** - Model serving, infrastructure
6. 📚 **Research Papers** - Reading & understanding papers
7. 💻 **Coding/Projects** - Hands-on implementation

## Performance & Optimization

- **Server-Side Rendering** for faster initial load
- **Suspense Boundaries** for parallel data fetching
- **Skeleton Loaders** during data loading states
- **Memoization** for expensive calculations (progress %, streaks)
- **Optimized Queries** with proper indexes
- **Responsive Images** and lazy loading

## Mobile Responsiveness

- **Mobile (375px)**: Single column, bottom navigation, collapsible forms
- **Tablet (768px)**: 2-column grid, collapsible sidebar
- **Desktop (1440px)**: Full layout with persistent 256px sidebar

## Error Handling & Security

- **Try/Catch Blocks**: All Supabase queries wrapped
- **User-Facing Errors**: Toast notifications for failures
- **Logging**: Console logs for debugging
- **RLS Enforcement**: Database-level security
- **Query Scoping**: All queries filtered by `auth.uid()`
- **Type Safety**: Full TypeScript support

## Development

### Running Tests

```bash
# Type checking
pnpm tsc --noEmit

# Build
pnpm build
```

### Adding a New Page

1. Create directory under `app/(dashboard)/`
2. Create `page.tsx`
3. Layout automatically provides sidebar + mobile nav + toasts

### Adding a New Domain

1. Update `DOMAINS` array in `lib/domains.ts`
2. Add Lucide icon
3. Re-run migration (or manually add color variable)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo in [Vercel Dashboard](https://vercel.com)
3. Add environment variables (3 Supabase vars)
4. Deploy!

Middleware automatically protects `/dashboard` routes and redirects unauthenticated users to `/auth`.

## Troubleshooting

### "Not authenticated" error
- Verify you're signed in by checking browser console
- Check that middleware redirects to `/auth` for unauthorized routes

### Supabase connection failing
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys in `.env.local`
- Check Supabase project is active
- Verify RLS policies allow the operation

### Charts not rendering
- Clear browser cache and rebuild: `pnpm build`
- Verify data is fetching: check Network tab in DevTools
- Ensure Recharts is installed: `pnpm list recharts`

### Mobile layout issues
- Check responsive classes (lg:, md:, sm:) are applied
- Clear Tailwind cache: `rm -rf .next && pnpm dev`
- Test on actual device or DevTools responsive mode

## Future Enhancements

- [ ] Export progress to CSV/PDF
- [ ] Dark/Light theme toggle
- [ ] Social features (share progress, study groups)
- [ ] Achievement badges & milestones
- [ ] AI-powered study recommendations
- [ ] Integrations (Coursera, Udacity, etc.)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard for admins

## Built with v0

This project was built using [v0 by Vercel](https://v0.app).

[Continue development on v0 →](https://v0.app/chat/projects/prj_bb14govNw1kKctaDBOsqPnO9neAS)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## License

MIT - feel free to use for your own learning!
