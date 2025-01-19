export type Unpartial<T> = Exclude<
  {
    [K in keyof T]-?: T[K];
  },
  undefined
>;
