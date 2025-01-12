import {
  AbstractControl,
  ControlEvent,
  FormSubmittedEvent,
  ValueChangeEvent,
} from '@angular/forms';
import {
  Observable,
  debounce,
  distinctUntilChanged,
  filter,
  map,
  of,
  share,
  switchMap,
  timer,
} from 'rxjs';

import { sourceToObservable, ValueSource } from '@flens-dev/tools/common';

import { FormValueOf } from './form-value-of';
import { getControlPathFromRoot } from './get-control-path-from-root';
import { FormControlPath } from './form-control-path';

type ValueAndReason<TValue> = Readonly<{
  value: TValue;
  reason: 'NOT_VALID' | 'DEBOUNCE' | 'SUBMIT';
}>;

const filterForValueChangeAndSubmittedEvents = () =>
  filter(
    (event: ControlEvent) =>
      event instanceof ValueChangeEvent || event instanceof FormSubmittedEvent,
  );

const mapToValueAndReason = <TControl extends AbstractControl>(
  form: TControl,
  debounceOnSet: ReadonlySet<string>,
) =>
  map(
    (
      event: ValueChangeEvent<FormValueOf<TControl>> | FormSubmittedEvent,
    ): ValueAndReason<FormValueOf<TControl>> => ({
      value: form.getRawValue(),
      reason:
        form.status !== 'VALID'
          ? 'NOT_VALID'
          : debounceOnSet.has(getControlPathFromRoot(event.source))
            ? 'DEBOUNCE'
            : 'SUBMIT',
    }),
  );

type DebounceIfPredicate<T> = (value: T) => boolean;

const debounceIf = <T>(predicate: DebounceIfPredicate<T>, debounceMs: number) =>
  debounce((value: T) => (predicate(value) ? timer(debounceMs) : of(0)));

const mapToValidValueOrNull = <TValue>() =>
  map(({ reason, value }: ValueAndReason<TValue>) =>
    reason === 'NOT_VALID' ? null : value,
  );

/**
 * Creates an observable which emits the values of the form whenever it changes or is submitted.
 *
 * It emits `null` if the status of the whole form is not `VALID`.
 *
 * When the name of the control, which is responsible for the `ValueChangeEvent`, is included in the `debounceOn` array,
 * the emission of the form value will be debounced by the time given in `debounceMs`.
 *
 * The `debounceOn` array can include dot separated paths to nested controls like in `AbstractControl.get('nested.property')`.
 */
export const debounceForm = <TControl extends AbstractControl>(
  $form$: ValueSource<TControl>,
  debounceMs: number,
  ...debounceOn: FormControlPath<TControl>[]
): Observable<FormValueOf<TControl> | null> => {
  const debounceOnSet = new Set<string>(debounceOn);

  return sourceToObservable($form$).pipe(
    switchMap((form) =>
      form.events.pipe(
        filterForValueChangeAndSubmittedEvents(),
        mapToValueAndReason(form, debounceOnSet),
        debounceIf(({ reason }) => reason === 'DEBOUNCE', debounceMs),
        mapToValidValueOrNull(),
        distinctUntilChanged(),
      ),
    ),
    share(),
  );
};
