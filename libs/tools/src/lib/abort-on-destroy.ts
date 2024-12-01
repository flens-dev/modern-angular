import { DestroyRef, InjectionToken, Provider } from '@angular/core';

export const AbortOnDestroyRef = new InjectionToken<AbortSignal>(
  'AbortOnDestroyRef',
);

export const provideAbortOnDestroyRef = (): Provider[] => [
  {
    provide: AbortOnDestroyRef,
    useFactory: (destroyRef: DestroyRef) => {
      const abort = new AbortController();
      destroyRef.onDestroy(() => abort.abort());
      return abort.signal;
    },
    deps: [DestroyRef],
  },
];
