// src/app/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';
import { BooksComponent } from './books/books.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LibrariansComponent } from './librarians/librarians.component';
import { RequestManagementComponent } from './request-management/request-management.component';
import { StudentsComponent } from './students/students.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', component: BooksComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'librarians', component: LibrariansComponent },
  { path: 'request-management', component: RequestManagementComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
