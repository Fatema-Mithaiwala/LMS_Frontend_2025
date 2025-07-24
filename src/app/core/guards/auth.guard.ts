// src/app/core/guards/prevent-access-if-authenticated.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const preventAccessIfAuthenticatedGuard: CanActivateFn = (): ReturnType<CanActivateFn> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  return auth.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true; 
      }
      const { role } = user;
      switch (role) {
        case 'Admin':
          messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'You are already loggedIn!'
          });
          return router.createUrlTree(['/admin/dashboard']);
        case 'Librarian':
          messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'You are already loggedIn!'
          });
          return router.createUrlTree(['/librarian/dashboard']);
        case 'Student':
          messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'You are already loggedIn!'
          });
          return router.createUrlTree(['/student/browse-books']);
        default:
          return router.createUrlTree(['/auth/login']); 
      }
    })
  );
};