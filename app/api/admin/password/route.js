import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkPassword, setPassword, SESSION_COOKIE, isValidSessionToken } from '../../../../lib/auth';

export async function PUT(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!checkPassword(currentPassword)) {
    return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 });
  }
  if (!newPassword || String(newPassword).length < 6) {
    return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalı' }, { status: 400 });
  }

  setPassword(String(newPassword));
  return NextResponse.json({ ok: true });
}
