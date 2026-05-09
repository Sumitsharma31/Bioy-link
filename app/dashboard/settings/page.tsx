import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, subscription_tier, avatar_url')
    .eq('id', user.id)
    .single();

  return <SettingsClient user={user} profile={profile} />;
}
