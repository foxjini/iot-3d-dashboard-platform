import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const searchParams = request.nextUrl.searchParams;
  const rawTargetIp = searchParams.get('target');
  const targetIp = rawTargetIp
    ? rawTargetIp.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim()
    : null;
  const path = params.path.join('/');

  if (!targetIp) {
    return NextResponse.json({ error: 'Target IP is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`http://${targetIp}/api/${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fetch failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const searchParams = request.nextUrl.searchParams;
  const rawTargetIp = searchParams.get('target');
  const targetIp = rawTargetIp
    ? rawTargetIp.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim()
    : null;
  const path = params.path.join('/');

  if (!targetIp) {
    return NextResponse.json({ error: 'Target IP is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`http://${targetIp}/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fetch failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
