import type { Immutable } from '@flens-dev/tools/common';

export type FooId = string;

export type Foo = Immutable<{
  name: string;
  count: number;
}>;

export type UpdateFoo = Immutable<{
  fooId: FooId;
  foo: Partial<Foo>;
}>;

export type FooUpdated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type DeleteFoo = Immutable<{
  fooId: FooId;
}>;

export type FooDeleted = Immutable<{
  fooId: FooId;
}>;

export type ReadFooRequest = Immutable<{
  fooId: FooId;
}>;

export type ReadFooResponse = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type FooOrderBy = keyof Pick<Foo, 'name' | 'count'>;

export type GetFoosRequest = Immutable<{
  withNameLike?: string;
  withMaxCount?: number;
  orderBy?: FooOrderBy;
}>;

export type GetFoosResponse = Immutable<{
  foos: ReadFooResponse[];
}>;
