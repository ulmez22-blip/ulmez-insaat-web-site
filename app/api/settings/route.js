import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSettings, updateSettings } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

function localized(value) {
  return {
    tr: String(value?.tr || ''),
    en: String(value?.en || ''),
    ku: String(value?.ku || ''),
  };
}

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const phones = Array.isArray(body.phones) ? body.phones.map((p) => String(p || '')) : [];
  const updated = updateSettings({
    phones,
    about: localized(body.about),
    contact: localized(body.contact),
    address: localized(body.address),
  });
  return NextResponse.json(updated);
}
