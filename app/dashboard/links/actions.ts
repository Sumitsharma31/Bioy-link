'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { linkSchema } from '@/lib/validations'

export async function addLink(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // 1. Validate Input
  const validatedFields = linkSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { title, url } = validatedFields.data
  const iconName = formData.get('iconName') as string || 'Globe'

  const { error } = await supabase
    .from('links')
    .insert({
      profile_id: user.id,
      title,
      url,
      icon_name: iconName,
      order_index: 0 
    })

  if (error) {
    console.error('Add link error:', error)
    return { error: 'Failed to add link. Please try again.' }
  }

  revalidatePath('/dashboard/links')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function toggleLinkActive(linkId: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('links')
    .update({ is_active: isActive })
    .eq('id', linkId)
    .eq('profile_id', user.id) // Security check: Ensure they own the link

  if (error) {
     console.error('Toggle link error:', error)
     return { error: 'Failed to update link status.' }
  }

  revalidatePath('/dashboard/links')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function deleteLink(linkId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .eq('profile_id', user.id) // Security check: Ensure they own the link

  if (error) {
     console.error('Delete link error:', error)
     return { error: 'Failed to delete link.' }
  }

  revalidatePath('/dashboard/links')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function updateLinkIcon(linkId: string, iconName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('links')
    .update({ icon_name: iconName })
    .eq('id', linkId)
    .eq('profile_id', user.id)

  if (error) {
     console.error('Update icon error:', error)
     return { error: 'Failed to update link icon.' }
  }

  revalidatePath('/dashboard/links')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function updateBio(bio: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ bio: bio })
    .eq('id', user.id)

  if (error) {
    console.error('Update bio error:', error)
    return { error: 'Failed to update bio.' }
  }

  revalidatePath('/dashboard/links')
  revalidatePath('/[username]', 'page')
  revalidateTag('profile', 'default') // bust getCachedProfile — bio is a profile field
  return { success: true }
}

export async function reorderLinks(linkIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // We perform multiple updates. 
  // In a high-traffic app, we might use a dedicated RPC or upsert.
  // For this scale, sequential updates are fine.
  const updates = linkIds.map((id, index) => 
    supabase
      .from('links')
      .update({ order_index: index })
      .eq('id', id)
      .eq('profile_id', user.id)
  )

  await Promise.all(updates)

  revalidatePath('/dashboard/links')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

