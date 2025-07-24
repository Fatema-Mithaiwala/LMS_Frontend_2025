import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Wishlist } from '../interfaces/wishlist.interface';

@Injectable({ providedIn: 'root' })
export class WishlistService {
    private readonly apiUrl = `${environment.apiUrl}/Wishlist`;
    private readonly bookApiUrl = `${environment.apiUrl}/Books`;
    private readonly TIMEOUT = 3000;

    constructor(private http: HttpClient) { }

    addToWishlist(userId: number, bookId: number): Observable<{ message: string }> {
        const payload = { bookId };
        return this.http.post<{ message: string }>(this.apiUrl, payload).pipe(
            timeout(this.TIMEOUT),
            catchError(this.handleError('adding to wishlist'))
        );
    }

    getWishlist(userId: number): Observable<Wishlist[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            timeout(this.TIMEOUT),
            map(items => items.map(this.mapWishlistItem)),
            catchError(this.handleError('fetching wishlist'))
        );
    }

    removeFromWishlist(wishlistId: number, userId: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${wishlistId}`).pipe(
            timeout(this.TIMEOUT),
            catchError(this.handleError('removing from wishlist'))
        );
    }

    getBookAvailability(bookId: number): Observable<number> {
        return this.http.get<any>(`${this.bookApiUrl}/${bookId}`).pipe(
            timeout(this.TIMEOUT),
            map(book => book.availableCopies ?? 0),
            catchError(this.handleError('fetching book availability'))
        );
    }

    private mapWishlistItem(item: any): Wishlist {
        return {
            wishlistId: item.wishlistId,
            userId: item.userId,
            bookId: item.bookId,
            bookTitle: item.bookTitle ?? 'Unknown',
            isNotified: item.isNotified,
            createdAt: item.createdAt,
            availableCopies: item.availableCopies ?? 0
        };
    }

    private handleError(action: string) {
        return (error: HttpErrorResponse) => {
            const message =
                error.error?.detail ||
                error.error?.message ||
                `Error ${action}: ${error.status} - ${error.statusText}`;
            return throwError(() => new Error(message));
        };
    }
}
