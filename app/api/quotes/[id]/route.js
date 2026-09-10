import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateQuoteStatus } from '../../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { status } = await request.json();
  const updated = updateQuoteStatus(params.id, status);
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(updated);
}
