import { Injectable, Signal } from '@angular/core';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthState } from './auth-state';

@Injectable()
export abstract class AuthSignInClient {
  /**
   * current state of the authentication
   */
  abstract readonly state: Signal<AuthState>;

  /**
   * will be called when needsSignIn returns true
   */
  abstract triggerSignIn(): void;

  /**
   * do the actual sign-in operation
   */
  abstract signIn(username: string, password: string): Observable<true>;

  /**
   * override if you need more control over detecting errors which should trigger sign-in
   */
  needsSignIn(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  /**
   * override if you need to modify the request after sign-in
   * example: add bearer token
   */
  modifyRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request;
  }
}
