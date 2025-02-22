import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { MaterialDialogAuthSignInClient } from '@flens-dev/tools/auth';

import { map, Observable, tap } from 'rxjs';
import * as v from 'valibot';

import {
  DummyjsonLoginResponseSchema,
  DummyjsonRequestLogin,
} from './dummyjson.types';

@Injectable({
  providedIn: 'root',
})
export class DummyjsonAuthSignInClient extends MaterialDialogAuthSignInClient {
  readonly #baseUrl = 'https://dummyjson.com';
  readonly #authBaseUrl = `${this.#baseUrl}/auth`;
  readonly #client = inject(HttpClient);
  #accessToken: string | null = null;

  readonly #authHeaderKey = 'Authorization';
  get authHeaderValue(): string {
    return `Bearer ${this.#accessToken}`;
  }
  get authHeader() {
    const headers = new HttpHeaders();
    return this.#accessToken == null || this.#accessToken === ''
      ? headers
      : headers.append(this.#authHeaderKey, this.authHeaderValue);
  }

  signIn(username: string, password: string): Observable<true> {
    const request: DummyjsonRequestLogin = {
      username,
      password,
      expiresInMins: 1,
    };

    return this.#client.post(`${this.#authBaseUrl}/login`, request).pipe(
      map((response) => v.parse(DummyjsonLoginResponseSchema, response)),
      tap(({ accessToken }) => (this.#accessToken = accessToken)),
      map(() => true),
    );
  }

  override modifyRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    if (
      this.#accessToken == null ||
      request.url === `${this.#authBaseUrl}/login` ||
      !request.url.startsWith(this.#authBaseUrl)
    ) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(this.#authHeaderKey, this.authHeaderValue),
    });
  }

  clearToken() {
    this.#accessToken = null;
  }
}
