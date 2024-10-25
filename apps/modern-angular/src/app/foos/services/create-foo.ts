import { Location } from '@angular/common';
import {
  computed,
  inject,
  InjectionToken,
  Provider,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import {
  ServiceCall,
  disableFormOnBusy,
  formNotValid,
  injectServiceCall,
  validFormSubmit,
} from '@flens-dev/tools';

import {
  CreateFoo,
  FOO_FORM,
  FooCreated,
  FooFormGroup,
  provideFooForm,
  validateCreateFoo,
} from '../model';
import {
  CREATE_FOO_ON_SUCCESS,
  CREATE_FOO_SERVICE_CONFIG,
  CREATE_FOO_SOURCE,
  CreateFooOnSuccess,
  CreateFooSource,
  FOO_REPOSITORY,
} from '../public';

export type CreateFooService = {
  readonly call: ServiceCall<CreateFoo, FooCreated>;
  readonly form: FooFormGroup;
  readonly submitDisabled: Signal<boolean>;
};

export const CREATE_FOO_SERVICE = new InjectionToken<CreateFooService>(
  'CreateFooService',
);

export const injectCreateFooSourceFromForm = (): CreateFooSource => {
  const form = inject(FOO_FORM);

  return validFormSubmit(form).pipe(map((foo) => ({ foo })));
};

export const injectCreateFooOnSuccessToUpdateRoute = (): CreateFooOnSuccess => {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  return (request, response) => {
    router.navigate(['..', encodeURIComponent(response.fooId), 'update'], {
      relativeTo: route,
      replaceUrl: true,
    });
  };
};

export const injectCreateFooOnSuccessToLocationBack =
  (): CreateFooOnSuccess => {
    const location = inject(Location);

    return (request, response) => {
      location.back();
    };
  };

export const injectCreateFooOnSuccessFromConfig = (): CreateFooOnSuccess => {
  const config = inject(CREATE_FOO_SERVICE_CONFIG, { optional: true });

  return config?.onSuccess === 'BACK'
    ? injectCreateFooOnSuccessToLocationBack()
    : config?.onSuccess === 'UPDATE'
      ? injectCreateFooOnSuccessToUpdateRoute()
      : undefined;
};

export const injectCreateFooService = (): CreateFooService => {
  const form = inject(FOO_FORM);
  const source = inject(CREATE_FOO_SOURCE);
  const onSuccess =
    inject(CREATE_FOO_ON_SUCCESS, { optional: true }) ?? undefined;
  const repository = inject(FOO_REPOSITORY);

  const formIsNotValid = formNotValid(form);
  const call = injectServiceCall(
    source,
    (command) => repository.createFoo(validateCreateFoo(command)),
    {
      behavior: 'CONCAT',
      onBusyChange: (busy) =>
        disableFormOnBusy(form, busy, { emitEvent: false }),
      onSuccess,
    },
  );
  const submitDisabled = computed(() => formIsNotValid() || call.busy());

  return {
    call,
    form,
    submitDisabled,
  };
};

export const provideCreateFoo = (): Provider[] => [
  provideFooForm(),
  {
    provide: CREATE_FOO_SOURCE,
    useFactory: injectCreateFooSourceFromForm,
  },
  {
    provide: CREATE_FOO_ON_SUCCESS,
    useFactory: injectCreateFooOnSuccessFromConfig,
  },
  {
    provide: CREATE_FOO_SERVICE,
    useFactory: injectCreateFooService,
  },
];
