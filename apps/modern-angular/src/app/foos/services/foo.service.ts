import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateFoo,
  FooCreated,
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

  createFoo(command: CreateFoo): Observable<FooCreated> {
    // TODO validate foo
    return this.#repository.createFoo(command);
  }
}
