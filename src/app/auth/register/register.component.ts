import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Register } from 'src/app/core/interfaces/register.interface';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        firstName: ['', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.noSpaceAllowed,
          CustomValidators.noNumbersOrSpecialCharsAllowed
        ]],
        lastName: ['', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.noSpaceAllowed,
          CustomValidators.noNumbersOrSpecialCharsAllowed
        ]],
        email: ['', [Validators.required, Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        )]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
        password: ['', [Validators.required, CustomValidators.passwordStrengthValidator()]],
        confirmPassword: ['', Validators.required]
      },
      { validators: CustomValidators.passwordsMatchValidator() }
    );
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.isSubmitted = true
      return;
    }

    const val = this.userForm.value;

    const payload: Register = {
      fullName: `${val.firstName.trim()} ${val.lastName.trim()}`,
      email: val.email.trim(),
      phoneNumber: val.phoneNumber.trim(),
      password: val.password.trim(),
      confirmPassword: val.confirmPassword.trim()
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message || 'Registration successful' });
        this.userForm.reset();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message || 'Registration failed' });
      }
    });
  }

  canDeactivate(): boolean {
    if (this.userForm.dirty && !this.isSubmitted) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
}
