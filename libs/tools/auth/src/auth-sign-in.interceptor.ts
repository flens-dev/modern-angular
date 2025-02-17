import { inject, Injector, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError, filter, first, mergeMap } from 'rxjs';

import { AuthSignInService } from './auth-sign-in.service';

export const authSignInInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error) => {
      const authService = injector.get(AuthSignInService);

      const authState = untracked(authService.state);
      if (authState === 'SIGNED_IN' || !authService.needsSignIn(error)) {
        throw error;
      }

      // trigger the sign-in once
      if (authState !== 'SIGNING_IN') {
        // Trigger the sign-in after creating/returning the "retry" observable,
        // so we can be sure that the authService.stateChanges blocks until the user is signed in.
        Promise.resolve().then(() => authService.triggerSignIn());
      }

      return toObservable(authService.state, { injector }).pipe(
        filter((state) => state === 'SIGNED_IN'),
        first(),
        mergeMap(() => next(req)),
      );
    }),
  );
};
