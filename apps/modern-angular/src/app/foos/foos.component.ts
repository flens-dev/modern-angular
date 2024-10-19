import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ErrorPipe, injectServiceCall } from '@flens-dev/tools';

import { FooOrderBy, FooService, GetFoosRequest, isFooOrderBy } from './model';
import { FooListItemComponent } from './views';
import { createFoosSearchForm } from './foos-search.form';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos',
  templateUrl: './foos.component.html',
  styleUrl: './foos.css',
  imports: [ReactiveFormsModule, ErrorPipe, FooListItemComponent],
})
export class FoosComponent {
  readonly #fooService = inject(FooService);

  protected readonly searchForm = createFoosSearchForm();

  readonly withNameLike = input<string | undefined, unknown>(undefined, {
    transform: (value) =>
      value == null || typeof value !== 'string' || value === ''
        ? undefined
        : value,
  });
  readonly withMaxCount = input<number | undefined, unknown>(undefined, {
    transform: (value) => (value == null ? undefined : numberAttribute(value)),
  });
  readonly orderBy = input<FooOrderBy | undefined, unknown>(undefined, {
    transform: (value) => (isFooOrderBy(value) ? value : undefined),
  });

  readonly #getFoosRequest = computed(
    (): GetFoosRequest => ({
      withNameLike: this.withNameLike(),
      withMaxCount: this.withMaxCount(),
      orderBy: this.orderBy(),
    }),
  );

  // eslint-disable-next-line no-unused-private-class-members
  readonly #setSearchFormEffect = effect(() => {
    const getFoosRequest = this.#getFoosRequest();
    untracked(() => {
      this.searchForm.patchValue(getFoosRequest, { emitEvent: false });
    });
  });

  protected readonly getFoos = injectServiceCall(
    this.#getFoosRequest,
    (req) => this.#fooService.getFoos(req),
    {
      behavior: 'SWITCH',
    },
  );
}
