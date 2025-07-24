import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/core/interfaces/book.interface';
import { BookService } from 'src/app/core/services/book.service';
import { BorrowRequestService } from 'src/app/core/services/borrow-request.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-browse-books',
  templateUrl: './browse-books.component.html',
  styleUrls: ['./browse-books.component.scss']
})
export class BrowseBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  search: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  selectedGenre: string = '';
  genres: string[] = [];
  isLoading: boolean = true;
  isProcessing: { [key: number]: boolean } = {};
  userId: number | null = null;

  constructor(
    private bookService: BookService,
    private borrowRequestService: BorrowRequestService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userId = user?.userId || null;
    });

    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filterBooks();
    });

    this.fetchBooks();
  }

  fetchBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.extractGenres();
        this.filterBooks();
        this.isLoading = false;
      },
      error: (err) => {
        this.showError(err.message);
        this.isLoading = false;
      }
    });
  }

  extractGenres(): void {
    const genres = new Set<string>();
    this.books.forEach(book => {
      if (book.genreName) {
        genres.add(book.genreName);
      }
    });
    this.genres = Array.from(genres).sort();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.search);
  }

  filterBooks(): void {
    let filtered = [...this.books];
    const term = this.search.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(book =>
        (book.title || '').toLowerCase().includes(term) ||
        (book.author || '').toLowerCase().includes(term) ||
        (book.genreName || '').toLowerCase().includes(term)
      );
    }
    if (this.selectedGenre) {
      filtered = filtered.filter(book =>
        (book.genreName || '').toLowerCase() === this.selectedGenre.toLowerCase()
      );
    }
    this.filteredBooks = filtered;
  }

  borrowBook(bookId: number): void {
    if (!this.userId) {
      this.showError('You must be logged in to borrow a book.');
      return;
    }
    this.isProcessing[bookId] = true;
    this.borrowRequestService.createBorrowRequest(this.userId, bookId).subscribe({
      next: (response) => {
        this.isProcessing[bookId] = false;
        this.showSuccess(response.message);
        this.fetchBooks();
      },
      error: (err) => {
        this.isProcessing[bookId] = false;
        this.showError(err.message);
      }
    });
  }

  notifyMe(bookId: number): void {
    if (!this.userId) {
      this.showError('You must be logged in to add a book to your wishlist.');
      return;
    }
    this.isProcessing[bookId] = true;
    this.wishlistService.addToWishlist(this.userId, bookId).subscribe({
      next: (response) => {
        this.isProcessing[bookId] = false;
        this.showSuccess(response.message);
      },
      error: (err) => {
        this.isProcessing[bookId] = false;
        this.showError(err.message);
      }
    });
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}