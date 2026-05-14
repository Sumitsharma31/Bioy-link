'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/lib/cloudinary';
import { validateUsername, normalizeUsername, RESERVED_USERNAMES } from '@/lib/username';

// ─── Update Profile (name, avatar) ───────────────────────────────

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const fullName = `${firstName} ${lastName}`.trim();
  const avatarFile = formData.get('avatar') as File | null;

  let avatarUrl: string | undefined;

  if (avatarFile && avatarFile.size > 0) {
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'biolinks/avatars', public_id: `avatar_${user.id}`, overwrite: true },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(buffer);
    }) as any;
    avatarUrl = uploadResult.secure_url;
  }

  const updateData: Record<string, any> = {
    full_name: fullName,
    updated_at: new Date().toISOString(),
  };
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  revalidateTag('profile', 'default'); // bust getCachedProfile
  return { success: true };
}

export async function removeAvatar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id);
  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  revalidateTag('profile', 'default');
  return { success: true };
}


// ─── Update Username ──────────────────────────────────────────────

export async function updateUsername(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  const raw = (formData.get('new_username') as string) ?? '';
  const newUsername = normalizeUsername(raw);

  if (!newUsername) return { error: 'Please enter a username.' };

  // Fetch current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, subscription_tier')
    .eq('id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found.' };
  if (profile.username === newUsername) return { error: 'This is already your username.' };

  const planType = profile.subscription_tier === 'premium' ? 'premium' : 'free' as const;

  // Full validation
  const validation = validateUsername(newUsername, planType);
  if (!validation.ok) {
    if (validation.reason === 'PREMIUM_REQUIRED') {
      return { error: 'Short single-word usernames require a Pro plan.' };
    }
    return { error: validation.message };
  }

  if (RESERVED_USERNAMES.has(newUsername)) {
    return { error: 'This username is reserved.' };
  }

  // Uniqueness check
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', newUsername)
    .maybeSingle();

  if (existing) return { error: 'Username is already taken.' };

  // Record history FIRST (non-fatal)
  await supabase.from('username_history').insert({
    user_id: user.id,
    old_username: profile.username,
    new_username: newUsername,
  });

  // Update username
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ username: newUsername, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (updateError) {
    if (updateError.code === '23505') return { error: 'Username was just taken. Please choose another.' };
    return { error: 'Failed to update username. Please try again.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  revalidateTag('profile', 'default'); // bust getCachedProfile — username changed
  return { success: true };
}

// ─── Delete Account ──────────────────────────────────────────────

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  // 1. Delete profile (cascades to links, appearance, etc. via DB constraints)
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (deleteError) {
    console.error('Delete profile error:', deleteError);
    return { error: 'Failed to delete profile data.' };
  }

  // 2. Delete user from Supabase Auth (requires service role)
  try {
    const adminClient = await createAdminClient();
    const { error: authError } = await adminClient.auth.admin.deleteUser(user.id);
    
    if (authError) {
      console.error('Auth deletion error:', authError);
      // We don't return here because the profile is already gone, 
      // but we log it. If the key is missing, this will throw.
    }
  } catch (err) {
    console.error('Admin client failed:', err);
    return { error: 'Admin key missing. Profile data was deleted, but Auth user remains. Please contact support.' };
  }

  // 3. Sign out (clears cookies)
  await supabase.auth.signOut();

  redirect('/');
}

// ─── Update Preferences (timezone) ───────────────────────────────

export async function updatePreferences(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  const timezone = formData.get('timezone') as string;

  if (!timezone) {
    return { error: 'Timezone is required.' };
  }

  const { error } = await supabase.from('profiles').update({ timezone }).eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  revalidateTag('profile', 'default');
  return { success: true };
}

// ─── Update Password ──────────────────────────────────────────────

export async function updatePassword(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
