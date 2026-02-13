# Minor Hockey Team Tracking App — Step 5: Technical Decisions

## Tech Stack

### Frontend
- React + Next.js
- Tailwind CSS + shadcn/ui
- Mobile-first responsive design — built for phone screens first, scales up to desktop
- Deployed on Vercel

### Backend / Database
- Supabase (PostgreSQL + built-in auth + real-time subscriptions + storage)
- Next.js API routes for business logic (smart merge, scenario engine, CSV parsing)

### Authentication
- Supabase Auth (email/password, Google, Apple sign-in)
- Row Level Security (RLS) to enforce role-based access at the database level
- Roles: Public Follower, Teammate, Contributor, Admin

### AI Integration
- Claude API for conversational layer
- Next.js API route as middleware: user question → assemble relevant data from Supabase based on user's role → send to Claude with context → return answer
- Audio input via browser speech-to-text API before sending to Claude

### CSV Import
- Parsed in Next.js API routes using PapaParse
- Validated against schema per category
- Smart merge logic runs server-side comparing against existing Supabase data

### Real-time
- Supabase real-time subscriptions available but **NOT required for launch**
- Live score updates deferred to a later phase
- Standard page refresh / polling is sufficient initially

### Notifications
- In-app notifications (not push, not email)
- Schedule overlap alerts, tournament updates, ranking reminders
- Notification center in the app where unread items accumulate

### Offline Score Entry
- Score entry works offline using local storage / service worker
- Queues the entry locally
- Syncs to Supabase when connection returns
- If a conflict exists when syncing (someone else entered while you were offline), smart merge flags it

### Hosting
- Vercel for the Next.js app
- Supabase cloud for database / auth / storage

## Platform Strategy
- Web app with mobile-first layout and functionality as the priority
- Responsive design scales up to desktop
- No native mobile app at launch — responsive web app covers both phone and desktop use cases
- Native apps (App Store / Google Play) can be considered later if demand warrants it

---

*Step 5 Complete. Step 6: MVP Scope to follow in separate document.*
