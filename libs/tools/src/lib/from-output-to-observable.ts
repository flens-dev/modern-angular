import { NEVER, Observable, switchMap } from 'rxjs';

import { ValueSource, sourceToObservable } from './value-source';
import { OutputNamesOf, OutputValueOf } from './outputs-of';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { OutputRef } from '@angular/core';

/**
 * Returns an observable which emits the events of the given output of the component.
 * Undefined/null will be mapped to the NEVER observable.
 *
 * Usefull to declaratively subscribe to outputs of components retrieved with `viewChild` from a template.
 */
export const fromOutputToObservable = <
  TComponent extends object,
  TOutput extends OutputNamesOf<TComponent>,
>(
  $component$: ValueSource<TComponent | null | undefined>,
  output: TOutput,
): Observable<OutputValueOf<TComponent, TOutput>> => {
  return sourceToObservable($component$).pipe(
    switchMap((comp) =>
      comp != null && output in comp
        ? outputToObservable(
            comp[output] as OutputRef<OutputValueOf<TComponent, TOutput>>,
          )
        : NEVER,
    ),
  );
};
