import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  disableFormOnBusy,
  injectServiceCall,
} from '@flens-dev/tools';

import {
  FooFormGroup,
  FooUpdated,
  UpdateFoo,
  validateUpdateFoo,
} from '../model';

import { FOO_REPOSITORY } from '../public';

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
      : (busy) => disableFormOnBusy(form, busy, { emitEvent: false });
  const onSuccess = options.onSuccess;

  return injectServiceCall(options.request, updateFooFn, {
    behavior: 'CONCAT',
    onBusyChange,
    onSuccess,
  });
};
