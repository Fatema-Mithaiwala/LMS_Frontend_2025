import { BookService } from 'src/app/core/services/book.service';
import { Book } from 'src/app/core/interfaces/book.interface'; 
import { Component, OnInit } from '@angular/core';
import { Wishlist } from 'src/app/core/interfaces/wishlist.interface';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { BorrowRequestService } from 'src/app/core/services/borrow-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlist: Wishlist[] = [];
  userId: number | null = null;
  allBooks: Book[] = [];
  isLoading = true;

  constructor(
    private wishlistService: WishlistService,
    private borrowRequestService: BorrowRequestService,
    private authService: AuthService,
    private bookService: BookService 
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userId = user?.userId ?? null;
      if (this.userId) {
        this.loadWishlistAndBooks();
      }
    });
  }

  loadWishlistAndBooks(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist(this.userId!).subscribe({
      next: (items) => {
        this.wishlist = items;
        this.bookService.getBooks().subscribe({
          next: (books) => {
            this.allBooks = books;
            this.mapAvailability();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Failed to load books:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Failed to load wishlist:', error);
        this.isLoading = false;
      }
    });
  }

  mapAvailability(): void {
    this.wishlist.forEach(item => {
      const book = this.allBooks.find(b => b.bookId === item.bookId);
      item.availableCopies = book?.availableCopies ?? 0;
    });
  }

  removeFromWishlist(wishlistId: number): void {
    this.wishlistService.removeFromWishlist(wishlistId, this.userId!).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(item => item.wishlistId !== wishlistId);
      },
      error: (error) => console.error('Failed to remove from wishlist:', error)
    });
  }

  borrowBook(bookId: number): void {
    this.borrowRequestService.createBorrowRequest(this.userId!, bookId).subscribe({
      next: () => {
        alert('Borrow request created successfully!');
        this.wishlist = this.wishlist.filter(item => item.bookId !== bookId);
      },
      error: (error) => console.error('Failed to create borrow request:', error)
    });
  }

}
