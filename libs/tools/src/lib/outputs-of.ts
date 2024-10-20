import { OutputRef } from '@angular/core';

export type OutputNamesOf<T extends object> = {
  [K in keyof T]: T[K] extends OutputRef<unknown> ? K : never;
}[keyof T];

export type OutputsOf<T extends object> = Pick<T, OutputNamesOf<T>>;

export type OutputValueOf<
  T extends object,
  O extends OutputNamesOf<T> = OutputNamesOf<T>,
> = T[O] extends OutputRef<infer V> ? V : never;
