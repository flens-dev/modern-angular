import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { injectServiceCall } from '@flens-dev/tools';

import { FooOrderBy, FooService, GetFoosRequest, isFooOrderBy } from './model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos',
  templateUrl: './foos.component.html',
})
export class FoosComponent {
  readonly #fooService = inject(FooService);

  readonly withNameLike = input<string | undefined, unknown>(undefined, {
    transform: (value) =>
      value == null || typeof value !== 'string' ? undefined : value,
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
    })
  );

  protected readonly getFoos = injectServiceCall(
    this.#getFoosRequest,
    (req) => this.#fooService.getFoos(req),
    {
      behavior: 'SWITCH',
    }
  );
}
