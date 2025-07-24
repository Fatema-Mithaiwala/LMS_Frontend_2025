export interface User {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isBlocked?: boolean;
}
