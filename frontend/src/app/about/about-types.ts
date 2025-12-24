import { Content } from '@/lib/graphql/graphql-types';

export interface AboutManagerProps {
  contents: Record<string, Content[]>;
}

export interface AboutCardProps {
  content: Content;
}
