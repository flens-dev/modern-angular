import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { countValidator, initialFoo, nameValidator } from './foo.model';
import { inject, InjectionToken, Provider } from '@angular/core';

export type FooFormGroup = FormGroup<{
  name: FormControl<string>;
  count: FormControl<number>;
}>;

export const injectFooForm = (): FooFormGroup => {
  const fb = inject(NonNullableFormBuilder);
  return fb.group({
    name: fb.control<string>(initialFoo.name, { validators: nameValidator }),
    count: fb.control<number>(initialFoo.count, { validators: countValidator }),
  });
};

export const FOO_FORM = new InjectionToken<FooFormGroup>('FooFormGroup');

export const provideFooForm = (): Provider[] => [
  {
    provide: FOO_FORM,
    useFactory: injectFooForm,
  },
];
