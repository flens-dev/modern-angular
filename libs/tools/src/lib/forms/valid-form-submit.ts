import { AbstractControl, FormSubmittedEvent } from '@angular/forms';
import { Observable, filter, map, share, switchMap } from 'rxjs';

import { ValueSource, sourceToObservable } from '../value-source';

import { FormValueOf } from './form-value-of';

/**
 * Returns an observable which emits the raw value of the control when the control is valid and submitted.
 * Can be used to declaratively react to form submissions.
 */
export const validFormSubmit = <TControl extends AbstractControl>(
  $form$: ValueSource<TControl>
): Observable<FormValueOf<TControl>> => {
  return sourceToObservable($form$).pipe(
    switchMap((form) =>
      form.events.pipe(
        filter(
          (controlEvent) =>
            controlEvent instanceof FormSubmittedEvent &&
            form.status === 'VALID'
        ),
        map(() => form.getRawValue())
      )
    ),
    share()
  );
};
