import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  students: User[] = [];
  filteredStudents$!: Observable<User[]>;
  searchControl = new FormControl('');
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

  private showError(error: any): void {
    const message = error?.error?.message || error?.message || 'An error occurred';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
