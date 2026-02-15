import { Request } from 'express';

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
  user: JwtPayload;
}

export type CookieKind = 'access' | 'refresh';

export interface GoogleProfile {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
  name?: { givenName?: string; familyName?: string };
  photos?: { value: string }[];
}
