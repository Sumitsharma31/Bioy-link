'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updatePricing(tierName: string, monthlyPrice: number, annualPrice: number) {
  const supabase = await createAdminClient();

  // Try to update existing
  const { error } = await supabase
    .from('pricing_plans')
    .upsert(
      { tier_name: tierName, monthly_price: monthlyPrice, annual_price: annualPrice, updated_at: new Date().toISOString() },
      { onConflict: 'tier_name' }
    );

  if (error) {
    console.error('Failed to update pricing:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/pricing');
  revalidatePath('/pricing');
  revalidatePath('/');
  return { success: true };
}
