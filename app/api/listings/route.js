import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getListings, addListing } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

export async function GET() {
  return NextResponse.json(getListings());
}

export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.title?.tr || !body.type || !body.status) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const listing = addListing(body);
  return NextResponse.json(listing, { status: 201 });
}
