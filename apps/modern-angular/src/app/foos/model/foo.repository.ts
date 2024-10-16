import { Injectable, Type, Provider } from '@angular/core';

import { Observable } from 'rxjs';

import { Immutable } from '@flens-dev/tools';

import {
  Foo,
  FooCreated,
  FooId,
  FooRead,
  FooUpdated,
  FooDeleted,
} from './foo.model';

export type FooOrderBy = keyof Pick<Foo, 'name' | 'count'>;

export const isFooOrderBy = (orderBy: unknown): orderBy is FooOrderBy => {
  return (
    orderBy != null &&
    typeof orderBy === 'string' &&
    (orderBy === 'name' || orderBy === 'count')
  );
};

export type GetFoosRequest = Immutable<{
  withNameLike?: string;
  withMaxCount?: number;
  orderBy?: FooOrderBy;
}>;

export type GetFoosResponse = Immutable<{
  foos: FooRead[];
}>;

@Injectable()
export abstract class FooRepository {
  abstract getFoos(request: GetFoosRequest): Observable<GetFoosResponse>;
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
