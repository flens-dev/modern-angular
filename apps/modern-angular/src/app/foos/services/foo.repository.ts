import { Type, Provider, InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import {
  DeleteFoo,
  Foo,
  FooCreated,
  FooRead,
  FooUpdated,
  FooDeleted,
  GetFoosRequest,
  GetFoosResponse,
  ReadFoo,
  UpdateFoo,
} from '../model';

export type FooRepository = {
  getFoos: (request: GetFoosRequest) => Observable<GetFoosResponse>;
  createFoo: (foo: Foo) => Observable<FooCreated>;
  readFoo: (command: ReadFoo) => Observable<FooRead>;
  updateFoo: (command: UpdateFoo) => Observable<FooUpdated>;
  deleteFoo: (command: DeleteFoo) => Observable<FooDeleted>;
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
