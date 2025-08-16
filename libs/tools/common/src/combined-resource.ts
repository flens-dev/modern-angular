import { computed, Resource, ResourceStatus, Signal } from '@angular/core';

const chooseResourceStatusFn: Record<
  ResourceStatus,
  (next: ResourceStatus) => ResourceStatus
> = {
  ['idle']: (next) => next,
  ['error']: (next) => 'error',
  ['loading']: (next) => (next === 'error' ? next : 'loading'),
  ['reloading']: (next) => (next === 'error' ? next : 'reloading'),
  ['resolved']: (next) =>
    next === 'error' || next === 'local' ? next : 'resolved',
  ['local']: (next) => (next === 'error' ? next : 'local'),
};

const chooseResourceStatus = (
  current: ResourceStatus,
  next: ResourceStatus,
): ResourceStatus => {
  return chooseResourceStatusFn[current](next);
};

class CombinedResourceImpl implements Resource<readonly unknown[]> {
  readonly status: Signal<ResourceStatus>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<Error | undefined>;
  readonly value: Signal<readonly unknown[]>;

  constructor(...resources: readonly Resource<unknown>[]) {
    this.status = computed(() =>
      resources
        .map((r) => r.status())
        .reduce((a, v) => chooseResourceStatus(a, v), 'idle'),
    );

    this.isLoading = computed(
      () => this.status() === 'loading' || this.status() === 'reloading',
    );

    // TODO use AggregateError when available
    this.error = computed(() =>
      this.status() === 'error'
        ? new Error(resources.map((r) => r.error()?.message).join(', '))
        : undefined,
    );

    this.value = computed(() => resources.map((r) => r.value()));
  }

  hasValue(): this is Resource<readonly unknown[]> {
    return this.status() === 'resolved' || this.status() === 'local';
  }

  reload() {
    return false;
  }
}

export function combinedResource(
  ...resources: readonly Resource<unknown>[]
): Resource<readonly unknown[]> {
  return new CombinedResourceImpl(...resources);
}
