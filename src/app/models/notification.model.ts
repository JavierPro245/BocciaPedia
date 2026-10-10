export interface AppNotification {

  id?: string;

  userId: string;

  title: string;

  message: string;

  link?: string;

  read: boolean;

  createdAt: Date;

}
