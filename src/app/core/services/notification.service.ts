import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppNotification } from '../interfaces/Notification.interface';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.apiUrl}/Notification`;

    constructor(private http: HttpClient) { }

    getNotifications(userId: number): Observable<AppNotification[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        });
        return this.http.get<AppNotification[]>(`${this.apiUrl}`, { headers });
    }

    markAsRead(notificationId: number): Observable<{ message: string }> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        });
        return this.http.patch<{ message: string }>(`${this.apiUrl}/${notificationId}/read`, {}, { headers });
    }

    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    updateUnreadCount(notifications: AppNotification[]): void {
        const unread = notifications.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unread);
    }

}