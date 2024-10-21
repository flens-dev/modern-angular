import { numberAttribute } from '@angular/core';
import { Validators } from '@angular/forms';

import { Immutable } from '@flens-dev/tools';

export type FooId = string;

export const validateFooId = (fooId: FooId): FooId => {
  if (fooId == null || typeof fooId !== 'string' || fooId === '') {
    throw new Error('Invalid fooId!');
  }

  return fooId;
};

export type Foo = Immutable<{
  name: string;
  count: number;
}>;

export const initialFoo: Foo = {
  name: '',
  count: 0,
};

export const nameValidator = Validators.required;
export const countValidator = Validators.min(0);

export type FooCreated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type ReadFoo = Immutable<{
  fooId: FooId;
}>;

export const validateReadFoo = (command: ReadFoo): ReadFoo => {
  if (command == null) {
    throw new Error('Invalid ReadFoo query!');
  }

  validateFooId(command.fooId);
  return command;
};

export type FooRead = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type UpdateFoo = Immutable<{
  fooId: FooId;
  foo: Partial<Foo>;
}>;

export const validateUpdateFoo = (command: UpdateFoo): UpdateFoo => {
  if (command == null) {
    throw new Error('Invalid UpdateFoo command!');
  }

  validateFooId(command.fooId);
  return command;
};

export type FooUpdated = Immutable<{
  fooId: FooId;
  foo: Foo;
}>;

export type DeleteFoo = Immutable<{
  fooId: FooId;
}>;

export const validateDeleteFoo = (command: DeleteFoo): DeleteFoo => {
  if (command == null) {
    throw new Error('Invalid DeleteFoo command!');
  }

  validateFooId(command.fooId);
  return command;
};

export type FooDeleted = Immutable<{
  fooId: FooId;
}>;

export type FooOrderBy = keyof Pick<Foo, 'name' | 'count'>;

export const isFooOrderBy = (orderBy: unknown): orderBy is FooOrderBy => {
  return (
    orderBy != null &&
    typeof orderBy === 'string' &&
    (orderBy === 'name' || orderBy === 'count')
  );
};

export type GetFoosRequest = Immutable<{
  withNameLike?: string;
  withMaxCount?: number;
  orderBy?: FooOrderBy;
}>;

export type GetFoosResponse = Immutable<{
  foos: FooRead[];
}>;

export const transformWithNameLike = (value: unknown) =>
  value == null || typeof value !== 'string' || value === ''
    ? undefined
    : value;

export const transformWithMaxCount = (value: unknown) =>
  value == null ? undefined : numberAttribute(value);

export const transformOrderBy = (value: unknown) =>
  isFooOrderBy(value) ? value : undefined;
