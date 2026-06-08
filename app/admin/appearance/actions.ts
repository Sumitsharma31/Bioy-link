'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import cloudinary from '@/lib/cloudinary'
import { createAdminClient } from '@/lib/supabase/admin'

export async function addBackgroundImage(formData: FormData) {
  const supabase = await createClient()
  
  // Verify Admin Access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const imageFile = formData.get('image') as File | null
  const tier = formData.get('tier') as string

  if (!name || !imageFile || imageFile.size === 0 || !tier) {
    return { error: 'Missing required fields' }
  }

  let uploadUrl = ''
  try {
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'biolinks/backgrounds' },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(buffer)
    }) as any
    uploadUrl = uploadResult.secure_url
  } catch (error) {
    console.error('Failed to upload to Cloudinary:', error)
    return { error: 'Failed to upload image' }
  }

  const adminSupabase = await createAdminClient()
  const { error } = await adminSupabase
    .from('background_images')
    .insert([{ name, url: uploadUrl, tier }])

  if (error) {
    console.error('Failed to add background:', error)
    return { error: 'Failed to add background' }
  }

  revalidatePath('/admin/appearance')
  revalidatePath('/dashboard/appearance')
  return { success: true }
}

export async function deleteBackgroundImage(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const adminSupabase = await createAdminClient()
  const { error } = await adminSupabase
    .from('background_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete background:', error)
    return { error: 'Failed to delete background' }
  }

  revalidatePath('/admin/appearance')
  revalidatePath('/dashboard/appearance')
  return { success: true }
}
