// components/layout/NavbarAuthButtons.tsx
// Isolated async Server Component — only this piece needs auth.
// Imported by Navbar (also a Server Component) which is used in server layouts.
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function NavbarAuthButtons() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-sm bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all text-body-md"
      >
        <LayoutDashboard size={17} />
        <span>Dashboard</span>
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden sm:block text-body-md text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-200 active:scale-95"
      >
        Log In
      </Link>
      <Link
        href="/login?mode=signup"
        className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all text-body-md"
      >
        Get Started
      </Link>
    </>
  );
}
