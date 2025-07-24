import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { HomeComponent } from './shared/home/home.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ProfileComponent } from './shared/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canMatch: [roleGuard],
    data: { role: '*' }
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canMatch: [roleGuard],
    data: { role: 'Admin' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'librarian',
    canMatch: [roleGuard],
    data: { role: 'Librarian' },
    loadChildren: () => import('./librarian/librarian.module').then(m => m.LibrarianModule)
  },
  {
    path: 'student',
    canMatch: [roleGuard],
    data: { role: 'Student' },
    loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
