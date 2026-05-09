'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateUsername, normalizeUsername, RESERVED_USERNAMES } from '@/lib/username'

export async function createProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Normalize and validate
  const raw = formData.get('username') as string ?? ''
  const username = normalizeUsername(raw)

  if (!username) {
    return { error: 'Please choose a username before continuing.' }
  }

  // Read name fields
  const firstName = (formData.get('first_name') as string ?? '').trim()
  const lastName  = (formData.get('last_name')  as string ?? '').trim()

  if (!firstName) {
    return { error: 'Please enter your first name.' }
  }

  const fullName = lastName ? `${firstName} ${lastName}` : firstName

  // Read user's plan — default free for new accounts
  const planType: 'free' | 'premium' = 'free'

  const validation = validateUsername(username, planType)

  if (!validation.ok) {
    switch (validation.reason) {
      case 'FORMAT':
        return { error: validation.message }
      case 'RESERVED':
        return { error: 'This username is reserved and cannot be used.' }
      case 'PREMIUM_REQUIRED':
        return { error: 'Short single-word usernames require a Pro plan. Please pick a different username.' }
    }
  }

  // Double-check reserved (defense-in-depth)
  if (RESERVED_USERNAMES.has(username)) {
    return { error: 'This username is reserved.' }
  }

  // Uniqueness check
  const { data: existing, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (checkError) {
    console.error('Username check error:', checkError)
    return { error: 'Failed to verify username availability. Please try again.' }
  }

  if (existing) {
    return { error: 'Username is already taken. Please choose another.' }
  }

  // Create profile — unique constraint handles race conditions
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username,
      full_name: fullName,
      subscription_tier: 'free',
    })

  if (profileError) {
    // Postgres unique violation code
    if (profileError.code === '23505') {
      return { error: 'Username was just taken. Please choose another.' }
    }
    console.error('Profile creation error:', profileError)
    return { error: 'Failed to create profile. Please contact support if this persists.' }
  }

  // Default appearance settings (non-fatal if fails)
  const { error: appearanceError } = await supabase
    .from('appearance')
    .insert({
      profile_id: user.id,
      theme_preset: 'Modern Lime',
    })

  if (appearanceError) {
    console.error('Appearance creation error:', appearanceError)
  }

  redirect('/dashboard')
}
