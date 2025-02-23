import { inject, Resource } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';

import { EMPTY, filter, map } from 'rxjs';
import * as v from 'valibot';

import { debounceForm } from '@flens-dev/tools/forms';

import {
  DummyjsonClient,
  DummyjsonUserSearchRequestSchema,
  DummyjsonUserSearchResponse,
} from '../dummyjson';

export type UsersSearchFormGroup = FormGroup<{
  q: FormControl<string>;
}>;

export type PlainAngularSignalsStore = Readonly<{
  usersSearchForm: UsersSearchFormGroup;
  users: Resource<DummyjsonUserSearchResponse | undefined>;
}>;

export const injectPlainAngularSignalsStore = (
  usersSearchForm: UsersSearchFormGroup,
): PlainAngularSignalsStore => {
  const dummyjsonClient = inject(DummyjsonClient);

  const debouncedUsersSearchRequest = debounceForm(
    usersSearchForm,
    500,
    'q',
  ).pipe(
    map((value) => {
      const parseResult = v.safeParse(DummyjsonUserSearchRequestSchema, value);
      return parseResult.success ? parseResult.output : null;
    }),
    filter((request) => request != null),
  );

  const usersSearchRequest = toSignal(debouncedUsersSearchRequest);
  const users = rxResource({
    request: usersSearchRequest,
    loader: ({ request, abortSignal }) =>
      request == null
        ? EMPTY
        : dummyjsonClient.searchUsers(request, abortSignal),
  });

  return {
    usersSearchForm,
    users,
  };
};
