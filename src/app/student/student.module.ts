import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { BrowseBooksComponent } from './browse-books/browse-books.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestsComponent } from './request/request.component';
import { CurrentBorrowComponent } from './current-borrow/current-borrow.component';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  declarations: [
    BrowseBooksComponent,
    WishlistComponent,
    RequestsComponent,
    CurrentBorrowComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class StudentModule { }
