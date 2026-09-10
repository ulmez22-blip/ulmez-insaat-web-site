import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjects, addProject } from '../../../lib/db';
import { SESSION_COOKIE, isValidSessionToken } from '../../../lib/auth';

export async function GET() {
  return NextResponse.json(getProjects());
}

export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.name?.tr || !body.location) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const project = addProject(body);
  return NextResponse.json(project, { status: 201 });
}
