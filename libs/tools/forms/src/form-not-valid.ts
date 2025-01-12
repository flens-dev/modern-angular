import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlStatus } from '@angular/forms';

import { map, of, startWith, switchMap } from 'rxjs';

import { sourceToObservable, ValueSource } from '@flens-dev/tools/common';

/**
 * Creates a signal which is true if the status of the control is "not valid".
 * This is usefull for disabling a submit button while the form is not valid.
 *
 * ```
 * readonly form: FormGroup = ...;
 * readonly submitting: Signal<boolean> = ...;
 *
 * readonly submitDisabled = computed(() => {
 *   const notValid = formNotValid(this.form);
 *   const busy = this.submitting();
 *   return notValid || busy;
 * });
 * ```
 */
export const formNotValid = <TControl extends AbstractControl>(
  $form$: ValueSource<TControl | null | undefined>,
): Signal<boolean> => {
  const formStatus$ = sourceToObservable($form$).pipe(
    switchMap((form) =>
      form == null
        ? of<FormControlStatus>('INVALID')
        : form.statusChanges.pipe(startWith(form.status)),
    ),
    map((status) => status !== 'VALID'),
  );

  return toSignal(formStatus$, {
    initialValue: true,
  });
};
