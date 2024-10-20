import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import {
  DeleteFoo,
  FOO_REPOSITORY,
  FooDeleted,
  FooFormGroup,
  FooId,
  disableOrEnableFooFormOnBusyChange,
  validateDeleteFoo,
} from '../model';

export const injectDeleteFoo = (options: {
  request: ValueSource<FooId>;
  form?: FooFormGroup;
  onSuccess?: ServiceCallOptions<FooId, FooDeleted>['onSuccess'];
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
    | ServiceCallOptions<FooId, FooDeleted>['onBusyChange']
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
