import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateProduct, deleteProduct } from '../../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../../lib/auth';

function requireAuth() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return isValidSessionToken(token);
}

export async function PUT(request, { params }) {
  if (!requireAuth()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json();
  const updated = updateProduct(params.id, body);
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  if (!requireAuth()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const ok = deleteProduct(params.id);
  if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
