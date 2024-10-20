import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  DeleteFoo,
  Foo,
  FooCreated,
  FooDeleted,
  FooId,
  FooRead,
  FooRepository,
  FooUpdated,
  GetFoosRequest,
  GetFoosResponse,
  provideFooRepository,
} from '../model';

@Injectable({
  providedIn: 'root',
})
export class FooHttpRepository implements FooRepository {
  readonly #baseUrl = '/api/foos'; // NOTE could be injected configuration
  readonly #http = inject(HttpClient);

  getFoos(request: GetFoosRequest): Observable<GetFoosResponse> {
    const params = new HttpParams({ fromObject: request });
    return this.#http.get<GetFoosResponse>(this.#baseUrl, { params });
  }

  createFoo(foo: Foo): Observable<FooCreated> {
    return this.#http.post<FooCreated>(`${this.#baseUrl}`, foo);
  }

  readFoo(fooId: FooId): Observable<FooRead> {
    return this.#http.get<FooRead>(
      `${this.#baseUrl}/${encodeURIComponent(fooId)}`,
    );
  }

  updateFoo(fooId: FooId, foo: Partial<Foo>): Observable<FooUpdated> {
    return this.#http.put<FooUpdated>(
      `${this.#baseUrl}/${encodeURIComponent(fooId)}`,
      foo,
    );
  }

  deleteFoo(fooId: DeleteFoo): Observable<FooDeleted> {
    return this.#http.delete<FooDeleted>(
      `${this.#baseUrl}/${encodeURIComponent(fooId)}`,
    );
  }
}

export const provideFooHttpRepository = provideFooRepository(FooHttpRepository);
