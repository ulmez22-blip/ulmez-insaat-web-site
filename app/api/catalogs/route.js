import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCatalogs, addCatalog } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

export async function GET() {
  return NextResponse.json(getCatalogs());
}

export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.dealerName || !body.title || !body.fileUrl) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const catalog = addCatalog(body);
  return NextResponse.json(catalog, { status: 201 });
}
