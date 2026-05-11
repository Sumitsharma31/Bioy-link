import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const supabase = await createClient();

  // ✅ Step 1 — getUser and profile fetched in parallel
  const [
    { data: { user } },
    // profile will be fetched after user is confirmed (needs user.id)
  ] = await Promise.all([
    supabase.auth.getUser(),
  ]);

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, subscription_tier, avatar_url, timezone')
    .eq('id', user.id)
    .single();

  return <SettingsClient user={user} profile={profile} />;
}
