// src/app/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { preventAccessIfAuthenticatedGuard } from '../core/guards/auth.guard';
import { unsavedFormDeactivateGuard } from '../core/guards/unsaved-form.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [preventAccessIfAuthenticatedGuard] },
  {
    path: 'register', component: RegisterComponent, canActivate: [preventAccessIfAuthenticatedGuard],
    canDeactivate: [unsavedFormDeactivateGuard]  },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [preventAccessIfAuthenticatedGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [preventAccessIfAuthenticatedGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }