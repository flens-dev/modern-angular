import { InjectionToken } from '@angular/core';

import type { Immutable, ValueSource } from '@flens-dev/tools/common';

import type { Foo, FooId } from './model';

export type CreateFoo = Immutable<{
  foo: Foo;
}>;

export type FooCreated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type CreateFooSource = ValueSource<CreateFoo>;

export type FooCreatedHandler = {
  readonly handleFooCreated: (fooCreated: FooCreated) => Promise<void> | void;
};

export const CREATE_FOO_SOURCE = new InjectionToken<CreateFooSource>(
  'CreateFooSource',
);

export const FOO_CREATED_HANDLER = new InjectionToken<FooCreatedHandler>(
  'FooCreatedHandler',
);
