import {
  DestroyRef,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

// TODO Remove when ported to Angular 19
export enum ResourceStatus {
  Idle,
  Error,
  Loading,
  Reloading,
  Resolved,
  Local,
}

// TODO Remove when ported to Angular 19
export interface Resource<T> {
  readonly value: Signal<T | undefined>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<unknown>;
  readonly isLoading: Signal<boolean>;

  hasValue(): boolean;
  reload(): boolean;
}

export type StreamAggregateResourceOptions<
  TResource,
  TRequest,
  TResponse = TResource,
> = {
  readonly initialValue: TResource;
  readonly request: Observable<TRequest>;
  readonly loader: (request: TRequest) => Observable<TResponse>;
  readonly aggregate: (accumulator: TResource, current: TResponse) => TResource;
  readonly destroyRef?: DestroyRef;
};

class StreamAggregateResource<TResource, TRequest, TResponse = TResource>
  implements Resource<TResource>
{
  readonly #value: WritableSignal<TResource>;
  readonly #status: WritableSignal<ResourceStatus>;
  readonly #error: WritableSignal<unknown>;
  readonly #reload = new BehaviorSubject<true>(true);

  readonly value: Signal<TResource | undefined>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<unknown>;
  readonly isLoading: Signal<boolean>;

  constructor(
    initialValue: TResource,
    request: Observable<TRequest>,
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

    combineLatest([request, this.#reload])
      .pipe(
        switchMap(([request]) =>
          loader(request).pipe(
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
              status: ResourceStatus.Loading as const,
            }),
          ),
        ),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe({
        next: (state) => {
          this.#status.set(state.status);

          switch (state.status) {
            case ResourceStatus.Loading: {
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

  /** will only reload when in error state */
  reload(): boolean {
    const status = untracked(this.status);
    if (status === ResourceStatus.Error) {
      this.#reload.next(true);
      return true;
    }

    return false;
  }
}

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
