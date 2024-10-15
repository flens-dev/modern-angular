import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FooService } from './model/foo.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo',
  template: `TODO FOO`,
})
export class FooComponent {
  readonly #fooService = inject(FooService);
}
