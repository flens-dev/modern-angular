import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import {
  FooFormGroup,
  FooUpdated,
  UpdateFoo,
  disableOrEnableFooFormOnBusyChange,
  validateUpdateFoo,
} from '../model';

import { FOO_REPOSITORY } from './foo.repository';

export const injectUpdateFoo = (options: {
  request: ValueSource<UpdateFoo>;
  form?: FooFormGroup;
  onSuccess?: ServiceCallOptions<UpdateFoo, FooUpdated>['onSuccess'];
}) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const updateFooFn: ServiceCallFn<UpdateFoo, FooUpdated> = (
    command: UpdateFoo,
  ) => {
    const validatedCommand = validateUpdateFoo(command);
    return fooRepository.updateFoo(validatedCommand);
  };

  const form = options.form;
  const onBusyChange:
    | ServiceCallOptions<UpdateFoo, FooUpdated>['onBusyChange']
    | undefined =
    form == null
      ? undefined
      : (busy) => disableOrEnableFooFormOnBusyChange(form, busy);
  const onSuccess = options.onSuccess;

  return injectServiceCall(options.request, updateFooFn, {
    behavior: 'CONCAT',
    onBusyChange,
    onSuccess,
  });
};
