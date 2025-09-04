import { SupabaseClient } from '@supabase/supabase-js'

const STORAGE_BUCKET = 'listing-media'
const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_FILE_MAX_MB || '25') * 1024 * 1024 // 25MB default

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  userId: string
): Promise<UploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      url: '',
      path: '',
      error: `File size exceeds ${process.env.NEXT_PUBLIC_FILE_MAX_MB || '25'}MB limit`
    }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      url: '',
      path: '',
      error: 'File must be an image'
    }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

  try {
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)

    return {
      url: publicUrl,
      path: fileName,
      error: undefined
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      url: '',
      path: '',
      error: error.message || 'Failed to upload image'
    }
  }
}

export async function uploadMultipleImages(
  supabase: SupabaseClient,
  files: File[],
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  const total = files.length

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(supabase, files[i], userId)
    results.push(result)
    
    if (onProgress) {
      onProgress((i + 1) / total * 100)
    }
  }

  return results
}

export async function deleteImage(
  supabase: SupabaseClient,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export async function deleteMultipleImages(
  supabase: SupabaseClient,
  paths: string[]
): Promise<boolean> {
  if (paths.length === 0) return true

  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export function getImageUrlFromPath(
  supabase: SupabaseClient,
  path: string
): string {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)
  
  return publicUrl
}

export function validateImageFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${process.env.NEXT_PUBLIC_FILE_MAX_MB || '25'}MB limit`
  }

  if (!file.type.startsWith('image/')) {
    return 'File must be an image'
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return 'Invalid image format. Please use JPEG, PNG, WebP, or GIF'
  }

  return null
}
