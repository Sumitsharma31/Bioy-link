import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LinksClient from './LinksClient';

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // ✅ Step 1 — All 3 queries run in parallel instead of sequentially
  const [
    { data: links },
    { data: appearance },
    { data: profile },
  ] = await Promise.all([
    supabase.from('links').select('*').eq('profile_id', user.id).order('order_index', { ascending: true }),
    supabase.from('appearance').select('*').eq('profile_id', user.id).single(),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ]);

  return (
    <LinksClient
      initialLinks={links || []}
      appearance={appearance}
      profile={profile}
    />
  );
}
