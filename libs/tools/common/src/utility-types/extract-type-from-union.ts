export type ExtractTypeFromUnion<
  T,
  K extends keyof T,
  V extends T[K],
> = Extract<T, Record<K, V>>;
