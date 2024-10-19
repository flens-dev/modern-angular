import { OutputRef } from '@angular/core';

export type OutputsOf<T> = {
  [K in keyof T]: T[K] extends OutputRef<unknown> ? K : never;
}[keyof T];
