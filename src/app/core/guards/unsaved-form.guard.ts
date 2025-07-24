// src/app/core/guards/form-deactivate.guard.ts
import { CanDeactivateFn } from '@angular/router';

export const unsavedFormDeactivateGuard: CanDeactivateFn<any> = (
  component
) => {
  if (component.canDeactivate && typeof component.canDeactivate === 'function') {
    return component.canDeactivate();
  }
  return true;
};
