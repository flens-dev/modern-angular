import { Provider } from '@angular/core';

import { FooService } from '../model';

export const provideFooServices = (): Provider[] => [FooService];
