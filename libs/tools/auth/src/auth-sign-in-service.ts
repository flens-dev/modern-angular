import { inject, Injectable, Injector, Signal, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { catchError, filter, first, mergeMap } from 'rxjs';

export type AuthState =
  | 'UNKNOWN'
  | 'SIGNING_IN'
  | 'SIGNED_IN'
  | 'SIGNING_OUT'
  | 'SIGNED_OUT';

@Injectable()
export abstract class AuthSignInService {
  abstract readonly state: Signal<AuthState>;

  abstract triggerSignIn(): void;

  needsSignIn(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }
}

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
