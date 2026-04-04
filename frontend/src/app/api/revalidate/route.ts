import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const TAG_TO_PATHS: Record<string, string[]> = {
  'home-hero': ['/'],
  'home-intro': ['/'],
  'home-services': ['/'],
  'home-solution': ['/'],
  'home-workflow': ['/'],
  'home-tech': ['/'],
  'home-about': ['/'],
  'home-contact': [
    '/',
    '/services/systems',
    'services/integrations',
    'services/ai',
  ],
  'systems-hero': ['/services/systems'],
  'systems-breakdown': ['/services/systems'],
  'systems-why': ['/services/systems'],
  'integrations-hero': ['/services/integrations'],
  'integrations-breakdown': ['/services/integrations'],
  'integrations-why': ['/services/integrations'],
  'ai-hero': ['/services/ai'],
  'ai-breakdown': ['/services/ai'],
  'ai-why': ['/services/ai'],
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
