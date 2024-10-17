import { Immutable } from '@flens-dev/tools';

export type FooId = string;

export type Foo = Immutable<{
  name: string;
  count: number;
}>;

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
