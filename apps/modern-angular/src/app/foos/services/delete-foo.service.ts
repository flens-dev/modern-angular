import { inject, Injectable } from '@angular/core';

import {
  injectServiceCall,
  ServiceCallOptions,
  ValueSource,
} from '@flens-dev/tools';

import {
  disableOrEnableFooFormOnBusyChange,
  FOO_REPOSITORY,
  FooDeleted,
  FooFormGroup,
  FooId,
  validateDeleteFoo,
} from '../model';

@Injectable()
export class DeleteFooService {
  readonly #fooRepository = inject(FOO_REPOSITORY);

  init(
    form: FooFormGroup,
    request: ValueSource<FooId>,
    onSuccess?: ServiceCallOptions<FooId, FooDeleted>['onSuccess'],
  ) {
    return injectServiceCall(
      request,
      (fooId) => this.#fooRepository.deleteFoo(validateDeleteFoo(fooId)),
      {
        behavior: 'CONCAT',
        onBusyChange: (busy) => disableOrEnableFooFormOnBusyChange(form, busy),
        onSuccess,
      },
    );
  }
}
