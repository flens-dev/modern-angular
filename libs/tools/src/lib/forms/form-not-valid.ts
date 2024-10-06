import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';

import { map, startWith, switchMap } from 'rxjs';

import { sourceToObservable, ValueSource } from '../value-source';

export const formNotValid = <TControl extends AbstractControl>(
  $form$: ValueSource<TControl>
): Signal<boolean> => {
  const formStatus$ = sourceToObservable($form$).pipe(
    switchMap((form) => form.statusChanges.pipe(startWith(form.status))),
    map((formStatus) => formStatus !== 'VALID')
  );

  return toSignal(formStatus$, {
    requireSync: true,
  });
};
