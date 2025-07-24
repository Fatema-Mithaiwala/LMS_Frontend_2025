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
  selector: 'app-librarians',
  templateUrl: './librarians.component.html',
  styleUrls: ['./librarians.component.scss']
})
export class LibrariansComponent implements OnInit {
  librarians: User[] = [];
  filteredLibrarians$!: Observable<User[]>;
  searchControl = new FormControl('');
  selectedUser: User | null = null;
  readonly roleId = 2;

  private librariansObserver!: { next: (users: User[]) => void };

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.setupFilteredStream();
    this.loadLibrarians();
  }

  private setupFilteredStream(): void {
    this.filteredLibrarians$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
      new Observable<User[]>(observer => {
        this.librariansObserver = observer;
        observer.next(this.librarians);
      })
    ]).pipe(
      map(([term, list]) => this.filterUsers(term || '', list))
    );
  }

  private filterUsers(term: string, list: User[]): User[] {
    const t = term.toLowerCase().trim();
    if (!t) return list;
    return list.filter(user =>
      user.fullName.toLowerCase().includes(t) ||
      user.email.toLowerCase().includes(t) ||
      user.phoneNumber?.toString().includes(t)
    );
  }

  loadLibrarians(): void {
    this.userService.getUsersByRole(this.roleId).subscribe({
      next: users => {
        this.librarians = users;
        if (this.librariansObserver) this.librariansObserver.next(users);
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
    const cb = () => {
      this.showSuccess(this.selectedUser ? 'Librarian updated' : 'Librarian created');
      this.closeModal();
      this.loadLibrarians();
    };

    if (this.selectedUser) {
      const payload: UpdateUser = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber
      };
      this.userService.updateUser(this.selectedUser.userId, payload).subscribe({
        next: () => cb(),
        error: err => this.showError(err)
      });
    } else {
      this.userService.createUser(data, this.roleId).subscribe({
        next: () => cb(),
        error: err => this.showError(err)
      });
    }
  }

  softDelete(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: res => {
        this.showSuccess(res.message);
        this.loadLibrarians();
      },
      error: err => this.showError(err)
    });
  }

  toggleBlock(user: User): void {
    this.userService.blockUser(user.userId, !user.isBlocked).subscribe({
      next: r => {
        user.isBlocked = !user.isBlocked;
        this.showSuccess(r.message);
      },
      error: e => this.showError(e)
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
    const msg = error?.error?.message || error?.message || 'An error occurred';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}
