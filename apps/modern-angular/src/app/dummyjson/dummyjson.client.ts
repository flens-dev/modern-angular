import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import * as v from 'valibot';

import {
  DummyjsonQuote,
  DummyjsonQuoteSchema,
  DummyjsonUser,
  DummyjsonUserSchema,
  DummyjsonUserSearchRequest,
  DummyjsonUserSearchResponse,
  DummyjsonUserSearchResponseSchema,
} from './dummyjson.types';
import { takeUntilAborted } from '@flens-dev/tools/common';

@Injectable({
  providedIn: 'root',
})
export class DummyjsonClient {
  readonly #baseUrl = 'https://dummyjson.com';
  readonly #authUrl = `${this.#baseUrl}/auth`;
  readonly #client = inject(HttpClient);

  getMe(): Observable<DummyjsonUser> {
    return this.#client
      .get(`${this.#authUrl}/me`)
      .pipe(map((response) => v.parse(DummyjsonUserSchema, response)));
  }

  #getRandomQuote(baseUrl: string): Observable<DummyjsonQuote> {
    return this.#client
      .get(`${baseUrl}/quotes/random`)
      .pipe(map((response) => v.parse(DummyjsonQuoteSchema, response)));
  }

  getAuthRandomQuote(): Observable<DummyjsonQuote> {
    return this.#getRandomQuote(this.#authUrl);
  }

  getRandomQuote(): Observable<DummyjsonQuote> {
    return this.#getRandomQuote(this.#baseUrl);
  }

  searchUsers(
    request: DummyjsonUserSearchRequest,
    abortSignal: AbortSignal,
  ): Observable<DummyjsonUserSearchResponse> {
    const params = new HttpParams().append('q', request.q);
    return this.#client.get(`${this.#baseUrl}/users/search`, { params }).pipe(
      takeUntilAborted(abortSignal),
      map((response) => v.parse(DummyjsonUserSearchResponseSchema, response)),
    );
  }
}
