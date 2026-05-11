import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // ✅ Step 1 — Profile and links fetched in parallel
  const [
    { data: profile },
    { data: links },
  ] = await Promise.all([
    supabase.from('profiles').select('views, username, mobile_views, desktop_views, tablet_views').eq('id', user.id).single(),
    supabase.from('links').select('*').eq('profile_id', user.id).order('clicks', { ascending: false }),
  ]);

  return (
    <AnalyticsClient
      profileViews={profile?.views || 0}
      deviceStats={{
        mobile: profile?.mobile_views || 0,
        desktop: profile?.desktop_views || 0,
        tablet: profile?.tablet_views || 0
      }}
      initialLinks={links || []}
    />
  );
}
