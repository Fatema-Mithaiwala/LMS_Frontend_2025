export interface Book {
    bookId: number;
    title: string;
    author: string;
    isbn: string;
    description: string;
    genreName: string; 
    totalCopies: number;
    availableCopies: number;
    coverImageBase64: string | null;
    
}