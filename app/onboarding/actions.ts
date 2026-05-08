'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { profileSchema } from '@/lib/validations'

export async function createProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // 1. Validate Input
  const validatedFields = profileSchema.safeParse({
    username: formData.get('username'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { username } = validatedFields.data

  // Check if username exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 means no rows returned, which is what we want.
    // Any other error is a DB issue.
    return { error: 'Failed to verify username availability. Please try again.' }
  }

  if (existingProfile) {
    return { error: 'Username is already taken' }
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username,
      full_name: 'New Creator',
      subscription_tier: 'free'
    })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    return { error: 'Failed to create profile. Please contact support if this persists.' }
  }

  // Create default appearance settings
  const { error: appearanceError } = await supabase
    .from('appearance')
    .insert({
      profile_id: user.id,
      theme_preset: 'Modern Lime',
    })
    
  if (appearanceError) {
     console.error('Appearance creation error:', appearanceError)
     // Non-fatal, we can still proceed
  }

  redirect('/dashboard')
}
