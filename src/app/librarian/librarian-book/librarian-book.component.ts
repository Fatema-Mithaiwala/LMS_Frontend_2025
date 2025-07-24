import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Book } from 'src/app/core/interfaces/book.interface';
import { BookService } from 'src/app/core/services/book.service';

declare var bootstrap: any;

@Component({
  selector: 'app-librarian-book',
  templateUrl: './librarian-book.component.html',
  styleUrls: ['./librarian-book.component.scss']
})
export class LibrarianBookComponent {
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
        console.error('Error fetching books:', err);
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
