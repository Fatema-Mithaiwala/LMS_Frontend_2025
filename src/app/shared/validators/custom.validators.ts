// 📁 src/app/shared/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, FormGroup, ValidatorFn } from "@angular/forms";

export class CustomValidators {
    static noSpaceAllowed(control: AbstractControl): ValidationErrors | null {
        const hasOnlySpaces = (control.value || '').trim().length === 0;
        return hasOnlySpaces ? { noSpaceAllowed: true } : null;
    }

    static noNumbersOrSpecialCharsAllowed(control: AbstractControl): ValidationErrors | null {
        const hasInvalidChars = /[\d!@#$%^&*(),.?":{}|<>[\]\\/_+=~`';-]/.test(control.value || '');
        return hasInvalidChars ? { noNumbersOrSpecialCharsAllowed: true } : null;
    }

    static passwordsMatchValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const password = group.get('password')?.value;
            const confirmPassword = group.get('confirmPassword')?.value;
            return password === confirmPassword ? null : { passwordMismatch: true };
        };
    }

    static passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasAtSymbol = /@/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const isLengthValid = value.length >= 6 && value.length <= 12;

            return hasUpperCase && hasLowerCase && hasAtSymbol && hasNumber && isLengthValid
                ? null
                : { passwordStrength: true };
        };
    }
}