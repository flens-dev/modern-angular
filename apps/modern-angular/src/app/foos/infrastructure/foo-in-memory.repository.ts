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
  makeFooId,
  provideFooRepository,
} from '../model';

@Injectable({
  providedIn: 'root',
})
export class FooInMemoryRepository extends FooRepository {
  #nextFooId = 1;
  readonly #foos = new Map<FooId, Foo>();

  override createFoo(foo: Foo): Observable<FooCreated> {
    return timer(1000).pipe(
      map((): FooCreated => {
        const fooId = makeFooId(`${this.#nextFooId}`);
        this.#nextFooId++;

        const createdFoo = { ...foo };
        this.#foos.set(fooId, createdFoo);

        return {
          fooId,
          foo: { ...createdFoo },
        };
      })
    );
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
      })
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
      })
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
      })
    );
  }
}

export const provideFooInMemoryRepository = provideFooRepository(
  FooInMemoryRepository
);
