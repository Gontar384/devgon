import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const body = await req.json();
  const tag = body.tag;

  if (!tag) {
    return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tag });
}
