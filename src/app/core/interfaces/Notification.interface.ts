export interface AppNotification {
    notificationId: number;
    userId: number;
    message: string;
    createdAt: string;
    isRead: boolean;
    type: string;
}