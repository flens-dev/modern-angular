import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import * as v from 'valibot';

import {
  DummyjsonQuote,
  DummyjsonQuoteSchema,
  DummyjsonUser,
  DummyjsonUserSchema,
} from './dummyjson.types';

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
}
