import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAILS } from '@/lib/admins'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If no explicit redirect is set, redirect admins to /admin and others to /dashboard
      let target = next;
      if (next === '/dashboard' && data.user?.email && ADMIN_EMAILS.includes(data.user.email)) {
        target = '/admin';
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${target}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${target}`)
      } else {
        return NextResponse.redirect(`${origin}${target}`)
      }
    }
    
    console.error('OAuth Error:', error)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
