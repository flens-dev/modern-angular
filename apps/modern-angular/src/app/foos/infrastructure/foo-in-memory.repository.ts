import { Injectable } from '@angular/core';

import { Observable, map, timer } from 'rxjs';

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
export class FooInMemoryRepository extends FooRepository {
  #nextFooId = 1;
  readonly #foos = new Map<FooId, Foo>();

  constructor() {
    super();
    this.#createFoo({ name: 'First', count: 1 });
    this.#createFoo({ name: 'Second', count: 2 });
    this.#createFoo({ name: 'Thrid', count: 3 });
  }

  override getFoos(request: GetFoosRequest): Observable<GetFoosResponse> {
    return timer(1000).pipe(
      map((): GetFoosResponse => {
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

  override createFoo(foo: Foo): Observable<FooCreated> {
    return timer(1000).pipe(map(() => this.#createFoo(foo)));
  }

  override readFoo(fooId: FooId): Observable<FooRead> {
    return timer(1000).pipe(
      map((): FooRead => {
        const foo = this.#foos.get(fooId);
        if (foo == null) {
          throw new Error('Foo not found!');
        }

        return {
          fooId,
          foo: { ...foo },
        };
      }),
    );
  }

  override updateFoo(fooId: FooId, foo: Partial<Foo>): Observable<FooUpdated> {
    return timer(1000).pipe(
      map((): FooUpdated => {
        const currentFoo = this.#foos.get(fooId);
        if (currentFoo == null) {
          throw new Error('Foo not found!');
        }

        const updatedFoo = {
          ...currentFoo,
          ...foo,
        };
        this.#foos.set(fooId, updatedFoo);

        return {
          fooId,
          foo: { ...updatedFoo },
        };
      }),
    );
  }

  override deleteFoo(fooId: FooId): Observable<FooDeleted> {
    return timer(1000).pipe(
      map((): FooDeleted => {
        const deleted = this.#foos.delete(fooId);
        if (deleted) {
          return {
            fooId,
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
