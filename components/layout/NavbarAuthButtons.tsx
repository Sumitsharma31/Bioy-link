// components/layout/NavbarAuthButtons.tsx
// Isolated async Server Component — only this piece needs auth.
// Imported by Navbar (also a Server Component) which is used in server layouts.
import Link from 'next/link';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_EMAILS } from '@/lib/admins';

export async function NavbarAuthButtons() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const isAdmin = ADMIN_EMAILS.includes(user.email || '');

    return (
      <div className="flex items-center gap-sm">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-sm bg-surface-container-high text-on-surface px-md py-sm rounded-lg font-bold hover:bg-surface-variant active:scale-95 transition-all text-body-md border border-outline-variant/20"
          >
            <ShieldCheck size={17} className="text-primary" />
            <span>Admin</span>
          </Link>
        )}
        {!isAdmin && (
          <Link
            href="/dashboard"
            className="flex items-center gap-sm bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all text-body-md"
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </Link>
        )}
      </div>
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
