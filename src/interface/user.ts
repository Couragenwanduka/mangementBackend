export type UserRole = 'User' | 'Admin';

export interface UserType{
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: UserRole;
  position: string;
  status?: 'Active' | 'Resigned' | 'LayedOff' | 'Fired';
  picture?: string
}