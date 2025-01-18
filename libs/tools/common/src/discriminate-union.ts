export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = Extract<
  T,
  Record<K, V>
>;

export type MapDiscriminatedUnion<
  T extends Record<K, string>,
  K extends keyof T,
> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Merge<U> =
  UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;

export type Unpartial<T> = Exclude<
  {
    [K in keyof T]-?: T[K];
  },
  undefined
>;
