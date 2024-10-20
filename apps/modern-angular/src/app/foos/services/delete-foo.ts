import { inject } from '@angular/core';

import {
  injectServiceCall,
  ServiceCallFn,
  ServiceCallOptions,
  ValueSource,
} from '@flens-dev/tools';

import {
  DeleteFoo,
  disableOrEnableFooFormOnBusyChange,
  FOO_REPOSITORY,
  FooDeleted,
  FooFormGroup,
  FooId,
  validateDeleteFoo,
} from '../model';

export const injectDeleteFoo = (
  form: FooFormGroup,
  request: ValueSource<FooId>,
  onSuccess?: ServiceCallOptions<FooId, FooDeleted>['onSuccess'],
) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const deleteFooFn: ServiceCallFn<DeleteFoo, FooDeleted> = (
    command: DeleteFoo,
  ) => {
    const validatedCommand = validateDeleteFoo(command);
    return fooRepository.deleteFoo(validatedCommand);
  };

  return injectServiceCall(request, deleteFooFn, {
    behavior: 'CONCAT',
    onBusyChange: (busy) => disableOrEnableFooFormOnBusyChange(form, busy),
    onSuccess,
  });
};
