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
import { DummyjsonAuthSignInClient } from './dummyjson-auth-sign-in.client';

@Injectable({
  providedIn: 'root',
})
export class DummyjsonClient {
  readonly #baseUrl = 'https://dummyjson.com/auth';
  readonly #client = inject(HttpClient);
  readonly #authSignInClient = inject(DummyjsonAuthSignInClient);

  getMe(): Observable<DummyjsonUser> {
    return this.#client
      .get(`${this.#baseUrl}/me`, {
        headers: this.#authSignInClient.authHeader,
      })
      .pipe(map((response) => v.parse(DummyjsonUserSchema, response)));
  }

  getRandomQuote(): Observable<DummyjsonQuote> {
    return this.#client
      .get(`${this.#baseUrl}/quotes/random`, {
        headers: this.#authSignInClient.authHeader,
      })
      .pipe(map((response) => v.parse(DummyjsonQuoteSchema, response)));
  }
}
