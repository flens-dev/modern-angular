import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { FooOrderBy } from './foo.repository';

export type FoosSearchFormGroup = FormGroup<{
  withNameLike: FormControl<string | undefined>;
  withMaxCount: FormControl<number | undefined>;
  orderBy: FormControl<FooOrderBy | undefined>;
}>;

export const createFoosSearchForm = (): FoosSearchFormGroup => {
  const fb = new FormBuilder().nonNullable;
  return fb.group({
    withNameLike: fb.control<string | undefined>(undefined),
    withMaxCount: fb.control<number | undefined>(undefined),
    orderBy: fb.control<FooOrderBy | undefined>(undefined),
  });
};
