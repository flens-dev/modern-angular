import { inject, InjectOptions, ProviderToken } from '@angular/core';

export function injectMulti<T>(token: ProviderToken<T>): T[];
export function injectMulti<T>(
  token: ProviderToken<T>,
  options: InjectOptions & {
    optional?: false;
  },
): T[];
export function injectMulti<T>(
  token: ProviderToken<T>,
  options: InjectOptions,
): T[] | null;
export function injectMulti<T>(
  token: ProviderToken<T>,
  options?: InjectOptions,
): T[] | null {
  const values = options == null ? inject(token) : inject(token, options);
  return values == null ? null : Array.isArray(values) ? values : [values];
}
