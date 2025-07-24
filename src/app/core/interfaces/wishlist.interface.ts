export interface Wishlist {
    wishlistId: number;
    userId: number;
    bookId: number;
    bookTitle: string;
    isNotified: boolean;
    createdAt: string;
    availableCopies?: number;
}