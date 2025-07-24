import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BorrowRequest, ReturnRequest } from 'src/app/core/interfaces/request.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-librarian-request-management',
  templateUrl: './librarian-request-management.component.html',
  styleUrls: ['./librarian-request-management.component.scss']
})
export class LibrarianRequestManagementComponent implements OnInit {
  filteredBorrowRequests = signal<BorrowRequest[]>([]);
  filteredReturnRequests = signal<ReturnRequest[]>([]);
  borrowFilter = signal<'Pending' | 'Approved' | 'Rejected'>('Pending');
  returnFilter = signal<'Pending' | 'Approved' | 'Rejected'>('Pending');
  isLoadingBorrow = signal<boolean>(true);
  isLoadingReturn = signal<boolean>(true);

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {
    const role = this.authService.getUserRole();
    if (!role || (role !== 'Admin' && role !== 'Librarian')) {
      this.router.navigate(['/login'], { queryParams: { unauthorized: true } });
    }
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoadingBorrow.set(true);
    this.isLoadingReturn.set(true);

    this.requestService.getAllBorrowRequests(this.borrowFilter()).subscribe({
      next: (requests) => {
        this.filteredBorrowRequests.set(requests);
      },
      error: (err: Error) => {
        console.error('Error fetching borrow requests:', err);
        alert(`Error fetching borrow requests: ${err.message}`);
        this.filteredBorrowRequests.set([]);
      },
      complete: () => {
        this.isLoadingBorrow.set(false);
      }
    });

    this.requestService.getAllReturnRequests(this.returnFilter()).subscribe({
      next: (requests) => {
        this.filteredReturnRequests.set(requests);
      },
      error: (err: Error) => {
        console.error('Error fetching return requests:', err);
        alert(`Error fetching return requests: ${err.message}`);
        this.filteredReturnRequests.set([]);
      },
      complete: () => {
        this.isLoadingReturn.set(false);
       
      }
    });
  }

  onBorrowFilterChange(status: 'Pending' | 'Approved' | 'Rejected'): void {
    this.borrowFilter.set(status);
    this.loadRequests();
  }

  onReturnFilterChange(status: 'Pending' | 'Approved' | 'Rejected'): void {
    this.returnFilter.set(status);
    this.loadRequests();
  }

  approveBorrowRequest(id: number): void {
    if (!id || id <= 0) {
      alert('Invalid request ID. Cannot approve request.');
      return;
    }
    if (confirm(`Are you sure you want to approve borrow request ${id}?`)) {
      this.requestService.approveBorrowRequest(id).subscribe({
        next: () => {
          alert(`Borrow request ${id} approved successfully`);
          this.loadRequests();
        },
        error: (err: Error) => {
          alert(`Error approving borrow request: ${err.message}`);
        }
      });
    }
  }

  rejectBorrowRequest(id: number): void {
    if (!id || id <= 0) {
      alert('Invalid request ID. Cannot reject request.');
      return;
    }
    const remarks = prompt('Enter reason for rejection (optional):', '');
    if (remarks !== null) {
      if (remarks.length > 500) {
        alert('Remarks cannot exceed 500 characters!');
        return;
      }
      if (confirm(`Are you sure you want to reject borrow request ${id}?`)) {
        this.requestService.rejectBorrowRequest(id, remarks || undefined).subscribe({
          next: () => {
            alert(`Borrow request ${id} rejected successfully`);
            this.loadRequests();
          },
          error: (err: Error) => {
            alert(`Error rejecting borrow request: ${err.message}`);
          }
        });
      }
    }
  }

  approveReturnRequest(id: number): void {
    if (!id || id <= 0) {
      alert('Invalid request ID. Cannot approve request.');
      return;
    }
    if (confirm(`Are you sure you want to approve return request ${id}?`)) {
      this.requestService.approveReturnRequest(id).subscribe({
        next: () => {
          alert(`Return request ${id} approved successfully`);
          this.loadRequests();
        },
        error: (err: Error) => {
          alert(`Error approving return request: ${err.message}`);
        }
      });
    }
  }

  rejectReturnRequest(id: number): void {
    if (!id || id <= 0) {
      alert('Invalid request ID. Cannot reject request.');
      return;
    }
    if (confirm(`Are you sure you want to reject return request ${id}?`)) {
      this.requestService.rejectReturnRequest(id).subscribe({
        next: () => {
          alert(`Return request ${id} rejected successfully`);
          this.loadRequests();
        },
        error: (err: Error) => {
          alert(`Error rejecting return request: ${err.message}`);
        }
      });
    }
  }
}
