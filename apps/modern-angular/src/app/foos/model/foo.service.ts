import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import {
  Foo,
  FooCreated,
  FooDeleted,
  FooId,
  FooRead,
  FooUpdated,
} from './foo.model';
import {
  FooRepository,
  GetFoosRequest,
  GetFoosResponse,
} from './foo.repository';

@Injectable()
export class FooService {
  readonly #repository = inject(FooRepository);

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

  updateFoo(fooId: FooId, foo: Partial<Foo>): Observable<FooUpdated> {
    // TODO validate foo
    return this.#repository.updateFoo(fooId, foo);
  }

  deleteFoo(fooId: FooId): Observable<FooDeleted> {
    return this.#repository.deleteFoo(fooId);
  }
}
