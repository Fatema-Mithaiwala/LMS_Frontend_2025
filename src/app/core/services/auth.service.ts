import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { Register } from '../interfaces/register.interface';
import { Login } from '../interfaces/login.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/Auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    

    constructor(private http: HttpClient, private userService: UserService) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            this.currentUserSubject.next(user);
            this.refreshUserData(user.userId);
        }
    }


    register(payload: Register): Observable<{ message: string }> {
        return this.http
            .post<{ message: string }>(`${this.apiUrl}/register`, payload)
            .pipe(
                catchError(err => this.handleError(err, 'Registration failed'))
            );
    }

    login(payload: Login): Observable<User> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(response => {
                const user: User = {
                    userId: response.userId,
                    fullName: response.fullName,
                    email: response.email,
                    phoneNumber: response.phoneNumber,
                    role: response.role
                };

                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);

                this.refreshUserData(response.userId);
            }),
            map(response => ({
                userId: response.userId,
                fullName: response.fullName,
                email: response.email,
                phoneNumber: response.phoneNumber,
                role: response.role
            })),
            catchError(err => this.handleError(err, 'Login failed'))
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
            catchError(err => this.handleError(err, 'Failed to send OTP'))
        );
    }

    resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { email, otp, newPassword }).pipe(
            catchError(err => this.handleError(err, 'Failed to reset password'))
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getUserRole(): string | null {
        return this.currentUserSubject.value?.role || null;
    }

    refreshUserData(userId: number): void {
        this.userService.getUserById(userId).subscribe({
            next: (user) => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            },
            error: (err) => {
                console.error('Failed to refresh user data:', err);
            }
        });
    }

    private handleError(err: HttpErrorResponse, fallbackMsg: string) {
        const message = err.error?.message || fallbackMsg;
        return throwError(() => new Error(message));
    }
}