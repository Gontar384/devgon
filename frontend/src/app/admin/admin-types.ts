import { Content } from '@/lib/graphql/graphql-types';
import { AuthUser } from '@/lib/auth/auth-types';

export interface AdminAboutManagerProps {
  mainCardContent: Content | null;
  authUser: AuthUser;
}

export interface AdminHomeManagerProps {
  mainCardContent: Content | null;
  authUser: AuthUser;
}
