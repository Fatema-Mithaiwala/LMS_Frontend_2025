import { Component, AfterViewInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { Chart } from 'chart.js';
import { AdminStatsService } from 'src/app/core/services/admin-stats.services';

@Component({
  selector: 'app-librarian-dashboard',
  templateUrl: './librarian-dashboard.component.html',
  styleUrls: ['./librarian-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibrarianDashboardComponent implements AfterViewInit {
  totalBooks = signal<number>(0);
  totalCopies = signal<number>(0);
  availableCopies = signal<number>(0);
  borrowedBooks = signal<number>(0);
  overdueBooks = signal<number>(0);
  pendingBorrowRequests = signal<number>(0);
  pendingReturnRequests = signal<number>(0);

  borrowTransactions = signal<any[]>([]);

  bookStats = computed(() => [
    {
      label: 'Total Books',
      value: this.totalBooks(),
      icon: 'bi bi-bookshelf',
      color: 'text-primary',
      gradient: 'gradient-primary'
    },
    {
      label: 'Total Copies',
      value: this.totalCopies(),
      icon: 'bi bi-collection',
      color: 'text-info',
      gradient: 'gradient-info'
    },
    {
      label: 'Available Copies',
      value: this.availableCopies(),
      icon: 'bi bi-book-fill',
      color: 'text-success',
      gradient: 'gradient-success'
    },
    {
      label: 'Borrowed Books',
      value: this.borrowedBooks(),
      icon: 'bi bi-book-half',
      color: 'text-info',
      gradient: 'gradient-info'
    },
    {
      label: 'Overdue Books',
      value: this.overdueBooks(),
      icon: 'bi bi-clock-history',
      color: 'text-danger',
      gradient: 'gradient-danger'
    },
    {
      label: 'Pending Borrow Requests',
      value: this.pendingBorrowRequests(),
      icon: 'bi bi-hourglass-split',
      color: 'text-warning',
      gradient: 'gradient-warning'
    },
    {
      label: 'Pending Return Requests',
      value: this.pendingReturnRequests(),
      icon: 'bi bi-arrow-return-left',
      color: 'text-secondary',
      gradient: 'gradient-secondary'
    }
  ]);

  constructor(private adminStatsService: AdminStatsService) { }

  private bookStatusChart: Chart | null = null;

  ngOnInit(): void {
    this.loadStats();

    this.loadBorrowTransactions();
  }

  ngAfterViewInit(): void {
    this.initCharts();
    this.updateCharts();
  }

  loadStats(): void {
    this.adminStatsService.getAllStats().subscribe({
      next: (stats) => {
        this.totalBooks.set(stats.totalBooks);
        this.totalCopies.set(stats.totalCopies);
        this.availableCopies.set(stats.availableBooks);
        this.borrowedBooks.set(stats.borrowedBooks);
        this.overdueBooks.set(stats.overdueBooks);
        this.pendingBorrowRequests.set(stats.pendingBorrowRequests);
        this.pendingReturnRequests.set(stats.pendingReturnRequests);
        this.updateCharts(); // Update charts when data changes
      },
      error: (err: Error) => {
        console.error('Error fetching book stats:', err.message);
      }
    });
  }

  loadBorrowTransactions(): void {
    this.adminStatsService.getBorrowTransactions().subscribe({
      next: (transactions) => {
        this.borrowTransactions.set(transactions);
      },
      error: (err: Error) => {
        console.error('Error fetching borrow transactions:', err.message);
      }
    });
  }

  initCharts(): void {
    this.bookStatusChart = new Chart('bookStatusChart', {
      type: 'doughnut',
      data: {
        labels: ['Available Copies', 'Borrowed', 'Overdue'],
        datasets: [{
          data: [0, 0, 0], 
          backgroundColor: [
            'rgba(40, 167, 69, 0.8)', 
            'rgba(54, 162, 235, 0.8)', 
            'rgba(220, 53, 69, 0.8)'  
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  updateCharts(): void {
    if (this.bookStatusChart) {
      this.bookStatusChart.data.datasets[0].data = [
        this.availableCopies(),
        this.borrowedBooks(),
        this.overdueBooks()
      ];
      this.bookStatusChart.update();
    }
  }
}