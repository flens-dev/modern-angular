import { Immutable } from '@flens-dev/tools';

import { Foo, FooId } from './foo.model';

export type CreateFoo = Immutable<{
  foo: Foo;
}>;

export const validateCreateFoo = (command: CreateFoo): CreateFoo => {
  if (command == null) {
    throw new Error('Invalid CreateFoo command!');
  }

  return command;
};

export type FooCreated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;
