# Next.js 15 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Vite/React 19 BioLinks project into a Next.js 15 App Router project with TypeScript, preserving the Material Design 3 UI.

**Architecture:** Initialize a fresh Next.js environment, reorganize existing code into the `app/` directory structure, convert components to Client Components as needed, and utilize Next.js Link/Navigation.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Lucide React.

---

### Task 1: Environment Initialization

**Files:**
- Create: `next.config.ts`, `tsconfig.json`, `package.json` (modified)
- Modify: `package.json`

- [ ] **Step 1: Install Next.js and TypeScript dependencies**
Run: `npm install next@latest react@latest react-dom@latest`
Run: `npm install -D typescript @types/node @types/react @types/react-dom`

- [ ] **Step 2: Update package.json scripts**
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

- [ ] **Step 3: Create next.config.ts**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

- [ ] **Step 4: Commit**
```bash
git add package.json next.config.ts tsconfig.json
git commit -m "chore: initialize next.js and typescript environment"
```

---

### Task 2: Design System Migration

**Files:**
- Create: `app/globals.css`
- Modify: `src/index.css` (source for content)

- [ ] **Step 1: Move index.css content to app/globals.css**
Copy content from `src/index.css` into `app/globals.css`, ensuring the `@theme` and Tailwind v4 directives are preserved.

- [ ] **Step 2: Create Root Layout**
- Create: `app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioLinks | Your Digital Identity",
  description: "Create your professional link-in-bio in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: migrate design system and root layout"
```

---

### Task 3: Shared Components Migration

**Files:**
- Create: `components/layout/Navbar.tsx`, `components/layout/Sidebar.tsx`, `components/layout/Footer.tsx`, `components/layout/DashboardLayout.tsx`

- [ ] **Step 1: Migrate Navbar to .tsx**
Convert `src/components/layout/Navbar.jsx` to `components/layout/Navbar.tsx`. Replace `Link` from `react-router-dom` with `next/link`.

- [ ] **Step 2: Migrate Sidebar to .tsx (Client Component)**
Convert `src/components/layout/Sidebar.jsx` to `components/layout/Sidebar.tsx`. Add `'use client'` at the top. Replace `useNavigate` with `useRouter` from `next/navigation`.

- [ ] **Step 3: Migrate Footer to .tsx**
Convert `src/components/layout/Footer.jsx` to `components/layout/Footer.tsx`.

- [ ] **Step 4: Migrate DashboardLayout to .tsx (Client Component)**
Convert `src/components/layout/DashboardLayout.jsx` to `components/layout/DashboardLayout.tsx`. Add `'use client'`. Replace `Outlet` with `{children}`.

- [ ] **Step 5: Commit**
```bash
git add components/layout/
git commit -m "feat: migrate shared layout components to next.js"
```

---

### Task 4: Public Pages Migration

**Files:**
- Create: `app/page.tsx`, `app/login/page.tsx`, `app/onboarding/page.tsx`

- [ ] **Step 1: Migrate Landing Page**
Convert `src/pages/LandingPage.jsx` to `app/page.tsx`.

- [ ] **Step 2: Migrate Login Page (Client Component)**
Convert `src/pages/auth/LoginPage.jsx` to `app/login/page.tsx`. Add `'use client'`.

- [ ] **Step 3: Migrate Onboarding Page (Client Component)**
Convert `src/pages/OnboardingPage.jsx` to `app/onboarding/page.tsx`. Add `'use client'`.

- [ ] **Step 4: Commit**
```bash
git add app/page.tsx app/login/page.tsx app/onboarding/page.tsx
git commit -m "feat: migrate public and auth pages"
```

---

### Task 5: Dashboard Pages Migration

**Files:**
- Create: `app/dashboard/page.tsx`, `app/dashboard/links/page.tsx`, `app/dashboard/appearance/page.tsx`, `app/dashboard/analytics/page.tsx`, `app/dashboard/qrcode/page.tsx`, `app/dashboard/settings/page.tsx`
- Create: `app/dashboard/layout.tsx`

- [ ] **Step 1: Create Dashboard Layout**
```tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

- [ ] **Step 2: Migrate Dashboard Pages**
Convert each dashboard `.jsx` file to its corresponding `app/dashboard/.../page.tsx` file. Add `'use client'` where state or interactivity is used.

- [ ] **Step 3: Commit**
```bash
git add app/dashboard/
git commit -m "feat: migrate dashboard pages"
```

---

### Task 6: Dynamic Public Profile Migration

**Files:**
- Create: `app/[username]/page.tsx`

- [ ] **Step 1: Migrate Public Profile**
Convert `src/pages/PublicProfile.jsx` to `app/[username]/page.tsx`. Use `useParams` (if client) or `params` (if server) to get the username.

- [ ] **Step 2: Commit**
```bash
git add app/[username]/page.tsx
git commit -m "feat: migrate dynamic public profile page"
```

---

### Task 7: Cleanup and Verification

- [ ] **Step 1: Delete old Vite/React files**
Remove `src/`, `vite.config.js`, `index.html`.

- [ ] **Step 2: Run build to verify**
Run: `npm run build`
Expected: Successful build without TS errors.

- [ ] **Step 3: Final Commit**
```bash
git commit -m "cleanup: remove legacy vite files"
```
