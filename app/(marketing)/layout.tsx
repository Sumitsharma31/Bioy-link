// app/(marketing)/layout.tsx
// Server Component layout for all marketing pages (/, /pricing, /showcase, /docs, etc.)
// Renders Navbar and Footer here so they live in a guaranteed Server Component boundary —
// the inner page.tsx can safely use 'use client' for animations without pulling
// server-only APIs (next/headers) into the client bundle.
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MarketingPageWrapper from '@/components/layout/MarketingPageWrapper';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <MarketingPageWrapper>
        {children}
      </MarketingPageWrapper>
      <Footer />
    </>
  );
}
