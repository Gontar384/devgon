import { Content } from '@/lib/graphql/graphql-types';
import { AuthUser } from '@/lib/auth/auth-types';

export interface AdminManagerProps {
  mainCardContent: Content | null;
  authUser: AuthUser;
}

export interface AdminMainCardProps {
  title: string;
  description: string;
  role: 'guest' | 'admin' | 'user';
  onSave?: (title: string, description: string) => void;
}
