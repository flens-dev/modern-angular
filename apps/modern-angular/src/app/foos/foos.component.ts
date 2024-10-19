import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ErrorPipe, injectServiceCall } from '@flens-dev/tools';

import { FooOrderBy, FooService, GetFoosRequest, isFooOrderBy } from './model';
import { FooListItemComponent } from './views';

import { FoosSearchFormComponent } from './foos-search-form.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos',
  templateUrl: './foos.component.html',
  styleUrl: './foos.css',
  imports: [
    ReactiveFormsModule,
    ErrorPipe,
    FooListItemComponent,
    FoosSearchFormComponent,
  ],
})
export class FoosComponent {
  readonly #fooService = inject(FooService);

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

  protected readonly getFoosRequest = computed(
    (): GetFoosRequest => ({
      withNameLike: this.withNameLike(),
      withMaxCount: this.withMaxCount(),
      orderBy: this.orderBy(),
    }),
  );

  protected readonly getFoos = injectServiceCall(
    this.getFoosRequest,
    (req) => this.#fooService.getFoos(req),
    {
      behavior: 'SWITCH',
    },
  );
}
