import { inject, Injectable, Provider } from '@angular/core';
import { Location } from '@angular/common';

import type { FooCreated } from '../model';
import type { FooCreatedHandler } from '../public';

import { FOO_CREATED_HANDLER } from '../public';

@Injectable()
export class LocationBackOnFooCreatedService implements FooCreatedHandler {
  readonly #location = inject(Location);

  handle(fooCreated: FooCreated) {
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
