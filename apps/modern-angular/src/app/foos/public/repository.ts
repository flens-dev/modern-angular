import { Type, Provider, InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import type {
  DeleteFoo,
  FooUpdated,
  FooDeleted,
  GetFoosRequest,
  GetFoosResponse,
  ReadFooRequest,
  ReadFooResponse,
  UpdateFoo,
} from './model';
import type { CreateFoo, FooCreated } from './create-foo';

export type FooRepository = {
  getFoos: (request: GetFoosRequest) => Observable<GetFoosResponse>;
  readFoo: (request: ReadFooRequest) => Observable<ReadFooResponse>;

  createFoo: (command: CreateFoo) => Observable<FooCreated>;
  updateFoo: (command: UpdateFoo) => Observable<FooUpdated>;
  deleteFoo: (command: DeleteFoo) => Observable<FooDeleted>;
};

export const FOO_REPOSITORY = new InjectionToken<FooRepository>(
  'FooRepository',
);

/**
 * Helper function to generate special provide-function for repository implementations
 */
export const provideFooRepository = <T extends FooRepository>(
  repository: Type<T>,
): Provider[] => [
  repository,
  {
    provide: FOO_REPOSITORY,
    useExisting: repository,
  },
];
