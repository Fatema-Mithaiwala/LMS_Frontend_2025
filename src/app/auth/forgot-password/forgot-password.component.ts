import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  @ViewChild('forgotPasswordForm') forgotPasswordForm!: NgForm;
  submitted = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    const email = form.value.email.trim();
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.submitted = true;
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Sent',
          detail: 'An OTP has been sent to your email.'
        });
        this.router.navigate(['/auth/reset-password'], { queryParams: { email } });
      },
      error: (err) => {
        this.submitted = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Failed to send OTP'
        });
      }
    });
  }
}