import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Genre } from '../interfaces/genre.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GenreService {
    private readonly apiUrl = `${environment.apiUrl}/Genre`;

    constructor(private http: HttpClient) { }

    getGenres(): Observable<Genre[]> {
        return this.http.get<Genre[]>(this.apiUrl).pipe(
            catchError(this.handleError('fetching genres'))
        );
    }

    private handleError(action: string) {
        return (error: HttpErrorResponse) => {
            const msg = error.error?.message || `Error occurred while ${action}`;
            return throwError(() => new Error(msg));
        };
    }
}