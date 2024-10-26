import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  areGetFoosRequestsEqual,
  transformOrderBy,
  transformWithMaxCount,
  transformWithNameLike,
} from '../model';
import { injectGetFoos } from '../services';
import { FooListItemComponent, FoosSearchFormComponent } from '../views';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-get-foos',
  templateUrl: './get-foos.component.html',
  styleUrl: '../common.css',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorPipe,
    ServiceCallStateComponent,
    FooListItemComponent,
    FoosSearchFormComponent,
  ],
})
export class GetFoosComponent {
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

  readonly #reload = signal(1);
  protected readonly getFoosRequest = computed((): GetFoosRequest => {
    const _justForTracking = this.#reload();
    return {
      withNameLike: this.withNameLike(),
      withMaxCount: this.withMaxCount(),
      orderBy: this.orderBy(),
    };
  });

  protected readonly getFoos = injectGetFoos({
    request: this.getFoosRequest,
  });

  protected readonly search = viewChild(FoosSearchFormComponent);
  readonly #searchSubmit = fromOutputToObservable(this.search, (c) => c.submit);

  constructor() {
    this.#searchSubmit.pipe(takeUntilDestroyed()).subscribe({
      next: (queryParams) => {
        const getFoosRequest = untracked(this.getFoosRequest);

        if (areGetFoosRequestsEqual(queryParams, getFoosRequest)) {
          this.#reload.update((v) => -v);
        } else {
          this.#router.navigate([], { queryParams });
        }
      },
    });
  }
}
