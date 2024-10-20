import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { countValidator, initialFoo, nameValidator } from './foo.model';
import { InjectionToken, Provider } from '@angular/core';

export type FooFormGroup = FormGroup<{
  name: FormControl<string>;
  count: FormControl<number>;
}>;

export const createFooForm = (fb: NonNullableFormBuilder): FooFormGroup => {
  return fb.group({
    name: fb.control<string>(initialFoo.name, { validators: nameValidator }),
    count: fb.control<number>(initialFoo.count, { validators: countValidator }),
  });
};

export const FOO_FORM = new InjectionToken<FooFormGroup>('FooFormGroup');

export const provideFooForm = (): Provider[] => [
  {
    provide: FOO_FORM,
    useFactory: (fb: NonNullableFormBuilder) => createFooForm(fb),
    deps: [NonNullableFormBuilder],
  },
];

export const disableOrEnableFooFormOnBusyChange = (
  form: FooFormGroup,
  busy: boolean,
): void => {
  if (busy && !form.disabled) {
    form.disable({ emitEvent: false });
  } else if (!busy && form.disabled) {
    form.enable({ emitEvent: false });
  }
};
