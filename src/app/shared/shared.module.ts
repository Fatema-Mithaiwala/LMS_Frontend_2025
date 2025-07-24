import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserFormComponent } from './user-form/user-form.component';
import { BookFormComponent } from './book-form/book-form.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    SidebarComponent,
    HomeComponent,
    UserFormComponent,
    BookFormComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SidebarComponent,
    HomeComponent,
    UserFormComponent,
    BookFormComponent
  ]
})
export class SharedModule { }
