import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import {
  DeleteFoo,
  FooDeleted,
  FooFormGroup,
  disableOrEnableFooFormOnBusyChange,
  validateDeleteFoo,
} from '../model';

import { FOO_REPOSITORY } from './foo.repository';

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
      : (busy) => disableOrEnableFooFormOnBusyChange(form, busy);
  const onSuccess = options.onSuccess;

  return injectServiceCall(options.request, deleteFooFn, {
    behavior: 'CONCAT',
    onBusyChange,
    onSuccess,
  });
};
