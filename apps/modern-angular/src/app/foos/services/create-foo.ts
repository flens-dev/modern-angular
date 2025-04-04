import {
  computed,
  inject,
  InjectionToken,
  Provider,
  Signal,
} from '@angular/core';

import { map } from 'rxjs';

import {
  ServiceCall,
  injectMulti,
  injectServiceCall,
} from '@flens-dev/tools/common';
import {
  disableFormOnBusy,
  formNotValid,
  validFormSubmit,
} from '@flens-dev/tools/forms';

import type { CreateFoo, CreateFooSource, FooCreated } from '../public';
import {
  CREATE_FOO_SOURCE,
  FOO_CREATED_HANDLER,
  FOO_REPOSITORY,
} from '../public';

import type { FooFormGroup } from '../model';
import { FOO_FORM, provideFooForm, validateCreateFoo } from '../model';

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

export const injectCreateFooService = (): CreateFooService => {
  const form = inject(FOO_FORM);
  const source = inject(CREATE_FOO_SOURCE);
  const repository = inject(FOO_REPOSITORY);
  const fooCreatedHandler = injectMulti(FOO_CREATED_HANDLER, {
    optional: true,
  });

  const onSuccess =
    fooCreatedHandler == null
      ? undefined
      : async (createFoo: CreateFoo, fooCreated: FooCreated) => {
          await Promise.allSettled(
            fooCreatedHandler.map((handler) =>
              Promise.resolve(handler.handleFooCreated(fooCreated)),
            ),
          );
        };

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
    provide: CREATE_FOO_SERVICE,
    useFactory: injectCreateFooService,
  },
];
