import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { Register } from '../interfaces/register.interface';
import { UpdateUser } from '../interfaces/update-user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl = `${environment.apiUrl}/User`;

    constructor(private http: HttpClient) { }

    private mapUserDto = (dto: any): User => ({
        userId: dto.userId,
        fullName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        role: dto.role ?? dto.roleName ?? '',      
        isBlocked: dto.isBlocked,
    });

    getAllUsers(): Observable<User[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(list => list.map(this.mapUserDto)),
            catchError(this.handleError('fetching all users'))
        );
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(this.mapUserDto),
            catchError(this.handleError('fetching user by id'))
        );
    }

    getUsersByRole(roleId: number): Observable<User[]> {
        return this.http.get<any[]>(`${this.apiUrl}/role/${roleId}`).pipe(
            map(list => list.map(this.mapUserDto)),
            catchError(this.handleError('fetching users by role'))
        );
    }

    createUser(payload: Register, roleId: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}?roleId=${roleId}`, payload).pipe(
            catchError(this.handleError('User creation failed'))
        );
    }

    updateUser(userId: number, payload: UpdateUser): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${userId}`, payload).pipe(
            catchError(this.handleError('User update failed'))
        );
    }

    deleteUser(userId: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`).pipe(
            catchError(this.handleError('User deletion failed'))
        );
    }

    blockUser(id: number, block: boolean): Observable<{ message: string }> {
        return this.http
            .patch<{ message: string }>(`${this.apiUrl}/${id}/block`, { block })
            .pipe(catchError(this.handleError(block ? 'blocking user' : 'unblocking user')));
    }
    
    private handleError(op: string) {
        return (e: HttpErrorResponse) =>
            throwError(() => new Error(e.error?.message || `Error while ${op}`));
    }
}


