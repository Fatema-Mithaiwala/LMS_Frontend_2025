import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BorrowTransaction } from '../interfaces/borrowTransaction.interface';

@Injectable({ providedIn: 'root' })
export class BorrowTransactionService {
    private readonly apiUrl = `${environment.apiUrl}/BorrowTransaction`;
    private readonly returnRequestApiUrl = `${environment.apiUrl}/ReturnRequest`;
    private readonly TIMEOUT = 30_000;

    constructor(private http: HttpClient) { }

    getCurrentBorrows(userId: number): Observable<BorrowTransaction[]> {
        const url = `${this.apiUrl}?returnDate=null&userId=${userId}`;
        return this.http.get<BorrowTransaction[]>(url).pipe(
            timeout(this.TIMEOUT),
            catchError(this.handleError('fetching current borrows'))
        );
    }

    createReturnRequest(userId: number, transactionId: number, bookId: number): Observable<{ message: string }> {
        const payload = { transactionId, bookId };
        return this.http.post<{ message: string }>(this.returnRequestApiUrl, payload).pipe(
            timeout(this.TIMEOUT),
            catchError(this.handleError('creating return request'))
        );
    }

    private handleError(operation: string) {
        return (error: HttpErrorResponse) => {
            const message = error.error?.detail || error.error?.message || `Error ${operation}: ${error.status} - ${error.statusText}`;
            return throwError(() => new Error(message));
        };
    }
}
