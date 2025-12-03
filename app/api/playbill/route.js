import { NextResponse } from 'next/server';
import { fetchPlaybill } from '@/lib/googleSheets.js';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing required slug query parameter.' },
      { status: 400 }
    );
  }

  try {
    const playbill = await fetchPlaybill(slug);

    if (!playbill) {
      return NextResponse.json(
        { error: `Playbill "${slug}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(playbill, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Failed to load playbill', error);
    return NextResponse.json(
      { error: 'Failed to load playbill data.' },
      { status: 500 }
    );
  }
}
