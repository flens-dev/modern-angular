import { Injectable } from '@angular/core';

import { Observable, map, timer } from 'rxjs';

import {
  DeleteFoo,
  Foo,
  FooCreated,
  FooDeleted,
  FooId,
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
export class FooInMemoryRepository implements FooRepository {
  readonly #timeoutMs = 400;
  #nextFooId = 1;
  readonly #foos = new Map<FooId, Foo>();

  constructor() {
    // for testing if the edit-route is matched with a conflicting fooId
    this.#foos.set('create', {
      name: 'Create',
      count: 0,
    });
    this.#createFoo({ name: 'First', count: 3 });
    this.#createFoo({ name: 'Second', count: 2 });
    this.#createFoo({ name: 'Third', count: 1 });
  }

  getFoos(request: GetFoosRequest): Observable<GetFoosResponse> {
    return timer(this.#timeoutMs).pipe(
      map((): GetFoosResponse => {
        if (request.withNameLike?.startsWith('err')) {
          throw new Error(
            'Internal Server Error ' + request.withNameLike.substring(3),
          );
        }

        const foos = [...this.#foos.entries()]
          .filter(
            ([_, foo]) =>
              (request.withNameLike == null ||
                foo.name
                  .toLowerCase()
                  .includes(request.withNameLike.toLowerCase())) &&
              (request.withMaxCount == null ||
                foo.count <= request.withMaxCount),
          )
          .map(([fooId, foo]): FooRead => ({ fooId, foo }));

        foos.sort(
          request.orderBy === 'name'
            ? (a, b) => a.foo.name.localeCompare(b.foo.name)
            : request.orderBy === 'count'
              ? (a, b) => a.foo.count - b.foo.count
              : (a, b) => a.fooId.localeCompare(b.fooId),
        );

        return {
          foos,
        };
      }),
    );
  }

  #createFoo(foo: Foo): FooCreated {
    const fooId = `${this.#nextFooId}`;
    this.#nextFooId++;

    const createdFoo = { ...foo };
    this.#foos.set(fooId, createdFoo);

    return {
      fooId,
      foo: { ...createdFoo },
    };
  }

  createFoo(foo: Foo): Observable<FooCreated> {
    return timer(this.#timeoutMs).pipe(map(() => this.#createFoo(foo)));
  }

  readFoo(query: ReadFoo): Observable<FooRead> {
    return timer(this.#timeoutMs).pipe(
      map((): FooRead => {
        const foo = this.#foos.get(query.fooId);
        if (foo == null) {
          throw new Error('Foo not found!');
        }

        return {
          fooId: query.fooId,
          foo: { ...foo },
        };
      }),
    );
  }

  updateFoo(command: UpdateFoo): Observable<FooUpdated> {
    return timer(this.#timeoutMs).pipe(
      map((): FooUpdated => {
        if (command.foo.name?.startsWith('err')) {
          throw new Error(
            'Internal Server Error ' + command.foo.name.substring(3),
          );
        }

        const currentFoo = this.#foos.get(command.fooId);
        if (currentFoo == null) {
          throw new Error('Foo not found!');
        }

        const updatedFoo = {
          ...currentFoo,
          ...command.foo,
        };
        this.#foos.set(command.fooId, updatedFoo);

        return {
          fooId: command.fooId,
          foo: { ...updatedFoo },
        };
      }),
    );
  }

  deleteFoo(command: DeleteFoo): Observable<FooDeleted> {
    return timer(this.#timeoutMs).pipe(
      map((): FooDeleted => {
        const deleted = this.#foos.delete(command);
        if (deleted) {
          return {
            fooId: command,
          };
        }

        throw new Error('Foo not found!');
      }),
    );
  }
}

export const provideFooInMemoryRepository = provideFooRepository(
  FooInMemoryRepository,
);
