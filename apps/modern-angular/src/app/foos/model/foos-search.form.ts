import { InjectionToken, Provider } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { FooOrderBy } from './foo.model';

export type FoosSearchFormGroup = FormGroup<{
  withNameLike: FormControl<string | undefined>;
  withMaxCount: FormControl<number | undefined>;
  orderBy: FormControl<FooOrderBy | undefined>;
}>;

export const createFoosSearchForm = (
  fb: NonNullableFormBuilder,
): FoosSearchFormGroup => {
  return fb.group({
    withNameLike: fb.control<string | undefined>(undefined),
    withMaxCount: fb.control<number | undefined>(undefined),
    orderBy: fb.control<FooOrderBy | undefined>(undefined),
  });
};

export const FOOS_SEARCH_FORM = new InjectionToken<FoosSearchFormGroup>(
  'FoosSearchFormGroup',
);

export const provideFoosSearchForm = (): Provider[] => [
  {
    provide: FOOS_SEARCH_FORM,
    useFactory: (fb: NonNullableFormBuilder) => createFoosSearchForm(fb),
    deps: [NonNullableFormBuilder],
  },
];
