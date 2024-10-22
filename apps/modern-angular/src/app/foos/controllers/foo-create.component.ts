import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-create',
  template: `TODO FOO CREATE`,
})
export class FooCreateComponent {}
