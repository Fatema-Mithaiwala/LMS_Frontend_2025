export interface BorrowTransaction {
    transactionId: number;
    borrowRequestId: number;
    userId: number;
    bookId: number;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    penaltyAmount: number;
    notes: string;
}