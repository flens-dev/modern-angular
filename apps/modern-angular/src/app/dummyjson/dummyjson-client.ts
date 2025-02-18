import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { MaterialDialogAuthSignInClient } from '@flens-dev/tools/auth';

import { map, Observable, tap } from 'rxjs';

import * as v from 'valibot';

export const DummyjsonUserSchema = v.object({
  id: v.number(),
  username: v.string(),
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  gender: v.string(),
  image: v.pipe(v.string(), v.url()),
});

export type DummyjsonUser = v.InferOutput<typeof DummyjsonUserSchema>;

export const DummyjsonQuoteSchema = v.object({
  id: v.number(),
  quote: v.string(),
  author: v.string(),
});

export type DummyjsonQuote = v.InferOutput<typeof DummyjsonQuoteSchema>;

type DummyjsonRequestLogin = {
  readonly username: string;
  readonly password: string;
  readonly expiresInMins?: number;
};

export const DummyjsonLoginResponseSchema = v.object({
  ...DummyjsonUserSchema.entries,
  accessToken: v.string(),
  refreshToken: v.string(),
});

export type DummyjsonLoginResponse = v.InferOutput<
  typeof DummyjsonLoginResponseSchema
>;

@Injectable({
  providedIn: 'root',
})
export class DummyjsonClient extends MaterialDialogAuthSignInClient {
  readonly #baseUrl = 'https://dummyjson.com/auth';
  readonly #client = inject(HttpClient);
  #accessToken: string | null = null;

  readonly #authHeaderKey = 'Authorization';
  get #authHeaderValue(): string {
    return `Bearer ${this.#accessToken}`;
  }
  get #authHeader() {
    const headers = new HttpHeaders();
    return this.#accessToken == null || this.#accessToken === ''
      ? headers
      : headers.append(this.#authHeaderKey, this.#authHeaderValue);
  }

  clearToken() {
    this.#accessToken = null;
  }

  signIn(username: string, password: string): Observable<true> {
    const request: DummyjsonRequestLogin = {
      username,
      password,
      expiresInMins: 1,
    };

    return this.#client.post(`${this.#baseUrl}/login`, request).pipe(
      map((response) => v.parse(DummyjsonLoginResponseSchema, response)),
      tap(({ accessToken }) => (this.#accessToken = accessToken)),
      map(() => true),
    );
  }

  override modifyRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    if (this.#accessToken == null) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(this.#authHeaderKey, this.#authHeaderValue),
    });
  }

  getMe(): Observable<DummyjsonUser> {
    return this.#client
      .get(`${this.#baseUrl}/me`, {
        headers: this.#authHeader,
      })
      .pipe(map((response) => v.parse(DummyjsonUserSchema, response)));
  }

  getRandomQuote(): Observable<DummyjsonQuote> {
    return this.#client
      .get(`${this.#baseUrl}/quotes/random`, {
        headers: this.#authHeader,
      })
      .pipe(map((response) => v.parse(DummyjsonQuoteSchema, response)));
  }
}
