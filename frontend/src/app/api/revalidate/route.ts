import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const TAG_TO_PATHS: Record<string, string[]> = {
  'home-hero': ['/'],
  'home-intro': ['/'],
  'home-projects': ['/'],
  'home-experience': ['/'],
  'home-workflow': ['/'],
  'home-tech': ['/'],
  'home-about': ['/'],
  'home-contact': ['/', '/cms'],
  'cms-hero': ['/cms'],
  'cms-flow': ['/cms'],
  'cms-breakdown': ['/cms'],
  'cms-preview': ['/cms'],
  'cms-why': ['/cms'],
  'privacy-policy-info': ['/privacy-policy'],
  'privacy-policy-sections': ['/privacy-policy'],
};

export async function POST(req: Request) {
  const body = await req.json();
  const tag = body.tag;

  if (!tag) {
    return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
  }

  revalidateTag(tag, {});

  const paths = TAG_TO_PATHS[tag] ?? [];
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, tag });
}
