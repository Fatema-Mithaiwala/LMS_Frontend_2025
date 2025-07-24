import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AppNotification } from 'src/app/core/interfaces/Notification.interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit {
  notifications: AppNotification[] = [];
  userId: number | null = null;
  currentDate: Date = new Date('2025-06-18T01:32:00+05:30');

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userId = user?.userId || null;
      if (this.userId) {
        this.loadNotifications();
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.userId!).subscribe({
      next: (notifications) => {
        const unread = notifications.filter(n => !n.isRead);
        this.notifications = unread.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.notificationService.updateUnreadCount(unread);
      },
      error: (err) => console.error('Failed to load notifications:', err)
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.notificationId !== notificationId);
        this.notificationService.updateUnreadCount(this.notifications);
      },
      error: (err) => console.error('Failed to mark as read:', err)
    });
  }

  getIconClass(type: string | undefined | null): string {
    switch (type?.toLowerCase()) {
      case 'info': return 'bi bi-info-circle';
      case 'warning': return 'bi bi-exclamation-triangle';
      case 'success': return 'bi bi-check-circle';
      case 'error': return 'bi bi-x-circle';
      default: return 'bi bi-bell';
    }
  }
}
