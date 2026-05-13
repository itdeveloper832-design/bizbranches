import { NextRequest, NextResponse } from 'next/server';
import { submitToIndexNow } from '@/lib/indexnow';

/**
 * GET /api/indexnow
 * Query params:
 * - url: Single URL to submit
 * - action: 'sitemap' to submit all URLs from sitemap
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const action = searchParams.get('action');

  if (url) {
    const result = await submitToIndexNow([url]);
    return NextResponse.json(result);
  }

  if (action === 'sitemap') {
    return NextResponse.json({ success: false, message: 'Sitemap submission is temporarily disabled.' }, { status: 501 });
  }

  return NextResponse.json({ 
    success: false, 
    message: 'Missing "url" or "action=sitemap" parameter.' 
  }, { status: 400 });
}

/**
 * POST /api/indexnow
 * JSON body: { urls: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing "urls" array.' }, { status: 400 });
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
