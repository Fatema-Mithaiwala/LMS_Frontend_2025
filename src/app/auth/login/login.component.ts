import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/core/interfaces/login.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginFormRef') loginFormRef!: NgForm;
  submitted = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const payload: Login = {
      email: form.value.email.trim(),
      password: form.value.password.trim()
    };

    this.auth.login(payload).subscribe({
      next: () => {
        this.submitted = true;
        const role = this.auth.getUserRole();

        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome ${role}`
        });

        switch (role) {
          case 'Admin':
            this.router.navigate(['/admin']);
            break;
          case 'Librarian':
            this.router.navigate(['/librarian']);
            break;
          default:
            this.router.navigate(['/student']);
            break;
        }
      },
      error: (err) => {
        this.submitted = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.message || 'Invalid credentials'
        });
      }
    });
  }

  canDeactivate(): boolean {
    return this.loginFormRef?.dirty && !this.submitted
      ? confirm('You have unsaved changes. Leave anyway?')
      : true;
  }
}
