import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/core/interfaces/book.interface';
import { BookService } from 'src/app/core/services/book.service';
import { MessageService } from 'primeng/api';

declare var bootstrap: any;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  search: string = '';
  modalMode: 'create' | 'edit' = 'create';
  isLoading: boolean = true;

  constructor(
    private bookService: BookService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (err) => {
        this.showError(err.message);
        this.isLoading = false;
      }
    });
  }

  private showError(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  get filteredBooks(): Book[] {
    const term = this.search.trim().toLowerCase();
    return this.books.filter(book => {
      return (
        (book.title || '').toLowerCase().includes(term) ||
        (book.author || '').toLowerCase().includes(term) ||
        (book.genreName || '').toLowerCase().includes(term)
      );
    });
  }

  openCreateModal(): void {
    this.selectedBook = null;
    this.modalMode = 'create';
    this.openForm();
  }

  editBook(book: Book): void {
    this.selectedBook = book;
    this.modalMode = 'edit';
    this.openForm();
  }

  private openForm(): void {
    const modalEl = document.getElementById('bookFormModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  closeModal(): void {
    const modalEl = document.getElementById('bookFormModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.fetchBooks();
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Book deleted successfully' });
        },
        error: (err) => this.showError(err.message)
      });
    }
  }

  handleFormSubmit(formData: FormData): void {
    const action = this.modalMode === 'create'
      ? this.bookService.createBook(formData)
      : this.bookService.updateBook(this.selectedBook!.bookId, formData);

    action.subscribe({
      next: () => {
        this.fetchBooks();
        this.closeModal();
        this.messageService.add({
          severity: 'success',
          summary: this.modalMode === 'create' ? 'Created' : 'Updated',
          detail: `Book ${this.modalMode === 'create' ? 'created' : 'updated'} successfully`
        });
      },
      error: (err) => this.showError(err.message)
    });
  }
}