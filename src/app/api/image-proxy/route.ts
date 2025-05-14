import { NextRequest } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new Response('Missing URL', { status: 400 })
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const contentType = response.headers['content-type'] || 'image/jpeg'

    return new Response(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return new Response('Failed to load image', { status: 500 })
  }
}
