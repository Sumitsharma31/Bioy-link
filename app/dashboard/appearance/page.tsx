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

  // Fetch current appearance settings
  const { data: appearance } = await supabase
    .from('appearance')
    .select('*')
    .eq('profile_id', user.id)
    .single();

  return <AppearanceClient initialAppearance={appearance} />;
}
