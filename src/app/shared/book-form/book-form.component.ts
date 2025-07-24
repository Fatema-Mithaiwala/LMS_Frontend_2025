import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from 'src/app/core/interfaces/book.interface';
import { GenreService } from 'src/app/core/services/genre.service';
import { Genre } from 'src/app/core/interfaces/genre.interface';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnChanges {
  @Input() book: Book | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSubmit = new EventEmitter<FormData>();

  bookForm: FormGroup;
  genres: Genre[] = [];
  coverImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService
  ) {
    this.bookForm = this.initForm();
    this.loadGenres();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book'] && this.book) {
      this.genreService.getGenres().subscribe({
        next: (genres) => {
          this.genres = genres;

          const matchedGenre = genres.find(g => g.genreName === this.book?.genreName);
          const genreId = matchedGenre ? matchedGenre.genreId : '';

          
          this.bookForm.patchValue({
            title: this.book!.title,
            author: this.book!.author,
            isbn: this.book!.isbn,
            genreId: genreId,
            description: this.book?.description,
            totalCopies: this.book!.totalCopies
          });
        },
        error: (err) => console.error('Failed to load genres:', err)
      });
    }

    if (changes['mode']) {
      this.bookForm.get('coverImage')?.setValidators(
        this.mode === 'create' ? Validators.required : null
      );
      this.bookForm.get('coverImage')?.updateValueAndValidity();
    }
  }

  private initForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{10}|\d{13}$/)]], 
      genreId: ['', Validators.required],
      description: ['', Validators.minLength(10)],
      totalCopies: [1, [Validators.required, Validators.min(1)]],
      coverImage: [null, this.mode === 'create' ? Validators.required : null]
    });
  }

  private loadGenres(): void {
    this.genreService.getGenres().subscribe({
      next: (genres) => (this.genres = genres),
      error: (err) => console.error('Failed to load genres:', err)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.coverImage = input.files[0];
      this.bookForm.get('coverImage')?.setValue(this.coverImage);
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formData = new FormData();
      formData.append('title', this.bookForm.get('title')?.value);
      formData.append('author', this.bookForm.get('author')?.value);
      formData.append('isbn', this.bookForm.get('isbn')?.value);
      formData.append('genreId', this.bookForm.get('genreId')?.value.toString());
      formData.append('description', this.bookForm.get('description')?.value || '');
      formData.append('totalCopies', this.bookForm.get('totalCopies')?.value.toString());
      if (this.coverImage) {
        formData.append('coverImage', this.coverImage);
      }
      this.formSubmit.emit(formData);
    } else {
      this.bookForm.markAllAsTouched();
    }
  }
}