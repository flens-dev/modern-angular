import { Observable, combineLatest, map, scan, startWith } from 'rxjs';

/**
 * Emits the value of the source and an indicator if the reload observable is the trigger for the emission.
 */
export const combineReload = <T>(
  source: Observable<T>,
  reload: Observable<unknown>,
): Observable<{ value: T; isReload: boolean }> => {
  return combineLatest([
    source,
    reload.pipe(
      map((_, index) => index),
      startWith(-1),
    ),
  ]).pipe(
    scan(
      ({ lastReloadIndex }, [value, reloadIndex]) => ({
        value,
        isReload: lastReloadIndex !== reloadIndex,
        lastReloadIndex: reloadIndex,
      }),
      {
        value: undefined as T,
        isReload: false,
        lastReloadIndex: -1,
      },
    ),
    // drop lastReloadIndex
    map(({ value, isReload }) => ({ value, isReload })),
  );
};
