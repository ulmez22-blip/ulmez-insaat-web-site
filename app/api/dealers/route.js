import { NextResponse } from 'next/server';
import { getDealers } from '../../../lib/db';

// Dealer logos are still meant to be edited by hand in data/dealers.json —
// without this, Next.js statically bakes the response at build time, so an
// edit would never show up until the next full rebuild.
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getDealers());
}
