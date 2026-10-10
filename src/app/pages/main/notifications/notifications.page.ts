import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppNotification } from 'src/app/models/notification.model';
import { NotificationService } from 'src/app/services/notification.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit, OnDestroy {

  notifications: AppNotification[] = [];

  private unsubscribe: (() => void) | null = null;

  constructor(
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const user = this.sessionService.getUser();

    if (!user) {
      return;
    }

    this.unsubscribe = this.notificationService.listenByUser(
      user.uid,
      notifications => {
        this.notifications = notifications;
      }
    );

  }

  ngOnDestroy(): void {

    this.unsubscribe?.();

  }

  async open(notification: AppNotification): Promise<void> {

    if (!notification.read && notification.id) {
      await this.notificationService.markAsRead(notification.id);
    }

    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }

  }

  async remove(notification: AppNotification): Promise<void> {

    if (!notification.id) {
      return;
    }

    await this.notificationService.delete(notification.id);

  }

}
