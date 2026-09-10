import { NextResponse } from 'next/server';
import {
  checkPassword, makeSessionToken, SESSION_COOKIE,
  isLoginLocked, recordFailedLogin, clearLoginAttempts,
} from '../../../../lib/auth';

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function POST(request) {
  const ip = getClientIp(request);

  if (isLoginLocked(ip)) {
    return NextResponse.json(
      { error: 'Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (!checkPassword(password)) {
    recordFailedLogin(ip);
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }

  clearLoginAttempts(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
