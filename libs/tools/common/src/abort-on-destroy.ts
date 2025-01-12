import { DestroyRef, inject, InjectionToken, Provider } from '@angular/core';

const createAbortOnDestroy = (destroyRef: DestroyRef): AbortSignal => {
  const abort = new AbortController();
  destroyRef.onDestroy(() => abort.abort());
  return abort.signal;
};

export const AbortOnDestroyRef = new InjectionToken<AbortSignal>(
  'AbortOnDestroyRef',
);

/**
 * Registers an AbortOnDestroyRef in dependecy injection.
 */
export const provideAbortOnDestroyRef = (): Provider[] => [
  {
    provide: AbortOnDestroyRef,
    useFactory: createAbortOnDestroy,
    deps: [DestroyRef],
  },
];

/**
 * Uses an AbortOnDestroyRef if provided in dependency injection.
 * Otherwise creates a new AbortController and link it to the DestroyRef.
 * @returns an AbortSignal which aborts when the DestroyRef is destroyed.
 */
export const injectAbortOnDestroy = (): AbortSignal => {
  const signal = inject(AbortOnDestroyRef, { optional: true });
  return signal == null ? createAbortOnDestroy(inject(DestroyRef)) : signal;
};
