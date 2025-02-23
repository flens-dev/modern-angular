import { inject, Resource } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { filter, map } from 'rxjs';
import * as v from 'valibot';

import { debounceForm } from '@flens-dev/tools/forms';

import {
  DummyjsonClient,
  DummyjsonUserSearchRequest,
  DummyjsonUserSearchRequestSchema,
  DummyjsonUserSearchResponse,
} from '../dummyjson';

export type SearchFormGroup = FormGroup<{
  q: FormControl<string>;
}>;

export type Store = Readonly<{
  searchForm: SearchFormGroup;
  users: Resource<DummyjsonUserSearchResponse>;
}>;

export const injectStore = (): Store => {
  const fb = inject(NonNullableFormBuilder);
  const dummyjsonClient = inject(DummyjsonClient);

  const searchForm = fb.group({
    q: [''],
  });

  const debouncedSearch = debounceForm(searchForm, 250, 'q').pipe(
    map((value) => {
      const parseResult = v.safeParse(DummyjsonUserSearchRequestSchema, value);
      return parseResult.success ? parseResult.output : null;
    }),
    filter((request): request is DummyjsonUserSearchRequest => request != null),
  );

  const usersSearchRequest = toSignal(debouncedSearch, {
    initialValue: searchForm.getRawValue(),
  });
  const usersDefaultValue: DummyjsonUserSearchResponse = {
    users: [],
    total: 0,
    skip: 0,
    limit: 0,
  };
  const users = rxResource({
    request: usersSearchRequest,
    loader: ({ request, abortSignal }) =>
      dummyjsonClient.searchUsers(request, abortSignal),
    defaultValue: usersDefaultValue,
  });

  return {
    searchForm,
    users,
  };
};
