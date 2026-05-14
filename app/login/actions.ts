'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authSchema } from '@/lib/validations'
import { AuthError } from '@supabase/supabase-js'
import { ADMIN_EMAILS } from '@/lib/admins'

function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    if (error.message.includes('User already registered')) {
      return { error: 'This email is already registered. Please sign in instead.' }
    }
    return { error: error.message }
  }
  return { error: 'An unexpected error occurred. Please try again.' }
}

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Validate Input
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // 2. Perform Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return handleAuthError(error)
  }

  // 3. Check for MFA
  if (data.session) {
    const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
      // User has 2FA enabled, must complete challenge
      return { mfaRequired: true };
    }
  }

  revalidatePath('/', 'layout')
  
  // Redirect admins to the admin panel, others to the dashboard
  if (data.user?.email && ADMIN_EMAILS.includes(data.user.email)) {
    redirect('/admin')
  }
  
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Validate Input
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // 2. Perform Signup
  const { data, error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return handleAuthError(error)
  }

  // If session is null, it usually means email confirmation is enabled
  if (data.user && !data.session) {
    return { message: 'Signup successful! Please check your email to confirm your account before logging in.' }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

/**
 * Combined action that reads a hidden 'mode' field ('login' | 'signup')
 * so we never need to swap the action inside useActionState.
 */
export async function handleAuth(prevState: any, formData: FormData) {
  const mode = formData.get('mode')
  if (mode === 'signup') {
    return signup(prevState, formData)
  }
  return login(prevState, formData)
}
