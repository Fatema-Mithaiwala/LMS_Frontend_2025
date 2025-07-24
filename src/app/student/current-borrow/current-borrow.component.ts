import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BorrowTransactionService } from 'src/app/core/services/borrow-transaction.service';
import { BorrowTransaction } from 'src/app/core/interfaces/borrowTransaction.interface';
import { AuthService } from 'src/app/core/services/auth.service';

interface ReturnRequest {
  returnRequestId: number;
  bookId: number;
  transactionId: number;
  userId: number;
  returnDate: string;
  status: string;
}

@Component({
  selector: 'app-current-borrow',
  templateUrl:'./current-borrow.component.html' ,
  styleUrls: ['./current-borrow.component.scss']
})
export class CurrentBorrowComponent implements OnInit {
  borrows: BorrowTransaction[] = [];
  userId: number | null = null;
  currentDate: Date = new Date('2025-06-17T21:46:00+05:30'); 
  pendingReturnRequests: Set<number> = new Set();
  flippedCards: boolean[] = [];
  private returnRequestApiUrl = `${environment.apiUrl}/ReturnRequest`;

  constructor(
    private borrowTransactionService: BorrowTransactionService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userId = user?.userId || null;
    });
    if (this.userId) {
      this.loadCurrentBorrows();
    }
  }

  loadCurrentBorrows(): void {
    this.borrowTransactionService.getCurrentBorrows(this.userId!).subscribe({
      next: (borrows: BorrowTransaction[]) => {
        this.borrows = borrows;
        this.flippedCards = new Array(borrows.length).fill(false);
      },
      error: (error: any) => console.error('Failed to load current borrows:', error)
    });
  }

  hasPendingReturnRequest(transactionId: number): boolean {
    return this.pendingReturnRequests.has(transactionId);
  }

  isOverdue(dueDate: string): boolean {
    const due = new Date(dueDate);
    return due < this.currentDate;
  }

  getTimeLeftPercentage(dueDate: string): number {
    const borrowDate = new Date(this.borrows.find(b => b.dueDate === dueDate)!.borrowDate);
    const due = new Date(dueDate);
    const totalDuration = due.getTime() - borrowDate.getTime();
    const timeLeft = due.getTime() - this.currentDate.getTime();
    const percentage = (timeLeft / totalDuration) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
  }

  toggleFlip(index: number): void {
    this.flippedCards[index] = !this.flippedCards[index];
  }

  initiateReturn(borrow: BorrowTransaction): void {
    this.borrowTransactionService.createReturnRequest(this.userId!, borrow.transactionId, borrow.bookId).subscribe({
      next: () => {
        alert('Return request created successfully!');
        this.pendingReturnRequests.add(borrow.transactionId);
      },
      error: (error: any) => console.error('Failed to create return request:', error)
    });
  }
}