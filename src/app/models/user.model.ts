export type UserRole =
  | 'admin'
  | 'trainer'
  | 'athlete'
  | 'assistant'
  | 'referee';

export interface User {

  uid: string;

  email: string;

  displayName: string;

  photoURL: string;

  roles: UserRole[];

  approved: boolean;

  active: boolean;

  createdAt: number;

  updatedAt: number;

}