import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import {
  CreateFoo,
  FooCreated,
  FooFormGroup,
  disableOrEnableFooFormOnBusyChange,
  validateCreateFoo,
} from '../model';

import { FOO_REPOSITORY } from './foo.repository';

export const injectCreateFoo = (options: {
  request: ValueSource<CreateFoo>;
  form?: FooFormGroup;
  onSuccess?: ServiceCallOptions<CreateFoo, FooCreated>['onSuccess'];
}) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const createFooFn: ServiceCallFn<CreateFoo, FooCreated> = (
    command: CreateFoo,
  ) => {
    const validatedCommand = validateCreateFoo(command);
    return fooRepository.createFoo(validatedCommand);
  };

  const form = options.form;
  const onBusyChange:
    | ServiceCallOptions<CreateFoo, FooCreated>['onBusyChange']
    | undefined =
    form == null
      ? undefined
      : (busy) => disableOrEnableFooFormOnBusyChange(form, busy);
  const onSuccess = options.onSuccess;

  return injectServiceCall(options.request, createFooFn, {
    behavior: 'CONCAT',
    onBusyChange,
    onSuccess,
  });
};
