import { inject, Injector } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError, mergeMap } from 'rxjs';

import { AuthSignInClient } from './auth-sign-in.client';

export const authSignInInterceptor: HttpInterceptorFn = (request, next) => {
  const injector = inject(Injector);

  return next(request).pipe(
    catchError((error) => {
      const authClient = injector.get(AuthSignInClient);

      if (!authClient.canRetryAfterSignIn(request, error)) {
        throw error;
      }

      return authClient
        .triggerSignIn()
        .pipe(mergeMap(() => next(authClient.modifyRequest(request))));
    }),
  );
};
