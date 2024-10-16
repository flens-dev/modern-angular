import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
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
export class FooHttpRepository extends FooRepository {
  readonly #baseUrl = '/api/foos'; // NOTE could be injected configuration
  readonly #http = inject(HttpClient);

  override getFoos(request: GetFoosRequest): Observable<GetFoosResponse> {
    const params = new HttpParams({ fromObject: request });
    return this.#http.get<GetFoosResponse>(this.#baseUrl, { params });
  }

  override createFoo(foo: Foo): Observable<FooCreated> {
    return this.#http.post<FooCreated>(`${this.#baseUrl}`, foo);
  }

  override readFoo(fooId: FooId): Observable<FooRead> {
    return this.#http.get<FooRead>(
      `${this.#baseUrl}/${encodeURIComponent(fooId)}`
    );
  }

  override updateFoo(fooId: FooId, foo: Partial<Foo>): Observable<FooUpdated> {
    return this.#http.put<FooUpdated>(
      `${this.#baseUrl}/${encodeURIComponent(fooId)}`,
      foo
    );
  }

  override deleteFoo(fooId: FooId): Observable<FooDeleted> {
    return this.#http.delete<FooDeleted>(
      `${this.#baseUrl}/${encodeURIComponent(fooId)}`
    );
  }
}

export const provideFooHttpRepository = provideFooRepository(FooHttpRepository);
