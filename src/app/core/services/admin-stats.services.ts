import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminStatsService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getTotalCopies(): Observable<number> {
        return this.http.get<any[]>(`${this.apiUrl}/Book`).pipe(
            map(books => books.reduce((total, book) => total + (book.totalCopies || 0), 0)),
            catchError(this.handleError('fetching total books'))
        );
    }

    getTotalBooks(): Observable<number> {
        return this.http.get<any[]>(`${this.apiUrl}/Book`).pipe(
            map(books => books.length),
            catchError(this.handleError('fetching total books'))
        );
    }

    getBorrowedBooks(): Observable<number> {
        return this.http.get<any[]>(`${this.apiUrl}/BorrowTransaction?activeOnly=true`).pipe(
            map(transactions => transactions.length),
            catchError(this.handleError('fetching borrowed books'))
        );
    }

    getOverdueBooks(): Observable<number> {
        return this.http.get<any[]>(`${this.apiUrl}/BorrowTransaction`).pipe(
            map(transactions => {
                const currentDate = new Date();
                return transactions.filter(t => {
                    const dueDate = new Date(t.dueDate);
                    return !t.returnDate && dueDate < currentDate;
                }).length;
            }),
            catchError(this.handleError('fetching overdue books'))
        );
    }

    getPendingBorrowRequests(): Observable<number> {
        return this.http.get<any[]>(`${this.apiUrl}/BorrowRequest/pending`).pipe(
            map(requests => requests.length),
            catchError(this.handleError('fetching pending borrow requests'))
        );
    }

    getPendingReturnRequests(): Observable<number> {
        return this.http.get<any[]>(`${this.apiUrl}/ReturnRequest/pending`).pipe(
            map(requests => requests.length),
            catchError(this.handleError('fetching pending return requests'))
        );
    }

    getBorrowTransactions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/BorrowTransaction`).pipe(
            catchError(this.handleError('fetching borrow transactions'))
        );
    }

    getAllStats(): Observable<{
        totalBooks: number,
        totalCopies: number,
        availableBooks: number,
        borrowedBooks: number,
        overdueBooks: number,
        pendingBorrowRequests: number,
        pendingReturnRequests: number
    }> {
        return forkJoin({
            totalBooks: this.getTotalBooks(),
            totalCopies: this.getTotalCopies(),
            borrowedBooks: this.getBorrowedBooks(),
            overdueBooks: this.getOverdueBooks(),
            pendingBorrowRequests: this.getPendingBorrowRequests(),
            pendingReturnRequests: this.getPendingReturnRequests()
        }).pipe(
            map(stats => ({
                totalBooks: stats.totalBooks,
                totalCopies : stats.totalCopies,
                availableBooks: stats.totalCopies - stats.borrowedBooks,
                borrowedBooks: stats.borrowedBooks,
                overdueBooks: stats.overdueBooks,
                pendingBorrowRequests: stats.pendingBorrowRequests,
                pendingReturnRequests: stats.pendingReturnRequests
            })),
            catchError(this.handleError('fetching all stats'))
        );
    }

    private handleError(operation: string) {
        return (error: HttpErrorResponse) => {
            const message = error.error?.message || `Error ${operation}`;
            return throwError(() => new Error(message));
        };
    }
}