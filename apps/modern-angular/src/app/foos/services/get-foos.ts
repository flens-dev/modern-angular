import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import { GetFoosResponse, GetFoosRequest, validateGetFoos } from '../model';

import { FOO_REPOSITORY } from './foo.repository';

export const injectGetFoos = (options: {
  request: ValueSource<GetFoosRequest>;
}) => {
  const fooRepository = inject(FOO_REPOSITORY);

  const getFoosFn: ServiceCallFn<GetFoosRequest, GetFoosResponse> = (
    command: GetFoosRequest,
  ) => {
    const validatedCommand = validateGetFoos(command);
    return fooRepository.getFoos(validatedCommand);
  };

  return injectServiceCall(options.request, getFoosFn, {
    behavior: 'SWITCH',
  });
};
