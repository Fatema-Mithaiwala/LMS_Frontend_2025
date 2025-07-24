import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibrarianDashboardComponent } from './librarian-dashboard/librarian-dashboard.component';
import { LibrarianBookComponent } from './librarian-book/librarian-book.component';
import { LibrarianRoutingModule } from './librarian-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { LibrarianRequestManagementComponent } from './librarian-request-management/librarian-request-management.component';



@NgModule({
  declarations: [
    LibrarianDashboardComponent,
    LibrarianBookComponent,
    StudentProfileComponent,
    LibrarianRequestManagementComponent
  ],
  imports: [
    CommonModule,
    LibrarianRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgChartsModule
  ]
})
export class LibrarianModule { }
