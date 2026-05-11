// lib/queries.ts
// Cached Supabase query helpers using unstable_cache.
//
// ⚠️  IMPORTANT: `unstable_cache` cannot call `cookies()` (a dynamic data source)
//     inside the cached function. The fix is to read cookies() OUTSIDE the cache
//     wrapper and pass them as a plain serializable array argument.
//     See: https://nextjs.org/docs/app/api-reference/functions/unstable_cache

import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

type CookieEntry = { name: string; value: string };

/** Build a lightweight Supabase client from pre-fetched cookie values (no dynamic sources). */
function buildClient(cookieList: CookieEntry[]) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieList; },
        setAll() { /* no-op — writes aren't needed inside cached queries */ },
      },
    }
  );
}

/**
 * Cached profile fetch — revalidated every 60 s or on `revalidateTag('profile')`.
 *
 * `cookies()` is called here (outside the cache) and the values are passed as
 * a serializable array so the cached function has no dynamic data-source access.
 */
export async function getCachedProfile(userId: string) {
  const cookieList = (await cookies()).getAll() as CookieEntry[];

  return unstable_cache(
    async (uid: string, cookieList: CookieEntry[]) => {
      const supabase = buildClient(cookieList);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      return data;
    },
    ['profile', userId],
    { revalidate: 60, tags: ['profile'] }
  )(userId, cookieList);
}

/**
 * Cached appearance fetch — revalidated every 60 s or on `revalidateTag('appearance')`.
 */
export async function getCachedAppearance(userId: string) {
  const cookieList = (await cookies()).getAll() as CookieEntry[];

  return unstable_cache(
    async (uid: string, cookieList: CookieEntry[]) => {
      const supabase = buildClient(cookieList);
      const { data } = await supabase
        .from('appearance')
        .select('*')
        .eq('profile_id', uid)
        .single();
      return data;
    },
    ['appearance', userId],
    { revalidate: 60, tags: ['appearance'] }
  )(userId, cookieList);
}
