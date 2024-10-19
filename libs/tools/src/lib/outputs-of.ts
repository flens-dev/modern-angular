import { OutputRef } from '@angular/core';

export type OutputsOf<T> = {
  [K in keyof T]: T[K] extends OutputRef<unknown> ? K : never;
}[keyof T];

export type OutputValueOf<T, O extends OutputsOf<T>> =
  T[O] extends OutputRef<infer V> ? V : never;
