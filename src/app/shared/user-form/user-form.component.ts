import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from 'src/app/core/interfaces/register.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { CustomValidators } from '../validators/custom.validators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnChanges {
  @Input() user: User | null = null;
  @Input() role: string = 'User';
  @Output() formSubmit = new EventEmitter<Register>();

  userForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isEditMode = !!this.user;
    this.initForm();

    if (this.isEditMode && this.user) {
      const [firstName, ...rest] = this.user.fullName.split(' ');
      const lastName = rest.join(' ');
      this.userForm.patchValue({
        firstName,
        lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber
      });
      this.userForm.removeControl('password');
      this.userForm.removeControl('confirmPassword');
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), CustomValidators.noSpaceAllowed, CustomValidators.noNumbersOrSpecialCharsAllowed]],
      lastName: ['', [Validators.required, Validators.minLength(2), CustomValidators.noSpaceAllowed, CustomValidators.noNumbersOrSpecialCharsAllowed]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', this.isEditMode ? [] : [Validators.required, CustomValidators.passwordStrengthValidator()]],
      confirmPassword: ['', this.isEditMode ? [] : Validators.required]
    }, {
      validators: this.isEditMode ? null : CustomValidators.passwordsMatchValidator()
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const fullName = `${formValue.firstName} ${formValue.lastName}`.trim();
      const payload: Register = {
        fullName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword
      };
      this.formSubmit.emit(payload);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

}
