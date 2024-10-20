import { Type, Provider, InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import {
  DeleteFoo,
  Foo,
  FooCreated,
  FooId,
  FooRead,
  FooUpdated,
  FooDeleted,
  GetFoosRequest,
  GetFoosResponse,
} from '../model';

export type FooRepository = {
  getFoos: (request: GetFoosRequest) => Observable<GetFoosResponse>;
  createFoo: (foo: Foo) => Observable<FooCreated>;
  readFoo: (fooId: FooId) => Observable<FooRead>;
  updateFoo: (fooId: FooId, foo: Partial<Foo>) => Observable<FooUpdated>;
  deleteFoo: (fooId: DeleteFoo) => Observable<FooDeleted>;
};

export const FOO_REPOSITORY = new InjectionToken<FooRepository>(
  'FooRepository',
);

/**
 * Helper function to generate special provide-function for repository implementations
 */
export const provideFooRepository =
  <T extends FooRepository>(repository: Type<T>): (() => Provider[]) =>
  () => [
    repository,
    {
      provide: FOO_REPOSITORY,
      useExisting: repository,
    },
  ];
