import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BorrowRequest, ReturnRequest } from '../interfaces/request.interface';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private readonly api = environment.apiUrl;
    private readonly TIMEOUT = 3000;   

    constructor(private http: HttpClient) { }

    getAllBorrowRequests(status?: string): Observable<BorrowRequest[]> {
        const url = status
            ? `${this.api}/BorrowRequest?status=${status.toLowerCase()}`
            : `${this.api}/BorrowRequest`;

        return this.http.get<any[]>(url).pipe(
            timeout(this.TIMEOUT),
            map(reqs => reqs.map(r => this.mapBorrow(r))),
            catchError(this.handleError('fetching borrow requests'))
        );
    }

    approveBorrowRequest(id: number): Observable<void> {
        return this.http
            .post<void>(`${this.api}/BorrowRequest/approve/${id}`, {})
            .pipe(timeout(this.TIMEOUT), catchError(this.handleError('approving borrow request')));
    }

    rejectBorrowRequest(id: number, remarks?: string): Observable<void> {
        const body = remarks ?? null;   
        return this.http
            .post<void>(`${this.api}/BorrowRequest/reject/${id}`, body)
            .pipe(timeout(this.TIMEOUT), catchError(this.handleError('rejecting borrow request')));
    }


    getAllReturnRequests(status?: string): Observable<ReturnRequest[]> {
        const url = status
            ? `${this.api}/ReturnRequest?status=${status.toLowerCase()}`
            : `${this.api}/ReturnRequest`;

        return this.http.get<any[]>(url).pipe(
            timeout(this.TIMEOUT),
            map(reqs => reqs.map(r => this.mapReturn(r))),
            catchError(this.handleError('fetching return requests'))
        );
    }

    approveReturnRequest(id: number): Observable<void> {
        return this.http
            .post<void>(`${this.api}/ReturnRequest/approve/${id}`, {})
            .pipe(timeout(this.TIMEOUT), catchError(this.handleError('approving return request')));
    }

    rejectReturnRequest(id: number): Observable<void> {
        return this.http
            .post<void>(`${this.api}/ReturnRequest/reject/${id}`, null)
            .pipe(timeout(this.TIMEOUT), catchError(this.handleError('rejecting return request')));
    }

    private mapBorrow(r: any): BorrowRequest {
        return {
            borrowRequestId: r.borrowRequestId,
            userId: r.userId,
            userName: r.userName ?? 'Unknown',
            bookId: r.bookId,
            bookTitle: r.bookTitle ?? 'Unknown',
            requestDate: r.requestDate,
            status: this.normStatus(r.status),
            approverId: r.approverId,
            approvedAt: r.approvedAt,
            remarks: r.remarks,
            userActiveBorrows: r.userActiveBorrows ?? 0
        };
    }

    private mapReturn(r: any): ReturnRequest {
        return {
            returnRequestId: r.returnRequestId,
            bookId: r.bookId,
            bookTitle: r.bookTitle ?? 'Unknown',
            transactionId: r.transactionId,
            userId: r.userId,
            userName: r.userName ?? 'Unknown',
            returnDate: r.returnDate,
            status: this.normStatus(r.status),
            processedBy: r.processedBy,
            processedAt: r.processedAt,
            userActiveBorrows: r.userActiveBorrows ?? 0
        };
    }

    private normStatus(raw: string | undefined): 'Pending' | 'Approved' | 'Rejected' {
        const s = raw?.toLowerCase();
        if (s === 'approved') return 'Approved';
        if (s === 'rejected') return 'Rejected';
        return 'Pending';
    }

    private handleError(action: string) {
        return (error: HttpErrorResponse) => {
            const msg = error.error?.detail || error.error?.message || `Error ${action}`;
            return throwError(() => new Error(msg));
        };
    }
}
