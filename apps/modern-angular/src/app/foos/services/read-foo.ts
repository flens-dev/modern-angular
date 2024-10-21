import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import { FooFormGroup, FooRead, ReadFoo, validateReadFoo } from '../model';

import { FOO_REPOSITORY } from './foo.repository';

export const injectReadFoo = (options: {
  request: ValueSource<ReadFoo>;
  form?: FooFormGroup;
}) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const readFooFn: ServiceCallFn<ReadFoo, FooRead> = (command: ReadFoo) => {
    const validatedCommand = validateReadFoo(command);
    return fooRepository.readFoo(validatedCommand);
  };

  const form = options.form;
  const onSuccess =
    form == null
      ? undefined
      : (_request: ReadFoo, response: FooRead) => form.setValue(response.foo);

  return injectServiceCall(options.request, readFooFn, {
    behavior: 'SWITCH',
    onSuccess,
  });
};
