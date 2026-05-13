import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import QRCodeClient from './QRCodeClient';

export default async function QRCodePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, subscription_tier')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  if (profile.subscription_tier === 'free') {
    redirect('/pricing');
  }

  return <QRCodeClient username={profile.username} />;
}
