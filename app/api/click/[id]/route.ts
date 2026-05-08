import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const supabase = await createClient();

  // 1. Get the link URL
  const { data: link, error: fetchError } = await supabase
    .from('links')
    .select('url')
    .eq('id', id)
    .single();

  if (fetchError || !link) {
    return redirect('/');
  }

  // 2. Increment click count in the background (using RPC or simple update)
  // We use .update() here, but in high traffic you might want an RPC for atomic increment
  await supabase.rpc('increment_link_clicks', { link_id: id });

  // 3. Redirect to the target URL
  return redirect(link.url);
}
