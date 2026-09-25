import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSettings, updateSettings } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

// Without this, Next.js statically optimizes this route at build time since
// GET doesn't touch cookies/headers — which silently strips PUT support too
// (a statically-generated route only ever serves the baked-in GET response),
// so saving settings from the admin panel would fail with a 405.
export const dynamic = 'force-dynamic';

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
