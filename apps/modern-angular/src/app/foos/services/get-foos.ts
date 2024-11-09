import { inject } from '@angular/core';

import {
  ServiceCallFn,
  ValueSource,
  injectServiceCall,
} from '@flens-dev/tools';

import type { GetFoosResponse, GetFoosRequest } from '../public';
import { FOO_REPOSITORY } from '../public';

import { validateGetFoos } from '../model';

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
