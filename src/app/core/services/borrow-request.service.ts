import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BorrowRequestService {
    private readonly apiUrl = `${environment.apiUrl}/BorrowRequest`;
    private readonly TIMEOUT = 30_000;

    constructor(private http: HttpClient) { }

    createBorrowRequest(userId: number, bookId: number): Observable<{ message: string }> {
        const payload = { bookId };
        return this.http.post<{ message: string }>(this.apiUrl, payload).pipe(
            timeout(this.TIMEOUT),
            catchError(this.handleError('creating borrow request'))
        );
    }

    private handleError(operation: string) {
        return (error: HttpErrorResponse) => {
            const message = error.error?.detail || error.error?.message || `Error ${operation}: ${error.status} - ${error.statusText}`;
            return throwError(() => new Error(message));
        };
    }
}
