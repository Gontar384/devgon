export type UserRole = 'guest' | 'user' | 'admin';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ProtectedRoute {
  path: string;
  roles: UserRole[];
}
