import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BooksComponent } from './books/books.component';
import { StudentsComponent } from './students/students.component';
import { LibrariansComponent } from './librarians/librarians.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestManagementComponent } from './request-management/request-management.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    DashboardComponent,
    BooksComponent,
    StudentsComponent,
    LibrariansComponent,
    RequestManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule
  ]
})
export class AdminModule { }
