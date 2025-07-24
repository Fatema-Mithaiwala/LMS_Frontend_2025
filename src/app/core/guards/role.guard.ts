import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { take, map } from 'rxjs/operators';

export const roleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);
  const expectedRole = route.data?.['role'];

  return auth.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return router.createUrlTree(['/auth/login']);
      }

      if (expectedRole === '*' || user.role === expectedRole) {
        return true;
      }

      messageService.add({
        severity: 'warn',
        summary: 'Unauthorized',
        detail: 'You are not allowed to access that page.'
      });

      switch (user.role) {
        case 'Admin': return router.createUrlTree(['/admin/dashboard']);
        case 'Librarian': return router.createUrlTree(['/librarian/dashboard']);
        case 'Student': return router.createUrlTree(['/student/browse-books']);
        default: return router.createUrlTree(['/auth/login']);
      }
    })
  );
};
