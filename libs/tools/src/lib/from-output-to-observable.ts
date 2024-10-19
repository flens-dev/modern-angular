import { NEVER, Observable, switchMap } from 'rxjs';

import { ValueSource, sourceToObservable } from './value-source';
import { OutputsOf } from './outputs-of';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { OutputRef } from '@angular/core';

/**
 * Returns an observable which emits the events of the given output of the component.
 * Undefined/null will be mapped to the NEVER observable.
 *
 * Usefull to declaratively subscribe to outputs of components retrieved with `viewChild` from a template.
 */
export const fromOutputToObservable = <TComponent extends object, TOutput>(
  $component$: ValueSource<TComponent | null | undefined>,
  outputName: OutputsOf<TComponent>,
): Observable<TOutput> => {
  return sourceToObservable($component$).pipe(
    switchMap((comp) =>
      comp != null && outputName in comp
        ? outputToObservable(comp[outputName] as OutputRef<TOutput>)
        : NEVER,
    ),
  );
};
