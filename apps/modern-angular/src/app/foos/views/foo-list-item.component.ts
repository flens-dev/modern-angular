import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Foo } from '../public';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-list-item',
  template: `<span> {{ foo().name }} (count: {{ foo().count }}) </span>`,
})
export class FooListItemComponent {
  readonly foo = input.required<Foo>();
}
