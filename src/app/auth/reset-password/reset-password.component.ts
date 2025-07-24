import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('resetPasswordForm') resetPasswordForm!: NgForm;
  submitted = false;
  email: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    const { email, otp, newPassword } = form.value;
    this.auth.resetPassword(email.trim(), otp.trim(), newPassword.trim()).subscribe({
      next: () => {
        this.submitted = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: 'Your password has been reset successfully.'
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.submitted = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Failed to reset password'
        });
      }
    });
  }
}