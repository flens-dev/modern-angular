export type Immutable<T> = T extends Array<infer E>
  ? ReadonlyArray<Immutable<E>>
  : T extends object
  ? {
      readonly [K in keyof T]: Immutable<T[K]>;
    }
  : T;

export type Mutable<T> = T extends Array<infer E> | ReadonlyArray<infer E>
  ? Array<Mutable<E>>
  : T extends object
  ? {
      -readonly [K in keyof T]: Mutable<T[K]>;
    }
  : T;
