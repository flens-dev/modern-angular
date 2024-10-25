import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import {
  FooFormGroup,
  ReadFooResponse,
  ReadFooRequest,
  validateReadFoo,
} from '../model';

import { FOO_REPOSITORY } from '../public';

export const injectReadFoo = (options: {
  request: ValueSource<ReadFooRequest>;
  form?: FooFormGroup;
}) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const readFooFn: ServiceCallFn<ReadFooRequest, ReadFooResponse> = (
    command: ReadFooRequest,
  ) => {
    const validatedCommand = validateReadFoo(command);
    return fooRepository.readFoo(validatedCommand);
  };

  const form = options.form;
  const onSuccess =
    form == null
      ? undefined
      : (_request: ReadFooRequest, response: ReadFooResponse) =>
          form.setValue(response.foo);

  return injectServiceCall(options.request, readFooFn, {
    behavior: 'SWITCH',
    onSuccess,
  });
};
