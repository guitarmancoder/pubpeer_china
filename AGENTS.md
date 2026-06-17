# Project Context

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase PostgreSQL
- **Font**: Noto Serif SC (via next/font/google)

## Project Overview

Post-Publication Peer Review (PPPR) - An English-language post-publication peer review platform, similar to PubPeer. Designed with Harvard University style (Crimson #A51C30 + white background + minimalist aesthetic).

## Directory Structure

```
├── public/                 # Static assets
├── scripts/                # Build & startup scripts
├── src/
│   ├── app/                # Page routes & layout
│   │   ├── api/            # API routes
│   │   │   ├── papers/     # Paper-related API
│   │   │   ├── search/     # Search API
│   │   │   ├── browse/     # Browse API
│   │   │   ├── auth/       # Auth API (login/register/verify)
│   │   │   ├── donations/  # Donations API
│   │   │   └── admin/      # Admin API (stats/comments/users)
│   │   ├── papers/[id]/    # Paper detail page
│   │   ├── search/         # Search page
│   │   ├── browse/         # Browse page
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── profile/        # Profile page
│   │   ├── donate/         # Donation page
│   │   ├── admin/          # Admin dashboard
│   │   └── (placeholder pages: blog, journals, institutions, about, etc.)
│   ├── components/         # Shared components
│   │   ├── ui/             # Shadcn UI component library
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Footer.tsx      # Footer
│   │   └── PlaceholderPage.tsx  # Placeholder page component
│   ├── storage/database/   # Supabase client & schema
│   └── lib/                # Utilities
├── next.config.ts          # Next.js configuration
├── package.json            # Dependency management
└── tsconfig.json           # TypeScript configuration
```

## Database Schema

- **profiles**: Users table (id, email, username, password_hash, display_name, role, is_active)
- **papers**: Papers table (id, title, authors, doi, pubmed_id, journal, publish_date, abstract, comment_count)
- **comments**: Comments table (id, paper_id, user_id, parent_id, content, is_anonymous, status)
- **donations**: Donations table (id, user_id, amount, donor_name, is_anonymous, message)

## API Endpoints

| Path | Method | Description |
|------|--------|-------------|
| /api/papers | GET | List papers |
| /api/papers | POST | Create paper |
| /api/papers/[id] | GET | Paper detail + comments |
| /api/papers/[id]/comments | POST | Add comment |
| /api/search | GET | Search papers |
| /api/browse | GET | Browse papers |
| /api/auth/login | POST | Login |
| /api/auth/register | POST | Register |
| /api/auth/verify | POST | Verify token |
| /api/donations | GET | List donations |
| /api/donations | POST | Create donation |
| /api/admin/stats | GET | Platform statistics |
| /api/admin/comments | GET | Pending comments |
| /api/admin/comments/approve | POST | Approve comment |
| /api/admin/comments/reject | POST | Reject comment |
| /api/admin/users | GET | User list |
| /api/admin/users/toggle | POST | Enable/disable user |

## Package Management

**Only pnpm** is allowed as the package manager. **npm and yarn are strictly prohibited**.

## Development Standards

### Coding Standards

- Write code with TypeScript `strict` mindset
- Implicit `any` and `as any` are prohibited
- All function parameters must have type annotations

### Hydration Issue Prevention

1. Dynamic content must use 'use client' + useEffect + useState
2. Do not use head tags; prefer metadata
3. Third-party fonts should be imported via next/font

## Default Account

- Admin: admin@pppr.cn / admin123456

## Design Style

- Primary color: Harvard Crimson (#A51C30)
- Title font: Noto Serif SC (serif)
- Body font: System sans-serif
- Style: Minimalist, authoritative, academic, generous whitespace
