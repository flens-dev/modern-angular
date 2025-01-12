import { ElementRef } from '@angular/core';

import { NEVER, Observable, fromEvent, switchMap } from 'rxjs';

import { ValueSource, sourceToObservable } from './value-source';

/**
 * Returns an observable which emits the events of the given element.
 * Undefined/null will be mapped to the NEVER obsrevable.
 *
 * Usefull to declaratively subscribe to elements retrieved with `viewChild` from a template.
 */
export const fromEventToObservable = <TEvent extends Event = Event>(
  $elementRef$: ValueSource<ElementRef | null | undefined>,
  eventName: string,
): Observable<TEvent> => {
  return sourceToObservable($elementRef$).pipe(
    switchMap((el) =>
      el == null ? NEVER : fromEvent<TEvent>(el.nativeElement, eventName),
    ),
  );
};
