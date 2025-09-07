export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  cookies?: Record<string, string>;
  user?: JwtPayload;
}

export interface GoogleProfile {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
  name?: { givenName?: string; familyName?: string };
  photos?: { value: string }[];
}
