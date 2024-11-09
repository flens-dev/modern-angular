import { inject, Injectable, Provider } from '@angular/core';
import { Location } from '@angular/common';

import type { FooCreated, FooCreatedHandler } from '../public';
import { FOO_CREATED_HANDLER } from '../public';

@Injectable()
export class LocationBackOnFooCreatedService implements FooCreatedHandler {
  readonly #location = inject(Location);

  handleFooCreated(fooCreated: FooCreated) {
    this.#location.back();
  }
}

export const provideLocationBackOnFooCreated = (): Provider[] => [
  LocationBackOnFooCreatedService,
  {
    provide: FOO_CREATED_HANDLER,
    useExisting: LocationBackOnFooCreatedService,
    multi: true,
  },
];
