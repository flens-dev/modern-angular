import { InjectionToken, Provider } from '@angular/core';

import type {
  Immutable,
  ServiceCallOptions,
  ValueSource,
} from '@flens-dev/tools';

import type { CreateFoo, FooCreated } from '../model';

export type CreateFooServiceConfig = Immutable<{
  onSuccess?: 'UPDATE' | 'BACK';
}>;

export type CreateFooSource = ValueSource<CreateFoo>;

export type CreateFooOnSuccess = ServiceCallOptions<
  CreateFoo,
  FooCreated
>['onSuccess'];

export const CREATE_FOO_SERVICE_CONFIG =
  new InjectionToken<CreateFooServiceConfig>('CreateFooServiceConfig');

export const CREATE_FOO_SOURCE = new InjectionToken<CreateFooSource>(
  'CreateFooSource',
);

export const CREATE_FOO_ON_SUCCESS = new InjectionToken<CreateFooOnSuccess>(
  'CreateFooOnSuccess',
);

export const provideCreateFooServiceConfig = (
  config?: CreateFooServiceConfig,
): Provider[] => [
  {
    provide: CREATE_FOO_SERVICE_CONFIG,
    useValue: config,
  },
];
