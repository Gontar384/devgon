import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { fetchPublicContents } from '@/cms/content/util/service/loadPageContents';

export async function POST(req: Request) {
  const body = await req.json();
  const tag = body.tag;

  if (!tag) {
    return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
  }

  revalidateTag(tag, {});

  await fetchPublicContents(tag);

  return NextResponse.json({ revalidated: true, tag });
}
