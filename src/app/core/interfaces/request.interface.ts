export interface BorrowRequest {
    borrowRequestId: number;
    userId: number;
    userName: string;
    bookId: number;
    bookTitle: string;
    requestDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    approverId?: number;
    approvedAt?: string;
    remarks?: string;
    userActiveBorrows: number;
}

export interface ReturnRequest {
    returnRequestId: number;
    bookId: number;
    bookTitle: string;
    transactionId: number;
    userId: number;
    userName: string;
    returnDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    processedBy?: number;
    processedAt?: string;
    userActiveBorrows: number;
}