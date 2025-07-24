import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseBooksComponent } from './browse-books/browse-books.component';
import { CurrentBorrowComponent } from './current-borrow/current-borrow.component';
import { NotificationComponent } from './notification/notification.component';
import { RequestsComponent } from './request/request.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
    { path: '', redirectTo: 'browse-books', pathMatch: 'full' },
    { path: 'browse-books', component: BrowseBooksComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: 'requests', component: RequestsComponent },
    { path: 'current-borrowing', component: CurrentBorrowComponent },
    { path: 'notifications', component: NotificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
