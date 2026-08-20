import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/upload
 * Accepts multipart/form-data with one or more image files.
 * Uploads them to the Supabase Storage "products" bucket using the
 * service-role key (bypasses RLS). Returns public URLs.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const uploadedUrls: string[] = []

    for (const file of files) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
        continue
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        continue
      }

      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Convert File to ArrayBuffer then to Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error('Upload error:', error.message)
        continue
      }

      const { data } = supabase.storage.from('products').getPublicUrl(filePath)
      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: 'Failed to upload any files' }, { status: 500 })
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
