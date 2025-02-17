import { Injectable, Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthState } from './auth-state';

@Injectable()
export abstract class AuthSignInService {
  abstract readonly state: Signal<AuthState>;

  abstract triggerSignIn(): void;

  needsSignIn(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }
}
