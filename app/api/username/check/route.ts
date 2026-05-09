import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  validateUsername,
  generateSuggestions,
  normalizeUsername,
  isPremiumUsername,
  RESERVED_USERNAMES,
  validateUsernameFormat,
} from '@/lib/username';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('username') ?? '';
  const plan = (searchParams.get('plan') ?? 'free') as 'free' | 'premium';

  const username = normalizeUsername(raw);

  // ── 1. Format validation (fast, no DB)
  const format = validateUsernameFormat(username);
  if (!format.valid) {
    return NextResponse.json({
      available: false,
      isPremiumRequired: false,
      formatError: format.error,
      suggestions: generateSuggestions(username),
    });
  }

  // ── 2. Reserved check
  if (RESERVED_USERNAMES.has(username)) {
    return NextResponse.json({
      available: false,
      isPremiumRequired: false,
      formatError: 'This username is reserved',
      suggestions: generateSuggestions(username),
    });
  }

  // ── 3. Premium gating
  const premiumRequired = isPremiumUsername(username);
  if (premiumRequired && plan === 'free') {
    return NextResponse.json({
      available: false,
      isPremiumRequired: true,
      formatError: null,
      suggestions: generateSuggestions(username),
    });
  }

  // ── 4. Uniqueness check (DB)
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (data) {
      // Taken → generate suggestions
      return NextResponse.json({
        available: false,
        isPremiumRequired: false,
        formatError: null,
        suggestions: generateSuggestions(username),
      });
    }

    return NextResponse.json({
      available: true,
      isPremiumRequired: false,
      formatError: null,
      suggestions: [],
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
