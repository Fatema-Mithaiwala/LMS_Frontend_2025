import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Book } from '../interfaces/book.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookService {
    private readonly apiUrl = `${environment.apiUrl}/Book`;

    constructor(private http: HttpClient) { }

    getBooks(): Observable<Book[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(books => books.map(book => ({
                bookId: book.bookId,
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                description: book.description,
                genreName: book.genreName || 'Unknown Genre',
                totalCopies: book.totalCopies,
                availableCopies: book.availableCopies,
                coverImageBase64: book.coverImageBase64 ? `${environment.baseUrl}${book.coverImageBase64}` : null
            }))),
            catchError(this.handleError('fetching books'))
        );
    }
    
    createBook(formData: FormData): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(this.apiUrl, formData).pipe(
            catchError(this.handleError('creating book'))
        );
    }

    updateBook(id: number, formData: FormData): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, formData).pipe(
            catchError(this.handleError('updating book'))
        );
    }

    deleteBook(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError('deleting book'))
        );
    }

    private handleError(action: string) {
        return (error: HttpErrorResponse) => {
            const msg = error.error?.message || `Error occurred while ${action}`;
            return throwError(() => new Error(msg));
        };
    }
}