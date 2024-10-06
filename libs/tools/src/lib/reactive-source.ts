import { isSignal, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { isObservable, Observable, of } from 'rxjs';

export type ValueSource<TValue> = TValue | Signal<TValue> | Observable<TValue>;

export const sourceToObservable = <TValue>(
  source: ValueSource<TValue>
): Observable<TValue> =>
  isObservable(source)
    ? source
    : isSignal(source)
    ? toObservable(source)
    : of(source);
