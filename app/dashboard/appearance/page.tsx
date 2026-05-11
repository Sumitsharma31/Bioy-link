import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AppearanceClient from './AppearanceClient';

export default async function AppearancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // ✅ Step 1 — Appearance, profile and links fetched in parallel
  const [
    { data: appearance },
    { data: profile },
    { data: links },
  ] = await Promise.all([
    supabase.from('appearance').select('*').eq('profile_id', user.id).single(),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('links').select('*').eq('profile_id', user.id).eq('is_active', true).order('order_index', { ascending: true }),
  ]);

  return (
    <AppearanceClient
      initialAppearance={appearance}
      profile={profile}
      links={links || []}
    />
  );
}
