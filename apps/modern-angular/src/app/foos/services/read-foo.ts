import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools/common';

import type { ReadFooResponse, ReadFooRequest } from '../public';
import { FOO_REPOSITORY } from '../public';

import { FooFormGroup, validateReadFoo } from '../model';

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
