import { UnionToIntersection } from './union-to-intersection';

export type MergeIntersections<U> =
  UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;
