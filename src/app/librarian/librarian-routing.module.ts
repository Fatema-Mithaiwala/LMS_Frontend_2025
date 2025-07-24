// src/app/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarianBookComponent } from './librarian-book/librarian-book.component';
import { LibrarianDashboardComponent } from './librarian-dashboard/librarian-dashboard.component';
import { LibrarianRequestManagementComponent } from './librarian-request-management/librarian-request-management.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: LibrarianDashboardComponent },
    { path: 'books', component: LibrarianBookComponent },
    { path: 'students', component: StudentProfileComponent },
    { path: 'request-management', component: LibrarianRequestManagementComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LibrarianRoutingModule { }
