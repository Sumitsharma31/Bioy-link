// app/dashboard/page.tsx
// ✅ Step 3 — Suspense streaming:
//   - Page shell (auth check) renders instantly
//   - DashboardStats streams in as its data arrives
//   - Skeleton shown during fetch — user never sees a frozen/blank screen
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardStats, DashboardStatsSkeleton } from './_components/DashboardStats';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Quick guard: ensure profile exists before rendering content
  // (avoids a flash of stats with no profile redirect)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    // space-y-xl wraps everything so layout is consistent with/without Suspense
    <div className="space-y-xl">
      {/* ✅ Shell renders in ~0ms. Stats stream in as DB responds. */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats userId={user.id} />
      </Suspense>
    </div>
  );
}
