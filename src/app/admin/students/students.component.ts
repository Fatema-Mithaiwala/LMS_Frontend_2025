import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';
import { Register } from 'src/app/core/interfaces/register.interface';
import { UpdateUser } from 'src/app/core/interfaces/update-user.interface';
import { UserService } from 'src/app/core/services/user.service';
import { MessageService } from 'primeng/api';

declare var bootstrap: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  students: User[] = [];
  filteredStudents$!: Observable<User[]>;
  searchControl = new FormControl('');
  selectedUser: User | null = null;
  readonly roleId = 3;

  private studentsObserver!: { next: (users: User[]) => void };

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.setupFilteredStream();
    this.loadStudents();
  }

  private setupFilteredStream(): void {
    this.filteredStudents$ = combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      new Observable<User[]>(observer => {
        this.studentsObserver = observer;
        observer.next(this.students);
      })
    ]).pipe(
      map(([term, list]) => this.filterStudents(term || '', list))
    );
  }

  private filterStudents(term: string, list: User[]): User[] {
    const t = term.toLowerCase().trim();
    if (!t) return list;
    return list.filter(user =>
      user.fullName.toLowerCase().includes(t) ||
      user.email.toLowerCase().includes(t) ||
      user.phoneNumber?.toString().includes(t)
    );
  }

  loadStudents(): void {
    this.userService.getUsersByRole(this.roleId).subscribe({
      next: users => {
        this.students = users;
        if (this.studentsObserver) this.studentsObserver.next(users);
      },
      error: err => this.showError(err)
    });
  }

  openForm(user?: User): void {
    this.selectedUser = user ?? null;
    const modalEl = document.getElementById('userFormModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  handleSubmit(data: Register): void {
    const callback = () => {
      this.showSuccess(this.selectedUser ? 'Student updated' : 'Student created');
      this.closeModal();
      this.loadStudents();
    };

    if (this.selectedUser) {
      const payload: UpdateUser = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber
      };
      this.userService.updateUser(this.selectedUser.userId, payload).subscribe({
        next: () => callback(),
        error: err => this.showError(err)
      });
    } else {
      this.userService.createUser(data, this.roleId).subscribe({
        next: () => callback(),
        error: err => this.showError(err)
      });
    }
  }

  softDelete(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: res => {
        this.showSuccess(res.message);
        this.loadStudents();
      },
      error: err => this.showError(err)
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('userFormModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
    this.selectedUser = null;
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showError(error: any): void {
    const message = error?.error?.message || error?.message || 'An error occurred';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  toggleBlock(u: User) {
    this.userService.blockUser(u.userId, !u.isBlocked).subscribe({
      next: r => {
        u.isBlocked = !u.isBlocked;
        this.showSuccess(r.message);
      },
      error: e => this.showError(e)
    });
  }
}
