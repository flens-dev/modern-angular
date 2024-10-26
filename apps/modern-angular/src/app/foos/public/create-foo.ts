import { InjectionToken } from '@angular/core';

import type { ValueSource } from '@flens-dev/tools';

import type { CreateFoo, FooCreated } from '../model';

export type CreateFooSource = ValueSource<CreateFoo>;

export type FooCreatedHandler = {
  readonly handle: (fooCreated: FooCreated) => void;
};

export const CREATE_FOO_SOURCE = new InjectionToken<CreateFooSource>(
  'CreateFooSource',
);

export const FOO_CREATED_HANDLER = new InjectionToken<FooCreatedHandler>(
  'FooCreatedHandler',
);