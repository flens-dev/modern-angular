import {
  DestroyRef,
  Resource,
  ResourceStatus,
  computed,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';

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
  readonly error: Error | undefined;
};

const idleValue: StreamValue<undefined> = {
  status: 'idle',
  value: undefined,
  error: undefined,
};

const resolvedValue = <TResponse>(
  value: TResponse,
): StreamValue<TResponse> => ({
  status: 'resolved',
  value,
  error: undefined,
});

const errorValue = (error: unknown): StreamValue<undefined> => ({
  status: 'error',
  value: undefined,
  error: error instanceof Error ? error : new Error(`Unknown error: ${error}`),
});

const loadingValue: StreamValue<undefined> = {
  status: 'loading',
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
    status: 'idle' as ResourceStatus,
    value: options.initialValue,
    error: undefined as Error | undefined,
  });

  const status = computed(() => source().status);
  const value = computed(() => source().value);
  const error = computed(() => source().error);
  const isLoading = computed(
    () => status() === 'loading' || status() === 'reloading',
  );
  const hasValue = (): this is Resource<Exclude<TResource, undefined>> => true;

  options.request
    .pipe(
      switchMap((request) => {
        if (request === undefined) {
          return of(idleValue);
        }

        try {
          return options.loader(request).pipe(
            map((response) => resolvedValue(response)),
            startWith(loadingValue),
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
          status: 'error',
          error,
        })),
      complete: () =>
        source.update((previous) => ({
          ...previous,
          status: 'idle',
        })),
    });

  return {
    status,
    value,
    error,
    isLoading,
    hasValue,
  };
};
