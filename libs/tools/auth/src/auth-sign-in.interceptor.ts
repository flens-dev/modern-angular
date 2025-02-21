import { inject, Injector, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError, filter, first, mergeMap } from 'rxjs';

import { AuthSignInClient } from './auth-sign-in.client';

export const authSignInInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error) => {
      const authClient = injector.get(AuthSignInClient);

      if (!authClient.needsSignIn(error)) {
        throw error;
      }

      // trigger the sign-in once
      const authState = untracked(authClient.state);
      if (authState !== 'SIGNING_IN') {
        authClient.triggerSignIn();
      }

      return toObservable(authClient.state, { injector }).pipe(
        filter((state) => state === 'SIGNED_IN'),
        first(),
        mergeMap(() => next(authClient.modifyRequest(req))),
      );
    }),
  );
};
