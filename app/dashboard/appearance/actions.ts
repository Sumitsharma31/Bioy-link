'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function saveAppearance(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const themePreset = formData.get('theme_preset') as string
  const buttonStyle = formData.get('button_style') as string
  const fontFamily = formData.get('font_family') as string
  const bgImageUrl = formData.get('bg_image_url') as string

  // Upsert the appearance row
  const { error } = await supabase
    .from('appearance')
    .upsert({
      profile_id: user.id,
      theme_preset: themePreset || 'Modern Lime',
      button_style: buttonStyle || 'Rounded',
      font_family: fontFamily || 'Inter',
      bg_image_url: bgImageUrl || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' })

  if (error) {
    console.error('Save appearance error:', error)
    return { error: 'Failed to save appearance settings.' }
  }

  // Find the username for revalidating
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  revalidatePath('/dashboard/appearance')
  revalidateTag('appearance', 'default') // bust getCachedAppearance
  revalidateTag('profile', 'default')    // bust getCachedProfile
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)
  }
  
  return { success: true }
}
