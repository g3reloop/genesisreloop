import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    
    // Security: Ensure the filename doesn't contain path traversal attempts
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 })
    }

    // Ensure filename has .docx extension
    const fullFilename = filename.endsWith('.docx') ? filename : `${filename}.docx`
    
    // Build the file path
    const filePath = path.join(process.cwd(), 'public', fullFilename)
    
    // Read the file
    const fileBuffer = await readFile(filePath)
    
    // Set appropriate headers for DOCX files
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fullFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error serving compliance document:', error)
    return new NextResponse('File not found', { status: 404 })
  }
}
