'use server'

import { createClient } from '@/lib/supabase/server'
import { forgotPasswordSchema } from '@/lib/validations'
import { AuthError } from '@supabase/supabase-js'

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const validatedFields = forgotPasswordSchema.safeParse({ email })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(validatedFields.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm?next=/reset-password`,
  })

  if (error) {
    if (error instanceof AuthError) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred.' }
  }

  return { message: 'If an account exists for this email, you will receive a password reset link shortly.' }
}
