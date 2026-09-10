import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProducts, addProduct } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.sku || !body.category || !body.name?.tr) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const product = addProduct(body);
  return NextResponse.json(product, { status: 201 });
}
