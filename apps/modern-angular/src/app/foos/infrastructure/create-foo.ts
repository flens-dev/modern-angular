import { Location } from '@angular/common';
import { inject, Injectable, Provider } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import type { FooCreated } from '../model';
import type { FooCreatedHandler } from '../public';

import { FOO_CREATED_HANDLER } from '../public';

@Injectable()
export class NavigateToUpdateOnFooCreatedService implements FooCreatedHandler {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  handle(fooCreated: FooCreated) {
    let route = this.#route;
    while (route.firstChild != null) {
      route = route.firstChild;
    }

    this.#router.navigate(
      ['..', encodeURIComponent(fooCreated.fooId), 'update'],
      {
        replaceUrl: true,
        relativeTo: route,
      },
    );
  }
}

export const provideNavigateToUpdateOnFooCreated = (): Provider[] => [
  NavigateToUpdateOnFooCreatedService,
  {
    provide: FOO_CREATED_HANDLER,
    useExisting: NavigateToUpdateOnFooCreatedService,
    multi: true,
  },
];

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
