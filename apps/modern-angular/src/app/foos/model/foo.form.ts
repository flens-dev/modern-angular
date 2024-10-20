import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { countValidator, Foo, initialFoo, nameValidator } from './foo.model';

export type FooFormGroup = FormGroup<{
  name: FormControl<string>;
  count: FormControl<number>;
}>;

export const createFooForm = (foo: Foo = initialFoo): FooFormGroup => {
  const fb = new FormBuilder().nonNullable;
  return fb.group({
    name: fb.control<string>(foo.name, { validators: nameValidator }),
    count: fb.control<number>(foo.count, { validators: countValidator }),
  });
};

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
