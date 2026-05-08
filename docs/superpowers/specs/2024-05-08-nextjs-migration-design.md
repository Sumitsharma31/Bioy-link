# Specification: Migration to Next.js 15 (App Router)

Migrate the BioLinks React 19 application from Vite to Next.js 15 to establish a production-ready SaaS backend, improved SEO, and robust routing.

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Preserving MD3 Design System)
- **Deployment Target**: Vercel (Standard for Next.js)

## Directory Mapping

| Vite Structure | Next.js Mapping |
|----------------|-----------------|
| `src/pages/LandingPage.jsx` | `app/page.tsx` |
| `src/pages/auth/LoginPage.jsx` | `app/login/page.tsx` |
| `src/pages/OnboardingPage.jsx` | `app/onboarding/page.tsx` |
| `src/pages/dashboard/DashboardOverview.jsx` | `app/dashboard/page.tsx` |
| `src/pages/dashboard/LinksPage.jsx` | `app/dashboard/links/page.tsx` |
| `src/pages/dashboard/AppearancePage.jsx` | `app/dashboard/appearance/page.tsx` |
| `src/pages/dashboard/AnalyticsPage.jsx` | `app/dashboard/analytics/page.tsx` |
| `src/pages/dashboard/QRCodePage.jsx` | `app/dashboard/qrcode/page.tsx` |
| `src/pages/dashboard/SettingsPage.jsx` | `app/dashboard/settings/page.tsx` |
| `src/pages/PublicProfile.jsx` | `app/[username]/page.tsx` |
| `src/components/layout/DashboardLayout.jsx` | `app/dashboard/layout.tsx` |

## Key Technical Changes

### 1. File Extension Migration
- Convert all `.jsx` to `.tsx`.
- Add `'use client'` directive to interactive components (all dashboard pages and forms).

### 2. Routing Logic
- Replace `react-router-dom` (`Link`, `useNavigate`, `NavLink`) with Next.js equivalents (`next/link`, `next/navigation`).
- Eliminate `App.jsx` router configuration in favor of filesystem routing.

### 3. Design System Preservation
- Migrate `index.css` (Tailwind v4) to `app/globals.css`.
- Update `layout.tsx` to include the global CSS and necessary fonts (Inter).

### 4. Public Profile Optimization
- Use Dynamic Routes `[username]` for public profiles.
- This allows for future Server-Side Rendering (SSR) of profile pages, improving link preview visibility on social media.

## Verification Plan

### Automated
- `npm run dev`: Verify Next.js development server starts.
- `npm run build`: Verify production build compatibility.

### Manual
- Navigate to `/` (Landing), `/dashboard`, and `/@alexcreator` to ensure UI fidelity is 100% maintained.
- Verify mobile responsiveness with the new Next.js layout structure.
