import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

interface BorrowRequest {
  borrowRequestId: number;
  userId: number;
  userName: string;
  bookId: number;
  bookTitle: string;
  requestDate: string;
  status: string;
  approverId?: number;
  approvedAt?: string;
  remarks?: string;
}

interface ReturnRequest {
  returnRequestId: number;
  bookId: number;
  transactionId: number;
  userId: number;
  returnDate: string;
  status: string;
  bookTitle: string;
  processedBy?: number;
  processedAt?: string;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestsComponent implements OnInit {
  borrowRequests: BorrowRequest[] = [];
  returnRequests: ReturnRequest[] = [];
  userId: number | null = null;
  activeTab: string = 'borrow'; // Default tab
  private borrowRequestApiUrl = `${environment.apiUrl}/BorrowRequest`;
  private returnRequestApiUrl = `${environment.apiUrl}/ReturnRequest`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userId = user?.userId || null;
      if (this.userId) {
        this.loadBorrowRequests();
        this.loadReturnRequests();
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadBorrowRequests(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    this.http.get<BorrowRequest[]>(`${this.borrowRequestApiUrl}/pending`, { headers }).subscribe({
      next: (requests) => this.borrowRequests = requests,
      error: (error) => console.error('Failed to load borrow requests:', error)
    });
  }

  loadReturnRequests(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    this.http.get<ReturnRequest[]>(`${this.returnRequestApiUrl}/pending`, { headers }).subscribe({
      next: (requests) => this.returnRequests = requests,
      error: (error) => console.error('Failed to load return requests:', error)
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }
}