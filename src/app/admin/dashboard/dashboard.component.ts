import { Component, AfterViewInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';
import { Chart } from 'chart.js';
import { AdminStatsService } from 'src/app/core/services/admin-stats.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterViewInit {
  // Signals for user stats
  users = signal<User[]>([]);
  students = signal<User[]>([]);
  librarians = signal<User[]>([]);

  // Signals for book stats
  totalBooks = signal<number>(0);
  totalCopies = signal<number>(0);
  availableCopies = signal<number>(0);
  borrowedBooks = signal<number>(0);
  overdueBooks = signal<number>(0);
  pendingBorrowRequests = signal<number>(0);
  pendingReturnRequests = signal<number>(0);

  // Signal for borrow transactions table
  borrowTransactions = signal<any[]>([]);

  // Computed stats for users
  totalUsers = computed(() => this.users().length);
  totalStudents = computed(() => this.students().length);
  totalLibrarians = computed(() => this.librarians().length);

  activeStudents = computed(() => this.students().filter(s => !s.isBlocked).length);
  inactiveStudents = computed(() => this.students().filter(s => s.isBlocked).length);
  activeLibrarians = computed(() => this.librarians().filter(s => !s.isBlocked).length);
  inactiveLibrarians = computed(() => this.librarians().filter(s => s.isBlocked).length);

  // System Stats (Users)
  sysStats = computed(() => [
    {
      label: 'Users',
      value: this.totalUsers(),
      icon: 'bi bi-people-fill',
      color: 'text-primary',
      gradient: 'gradient-primary'
    },
    {
      label: 'Students',
      value: this.totalStudents(),
      icon: 'bi bi-person-circle',
      color: 'text-success',
      gradient: 'gradient-success'
    },
    {
      label: 'Librarians',
      value: this.totalLibrarians(),
      icon: 'bi bi-person-badge',
      color: 'text-warning',
      gradient: 'gradient-warning'
    }
  ]);

  // Book Stats
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

  // Detailed Breakdown (Users)
  breakdown = computed(() => [
    { label: 'Active Students', count: this.activeStudents() },
    { label: 'Inactive Students', count: this.inactiveStudents() },
    { label: 'Active Librarians', count: this.activeLibrarians() },
    { label: 'Inactive Librarians', count: this.inactiveLibrarians() }
  ]);

  constructor(
    private userService: UserService,
    private adminStatsService: AdminStatsService
  ) { }

  readonly STUDENT_ROLE_ID = 3;
  readonly LIBRARIAN_ROLE_ID = 2;

  private bookStatusChart: Chart | null = null;
  private userRoleChart: Chart | null = null;

  ngOnInit(): void {
    // Fetch user data
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (err: Error) => console.error('Error fetching users:', err.message)
    });
    this.userService.getUsersByRole(this.STUDENT_ROLE_ID).subscribe({
      next: (students) => this.students.set(students),
      error: (err: Error) => console.error('Error fetching students:', err.message)
    });
    this.userService.getUsersByRole(this.LIBRARIAN_ROLE_ID).subscribe({
      next: (librarians) => this.librarians.set(librarians),
      error: (err: Error) => console.error('Error fetching librarians:', err.message)
    });

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
        this.updateCharts();
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

    this.userRoleChart = new Chart('userRoleChart', {
      type: 'pie',
      data: {
        labels: ['Admins', 'Librarians', 'Students'],
        datasets: [{
          data: [0, 0, 0], 
          backgroundColor: [
            'rgba(111, 66, 193, 0.8)',
            'rgba(255, 193, 7, 0.8)',  
            'rgba(40, 167, 69, 0.8)'   
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

    if (this.userRoleChart) {
      this.userRoleChart.data.datasets[0].data = [
        this.users().filter(u => u.role.toLowerCase() === 'admin').length,
        this.librarians().length,
        this.students().length
      ];
      this.userRoleChart.update();
    }
  }
}