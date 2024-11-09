import { numberAttribute } from '@angular/core';
import { Validators } from '@angular/forms';

import type {
  FooId,
  Foo,
  UpdateFoo,
  DeleteFoo,
  ReadFooRequest,
  FooOrderBy,
  GetFoosRequest,
} from '../public';

export const validateFooId = (fooId: FooId): FooId => {
  if (fooId == null || typeof fooId !== 'string' || fooId === '') {
    throw new Error('Invalid fooId!');
  }

  return fooId;
};

export const initialFoo: Foo = {
  name: '',
  count: 0,
};

export const nameValidator = Validators.required;
export const countValidator = Validators.min(0);

export const validateUpdateFoo = (command: UpdateFoo): UpdateFoo => {
  if (command == null) {
    throw new Error('Invalid UpdateFoo command!');
  }

  validateFooId(command.fooId);
  return command;
};

export const validateDeleteFoo = (command: DeleteFoo): DeleteFoo => {
  if (command == null) {
    throw new Error('Invalid DeleteFoo command!');
  }

  validateFooId(command.fooId);
  return command;
};

export const validateReadFoo = (request: ReadFooRequest): ReadFooRequest => {
  if (request == null) {
    throw new Error('Invalid ReadFoo query!');
  }

  validateFooId(request.fooId);
  return request;
};

export const isFooOrderBy = (orderBy: unknown): orderBy is FooOrderBy => {
  return (
    orderBy != null &&
    typeof orderBy === 'string' &&
    (orderBy === 'name' || orderBy === 'count')
  );
};

export const areGetFoosRequestsEqual = (
  lhs: GetFoosRequest,
  rhs: GetFoosRequest,
): boolean => {
  return (
    (lhs.withNameLike ?? null) === (rhs.withNameLike ?? null) &&
    (lhs.withMaxCount ?? null) === (rhs.withMaxCount ?? null) &&
    (lhs.orderBy ?? null) === (rhs.orderBy ?? null)
  );
};

export const validateGetFoos = (request: GetFoosRequest): GetFoosRequest => {
  if (request == null) {
    throw new Error('Invalid GetFoos query!');
  }

  return request;
};

export const transformWithNameLike = (value: unknown) =>
  value == null || typeof value !== 'string' || value === ''
    ? undefined
    : value;

export const transformWithMaxCount = (value: unknown) =>
  value == null ? undefined : numberAttribute(value);

export const transformOrderBy = (value: unknown) =>
  isFooOrderBy(value) ? value : undefined;
