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

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', user.id)
    .order('order_index', { ascending: true });

  const { data: appearance } = await supabase
    .from('appearance')
    .select('*')
    .eq('profile_id', user.id)
    .single();

  return (
    <LinksClient initialLinks={links || []} appearance={appearance} />
  );
}
