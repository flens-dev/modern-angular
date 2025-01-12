import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';
import { disableFormOnBusy } from '@flens-dev/tools/forms';

import type { FooUpdated, UpdateFoo } from '../public';
import { FOO_REPOSITORY } from '../public';

import { FooFormGroup, validateUpdateFoo } from '../model';

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
