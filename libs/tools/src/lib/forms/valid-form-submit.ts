import { AbstractControl, FormSubmittedEvent } from '@angular/forms';
import { Observable, filter, map, switchMap } from 'rxjs';

import { ValueSource, sourceToObservable } from '../value-source';

import { FormValueOf } from './form-value-of';

export const validFormSubmit = <TControl extends AbstractControl>(
  $form$: ValueSource<TControl>
): Observable<FormValueOf<TControl>> => {
  return sourceToObservable($form$).pipe(
    switchMap((form) =>
      form.events.pipe(
        filter(
          (controlEvent): controlEvent is FormSubmittedEvent =>
            controlEvent instanceof FormSubmittedEvent &&
            controlEvent.source.status === 'VALID'
        ),
        map(() => form.getRawValue())
      )
    )
  );
};
