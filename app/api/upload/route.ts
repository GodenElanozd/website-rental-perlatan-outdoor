import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

// Simple in-memory storage for tracking uploaded files
// In production, you would use a proper file management system
const uploadedFiles = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const oldFileUrl = formData.get("oldFileUrl") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Compress image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true }) // Resize large images
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer()

    // Convert to base64 for storage (in production, use cloud storage)
    const base64 = compressedBuffer.toString("base64")
    const dataUrl = `data:image/webp;base64,${base64}`

    // Track the new file
    uploadedFiles.add(dataUrl)

    // In a real production environment, you would:
    // 1. Upload the new file to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Delete the old file from cloud storage if oldFileUrl is provided
    // 3. Return the new file URL

    // For demo purposes, we'll just log that we would delete the old file
    if (oldFileUrl && oldFileUrl.startsWith("data:")) {
      console.log("Would delete old file:", oldFileUrl.substring(0, 50) + "...")
      uploadedFiles.delete(oldFileUrl)
    }

    return NextResponse.json({
      url: dataUrl,
      filename: file.name,
      size: compressedBuffer.length,
      type: "image/webp",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

// Add a DELETE endpoint for cleaning up files
export async function DELETE(request: NextRequest) {
  try {
    const { fileUrl } = await request.json()

    if (fileUrl && uploadedFiles.has(fileUrl)) {
      uploadedFiles.delete(fileUrl)
      console.log("File deleted from memory:", fileUrl.substring(0, 50) + "...")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
