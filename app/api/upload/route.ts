import cloudinary from "@/lib/cloudinary"

export function POST(req) {
    const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  
  cloudinary.v2.uploader.upload_stream
}