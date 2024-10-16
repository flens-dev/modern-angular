import { Provider } from '@angular/core';

import { FooService } from './foo.service';

export const provideFooServices = (): Provider[] => [FooService];
