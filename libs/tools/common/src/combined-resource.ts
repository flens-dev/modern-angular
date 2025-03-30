import { computed, Resource, ResourceStatus, Signal } from '@angular/core';

const chooseResourceStatusFn: Record<
  ResourceStatus,
  (next: ResourceStatus) => ResourceStatus
> = {
  [ResourceStatus.Idle]: (next) => next,
  [ResourceStatus.Error]: (next) => ResourceStatus.Error,
  [ResourceStatus.Loading]: (next) =>
    next === ResourceStatus.Error ? next : ResourceStatus.Loading,
  [ResourceStatus.Reloading]: (next) =>
    next === ResourceStatus.Error ? next : ResourceStatus.Reloading,
  [ResourceStatus.Resolved]: (next) =>
    next === ResourceStatus.Error || next === ResourceStatus.Local
      ? next
      : ResourceStatus.Resolved,
  [ResourceStatus.Local]: (next) =>
    next === ResourceStatus.Error ? next : ResourceStatus.Local,
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
  readonly error: Signal<unknown>;
  readonly value: Signal<readonly unknown[]>;

  constructor(...resources: readonly Resource<unknown>[]) {
    this.status = computed(() =>
      resources
        .map((r) => r.status())
        .reduce((a, v) => chooseResourceStatus(a, v), ResourceStatus.Idle),
    );

    this.isLoading = computed(
      () =>
        this.status() === ResourceStatus.Loading ||
        this.status() === ResourceStatus.Reloading,
    );

    this.error = computed(() =>
      this.status() === ResourceStatus.Error
        ? resources.map((r) => r.error())
        : undefined,
    );

    this.value = computed(() => resources.map((r) => r.value()));
  }

  hasValue(): this is Resource<readonly unknown[]> {
    return (
      this.status() === ResourceStatus.Resolved ||
      this.status() === ResourceStatus.Local
    );
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
