import { Immutable } from '@flens-dev/tools';

export type FooId = string & { __brand: 'FooId' };

export const makeFooId = (fooId: string): FooId => {
  if (fooId == null || typeof fooId !== 'string' || fooId === '') {
    throw new Error();
  }

  return fooId as FooId;
};

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
