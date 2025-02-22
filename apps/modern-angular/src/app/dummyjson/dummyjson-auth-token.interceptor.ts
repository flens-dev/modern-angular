import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { DummyjsonAuthSignInClient } from './dummyjson-auth-sign-in.client';

export const dummyjsonAuthTokenInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  const authSignInClient = inject(DummyjsonAuthSignInClient);

  return next(authSignInClient.modifyRequest(request));
};
