import React from 'react';
import { 
  ExternalLink, ChevronRight, Globe, AtSign, Rss, Mail, Flag, Lock,
  Instagram, Twitter, Linkedin, Github, Youtube, Facebook, 
  Phone, ShoppingBag, Video, Music, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

const iconMap: Record<string, React.ElementType> = {
  Globe, Instagram, Twitter, Linkedin, Github, Youtube, Facebook, 
  Mail, Phone, ShoppingBag, Video, Music, MessageCircle
};

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;

  // Ignore static files that might accidentally hit this dynamic route
  // Allow dots now (usernames like hey.sumit are valid)
  if (/\.(png|jpg|svg|ico|css|js|json|txt|xml|webp)$/.test(username)) {
    notFound();
  }

  // Fallback safely if Supabase is not configured yet
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
     return (
        <div className="min-h-screen flex items-center justify-center text-on-surface">
           <p>Backend not connected yet. Check .env.local</p>
        </div>
     );
  }

  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    // Check username_history — old username may redirect to a new one
    const { data: history } = await supabase
      .from('username_history')
      .select('new_username')
      .eq('old_username', username)
      .order('changed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (history?.new_username) {
      redirect(`/${history.new_username}`);
    }

    notFound();
  }

  // 2. Fetch Active Links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  // 3. Fetch Appearance
  const { data: appearance } = await supabase.from('appearance').select('*').eq('profile_id', profile.id).single();

  // 4. Track Profile View (Background)
  let deviceType = 'desktop';
  const headersList = await (await import('next/headers')).headers();
  const userAgent = headersList.get('user-agent') || '';
  if (/mobile/i.test(userAgent)) deviceType = 'mobile';
  else if (/tablet/i.test(userAgent)) deviceType = 'tablet';

  supabase.rpc('increment_profile_views', { 
    profile_id: profile.id,
    device_type: deviceType
  }).then(({ error }) => {
    if (error) console.error('Error tracking view:', error);
  });

  const getThemeStyles = (preset?: string) => {
    switch (preset) {
      case 'Deep Space':
        return { bg: '#0a0a2e', card: '#161644', text: '#e2e8f0', accent: '#7c3aed' };
      case 'Snow Peak':
        return { bg: '#ffffff', card: '#f3f4f6', text: '#1a1a1a', accent: '#6b7280' };
      case 'Custom':
        return { bg: '#1a1a2e', card: '#242442', text: '#f0f0f0', accent: '#00d9ff' };
      case 'Modern Lime':
      default:
        return { bg: '#131313', card: '#1c1c1c', text: '#ffffff', accent: '#d2e823' };
    }
  };

  const isFree = profile.subscription_tier === 'free';
  const activeThemePreset = (appearance?.theme_preset === 'Custom' && isFree) ? 'Modern Lime' : appearance?.theme_preset;
  const theme = getThemeStyles(activeThemePreset);
  const buttonRadius = appearance?.button_style === 'Sharp' ? '0px' : appearance?.button_style === 'Pill' ? '9999px' : '0.5rem';
  const fontFamily = appearance?.font_family !== 'Inter' ? `"${appearance?.font_family}", sans-serif` : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center py-xl px-md" style={{ backgroundColor: theme.bg, color: theme.text, fontFamily }}>
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full border-2 p-sm mb-md overflow-hidden flex items-center justify-center" style={{ borderColor: theme.accent, backgroundColor: theme.card }}>
           {profile.avatar_url ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={profile.avatar_url} alt={profile.full_name || username} className="w-full h-full object-cover rounded-full" />
           ) : (
             <span className="text-headline-md font-bold uppercase" style={{ color: theme.text }}>{username.substring(0, 2)}</span>
           )}
        </div>

        {/* Name & Bio */}
        <h1 className="text-headline-md font-black mb-xs" style={{ color: theme.text }}>@{profile.username}</h1>
        <p className="text-body-md text-center max-w-xs mb-xl" style={{ color: theme.text, opacity: 0.8 }}>
          {profile.bio || 'Sharing my digital footprint one link at a time.'}
        </p>

        {/* Link List */}
        <div className="w-full flex flex-col gap-md mb-lg">
          {links?.map((link) => {
             const LinkIcon = iconMap[link.icon_name] || Globe;
             return (
               <a 
                 key={link.id} 
                 href={`/api/click/${link.id}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full border p-md flex items-center justify-between group hover:opacity-90 transition-all active:scale-[0.98]"
                 style={{ backgroundColor: theme.card, borderColor: 'transparent', borderRadius: buttonRadius, color: theme.text }}
               >
                 <div className="flex items-center gap-md">
                   <LinkIcon size={20} style={{ color: theme.accent }} />
                   <span className="text-label-md font-bold">{link.title}</span>
                 </div>
                 <ExternalLink size={18} style={{ opacity: 0.5 }} className="group-hover:opacity-100 transition-opacity" />
               </a>
             );
          })}
          {links?.length === 0 && (
            <p className="text-center text-body-md text-on-surface-variant py-xl border border-dashed border-outline-variant/30 rounded-xl">
              No active links found.
            </p>
          )}
        </div>

        {/* Social Row — Static for MVP, would normally come from DB */}
        <div className="w-full flex justify-center gap-md py-md mt-md border-t" style={{ borderColor: 'rgba(150,150,150,0.2)' }}>
          <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80" style={{ backgroundColor: theme.card, borderColor: 'transparent' }}>
            <Globe size={18} style={{ color: theme.text }} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80" style={{ backgroundColor: theme.card, borderColor: 'transparent' }}>
            <AtSign size={18} style={{ color: theme.text }} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80" style={{ backgroundColor: theme.card, borderColor: 'transparent' }}>
            <Mail size={18} style={{ color: theme.text }} />
          </a>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-xl flex flex-col items-center gap-md">
          {isFree && (
            <Link href="/" className="text-label-sm text-on-surface-variant/40 uppercase tracking-widest font-black hover:text-on-surface-variant transition-colors">
              Built with BioLinks
            </Link>
          )}
          <div className="flex gap-lg">
            <a href="#" className="flex items-center gap-xs text-[10px] text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
              <Flag size={10} /> Report
            </a>
            <a href="#" className="flex items-center gap-xs text-[10px] text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
              <Lock size={10} /> Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
