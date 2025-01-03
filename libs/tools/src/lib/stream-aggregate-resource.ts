import {
  DestroyRef,
  Resource,
  ResourceStatus,
  Signal,
  computed,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  Subject,
  Observable,
  catchError,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { combineReload } from './combine-reload';

export type StreamAggregateResourceOptions<
  TResource,
  TRequest,
  TResponse = TResource,
> = {
  readonly initialValue: TResource;
  readonly request: Observable<TRequest | undefined>;
  readonly loader: (request: NoInfer<TRequest>) => Observable<TResponse>;
  readonly aggregate: (accumulator: TResource, current: TResponse) => TResource;
  readonly destroyRef?: DestroyRef;
};

type StreamValue<TResponse> = {
  readonly status: ResourceStatus;
  readonly value: TResponse | undefined;
  readonly error: unknown;
};

const idleValue: StreamValue<undefined> = {
  status: ResourceStatus.Idle,
  value: undefined,
  error: undefined,
};

const resolvedValue = <TResponse>(
  value: TResponse,
): StreamValue<TResponse> => ({
  status: ResourceStatus.Resolved,
  value,
  error: undefined,
});

const errorValue = (error: unknown): StreamValue<undefined> => ({
  status: ResourceStatus.Error,
  value: undefined,
  error,
});

const loadingValue: StreamValue<undefined> = {
  status: ResourceStatus.Loading,
  value: undefined,
  error: undefined,
};

const reloadingValue: StreamValue<undefined> = {
  status: ResourceStatus.Reloading,
  value: undefined,
  error: undefined,
};

/**
 * Aggregates all responses from the loader into the value of the resource.
 * A new request triggers a new call of the loader.
 * If not called in an injection context a DestroyRef must be provided.
 * The reload method will only work if the resource is in error state.
 */
export const streamAggregateResource = <
  TResource,
  TRequest,
  TResponse = TResource,
>(
  options: StreamAggregateResourceOptions<TResource, TRequest, TResponse>,
): Resource<TResource> => {
  const source = signal({
    status: ResourceStatus.Idle,
    value: options.initialValue,
    error: undefined as unknown,
  });

  const status = computed(() => source().status);
  const value = computed(() => source().value);
  const error = computed(() => source().error);
  const isLoading = computed(
    () =>
      status() === ResourceStatus.Loading ||
      status() === ResourceStatus.Reloading,
  );
  const hasValue = (): this is Resource<TResource> & {
    value: Signal<TResource>;
  } => true;

  const reload$ = new Subject<void>();
  const reload = () => {
    if (untracked(status) === ResourceStatus.Error) {
      reload$.next();
      return true;
    }
    return false;
  };

  combineReload(options.request, reload$)
    .pipe(
      switchMap(({ value: request, isReload }) => {
        if (request === undefined) {
          return of(idleValue);
        }

        try {
          return options.loader(request).pipe(
            map((response) => resolvedValue(response)),
            startWith(isReload ? reloadingValue : loadingValue),
            catchError((error) => of(errorValue(error))),
          );
        } catch (error) {
          return of(errorValue(error));
        }
      }),
      takeUntilDestroyed(options.destroyRef),
    )
    .subscribe({
      next: (nextState) =>
        source.update((previous) => {
          const nextValue =
            nextState.value === undefined
              ? previous.value
              : options.aggregate(previous.value, nextState.value);

          return {
            status: nextState.status,
            value: nextValue,
            error: nextState.error,
          };
        }),
      error: (error) =>
        source.update((previous) => ({
          ...previous,
          status: ResourceStatus.Error,
          error,
        })),
      complete: () =>
        source.update((previous) => ({
          ...previous,
          status: ResourceStatus.Idle,
        })),
    });

  return {
    status,
    value,
    error,
    isLoading,
    hasValue,
    reload,
  };
};
