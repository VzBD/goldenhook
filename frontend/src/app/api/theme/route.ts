import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body?.mode;
    if (mode !== 'light' && mode !== 'dark') {
      return NextResponse.json({ error: 'invalid mode' }, { status: 400 });
    }
    const secure = process.env.NODE_ENV === 'production';
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    const cookie = `theme-mode=${mode}; Path=/; Max-Age=${maxAge}; SameSite=Lax; ${secure ? 'Secure; ' : ''}HttpOnly`;
    return NextResponse.json({ ok: true }, { headers: { 'Set-Cookie': cookie } });
  } catch (e) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
