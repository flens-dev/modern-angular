import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import type {
  CreateFoo,
  DeleteFoo,
  FooCreated,
  FooDeleted,
  FooUpdated,
  GetFoosRequest,
  GetFoosResponse,
  ReadFooRequest,
  ReadFooResponse,
  UpdateFoo,
} from '../model';
import { FooRepository, provideFooRepository } from '../public';

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

  readFoo(request: ReadFooRequest): Observable<ReadFooResponse> {
    return this.#http.get<ReadFooResponse>(
      `${this.#baseUrl}/${encodeURIComponent(request.fooId)}`,
    );
  }

  createFoo(command: CreateFoo): Observable<FooCreated> {
    return this.#http.post<FooCreated>(`${this.#baseUrl}`, command.foo);
  }

  updateFoo(command: UpdateFoo): Observable<FooUpdated> {
    return this.#http.put<FooUpdated>(
      `${this.#baseUrl}/${encodeURIComponent(command.fooId)}`,
      command.foo,
    );
  }

  deleteFoo(command: DeleteFoo): Observable<FooDeleted> {
    return this.#http.delete<FooDeleted>(
      `${this.#baseUrl}/${encodeURIComponent(command.fooId)}`,
    );
  }
}

export const provideFooHttpRepository = provideFooRepository(FooHttpRepository);
