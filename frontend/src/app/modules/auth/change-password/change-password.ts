import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password.html',
    styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {
    changePasswordForm: FormGroup;
    isLoading = false;
    message = '';
    error = '';
    user: User | null = null;

    get isTempPassword(): boolean {
        return this.user?.passwordTemporal ?? false;
    }

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.user = this.authService.getUser();

        if (!this.user) {
            this.router.navigate(['/login']);
        }

        this.changePasswordForm = this.fb.group({
            currentPassword: [''],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });

        if (!this.isTempPassword) {
            this.changePasswordForm.get('currentPassword')?.setValidators([Validators.required]);
            this.changePasswordForm.get('currentPassword')?.updateValueAndValidity();
        }
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');
        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ mismatch: true });
            return { mismatch: true };
        }
        return null;
    }

    onSubmit() {
        if (!this.changePasswordForm.valid) {
            this.error = 'Por favor completa todos los campos correctamente.';
            return;
        }

        this.isLoading = true;
        this.error = '';
        this.message = '';

        const { currentPassword, newPassword } = this.changePasswordForm.value;
        const payload: { currentPassword?: string; newPassword: string } = { newPassword };

        if (!this.isTempPassword) {
            payload.currentPassword = currentPassword;
        }

        this.authService.changePassword(payload).subscribe({
            next: () => {
                this.isLoading = false;
                this.message = 'Contraseña cambiada exitosamente.';
                if (this.user) {
                    this.user.passwordTemporal = false;
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
                this.changePasswordForm.reset();
                const redirect = this.user?.rol === 'Administrador' ? '/admin/catalogo' : '/admin/pos';
                this.router.navigate([redirect]);
            },
            error: (error) => {
                this.isLoading = false;
                this.error = error.error?.msg || 'Error al cambiar la contraseña';
            }
        });
    }
}