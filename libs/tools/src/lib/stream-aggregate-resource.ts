import {
  DestroyRef,
  Resource,
  ResourceStatus,
  Signal,
  WritableSignal,
  computed,
  inject,
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

class StreamAggregateResource<TResource, TRequest, TResponse = TResource>
  implements Resource<TResource>
{
  readonly #value: WritableSignal<TResource>;
  readonly #status: WritableSignal<ResourceStatus>;
  readonly #error: WritableSignal<unknown>;
  readonly #reload = new Subject<void>();

  readonly value: Signal<TResource | undefined>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<unknown>;
  readonly isLoading: Signal<boolean>;

  constructor(
    initialValue: TResource,
    request$: Observable<TRequest | undefined>,
    loader: (request: TRequest) => Observable<TResponse>,
    aggregate: (accumulator: TResource, current: TResponse) => TResource,
    destroyRef: DestroyRef,
  ) {
    this.#value = signal(initialValue);
    this.#status = signal(ResourceStatus.Idle);
    this.#error = signal(undefined);

    this.value = this.#value.asReadonly();
    this.status = this.#status.asReadonly();
    this.error = this.#error.asReadonly();
    this.isLoading = computed(
      () =>
        this.status() === ResourceStatus.Loading ||
        this.status() === ResourceStatus.Reloading,
    );

    combineReload(request$, this.#reload)
      .pipe(
        switchMap(({ value: request, isReload }) => {
          if (request === undefined) {
            return of({
              status: ResourceStatus.Idle as const,
            });
          }

          try {
            return loader(request).pipe(
              map((response) => ({
                status: ResourceStatus.Resolved as const,
                response,
              })),
              catchError((error) =>
                of({
                  status: ResourceStatus.Error as const,
                  error,
                }),
              ),
              startWith({
                status: isReload
                  ? (ResourceStatus.Reloading as const)
                  : (ResourceStatus.Loading as const),
              }),
            );
          } catch (error) {
            return of({
              status: ResourceStatus.Error as const,
              error,
            });
          }
        }),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe({
        next: (state) => {
          this.#status.set(state.status);

          switch (state.status) {
            case ResourceStatus.Idle:
            case ResourceStatus.Loading:
            case ResourceStatus.Reloading: {
              this.#error.set(undefined);
              break;
            }
            case ResourceStatus.Resolved: {
              this.#error.set(undefined);
              this.#value.update((value) => aggregate(value, state.response));
              break;
            }
            case ResourceStatus.Error: {
              this.#error.set(state.error);
              break;
            }
          }
        },
        error: (error) => {
          this.#status.set(ResourceStatus.Error);
          this.#error.set(error);
        },
      });
  }

  hasValue(): this is Resource<TResource> & { value: Signal<TResource> } {
    return true;
  }

  reload(): boolean {
    const status = untracked(this.status);
    if (status === ResourceStatus.Error) {
      this.#reload.next();
      return true;
    }

    return false;
  }
}

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
  return new StreamAggregateResource(
    options.initialValue,
    options.request,
    options.loader,
    options.aggregate,
    options.destroyRef ?? inject(DestroyRef),
  );
};
