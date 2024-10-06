import { Signal, isSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Observable, isObservable, of } from 'rxjs';

export type ValueSource<TValue> = TValue | Signal<TValue> | Observable<TValue>;

/**
 * Converts any valid `ValueSource` into an observable.
 * Usefull to create observable streams from any value source.
 */
export const sourceToObservable = <TValue>(
  source: ValueSource<TValue>
): Observable<TValue> =>
  isObservable(source)
    ? source
    : isSignal(source)
    ? toObservable(source)
    : of(source);
