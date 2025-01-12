import { OutputRef } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { NEVER, Observable, switchMap } from 'rxjs';

import { ValueSource, sourceToObservable } from './value-source';
import { OutputsOf, OutputValueOf } from './outputs-of';

/**
 * Returns an observable which emits the events of the selected output of the component.
 * Undefined/null will be mapped to the NEVER observable.
 *
 * Usefull to declaratively subscribe to outputs of components retrieved with `viewChild` from a template.
 */
export const fromOutputToObservable = <
  TComponent extends object,
  TOutput extends OutputValueOf<TComponent>,
>(
  $component$: ValueSource<TComponent | null | undefined>,
  outputSelector: (c: OutputsOf<TComponent>) => OutputRef<TOutput>,
): Observable<TOutput> => {
  return sourceToObservable($component$).pipe(
    switchMap((comp) =>
      comp == null ? NEVER : outputToObservable(outputSelector(comp)),
    ),
  );
};
