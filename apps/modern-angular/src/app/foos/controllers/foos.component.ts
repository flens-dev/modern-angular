import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  ErrorPipe,
  fromOutputToObservable,
  isSuccessState,
  ServiceCallStateComponent,
} from '@flens-dev/tools';

import {
  GetFoosRequest,
  GetFoosResponse,
  transformOrderBy,
  transformWithMaxCount,
  transformWithNameLike,
} from '../model';
import { injectGetFoos } from '../services';
import { FooListItemComponent, FoosSearchFormComponent } from '../views';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos',
  templateUrl: './foos.component.html',
  styleUrl: '../foos.css',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorPipe,
    ServiceCallStateComponent,
    FooListItemComponent,
    FoosSearchFormComponent,
  ],
})
export class FoosComponent {
  readonly #router = inject(Router);

  protected readonly isSuccessState: typeof isSuccessState<
    GetFoosRequest,
    GetFoosResponse
  > = isSuccessState;

  readonly withNameLike = input(undefined, {
    transform: transformWithNameLike,
  });
  readonly withMaxCount = input(undefined, {
    transform: transformWithMaxCount,
  });
  readonly orderBy = input(undefined, {
    transform: transformOrderBy,
  });

  protected readonly getFoosRequest = computed(
    (): GetFoosRequest => ({
      withNameLike: this.withNameLike(),
      withMaxCount: this.withMaxCount(),
      orderBy: this.orderBy(),
    }),
  );

  protected readonly getFoos = injectGetFoos({
    request: this.getFoosRequest,
  });

  protected readonly search = viewChild(FoosSearchFormComponent);
  readonly #searchSubmit = toSignal(
    fromOutputToObservable(this.search, 'submit'),
  );

  constructor() {
    effect(() => {
      const searchSubmit = this.#searchSubmit();
      untracked(() => {
        this.#router.navigate([], { queryParams: searchSubmit });
      });
    });
  }
}
