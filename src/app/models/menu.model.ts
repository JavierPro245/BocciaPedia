import { UserRole } from './user.model';

export interface Menu {

  title: string;

  icon: string;

  url?: string;

  children?: Menu[];

  roles?: UserRole[];

  visible?: boolean;

  badge?: number;

  order?: number;

}