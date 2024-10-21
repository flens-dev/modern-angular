import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import {
  Foo,
  FooCreated,
  FooId,
  FooRead,
  GetFoosRequest,
  GetFoosResponse,
} from '../model';

import { FOO_REPOSITORY } from './foo.repository';

@Injectable()
export class FooService {
  readonly #repository = inject(FOO_REPOSITORY);

  getFoos(request: GetFoosRequest): Observable<GetFoosResponse> {
    // TODO validate request
    return this.#repository.getFoos(request);
  }

  createFoo(foo: Foo): Observable<FooCreated> {
    // TODO validate foo
    return this.#repository.createFoo(foo);
  }

  readFoo(fooId: FooId): Observable<FooRead> {
    return this.#repository.readFoo(fooId);
  }
}
