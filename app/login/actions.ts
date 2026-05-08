'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authSchema } from '@/lib/validations'
import { AuthError } from '@supabase/supabase-js'

function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    // Map specific Supabase errors to user-friendly messages if needed
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
  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return handleAuthError(error)
  }

  revalidatePath('/', 'layout')
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
