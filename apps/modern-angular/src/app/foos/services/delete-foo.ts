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
  FOO_FORM,
  FOO_REPOSITORY,
  FooDeleted,
  FooId,
  validateDeleteFoo,
} from '../model';

export const injectDeleteFoo = (
  request: ValueSource<FooId>,
  onSuccess?: ServiceCallOptions<FooId, FooDeleted>['onSuccess'],
) => {
  const fooRepository = inject(FOO_REPOSITORY);
  const fooform = inject(FOO_FORM);

  const deleteFooFn: ServiceCallFn<DeleteFoo, FooDeleted> = (
    command: DeleteFoo,
  ) => {
    const validatedCommand = validateDeleteFoo(command);
    return fooRepository.deleteFoo(validatedCommand);
  };

  return injectServiceCall(request, deleteFooFn, {
    behavior: 'CONCAT',
    onBusyChange: (busy) => disableOrEnableFooFormOnBusyChange(fooform, busy),
    onSuccess,
  });
};
