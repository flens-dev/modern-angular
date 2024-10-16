import { Injectable, Type, Provider } from '@angular/core';

import { Observable } from 'rxjs';

import {
  Foo,
  FooCreated,
  FooId,
  FooRead,
  FooUpdated,
  FooDeleted,
} from './foo.model';

@Injectable()
export abstract class FooRepository {
  abstract createFoo(foo: Foo): Observable<FooCreated>;
  abstract readFoo(fooId: FooId): Observable<FooRead>;
  abstract updateFoo(fooId: FooId, foo: Partial<Foo>): Observable<FooUpdated>;
  abstract deleteFoo(fooId: FooId): Observable<FooDeleted>;
}

/**
 * Helper function to generate special provide-function for repository implementations
 */
export const provideFooRepository =
  <T extends FooRepository>(repository: Type<T>): (() => Provider[]) =>
  () =>
    [
      {
        provide: FooRepository,
        useClass: repository,
      },
    ];
