import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export abstract class AuthSignInClient {
  /**
   * override if you need more control over detecting errors which should trigger sign-in
   */
  canRetryAfterSignIn(request: HttpRequest<unknown>, error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  /**
   * returns the observable which emits exactly once after a successful sign-in
   */
  abstract triggerSignIn(): Observable<void>;

  /**
   * override if you need to modify the request after sign-in
   * example: add bearer token
   */
  modifyRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request;
  }

  /**
   * do the actual sign-in operation
   */
  abstract signIn(username: string, password: string): Observable<true>;
}
