import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { countValidator, Foo, initialFoo, nameValidator } from './foo.model';

export type FooEditFormGroup = FormGroup<{
  name: FormControl<string>;
  count: FormControl<number>;
}>;

export const createFooEditForm = (foo: Foo = initialFoo): FooEditFormGroup => {
  const fb = new FormBuilder().nonNullable;
  return fb.group({
    name: fb.control<string>(foo.name, { validators: nameValidator }),
    count: fb.control<number>(foo.count, { validators: countValidator }),
  });
};
