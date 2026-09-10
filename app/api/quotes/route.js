import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addQuote, getQuotes } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const quotes = getQuotes().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(quotes);
}

export async function POST(request) {
  const body = await request.json();
  const { name, phone, items } = body;

  if (!name || !phone || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  // Basic size guard against abuse.
  if (JSON.stringify(body).length > 20000) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }

  const quote = addQuote({
    name: String(name).slice(0, 200),
    phone: String(phone).slice(0, 50),
    email: body.email ? String(body.email).slice(0, 200) : '',
    address: body.address ? String(body.address).slice(0, 500) : '',
    message: body.message ? String(body.message).slice(0, 2000) : '',
    locale: body.locale || 'tr',
    items,
  });

  return NextResponse.json({ ok: true, id: quote.id }, { status: 201 });
}
