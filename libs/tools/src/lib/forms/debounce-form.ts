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

import { sourceToObservable, ValueSource } from '../value-source';

import { FormValueOf } from './form-value-of';
import { getControlPathFromRoot } from './get-control-path-from-root';

type ValueAndCause<TValue> = Readonly<{
  value: TValue;
  cause: 'NOT_VALID' | 'DEBOUNCE' | 'SUBMIT';
}>;

const filterForValueChangeAndSubmittedEvents = () =>
  filter(
    (event: ControlEvent) =>
      event instanceof ValueChangeEvent || event instanceof FormSubmittedEvent
  );

const mapToValueAndCause = <TControl extends AbstractControl>(
  form: TControl,
  debounceOnSet: ReadonlySet<string>
) =>
  map(
    (
      event: ValueChangeEvent<FormValueOf<TControl>> | FormSubmittedEvent
    ): ValueAndCause<FormValueOf<TControl>> => ({
      value: form.getRawValue(),
      cause:
        form.status !== 'VALID'
          ? 'NOT_VALID'
          : debounceOnSet.has(getControlPathFromRoot(event.source))
          ? 'DEBOUNCE'
          : 'SUBMIT',
    })
  );

type DebounceIfPredicate<T> = (value: T) => boolean;

const debounceIf = <T>(predicate: DebounceIfPredicate<T>, debounceMs: number) =>
  debounce((value: T) => (predicate(value) ? timer(debounceMs) : of(0)));

const mapToValidValueOrNull = <TValue>() =>
  map(({ cause, value }: ValueAndCause<TValue>) =>
    cause === 'NOT_VALID' ? null : value
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
  ...debounceOn: string[]
): Observable<FormValueOf<TControl> | null> => {
  const debounceOnSet = new Set<string>(debounceOn);

  return sourceToObservable($form$).pipe(
    switchMap((form) =>
      form.events.pipe(
        filterForValueChangeAndSubmittedEvents(),
        mapToValueAndCause(form, debounceOnSet),
        debounceIf(({ cause }) => cause === 'DEBOUNCE', debounceMs),
        mapToValidValueOrNull(),
        distinctUntilChanged()
      )
    ),
    share()
  );
};
