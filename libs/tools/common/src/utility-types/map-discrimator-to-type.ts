import { ExtractTypeFromUnion } from './extract-type-from-union';

export type MapDiscriminatorToType<
  T extends Record<K, string>,
  K extends keyof T,
> = {
  [V in T[K]]: ExtractTypeFromUnion<T, K, V>;
};
