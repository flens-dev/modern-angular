import { Provider } from '@angular/core';

import { DeleteFooService } from './delete-foo.service';
import { FooService } from '../model';

export const provideFooServices = (): Provider[] => [
  FooService, // TODO replace FooService with CreateFooService, UpdateFooService etc.
  DeleteFooService,
];
