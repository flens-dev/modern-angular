import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';
import { disableFormOnBusy } from '@flens-dev/tools/forms';

import type { DeleteFoo, FooDeleted } from '../public';
import { FOO_REPOSITORY } from '../public';

import { FooFormGroup, validateDeleteFoo } from '../model';

export const injectDeleteFoo = (options: {
  request: ValueSource<DeleteFoo>;
  form?: FooFormGroup;
  onSuccess?: ServiceCallOptions<DeleteFoo, FooDeleted>['onSuccess'];
}) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const deleteFooFn: ServiceCallFn<DeleteFoo, FooDeleted> = (
    command: DeleteFoo,
  ) => {
    const validatedCommand = validateDeleteFoo(command);
    return fooRepository.deleteFoo(validatedCommand);
  };

  const form = options.form;
  const onBusyChange:
    | ServiceCallOptions<DeleteFoo, FooDeleted>['onBusyChange']
    | undefined =
    form == null
      ? undefined
      : (busy) => disableFormOnBusy(form, busy, { emitEvent: false });
  const onSuccess = options.onSuccess;

  return injectServiceCall(options.request, deleteFooFn, {
    behavior: 'CONCAT',
    onBusyChange,
    onSuccess,
  });
};
