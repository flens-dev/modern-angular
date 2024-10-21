import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  DeleteFoo,
  Foo,
  FooCreated,
  FooDeleted,
  FooRead,
  FooUpdated,
  GetFoosRequest,
  GetFoosResponse,
  ReadFoo,
  UpdateFoo,
} from '../model';
import { FooRepository, provideFooRepository } from '../services';

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

  readFoo(query: ReadFoo): Observable<FooRead> {
    return this.#http.get<FooRead>(
      `${this.#baseUrl}/${encodeURIComponent(query.fooId)}`,
    );
  }

  updateFoo(command: UpdateFoo): Observable<FooUpdated> {
    return this.#http.put<FooUpdated>(
      `${this.#baseUrl}/${encodeURIComponent(command.fooId)}`,
      command.foo,
    );
  }

  deleteFoo(command: DeleteFoo): Observable<FooDeleted> {
    return this.#http.delete<FooDeleted>(
      `${this.#baseUrl}/${encodeURIComponent(command)}`,
    );
  }
}

export const provideFooHttpRepository = provideFooRepository(FooHttpRepository);
