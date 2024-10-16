import { Injectable, Provider, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { Immutable } from '@flens-dev/tools';

export type Foo = Immutable<{
  name: string;
  count: number;
}>;

export type FooId = string;

export type FooCreated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type FooRead = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type FooUpdated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type FooDeleted = Immutable<{
  fooId: FooId;
}>;

@Injectable()
export abstract class FooRepository {
  abstract createFoo(foo: Foo): Observable<FooCreated>;
  abstract readFoo(fooId: FooId): Observable<FooRead>;
  abstract updateFoo(fooId: FooId, foo: Partial<Foo>): Observable<FooUpdated>;
  abstract deleteFoo(fooId: FooId): Observable<FooDeleted>;
}

/** Helper function to generate special provide-function for repository implementations */
export const provideFooRepository =
  <T extends FooRepository>(repository: Type<T>): (() => Provider[]) =>
  () =>
    [
      {
        provide: FooRepository,
        useClass: repository,
      },
    ];
